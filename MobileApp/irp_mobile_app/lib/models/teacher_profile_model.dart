class TeacherProfileModel {
  final String id;
  final String userId;
  final String teacherFullName;
  final String teacherRegId;
  final String cnic;
  final String qualification;
  final double salary;
  final DateTime joiningDate;
  final List<String> subjects;
  final List<int> classes;
  final String contact;
  final String address;
  final int age;

  TeacherProfileModel({
    required this.id,
    required this.userId,
    required this.teacherFullName,
    required this.teacherRegId,
    required this.cnic,
    required this.qualification,
    required this.salary,
    required this.joiningDate,
    required this.subjects,
    required this.classes,
    required this.contact,
    required this.address,
    required this.age,
  });

  factory TeacherProfileModel.fromJson(Map<String, dynamic> json) {
    return TeacherProfileModel(
      id: json['_id'] ?? '',
      userId: json['userId'] ?? '',
      teacherFullName: json['teacherFullName'] ?? '',
      teacherRegId: json['teacherRegId'] ?? '',
      cnic: json['cnic'] ?? '',
      qualification: json['qualification'] ?? '',
      salary: (json['salary'] ?? 0).toDouble(),
      joiningDate: json['joiningDate'] != null
          ? DateTime.parse(json['joiningDate'])
          : DateTime.now(),
      subjects: List<String>.from(json['subjects'] ?? []),
      classes: List<int>.from(json['classes'] ?? []),
      contact: json['contact'] ?? '',
      address: json['address'] ?? '',
      age: json['age'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userId': userId,
      'teacherFullName': teacherFullName,
      'teacherRegId': teacherRegId,
      'cnic': cnic,
      'qualification': qualification,
      'salary': salary,
      'joiningDate': joiningDate.toIso8601String(),
      'subjects': subjects,
      'classes': classes,
      'contact': contact,
      'address': address,
      'age': age,
    };
  }
}
