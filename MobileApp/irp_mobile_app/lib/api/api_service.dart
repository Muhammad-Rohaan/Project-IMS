import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:path_provider/path_provider.dart';
import '../constants/app_constants.dart';
import 'interceptors.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  late Dio _dio;
  late PersistCookieJar _cookieJar;

  late Dio _aiDio;

  factory ApiService() {
    return _instance;
  }

  ApiService._internal() {
    _dio = Dio(BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    _dio.interceptors.add(RetryInterceptor(dio: _dio));

    _aiDio = Dio(BaseOptions(
      baseUrl: AppConstants.aiBaseUrl,
      connectTimeout: const Duration(seconds: 60), // AI might take longer
      receiveTimeout: const Duration(seconds: 60),
      headers: {
        'Content-Type': 'application/json',
      },
    ));

    _aiDio.interceptors.add(RetryInterceptor(dio: _aiDio));
  }

  Future<void> init() async {
    final appDocDir = await getApplicationDocumentsDirectory();
    final String cookiePath = '${appDocDir.path}/.cookies/';
    _cookieJar = PersistCookieJar(storage: FileStorage(cookiePath));
    _dio.interceptors.add(CookieManager(_cookieJar));
    // AI service usually doesn't need session cookies but we can add if needed
  }

  Dio get dio => _dio;
  Dio get aiDio => _aiDio;
  PersistCookieJar get cookieJar => _cookieJar;

  // Generic GET request
  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) async {
    try {
      return await _dio.get(path, queryParameters: queryParameters);
    } on DioException catch (_) {
      rethrow;
    }
  }

  // Generic POST request
  Future<Response> post(String path, {dynamic data}) async {
    try {
      return await _dio.post(path, data: data);
    } on DioException catch (_) {
      rethrow;
    }
  }

  // Generic PUT request
  Future<Response> put(String path, {dynamic data}) async {
    try {
      return await _dio.put(path, data: data);
    } on DioException catch (_) {
      rethrow;
    }
  }

  // Generic DELETE request
  Future<Response> delete(String path) async {
    try {
      return await _dio.delete(path);
    } on DioException catch (_) {
      rethrow;
    }
  }

  Future<void> clearCookies() async {
    await _cookieJar.deleteAll();
  }
}
