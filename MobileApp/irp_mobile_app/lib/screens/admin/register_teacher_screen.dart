import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../providers/admin_provider.dart';
import '../../widgets/custom_text_field.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';

class RegisterTeacherScreen extends StatefulWidget {
  const RegisterTeacherScreen({super.key});

  @override
  State<RegisterTeacherScreen> createState() => _RegisterTeacherScreenState();
}

class _RegisterTeacherScreenState extends State<RegisterTeacherScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _teacherRegIdController = TextEditingController();
  final _cnicController = TextEditingController();
  final _qualificationController = TextEditingController();
  final _salaryController = TextEditingController();
  final _contactController = TextEditingController();
  final _addressController = TextEditingController();
  final _ageController = TextEditingController();
  final _subjectsController = TextEditingController();
  final _classesController = TextEditingController();

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      final adminProvider = Provider.of<AdminProvider>(context, listen: false);
      final success = await adminProvider.registerTeacher(
        fullName: _fullNameController.text,
        email: _emailController.text,
        password: _passwordController.text,
        teacherRegId: _teacherRegIdController.text,
        cnic: _cnicController.text,
        qualification: _qualificationController.text,
        salary: double.parse(_salaryController.text),
        joiningDate: DateTime.now().toIso8601String(),
        subjects: _subjectsController.text.split(',').map((s) => s.trim()).toList(),
        classes: _classesController.text.split(',').map((s) => s.trim()).toList(),
        contact: _contactController.text,
        address: _addressController.text,
        age: int.parse(_ageController.text),
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Teacher registered successfully!'), backgroundColor: AppColors.success),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(adminProvider.error ?? 'Registration failed'), backgroundColor: AppColors.danger),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final adminProvider = Provider.of<AdminProvider>(context);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: AppColors.backgroundGradient,
        ),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(width: 8),
                    GradientText(
                      'Register Teacher',
                      gradient: AppColors.textGradient,
                      style: GoogleFonts.poppins(
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        CustomTextField(
                          controller: _fullNameController,
                          label: 'Full Name',
                          prefixIcon: Icons.person_rounded,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _emailController,
                          label: 'Email',
                          prefixIcon: Icons.email_rounded,
                          keyboardType: TextInputType.emailAddress,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _passwordController,
                          label: 'Password',
                          prefixIcon: Icons.lock_rounded,
                          isPassword: true,
                          validator: (v) => v!.length < 6 ? 'Too short' : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _teacherRegIdController,
                          label: 'Teacher Registration ID',
                          prefixIcon: Icons.badge_rounded,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _cnicController,
                          label: 'CNIC',
                          prefixIcon: Icons.credit_card_rounded,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _qualificationController,
                          label: 'Qualification',
                          prefixIcon: Icons.school_rounded,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: CustomTextField(
                                controller: _salaryController,
                                label: 'Salary',
                                prefixIcon: Icons.payments_rounded,
                                keyboardType: TextInputType.number,
                                validator: (v) => double.tryParse(v!) == null ? 'Invalid' : null,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: CustomTextField(
                                controller: _ageController,
                                label: 'Age',
                                prefixIcon: Icons.cake_rounded,
                                keyboardType: TextInputType.number,
                                validator: (v) => int.tryParse(v!) == null ? 'Invalid' : null,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _contactController,
                          label: 'Contact',
                          prefixIcon: Icons.phone_rounded,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _addressController,
                          label: 'Address',
                          prefixIcon: Icons.home_rounded,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _subjectsController,
                          label: 'Subjects (comma separated)',
                          prefixIcon: Icons.book_rounded,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _classesController,
                          label: 'Classes (comma separated)',
                          prefixIcon: Icons.class_rounded,
                          validator: (v) => v!.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 40),
                        Container(
                          width: double.infinity,
                          height: 56,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            gradient: AppColors.buttonGradient,
                          ),
                          child: ElevatedButton(
                            onPressed: adminProvider.isLoading ? null : _handleRegister,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: adminProvider.isLoading
                                ? const CircularProgressIndicator(color: Colors.white)
                                : const Text(
                                    'Register Teacher',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.white),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 40),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
