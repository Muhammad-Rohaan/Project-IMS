import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../providers/teacher_provider.dart';
import '../../widgets/custom_text_field.dart';

class ResultUploadScreen extends StatefulWidget {
  const ResultUploadScreen({super.key});

  @override
  State<ResultUploadScreen> createState() => _ResultUploadScreenState();
}

class _ResultUploadScreenState extends State<ResultUploadScreen> {
  final _formKey = GlobalKey<FormState>();
  final _classController = TextEditingController();
  final _testNameController = TextEditingController();
  File? _image;
  final _picker = ImagePicker();

  Future<void> _getImage(ImageSource source) async {
    final pickedFile = await _picker.pickImage(source: source);
    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  void _handleUpload() async {
    if (_image == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select or take an image')),
      );
      return;
    }

    if (_formKey.currentState!.validate()) {
      final teacherProvider = Provider.of<TeacherProvider>(context, listen: false);
      final success = await teacherProvider.uploadResult(
        imageFile: _image!,
        className: _classController.text,
        testName: _testNameController.text,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Result uploaded successfully!')),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(teacherProvider.error ?? 'Upload failed')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final teacherProvider = Provider.of<TeacherProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Upload Result')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Card(
                clipBehavior: Clip.antiAlias,
                child: InkWell(
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      builder: (context) => SafeArea(
                        child: Wrap(
                          children: [
                            ListTile(
                              leading: const Icon(Icons.photo_library),
                              title: const Text('Gallery'),
                              onTap: () {
                                _getImage(ImageSource.gallery);
                                Navigator.pop(context);
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.camera_alt),
                              title: const Text('Camera'),
                              onTap: () {
                                _getImage(ImageSource.camera);
                                Navigator.pop(context);
                              },
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                  child: Container(
                    height: 200,
                    color: Colors.grey.shade200,
                    child: _image == null
                        ? const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.add_a_photo, size: 48, color: Colors.grey),
                              SizedBox(height: 8),
                              Text('Tap to select result image'),
                            ],
                          )
                        : Image.file(_image!, fit: BoxFit.cover),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              CustomTextField(
                controller: _classController,
                label: 'Class Name (e.g., 10A)',
                prefixIcon: Icons.class_,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Class name is required';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _testNameController,
                label: 'Test Name (e.g., Mid Term)',
                prefixIcon: Icons.assignment,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Test name is required';
                  return null;
                },
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: teacherProvider.isLoading ? null : _handleUpload,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: teacherProvider.isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Upload Result', style: TextStyle(fontSize: 18)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
