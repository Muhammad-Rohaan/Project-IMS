import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/teacher_provider.dart';

class TeacherResultsScreen extends StatefulWidget {
  const TeacherResultsScreen({super.key});

  @override
  State<TeacherResultsScreen> createState() => _TeacherResultsScreenState();
}

class _TeacherResultsScreenState extends State<TeacherResultsScreen> {
  @override
  void initState() {
    super.initState();
    final teacherProvider = Provider.of<TeacherProvider>(context, listen: false);
    Future.microtask(() => teacherProvider.fetchAllResults());
  }

  void _showFullScreenImage(BuildContext context, String imageUrl, String testName) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(16),
        child: Stack(
          children: [
            Center(
              child: InteractiveViewer(
                minScale: 0.5,
                maxScale: 4.0,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    imageUrl,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Container(
                        width: 300,
                        height: 400,
                        color: Colors.black54,
                        child: Center(
                          child: CircularProgressIndicator(
                            value: loadingProgress.expectedTotalBytes != null
                                ? loadingProgress.cumulativeBytesLoaded /
                                    loadingProgress.expectedTotalBytes!
                                : null,
                          ),
                        ),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) => Container(
                      width: 300,
                      height: 400,
                      color: Colors.black54,
                      child: const Center(
                        child: Icon(Icons.error, color: Colors.white, size: 48),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            Positioned(
              top: 0,
              right: 0,
              child: GestureDetector(
                onTap: () => Navigator.pop(context),
                child: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(Icons.close, color: Colors.white),
                ),
              ),
            ),
            Positioned(
              bottom: 16,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    testName,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final teacherProvider = Provider.of<TeacherProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Test Results'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.deepPurple.shade900, Colors.black],
          ),
        ),
        child: RefreshIndicator(
          onRefresh: () => teacherProvider.fetchAllResults(),
          child: teacherProvider.isLoading && teacherProvider.results.isEmpty
              ? const Center(child: CircularProgressIndicator())
              : teacherProvider.error != null && teacherProvider.results.isEmpty
                  ? Center(child: Text(teacherProvider.error!, style: const TextStyle(color: Colors.white)))
                  : teacherProvider.results.isEmpty
                      ? const Center(child: Text('No results found', style: TextStyle(color: Colors.white)))
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: teacherProvider.results.length,
                          separatorBuilder: (context, index) => const SizedBox(height: 12),
                          itemBuilder: (context, index) {
                            final result = teacherProvider.results[index];
                            return Container(
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: ListTile(
                                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                leading: Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: Colors.green.withOpacity(0.2),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.assignment_turned_in, color: Colors.green),
                                ),
                                title: Text(
                                  result.testName,
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                                ),
                                subtitle: Text(
                                  'Class: ${result.className}',
                                  style: TextStyle(color: Colors.white.withOpacity(0.7)),
                                ),
                                trailing: TextButton(
                                  onPressed: () => _showFullScreenImage(context, result.imageUrl, result.testName),
                                  child: const Text('View'),
                                ),
                              ),
                            );
                          },
                        ),
        ),
      ),
    );
  }
}
