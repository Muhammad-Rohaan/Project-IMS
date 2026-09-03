class FeeModel {
  final String status;
  final String collectedBy;
  final DateTime collectedDate;

  FeeModel({
    required this.status,
    required this.collectedBy,
    required this.collectedDate,
  });

  factory FeeModel.fromJson(Map<String, dynamic> json) {
    return FeeModel(
      status: json['status'] ?? 'pending',
      collectedBy: json['collectedBy'] ?? 'Unknown',
      collectedDate: json['collectedDate'] != null
          ? DateTime.parse(json['collectedDate'])
          : DateTime.now(),
    );
  }
}
