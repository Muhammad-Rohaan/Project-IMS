import 'dart:io';
import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:provider/provider.dart';
import '../../providers/teacher_provider.dart';
import '../../widgets/custom_text_field.dart';

class UploadNotesScreen extends StatefulWidget {
  const UploadNotesScreen({super.key});

  @override
  State<UploadNotesScreen> createState() => _UploadNotesScreenState();
}

class _UploadNotesScreenState extends State<UploadNotesScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _subjectController = TextEditingController();
  final _classController = TextEditingController();
  File? _selectedFile;

  Future<void> _pickFile() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();

    if (result != null) {
      setState(() {
        _selectedFile = File(result.files.single.path!);
      });
    }
  }

  void _handleUpload() async {
    if (_formKey.currentState!.validate() && _selectedFile != null) {
      final teacherProvider = Provider.of<TeacherProvider>(context, listen: false);
      final success = await teacherProvider.uploadNotes(
        file: _selectedFile!,
        title: _titleController.text.trim(),
        subject: _subjectController.text.trim(),
        className: _classController.text.trim().toUpperCase(),
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Notes uploaded successfully!')),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(teacherProvider.error ?? 'Upload failed')),
        );
      }
    } else if (_selectedFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a file')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final teacherProvider = Provider.of<TeacherProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Upload Notes')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              CustomTextField(
                controller: _titleController,
                label: 'Note Title',
                prefixIcon: Icons.title,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _subjectController,
                label: 'Subject',
                prefixIcon: Icons.book,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _classController,
                label: 'Class (e.g. 10A)',
                prefixIcon: Icons.class_,
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 24),
              OutlinedButton.icon(
                onPressed: _pickFile,
                icon: const Icon(Icons.attach_file),
                label: Text(_selectedFile == null
                    ? 'Select File'
                    : 'File Selected: ${_selectedFile!.path.split('/').last}'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  side: BorderSide(color: Theme.of(context).primaryColor),
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: teacherProvider.isLoading ? null : _handleUpload,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: teacherProvider.isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Upload Notes'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
