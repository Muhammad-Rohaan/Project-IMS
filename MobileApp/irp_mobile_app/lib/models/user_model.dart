class UserModel {
  final String id;
  final String fullName;
  final String email;
  final String role;
  final bool isActive;
  final String? profileType;
  final dynamic profile;

  UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    required this.role,
    this.isActive = true,
    this.profileType,
    this.profile,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'] ?? '',
      fullName: json['name'] ?? json['fullName'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? '',
      isActive: json['isActive'] ?? true,
      profileType: json['profileType'],
      profile: json['profile'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'email': email,
      'role': role,
      'isActive': isActive,
      'profileType': profileType,
      'profile': profile,
    };
  }
}
