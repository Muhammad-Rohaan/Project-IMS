import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/teacher_provider.dart';
import '../../widgets/custom_text_field.dart';

class TeacherStudentsScreen extends StatefulWidget {
  const TeacherStudentsScreen({super.key});

  @override
  State<TeacherStudentsScreen> createState() => _TeacherStudentsScreenState();
}

class _TeacherStudentsScreenState extends State<TeacherStudentsScreen> {
  final _classController = TextEditingController();
  bool _hasSearched = false;

  void _handleSearch() {
    if (_classController.text.isNotEmpty) {
      Provider.of<TeacherProvider>(context, listen: false)
          .fetchStudentsByClass(_classController.text.trim().toUpperCase());
      setState(() {
        _hasSearched = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final teacherProvider = Provider.of<TeacherProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Find Students')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    controller: _classController,
                    label: 'Class (e.g. 11)',
                    prefixIcon: Icons.class_,
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: teacherProvider.isLoading ? null : _handleSearch,
                  icon: const Icon(Icons.search),
                  style: IconButton.styleFrom(
                    backgroundColor: Theme.of(context).primaryColor,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.all(12),
                  ),
                ),
              ],
            ),
          ),
          if (teacherProvider.isLoading)
            const Expanded(child: Center(child: CircularProgressIndicator()))
          else if (teacherProvider.error != null)
            Expanded(child: Center(child: Text(teacherProvider.error!)))
          else if (_hasSearched && teacherProvider.students.isEmpty)
            const Expanded(child: Center(child: Text('No students found in this class')))
          else
            Expanded(
              child: ListView.separated(
                itemCount: teacherProvider.students.length,
                separatorBuilder: (context, index) => const Divider(),
                itemBuilder: (context, index) {
                  final student = teacherProvider.students[index];
                  return ListTile(
                    leading: CircleAvatar(
                      child: Text(student.stdName[0].toUpperCase()),
                    ),
                    title: Text(student.stdName),
                    subtitle: Text('Roll No: ${student.rollNo}'),
                    trailing: Text('Class: ${student.className}'),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}
