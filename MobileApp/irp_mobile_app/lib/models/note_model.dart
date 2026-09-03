class NoteModel {
  final String id;
  final String title;
  final String subject;
  final String className;
  final String fileUrl;
  final DateTime createdAt;

  NoteModel({
    required this.id,
    required this.title,
    required this.subject,
    required this.className,
    required this.fileUrl,
    required this.createdAt,
  });

  factory NoteModel.fromJson(Map<String, dynamic> json) {
    return NoteModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? 'Untitled',
      subject: json['subject'] ?? 'N/A',
      className: json['className'] ?? 'N/A',
      fileUrl: json['fileUrl'] ?? '',
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt']) 
          : DateTime.now(),
    );
  }
}
