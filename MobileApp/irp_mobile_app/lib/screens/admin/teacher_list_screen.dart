import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';

class TeacherListScreen extends StatefulWidget {
  const TeacherListScreen({super.key});

  @override
  State<TeacherListScreen> createState() => _TeacherListScreenState();
}

class _TeacherListScreenState extends State<TeacherListScreen> {
  @override
  void initState() {
    super.initState();
    final adminProvider = Provider.of<AdminProvider>(context, listen: false);
    Future.microtask(() => adminProvider.fetchAllTeachers());
  }

  void _confirmDelete(String regId, String name) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: Text('Are you sure you want to delete teacher $name?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () async {
              final messenger = ScaffoldMessenger.of(context);
              Navigator.pop(context);
              final success = await Provider.of<AdminProvider>(context, listen: false)
                  .deleteTeacher(regId);
              if (success && mounted) {
                messenger.showSnackBar(
                  const SnackBar(content: Text('Teacher deleted successfully')),
                );
              }
            },
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final adminProvider = Provider.of<AdminProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('All Teachers')),
      body: RefreshIndicator(
        onRefresh: () => adminProvider.fetchAllTeachers(),
        child: adminProvider.isLoading
            ? const Center(child: CircularProgressIndicator())
            : adminProvider.error != null
                ? Center(child: Text(adminProvider.error!))
                : adminProvider.teachers.isEmpty
                    ? const Center(child: Text('No teachers found'))
                    : ListView.separated(
                        itemCount: adminProvider.teachers.length,
                        separatorBuilder: (context, index) => const Divider(),
                        itemBuilder: (context, index) {
                          final teacher = adminProvider.teachers[index];
                          final name = teacher['teacherFullName'] ?? 'No Name';
                          return ListTile(
                            leading: CircleAvatar(
                              child: Text(name[0].toUpperCase()),
                            ),
                            title: Text(name),
                            subtitle: Text('ID: ${teacher['teacherRegId']} | ${teacher['qualification']}'),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () => _confirmDelete(
                                teacher['teacherRegId'],
                                name,
                              ),
                            ),
                            onTap: () {
                              // Could show details
                            },
                          );
                        },
                      ),
      ),
    );
  }
}
