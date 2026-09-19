import 'package:flutter/material.dart';
import '../api/api_service.dart';

class AdminProvider with ChangeNotifier {
  bool _isLoading = false;
  String? _error;
  List<dynamic> _teachers = [];
  List<dynamic> _receptionists = [];
  Map<String, int> _stats = {
    'students': 0,
    'teachers': 0,
    'announcements': 0,
  };

  bool get isLoading => _isLoading;
  String? get error => _error;
  List<dynamic> get teachers => _teachers;
  List<dynamic> get receptionists => _receptionists;
  Map<String, int> get stats => _stats;

  final ApiService _apiService = ApiService();

  Future<void> fetchStats() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        _apiService.get('/admin/az-teachers/fetch-all-teachers'),
        _apiService.get('/admin/az-teachers/getAllStudents'),
        _apiService.get('/announcement/all'),
      ]);

      final teachersCount = (results[0].data['teachers'] as List?)?.length ?? 0;
      final studentsCount = (results[1].data['getStds'] as List?)?.length ?? 0;
      final announcementsCount = (results[2].data['announcement'] as List?)?.length ?? 0;

      _stats = {
        'students': studentsCount,
        'teachers': teachersCount,
        'announcements': announcementsCount,
      };
    } catch (e) {
      _error = 'Failed to fetch dashboard stats';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> registerUser({
    required String fullName,
    required String email,
    required String password,
    required String role,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post('/auth/register', data: {
        'fullName': fullName,
        'email': email,
        'password': password,
        'role': role,
      });

      if (response.statusCode == 201) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Registration failed. Email might already exist.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> registerTeacher({
    required String fullName,
    required String email,
    required String password,
    required String teacherRegId,
    required String cnic,
    required String qualification,
    required double salary,
    required String joiningDate,
    required List<String> subjects,
    required List<String> classes,
    required String contact,
    required String address,
    required int age,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post('/admin/az-teachers/register-teacher', data: {
        'fullName': fullName,
        'email': email,
        'password': password,
        'teacherRegId': teacherRegId,
        'cnic': cnic,
        'qualification': qualification,
        'salary': salary,
        'joiningDate': joiningDate,
        'subjects': subjects,
        'classes': classes,
        'contact': contact,
        'address': address,
        'age': age,
      });

      if (response.statusCode == 201) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Teacher registration failed.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> registerReceptionist({
    required String fullName,
    required String email,
    required String password,
    required String receptionRegId,
    required String cnic,
    required double salary,
    required String joiningDate,
    required String contact,
    required String address,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post('/admin/az-reception/register-receptionist', data: {
        'fullName': fullName,
        'email': email,
        'password': password,
        'receptionRegId': receptionRegId,
        'cnic': cnic,
        'salary': salary,
        'joiningDate': joiningDate,
        'contact': contact,
        'address': address,
      });

      if (response.statusCode == 201) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Receptionist registration failed.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> fetchAllTeachers() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/admin/az-teachers/fetch-all-teachers');
      if (response.statusCode == 200) {
        _teachers = response.data['teachers'] ?? [];
      }
    } catch (e) {
      _error = 'Failed to fetch teachers';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchAllReceptionists() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/admin/az-reception/fetch-all-receptionists');
      if (response.statusCode == 200) {
        _receptionists = response.data['receptionists'] ?? [];
      }
    } catch (e) {
      _error = 'Failed to fetch receptionists';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> deleteTeacher(String teacherRegId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.delete('/admin/az-teachers/delete-teacher/$teacherRegId');
      if (response.statusCode == 200) {
        _teachers.removeWhere((t) => t['teacherRegId'] == teacherRegId);
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Failed to delete teacher';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> deleteReceptionist(String receptionRegId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.delete('/admin/az-reception/delete-receptionist/$receptionRegId');
      if (response.statusCode == 200) {
        _receptionists.removeWhere((r) => r['receptionRegId'] == receptionRegId);
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Failed to delete receptionist';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> postAnnouncement({
    required String title,
    required String message,
    required String target,
    required String className,
    required String createdBy,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post('/announcement/create-new-announcement', data: {
        'title': title,
        'message': message,
        'target': target,
        'className': className,
        'createdBy': createdBy,
      });

      if (response.statusCode == 200) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Failed to post announcement.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }
}
