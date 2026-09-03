import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../api/api_service.dart';
import '../models/user_model.dart';
import '../constants/app_constants.dart';

class AuthProvider with ChangeNotifier {
  UserModel? _user;
  bool _isLoading = false;
  String? _error;

  UserModel? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  final ApiService _apiService = ApiService();

  AuthProvider() {
    _loadUserFromPrefs();
  }

  Future<void> _loadUserFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString(AppConstants.userKey);
    if (userData != null) {
      _user = UserModel.fromJson(json.decode(userData));
      notifyListeners();
    }
  }

  Future<bool> login(String? email, String? identifier, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post(
        AppConstants.login,
        data: {'email': email, 'identifier': identifier, 'password': password}
          ..removeWhere((key, value) => value == null),
      );

      if (response.statusCode == 200) {
        final userData = response.data['user'];
        _user = UserModel.fromJson(userData);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(
          AppConstants.userKey,
          json.encode(_user!.toJson()),
        );

        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Login failed. Please check your credentials.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    try {
      await _apiService.get(AppConstants.logout);
    } catch (e) {
      // Ignore logout errors
    }

    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.userKey);
    await _apiService.clearCookies();
    notifyListeners();
  }

  Future<Map<String, dynamic>> changePassword(
    String oldPassword,
    String newPassword,
    String confirmPassword,
  ) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.put(
        AppConstants.changePassword,
        data: {
          'oldPassword': oldPassword,
          'newPassword': newPassword,
          'confirmPassword': confirmPassword,
        },
      );

      _isLoading = false;
      notifyListeners();
      return {
        'success': response.data['success'] ?? true,
        'message': response.data['message'] ?? 'Password changed successfully',
      };
    } catch (e) {
      _isLoading = false;
      _error = 'Failed to change password. Please check your old password.';
      notifyListeners();
      return {'success': false, 'message': _error};
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
