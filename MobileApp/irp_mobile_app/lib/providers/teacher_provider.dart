import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../api/api_service.dart';

import '../models/student_model.dart';
import '../models/result_model.dart';

class TeacherProvider with ChangeNotifier {
  bool _isLoading = false;
  String? _error;
  List<StudentModel> _students = [];
  List<ResultModel> _results = [];

  bool get isLoading => _isLoading;
  String? get error => _error;
  List<StudentModel> get students => _students;
  List<ResultModel> get results => _results;

  final ApiService _apiService = ApiService();

  Future<bool> uploadResult({
    required File imageFile,
    required String className,
    required String testName,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      String fileName = imageFile.path.split('/').last;
      FormData formData = FormData.fromMap({
        'className': className,
        'testName': testName,
        'image': await MultipartFile.fromFile(
          imageFile.path,
          filename: fileName,
        ),
      });

      final response = await _apiService.post('/teacher/upload-result', data: formData);

      if (response.statusCode == 201) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Failed to upload result. Please try again.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> fetchStudentsByClass(String className) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/teacher/students/$className');
      if (response.statusCode == 200) {
        final data = response.data['data'];
        if (data != null && data is List) {
          _students = data.map((s) => StudentModel.fromJson(s)).toList();
        } else {
          _students = [];
        }
      }
    } catch (e) {
      _error = 'Failed to fetch students';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> uploadNotes({
    required File file,
    required String title,
    required String subject,
    required String className,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      String fileName = file.path.split('/').last;
      FormData formData = FormData.fromMap({
        'title': title,
        'subject': subject,
        'className': className,
        'file': await MultipartFile.fromFile(
          file.path,
          filename: fileName,
        ),
      });

      final response = await _apiService.post('/teacher/upload-notes', data: formData);

      if (response.statusCode == 201) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Failed to upload notes. Please try again.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> fetchAllResults() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/teacher/all-results');
      if (response.statusCode == 200) {
        final data = response.data['results'];
        if (data != null && data is List) {
          _results = data.map((item) => ResultModel.fromJson(item)).toList();
        } else {
          _results = [];
        }
      }
    } catch (e) {
      _error = 'Failed to fetch results';
    }

    _isLoading = false;
    notifyListeners();
  }
}
