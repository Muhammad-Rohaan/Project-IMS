import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_text_field.dart';

class PostAnnouncementScreen extends StatefulWidget {
  const PostAnnouncementScreen({super.key});

  @override
  State<PostAnnouncementScreen> createState() => _PostAnnouncementScreenState();
}

class _PostAnnouncementScreenState extends State<PostAnnouncementScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _messageController = TextEditingController();
  final _classNameController = TextEditingController();
  String _selectedTarget = 'all';

  final List<String> _targets = ['all', 'specific-class'];

  void _handlePost() async {
    if (_formKey.currentState!.validate()) {
      final adminProvider = Provider.of<AdminProvider>(context, listen: false);
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      final success = await adminProvider.postAnnouncement(
        title: _titleController.text.trim(),
        message: _messageController.text.trim(),
        target: _selectedTarget,
        className: _selectedTarget == 'all' ? 'N/A' : _classNameController.text.trim(),
        createdBy: authProvider.user?.fullName ?? 'Admin',
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Announcement posted successfully!')),
        );
        Navigator.pop(context);
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(adminProvider.error ?? 'Failed to post announcement')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final adminProvider = Provider.of<AdminProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Post Announcement')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              CustomTextField(
                controller: _titleController,
                label: 'Announcement Title',
                prefixIcon: Icons.title,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Title is required';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              CustomTextField(
                controller: _messageController,
                label: 'Message',
                prefixIcon: Icons.message,
                maxLines: 5,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Message is required';
                  return null;
                },
              ),
              if (_selectedTarget == 'specific-class') ...[
                const SizedBox(height: 16),
                CustomTextField(
                  controller: _classNameController,
                  label: 'Class Name (e.g. 10th A)',
                  prefixIcon: Icons.class_,
                  validator: (value) {
                    if (_selectedTarget == 'specific-class' && (value == null || value.isEmpty)) {
                      return 'Class name is required for specific class';
                    }
                    return null;
                  },
                ),
              ],
              const SizedBox(height: 24),
              const Text('Target Audience',
                  style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _selectedTarget,
                items: _targets.map((target) => DropdownMenuItem(
                          value: target,
                          child: Text(target.toUpperCase()),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedTarget = value!;
                  });
                },
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.group),
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: adminProvider.isLoading ? null : _handlePost,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                child: adminProvider.isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Post Announcement',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
