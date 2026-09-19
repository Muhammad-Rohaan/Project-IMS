import 'package:dio/dio.dart';
import 'dart:async';

class RetryInterceptor extends Interceptor {
  final Dio dio;
  final int maxRetries;
  final int retryDelayMs;

  RetryInterceptor({
    required this.dio,
    this.maxRetries = 3,
    this.retryDelayMs = 1000,
  });

  @override
  Future onError(DioException err, ErrorInterceptorHandler handler) async {
    var requestOptions = err.requestOptions;
    
    // Check if we should retry
    if (_shouldRetry(err) && (requestOptions.extra['retries'] ?? 0) < maxRetries) {
      requestOptions.extra['retries'] = (requestOptions.extra['retries'] ?? 0) + 1;
      
      await Future.delayed(Duration(milliseconds: retryDelayMs));
      
      try {
        final response = await dio.request(
          requestOptions.path,
          data: requestOptions.data,
          queryParameters: requestOptions.queryParameters,
          cancelToken: requestOptions.cancelToken,
          options: Options(
            method: requestOptions.method,
            headers: requestOptions.headers,
            extra: requestOptions.extra,
          ),
          onReceiveProgress: requestOptions.onReceiveProgress,
          onSendProgress: requestOptions.onSendProgress,
        );
        return handler.resolve(response);
      } catch (e) {
        return super.onError(err, handler);
      }
    }
    
    return super.onError(err, handler);
  }

  bool _shouldRetry(DioException err) {
    return err.type == DioExceptionType.connectionTimeout ||
           err.type == DioExceptionType.sendTimeout ||
           err.type == DioExceptionType.receiveTimeout ||
           err.type == DioExceptionType.connectionError ||
           (err.response?.statusCode != null && err.response!.statusCode! >= 500);
  }
}
