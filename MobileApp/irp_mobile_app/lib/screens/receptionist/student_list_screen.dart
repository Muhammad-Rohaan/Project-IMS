import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/receptionist_provider.dart';

class StudentListScreen extends StatefulWidget {
  const StudentListScreen({super.key});

  @override
  State<StudentListScreen> createState() => _StudentListScreenState();
}

class _StudentListScreenState extends State<StudentListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ReceptionistProvider>(context, listen: false).fetchAllStudents();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('All Students')),
      body: Consumer<ReceptionistProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading && provider.students.isEmpty) {
            return const Center(child: CircularProgressIndicator());
          }

          if (provider.error != null && provider.students.isEmpty) {
            return Center(child: Text(provider.error!));
          }

          return RefreshIndicator(
            onRefresh: () => provider.fetchAllStudents(),
            child: ListView.separated(
              itemCount: provider.students.length,
              separatorBuilder: (context, index) => const Divider(),
              itemBuilder: (context, index) {
                final student = provider.students[index];
                return ListTile(
                  leading: CircleAvatar(
                    child: Text(student.stdName[0].toUpperCase()),
                  ),
                  title: Text(student.stdName),
                  subtitle: Text('Roll No: ${student.rollNo} | Class: ${student.className}'),
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: Text(student.stdName),
                        content: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Roll No: ${student.rollNo}'),
                            Text('Class: ${student.className}'),
                            if (student.fatherName != null)
                              Text('Father Name: ${student.fatherName}'),
                            if (student.contact != null)
                              Text('Contact: ${student.contact}'),
                          ],
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Close'),
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          );
        },
      ),
    );
  }
}
