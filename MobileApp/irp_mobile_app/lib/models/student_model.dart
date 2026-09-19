class StudentModel {
  final String id;
  final String rollNo;
  final String stdName;
  final String className;
  final String? fatherName;
  final String? contact;

  StudentModel({
    required this.id,
    required this.rollNo,
    required this.stdName,
    required this.className,
    this.fatherName,
    this.contact,
  });

  factory StudentModel.fromJson(Map<String, dynamic> json) {
    return StudentModel(
      id: json['_id'],
      rollNo: json['rollNo'],
      stdName: json['stdName'],
      className: json['className'],
      fatherName: json['fatherName'],
      contact: json['contact'],
    );
  }
}
