import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../providers/receptionist_provider.dart';
import '../../widgets/custom_text_field.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';

class RegisterStudentScreen extends StatefulWidget {
  const RegisterStudentScreen({super.key});

  @override
  State<RegisterStudentScreen> createState() => _RegisterStudentScreenState();
}

class _RegisterStudentScreenState extends State<RegisterStudentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  // final _rollNoController = TextEditingController();
  final _fatherNameController = TextEditingController();
  final _fatherPhoneController = TextEditingController();
  final _contactController = TextEditingController();
  final _addressController = TextEditingController();
  final _ageController = TextEditingController();
  final _classController = TextEditingController();
  String _selectedField = 'cs';

  final List<Map<String, String>> _fields = [
    {'value': 'cs', 'label': 'Computer Science (CS)'},
    {'value': 'medical', 'label': 'Pre-Medical'},
    {'value': 'engineering', 'label': 'Pre-Engineering'},
    {'value': 'commerce', 'label': 'Commerce'},
    {'value': 'arts', 'label': 'Arts'},
  ];

  // Inside _RegisterStudentScreenState

  void _handleRegister() async {
    if (_formKey.currentState!.validate()) {
      String email = _emailController.text.trim();

      // Auto-generate temporary email if field is empty
      if (email.isEmpty) {
        final timestamp = DateTime.now().second;
        email = 'temp$timestamp@az.pk';

        // Optional: Show user what email was generated
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Generated temporary email: $email'),
            backgroundColor: AppColors.accent,
            duration: const Duration(seconds: 3),
          ),
        );
      }

      final receptionistProvider = Provider.of<ReceptionistProvider>(
        context,
        listen: false,
      );

      final success = await receptionistProvider.registerStudent(
        fullName: _fullNameController.text,
        email: email, // ← Use the (possibly generated) email
        password: _passwordController.text,
        // rollNo: _rollNoController.text,
        fatherName: _fatherNameController.text,
        fatherPhone: _fatherPhoneController.text,
        contact: _contactController.text,
        address: _addressController.text,
        age: int.parse(_ageController.text),
        className: _classController.text,
        field: _selectedField,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Student registered successfully!'),
            backgroundColor: AppColors.success,
          ),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(receptionistProvider.error ?? 'Registration failed'),
            backgroundColor: AppColors.danger,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final receptionistProvider = Provider.of<ReceptionistProvider>(context);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(
                        Icons.arrow_back_ios_new_rounded,
                        color: Colors.white,
                      ),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(width: 8),
                    GradientText(
                      'Register Student',
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
                          validator: (value) => value == null || value.isEmpty
                              ? 'Required'
                              : null,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _emailController,
                          label: 'Email Address (Optional)',
                          prefixIcon: Icons.email_rounded,
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) => null, // ← Allow empty
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _passwordController,
                          label: 'Password',
                          prefixIcon: Icons.lock_rounded,
                          isPassword: true,
                          validator: (value) =>
                              value == null || value.length < 6
                              ? 'Too short'
                              : null,
                        ),
                        
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _fatherNameController,
                          label: 'Father Name',
                          prefixIcon: Icons.person_outline_rounded,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _fatherPhoneController,
                          label: 'Father Phone',
                          prefixIcon: Icons.phone_android_rounded,
                          keyboardType: TextInputType.phone,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _contactController,
                          label: 'Student Contact',
                          prefixIcon: Icons.phone_rounded,
                          keyboardType: TextInputType.phone,
                        ),
                        const SizedBox(height: 16),
                        CustomTextField(
                          controller: _addressController,
                          label: 'Address',
                          prefixIcon: Icons.home_rounded,
                          validator: (value) => value == null || value.isEmpty
                              ? 'Required'
                              : null,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: CustomTextField(
                                controller: _ageController,
                                label: 'Age',
                                prefixIcon: Icons.calendar_today_rounded,
                                keyboardType: TextInputType.number,
                                validator: (value) =>
                                    value == null || int.tryParse(value) == null
                                    ? 'Invalid'
                                    : null,
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: CustomTextField(
                                controller: _classController,
                                label: 'Class (e.g. 11)',
                                prefixIcon: Icons.class_rounded,
                                validator: (value) =>
                                    value == null || value.isEmpty
                                    ? 'Required'
                                    : null,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        _buildDropdown(),
                        const SizedBox(height: 40),
                        Container(
                          width: double.infinity,
                          height: 56,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            gradient: AppColors.buttonGradient,
                          ),
                          child: ElevatedButton(
                            onPressed: receptionistProvider.isLoading
                                ? null
                                : _handleRegister,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: receptionistProvider.isLoading
                                ? const CircularProgressIndicator(
                                    color: Colors.white,
                                  )
                                : const Text(
                                    'Register Student',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Colors.white,
                                    ),
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

  Widget _buildDropdown() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.accent.withOpacity(0.2)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButtonFormField<String>(
          value: _selectedField,
          dropdownColor: AppColors.background,
          style: GoogleFonts.poppins(color: Colors.white),
          decoration: InputDecoration(
            labelText: 'Field/Department',
            labelStyle: const TextStyle(color: Colors.white38),
            prefixIcon: Icon(
              Icons.school_rounded,
              color: AppColors.accent.withOpacity(0.5),
            ),
            border: InputBorder.none,
          ),
          items: _fields
              .map(
                (f) => DropdownMenuItem(
                  value: f['value'],
                  child: Text(f['label']!),
                ),
              )
              .toList(),
          onChanged: (val) => setState(() => _selectedField = val!),
        ),
      ),
    );
  }
}
