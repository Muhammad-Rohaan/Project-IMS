import 'package:flutter/material.dart';
import '../api/api_service.dart';
import '../models/announcement_model.dart';
import '../models/fee_model.dart';
import '../models/result_model.dart';
import '../utils/database_helper.dart';
import '../constants/app_constants.dart';

import '../models/note_model.dart';

class StudentProvider with ChangeNotifier {
  List<AnnouncementModel> _announcements = [];
  List<FeeModel> _fees = [];
  List<ResultModel> _results = [];
  List<NoteModel> _notes = [];
  Map<String, dynamic>? _profile;
  List<dynamic> _attendance = [];
  bool _isLoading = false;
  String? _error;

  List<AnnouncementModel> get announcements => _announcements;
  List<FeeModel> get fees => _fees;
  List<ResultModel> get results => _results;
  List<NoteModel> get notes => _notes;
  Map<String, dynamic>? get profile => _profile;
  List<dynamic> get attendance => _attendance;
  bool get isLoading => _isLoading;
  String? get error => _error;

  final ApiService _apiService = ApiService();
  final DatabaseHelper _dbHelper = DatabaseHelper();

  Future<void> fetchAnnouncements([String? className]) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    // Load from offline cache first
    final cachedData = await _dbHelper.getData('announcements');
    if (cachedData != null) {
      _announcements = (cachedData as List)
          .map((item) => AnnouncementModel.fromJson(item))
          .toList();
      notifyListeners();
    }

    try {
      // Use the unified endpoint /announcement/:className
      final param = (className != null && className != 'N/A') ? className : 'all';
      final response = await _apiService.get('${AppConstants.announcements}/$param');
      
      if (response.statusCode == 200) {
        final data = response.data;
        if (data != null) {
          final List<dynamic> globalAnn = data['announcement'] ?? [];
          final List<dynamic> classAnn = data['myAnnouncement'] ?? [];
          
          final combinedData = [...globalAnn, ...classAnn];
          
          _announcements = combinedData
              .map((item) => AnnouncementModel.fromJson(item))
              .toList();
          
          // Save to offline cache
          await _dbHelper.saveData('announcements', combinedData);
        }
      }
    } catch (e) {
      _error = 'Failed to fetch announcements. Using offline data.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchFees() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    // Load from cache
    final cachedData = await _dbHelper.getData('fees');
    if (cachedData != null) {
      _fees = (cachedData as List).map((item) => FeeModel.fromJson(item)).toList();
      notifyListeners();
    }

    try {
      final response = await _apiService.get('/student/fees');
      if (response.statusCode == 200) {
        final data = response.data['fees'];
        if (data != null && data is List) {
          _fees = data.map((item) => FeeModel.fromJson(item)).toList();
          await _dbHelper.saveData('fees', data);
        } else {
          _fees = [];
        }
      }
    } catch (e) {
      _error = 'Failed to fetch fees. Using offline data.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchResults() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    // Load from cache
    final cachedData = await _dbHelper.getData('results');
    if (cachedData != null) {
      _results = (cachedData as List).map((item) => ResultModel.fromJson(item)).toList();
      notifyListeners();
    }

    try {
      final response = await _apiService.get('/student/my-class-results');
      if (response.statusCode == 200) {
        final data = response.data['results'];
        if (data != null && data is List) {
          _results = data.map((item) => ResultModel.fromJson(item)).toList();
          await _dbHelper.saveData('results', data);
        } else {
          _results = [];
        }
      }
    } catch (e) {
      _error = 'Failed to fetch results. Using offline data.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchNotes() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    // Load from cache
    final cachedData = await _dbHelper.getData('notes');
    if (cachedData != null) {
      _notes = (cachedData as List).map((item) => NoteModel.fromJson(item)).toList();
      notifyListeners();
    }

    try {
      final response = await _apiService.get('/student/fetchNotes');
      if (response.statusCode == 200) {
        final data = response.data['notes'];
        if (data != null && data is List) {
          _notes = data.map((item) => NoteModel.fromJson(item)).toList();
          await _dbHelper.saveData('notes', data);
        } else {
          _notes = [];
        }
      }
    } catch (e) {
      _error = 'Failed to fetch notes. Using offline data.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchAttendance() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/student/attendance');
      if (response.statusCode == 200) {
        _attendance = response.data['attendance'] ?? [];
      }
    } catch (e) {
      _error = 'Failed to fetch attendance.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> fetchProfile() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    // Load from cache
    final cachedData = await _dbHelper.getData('student_profile');
    if (cachedData != null) {
      _profile = cachedData;
      notifyListeners();
    }

    try {
      final response = await _apiService.get('/student/profile');
      if (response.statusCode == 200) {
        _profile = response.data;
        await _dbHelper.saveData('student_profile', response.data);
      }
    } catch (e) {
      _error = 'Failed to fetch profile. Using offline data.';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> saveQuizResult({
    required String topic,
    required int score,
    required int total,
    required String difficulty,
    required String userId,
  }) async {
    try {
      // Assuming you have a backend endpoint for saving quiz results
      final response = await _apiService.post('/quizzes/results', data: {
        'topic': topic,
        'score': score,
        'total': total,
        'difficulty': difficulty,
        'userId': userId,
      });
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      debugPrint('Error saving quiz result: $e');
      return false;
    }
  }
}
