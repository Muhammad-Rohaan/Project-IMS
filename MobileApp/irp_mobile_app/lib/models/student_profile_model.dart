class StudentProfileModel {
  final String id;
  final String userId;
  final String rollNo;
  final String stdName;
  final String fatherName;
  final String fatherPhone;
  final String? contact;
  final String address;
  final int age;
  final String className;
  final String field;

  StudentProfileModel({
    required this.id,
    required this.userId,
    required this.rollNo,
    required this.stdName,
    required this.fatherName,
    required this.fatherPhone,
    this.contact,
    required this.address,
    required this.age,
    required this.className,
    required this.field,
  });

  factory StudentProfileModel.fromJson(Map<String, dynamic> json) {
    return StudentProfileModel(
      id: json['_id'] ?? '',
      userId: json['userId'] ?? '',
      rollNo: json['rollNo'] ?? '',
      stdName: json['stdName'] ?? '',
      fatherName: json['fatherName'] ?? '',
      fatherPhone: json['fatherPhone'] ?? '',
      contact: json['contact'],
      address: json['address'] ?? '',
      age: json['age'] ?? 0,
      className: json['className'] ?? '',
      field: json['field'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'userId': userId,
      'rollNo': rollNo,
      'stdName': stdName,
      'fatherName': fatherName,
      'fatherPhone': fatherPhone,
      'contact': contact,
      'address': address,
      'age': age,
      'className': className,
      'field': field,
    };
  }
}
