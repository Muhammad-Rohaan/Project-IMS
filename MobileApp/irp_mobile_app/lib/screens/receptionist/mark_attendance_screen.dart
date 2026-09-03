import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/receptionist_provider.dart';
import '../../widgets/custom_text_field.dart';

class MarkAttendanceScreen extends StatefulWidget {
  const MarkAttendanceScreen({super.key});

  @override
  State<MarkAttendanceScreen> createState() => _MarkAttendanceScreenState();
}

class _MarkAttendanceScreenState extends State<MarkAttendanceScreen> {
  final _formKey = GlobalKey<FormState>();
  final _rollNoController = TextEditingController();
  String _status = 'Present';

  void _handleSubmit() async {
    if (_formKey.currentState!.validate()) {
      final receptionistProvider =
          Provider.of<ReceptionistProvider>(context, listen: false);
      final success = await receptionistProvider.markAttendance(
        rollNo: _rollNoController.text,
        status: _status,
      );

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Attendance marked successfully!')),
        );
        _rollNoController.clear();
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(receptionistProvider.error ?? 'Failed')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final receptionistProvider = Provider.of<ReceptionistProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Mark Attendance')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              CustomTextField(
                controller: _rollNoController,
                label: 'Roll Number',
                prefixIcon: Icons.badge,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Roll No is required';
                  return null;
                },
              ),
              const SizedBox(height: 24),
              const Text('Status', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'present', label: Text('Present')),
                  ButtonSegment(value: 'absent', label: Text('Absent')),
                  ButtonSegment(value: 'late', label: Text('Late')),
                ],
                selected: {_status},
                onSelectionChanged: (Set<String> newSelection) {
                  setState(() {
                    _status = newSelection.first;
                  });
                },
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: receptionistProvider.isLoading ? null : _handleSubmit,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: receptionistProvider.isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Mark Attendance'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
