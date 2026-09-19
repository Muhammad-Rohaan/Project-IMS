import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../student/pdf_viewer_screen.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../providers/student_provider.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  @override
  void initState() {
    super.initState();
    final studentProvider = Provider.of<StudentProvider>(context, listen: false);
    Future.microtask(() => studentProvider.fetchNotes());
  }

  // Replace with this:
void _openPdf(String url, String title) {
  Navigator.push(
    context,
    MaterialPageRoute(
      builder: (_) => PdfViewerScreen(pdfUrl: url, title: title),
    ),
  );
}

  @override
  Widget build(BuildContext context) {
    final studentProvider = Provider.of<StudentProvider>(context);

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: AppColors.backgroundGradient,
        ),
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(width: 8),
                    GradientText(
                      'Study Notes',
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
                child: RefreshIndicator(
                  onRefresh: () => studentProvider.fetchNotes(),
                  child: studentProvider.isLoading && studentProvider.notes.isEmpty
                      ? const Center(child: CircularProgressIndicator(color: AppColors.accent))
                      : studentProvider.notes.isEmpty
                          ? _buildEmptyState()
                          : ListView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                              itemCount: studentProvider.notes.length,
                              itemBuilder: (context, index) {
                                final note = studentProvider.notes[index];
                                return _buildNoteCard(note);
                              },
                            ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.description_outlined, size: 64, color: Colors.white24),
          ),
          const SizedBox(height: 24),
          Text(
            'No study notes available',
            style: GoogleFonts.poppins(color: Colors.white60, fontSize: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildNoteCard(dynamic note) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.indigoAccent.withOpacity(0.3)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _openPdf(note.fileUrl, note.title),
          borderRadius: BorderRadius.circular(24),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.indigoAccent.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(Icons.picture_as_pdf_rounded, color: Colors.indigoAccent, size: 28),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        note.title,
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        note.subject,
                        style: GoogleFonts.poppins(
                          color: Colors.white38,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.open_in_new_rounded, color: Colors.white24, size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
