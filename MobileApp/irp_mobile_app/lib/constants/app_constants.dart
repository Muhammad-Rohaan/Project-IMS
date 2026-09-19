import 'dart:io';
import 'package:flutter/foundation.dart';

class AppConstants {
  static const String  _laptopIP = '172.16.179.205'; // Physical Device // this should be the deployment server
  // Use 10.0.2.2 for Android Emulator, localhost for iOS/Web
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:5000/api';
    if (Platform.isAndroid) return 'http://$_laptopIP:5000/api';
    return 'http://localhost:5000/api';
  }

  static String get aiBaseUrl {
    if (kIsWeb) return 'http://localhost:8000/api';
    if (Platform.isAndroid) return 'http://$_laptopIP:8000/api';
    return 'http://localhost:8000/api';
  }


  // API Endpoints
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String changePassword = '/auth/change-password';
  static const String profile = '/auth/profile';

  // Admin Endpoints
  static const String adminDashboard = '/admin/dashboard';
  static const String registerUser = '/admin/register-user';
  static const String getTeachers = '/admin/teachers';
  static const String getStudents = '/admin/students';

  // Student Endpoints
  static const String studentProfile = '/student/profile';
  static const String studentAttendance = '/student/attendance';
  static const String studentFees = '/student/fees';

  // Teacher Endpoints
  static const String teacherProfile = '/teacher/profile';
  static const String teacherStudents = '/teacher/students';

  // Announcement Endpoints
  static const String announcements = '/announcement';

  // Storage Keys
  static const String tokenKey = 'jwt_token';
  static const String userKey = 'user_data';
}
