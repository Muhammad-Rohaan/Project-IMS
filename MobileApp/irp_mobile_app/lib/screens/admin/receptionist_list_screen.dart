import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/admin_provider.dart';

class ReceptionistListScreen extends StatefulWidget {
  const ReceptionistListScreen({super.key});

  @override
  State<ReceptionistListScreen> createState() => _ReceptionistListScreenState();
}

class _ReceptionistListScreenState extends State<ReceptionistListScreen> {
  @override
  void initState() {
    super.initState();
    final adminProvider = Provider.of<AdminProvider>(context, listen: false);
    Future.microtask(() => adminProvider.fetchAllReceptionists());
  }

  void _confirmDelete(String regId, String name) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirm Delete'),
        content: Text('Are you sure you want to delete receptionist $name?'),
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
                  .deleteReceptionist(regId);
              if (success && mounted) {
                messenger.showSnackBar(
                  const SnackBar(content: Text('Receptionist deleted successfully')),
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
      appBar: AppBar(title: const Text('All Receptionists')),
      body: RefreshIndicator(
        onRefresh: () => adminProvider.fetchAllReceptionists(),
        child: adminProvider.isLoading
            ? const Center(child: CircularProgressIndicator())
            : adminProvider.error != null
                ? Center(child: Text(adminProvider.error!))
                : adminProvider.receptionists.isEmpty
                    ? const Center(child: Text('No receptionists found'))
                    : ListView.separated(
                        itemCount: adminProvider.receptionists.length,
                        separatorBuilder: (context, index) => const Divider(),
                        itemBuilder: (context, index) {
                          final receptionist = adminProvider.receptionists[index];
                          final name = receptionist['receptionistFullName'] ?? 'No Name';
                          return ListTile(
                            leading: CircleAvatar(
                              child: Text(name[0].toUpperCase()),
                            ),
                            title: Text(name),
                            subtitle: Text('ID: ${receptionist['receptionRegId']}'),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () => _confirmDelete(
                                receptionist['receptionRegId'],
                                name,
                              ),
                            ),
                          );
                        },
                      ),
      ),
    );
  }
}
