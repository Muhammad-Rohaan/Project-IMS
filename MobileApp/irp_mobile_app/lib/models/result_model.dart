class ResultModel {
  final String testName;
  final String className;
  final String imageUrl;

  ResultModel({
    required this.testName,
    required this.className,
    required this.imageUrl,
  });

  factory ResultModel.fromJson(Map<String, dynamic> json) {
    return ResultModel(
      testName: json['testName'] ?? 'Unnamed Test',
      className: json['className'] ?? 'N/A',
      imageUrl: json['imageUrl'] ?? '',
    );
  }
}
