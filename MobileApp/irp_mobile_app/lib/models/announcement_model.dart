class AnnouncementModel {
  final String id;
  final String title;
  final String message;
  final String target;
  final String? className;
  final String createdBy;
  final DateTime createdAt;

  AnnouncementModel({
    required this.id,
    required this.title,
    required this.message,
    required this.target,
    this.className,
    required this.createdBy,
    required this.createdAt,
  });

  factory AnnouncementModel.fromJson(Map<String, dynamic> json) {
    return AnnouncementModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      target: json['target'] ?? 'all',
      className: json['className'],
      createdBy: json['createdBy'] ?? '',
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'message': message,
      'target': target,
      'className': className,
      'createdBy': createdBy,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
