import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/student_model.dart';

class ReceptionistProvider with ChangeNotifier {
  bool _isLoading = false;
  String? _error;
  List<StudentModel> _students = [];

  bool get isLoading => _isLoading;
  String? get error => _error;
  List<StudentModel> get students => _students;

  final ApiService _apiService = ApiService();

  Future<bool> markAttendance({
    required String rollNo,
    required String status,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post('/reception/attendance/markAttendance', data: {
        'rollNo': rollNo,
        'status': status,
      });

      if (response.statusCode == 200) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Failed to mark attendance.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> collectFee({
    required String rollNo,
    required String month,
    required String year,
    required double feesAmount,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post('/reception/fees/collect', data: {
        'rollNo': rollNo,
        'month': month,
        'year': year,
        'feesAmount': feesAmount,
      });

      if (response.statusCode == 200) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Failed to collect fee.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> registerStudent({
    required String fullName,
    required String email,
    required String password,
    // required String rollNo,
    required String fatherName,
    required String fatherPhone,
    required String contact,
    required String address,
    required int age,
    required String className,
    required String field,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.post('/reception/az-students/admissions/register-student', data: {
        'fullName': fullName,
        'email': email,
        'password': password,
        // 'rollNo': rollNo,
        'fatherName': fatherName,
        'fatherPhone': fatherPhone,
        'contact': contact,
        'address': address,
        'age': age,
        'className': className,
        'field': field,
      });

      if (response.statusCode == 201) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _error = 'Failed to register student. Roll No or Email might exist.';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> fetchAllStudents() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/reception/az-students/fetch-all-students');
      if (response.statusCode == 200) {
        final data = response.data['students'];
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
}
