import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../api/api_service.dart';
import '../../models/quiz_model.dart';
import '../../providers/student_provider.dart';
import '../../providers/auth_provider.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';

class GenerateQuizScreen extends StatefulWidget {
  const GenerateQuizScreen({super.key});

  @override
  State<GenerateQuizScreen> createState() => _GenerateQuizScreenState();
}

class _GenerateQuizScreenState extends State<GenerateQuizScreen> {
  final TextEditingController _topicController = TextEditingController();
  String _difficulty = 'medium';
  int _count = 5;
  bool _isLoading = false;
  QuizResponse? _quizData;
  int _currentQuestionIndex = 0;
  Map<int, int> _selectedAnswers = {};
  bool _showResults = false;
  int _score = 0;
  final Set<int> _expandedExplanations = {};

  final List<String> _difficulties = ['easy', 'medium', 'hard'];
  final List<int> _counts = [5, 10, 15, 20];

  @override
  void dispose() {
    _topicController.dispose();
    super.dispose();
  }

  Future<void> _handleGenerateQuiz() async {
    final topic = _topicController.text.trim();
    if (topic.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a topic'), backgroundColor: AppColors.danger),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final response = await ApiService().aiDio.post('/quizzes/generate', data: {
        'topic': topic,
        'difficulty': _difficulty,
        'count': _count,
      });

      if (response.statusCode == 200 || response.statusCode == 201) {
        if (!mounted) return;
        setState(() {
          _quizData = QuizResponse.fromJson(response.data);
          _currentQuestionIndex = 0;
          _selectedAnswers = {};
          _showResults = false;
          _score = 0;
        });
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error generating quiz: $e'), backgroundColor: AppColors.danger),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _submitQuiz() async {
    int totalScore = 0;
    if (_quizData != null) {
      for (int i = 0; i < _quizData!.questions.length; i++) {
        if (_selectedAnswers[i] == _quizData!.questions[i].correctAnswer) {
          totalScore++;
        }
      }

      final studentProvider = Provider.of<StudentProvider>(context, listen: false);
      final authProvider = Provider.of<AuthProvider>(context, listen: false);

      if (authProvider.user != null) {
        await studentProvider.saveQuizResult(
          topic: _quizData!.topic,
          score: totalScore,
          total: _quizData!.questions.length,
          difficulty: _quizData!.difficulty,
          userId: authProvider.user!.id,
        );
      }
    }

    if (!mounted) return;
    setState(() {
      _score = totalScore;
      _showResults = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(gradient: AppColors.backgroundGradient),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                    const SizedBox(width: 8),
                    GradientText(
                      'AI Quiz Generator',
                      gradient: AppColors.textGradient,
                      style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w900),
                    ),
                  ],
                ),
              ),

              // Main Content
              Expanded(
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator(color: AppColors.accent))
                    : _quizData == null
                        ? _buildSetupView()
                        : _showResults
                            ? _buildResultsView()
                            : _buildQuizView(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSetupView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20),

          Center(
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.accent.withOpacity(0.1),
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.accent.withOpacity(0.2)),
              ),
              child: const Icon(Icons.psychology_rounded, size: 64, color: AppColors.accent),
            ),
          ),

          const SizedBox(height: 32),
          Text(
            'Generate a Quiz with AI',
            style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Enter a topic and let our AI create a custom quiz for you.',
            style: GoogleFonts.poppins(color: Colors.white60, fontSize: 14),
          ),

          const SizedBox(height: 40),

          _buildLabel('Topic'),
          TextField(
            controller: _topicController,
            style: GoogleFonts.poppins(color: Colors.white),
            decoration: InputDecoration(
              hintText: 'e.g. Flutter Development, Science, etc.',
              hintStyle: const TextStyle(color: Colors.white24),
              filled: true,
              fillColor: Colors.white.withOpacity(0.05),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(color: AppColors.accent.withOpacity(0.2)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: const BorderSide(color: AppColors.accent),
              ),
            ),
          ),

          const SizedBox(height: 24),

          Row(
            children: [
              Expanded(child: _buildDropdown('Difficulty', _difficulty, _difficulties, (val) {
                if (val != null) setState(() => _difficulty = val);
              })),
              const SizedBox(width: 16),
              Expanded(child: _buildDropdown('Questions', _count.toString(), _counts.map((e) => e.toString()).toList(), (val) {
                if (val != null) setState(() => _count = int.parse(val));
              })),
            ],
          ),

          const SizedBox(height: 48),

          // Generate Button
          Container(
            width: double.infinity,
            height: 56,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: AppColors.buttonGradient,
              boxShadow: [BoxShadow(color: AppColors.accent.withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 4))],
            ),
            child: ElevatedButton(
              onPressed: _handleGenerateQuiz,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: Text(
                'Generate Quiz',
                style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
          ),

          const SizedBox(height: 32), // Extra space at bottom
        ],
      ),
    );
  }

  Widget _buildDropdown<T>(String label, T value, List<T> items, ValueChanged<T?> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel(label),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.05),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.accent.withOpacity(0.2)),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<T>(
              value: value,
              dropdownColor: AppColors.background,
              style: GoogleFonts.poppins(color: Colors.white),
              isExpanded: true,
              items: items.map((T value) {
                return DropdownMenuItem<T>(
                  value: value,
                  child: Text(value.toString().toUpperCase()),
                );
              }).toList(),
              onChanged: onChanged,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        text.toUpperCase(),
        style: GoogleFonts.poppins(color: Colors.white38, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 1.2),
      ),
    );
  }

  // Keep your existing _buildQuizView() and _buildResultsView() as they already use Expanded properly.
  // Only minor improvement: Add more padding control if needed.

  Widget _buildQuizView() {
    if (_quizData == null) return const SizedBox.shrink();
    final question = _quizData!.questions[_currentQuestionIndex];

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: AppColors.accent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.accent.withOpacity(0.2)),
                ),
                child: Text(
                  'Question ${_currentQuestionIndex + 1} of ${_quizData!.questions.length}',
                  style: GoogleFonts.poppins(color: AppColors.accent, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ),
              Flexible(
                child: Text(
                  _quizData!.topic,
                  style: GoogleFonts.poppins(color: Colors.white38, fontSize: 12),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text(
            question.question,
            style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white, height: 1.4),
          ),
          const SizedBox(height: 24),

          Expanded(
            child: ListView.builder(
              itemCount: question.options.length,
              itemBuilder: (context, index) {
                final isSelected = _selectedAnswers[_currentQuestionIndex] == index;
                return GestureDetector(
                  onTap: () => setState(() => _selectedAnswers[_currentQuestionIndex] = index),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary.withOpacity(0.2) : AppColors.cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: isSelected ? AppColors.primary : AppColors.accent.withOpacity(0.1),
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: isSelected ? Colors.white : Colors.white24, width: 2),
                            color: isSelected ? AppColors.primary : Colors.transparent,
                          ),
                          child: Center(
                            child: Text(
                              String.fromCharCode(65 + index),
                              style: TextStyle(color: isSelected ? Colors.white : Colors.white24, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            question.options[index],
                            style: GoogleFonts.poppins(
                              color: isSelected ? Colors.white : Colors.white70,
                              fontSize: 16,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (_currentQuestionIndex > 0)
                TextButton(
                  onPressed: () => setState(() => _currentQuestionIndex--),
                  child: const Text('PREVIOUS', style: TextStyle(color: Colors.white38)),
                )
              else
                const SizedBox.shrink(),
              const Spacer(),
              if (_currentQuestionIndex < _quizData!.questions.length - 1)
                ElevatedButton(
                  onPressed: _selectedAnswers.containsKey(_currentQuestionIndex)
                      ? () => setState(() => _currentQuestionIndex++)
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accent,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  ),
                  child: const Text('NEXT', style: TextStyle(fontWeight: FontWeight.bold)),
                )
              else
                ElevatedButton(
                  onPressed: _selectedAnswers.containsKey(_currentQuestionIndex) ? _submitQuiz : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  ),
                  child: const Text('SUBMIT', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildResultsView() {
    final percentage = (_score / _quizData!.questions.length) * 100;
    final isPassed = percentage >= 60;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: (isPassed ? AppColors.success : AppColors.danger).withOpacity(0.1),
              shape: BoxShape.circle,
              border: Border.all(
                color: (isPassed ? AppColors.success : AppColors.danger).withOpacity(0.2),
              ),
            ),
            child: Icon(
              isPassed ? Icons.emoji_events_rounded : Icons.sentiment_dissatisfied_rounded,
              size: 80,
              color: isPassed ? AppColors.success : AppColors.danger,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            isPassed ? 'Congratulations!' : 'Keep Practicing!',
            style: GoogleFonts.poppins(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'You scored $_score out of ${_quizData!.questions.length}',
            style: GoogleFonts.poppins(color: Colors.white60, fontSize: 18),
          ),
          const SizedBox(height: 32),
          
          // Questions Summary
          ...List.generate(_quizData!.questions.length, (index) {
            final question = _quizData!.questions[index];
            final selectedIdx = _selectedAnswers[index];
            final isCorrect = selectedIdx == question.correctAnswer;
            final isExpanded = _expandedExplanations.contains(index);

            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: (isCorrect ? AppColors.success : AppColors.danger).withOpacity(0.2),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Q${index + 1}: ',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Expanded(
                        child: Text(
                          question.question,
                          style: GoogleFonts.poppins(color: Colors.white),
                        ),
                      ),
                      Icon(
                        isCorrect ? Icons.check_circle_rounded : Icons.cancel_rounded,
                        color: isCorrect ? AppColors.success : AppColors.danger,
                        size: 20,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Correct: ${question.options[question.correctAnswer]}',
                    style: GoogleFonts.poppins(color: AppColors.success, fontSize: 13),
                  ),
                  if (!isCorrect)
                    Text(
                      'Yours: ${selectedIdx != null ? question.options[selectedIdx] : "Not Answered"}',
                      style: GoogleFonts.poppins(color: AppColors.danger, fontSize: 13),
                    ),
                  
                  if (question.explanation != null && question.explanation!.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    InkWell(
                      onTap: () {
                        setState(() {
                          if (isExpanded) {
                            _expandedExplanations.remove(index);
                          } else {
                            _expandedExplanations.add(index);
                          }
                        });
                      },
                      child: Row(
                        children: [
                          Text(
                            isExpanded ? 'Hide Explanation' : 'Show Explanation',
                            style: GoogleFonts.poppins(
                              color: AppColors.accent,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Icon(
                            isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                            color: AppColors.accent,
                            size: 16,
                          ),
                        ],
                      ),
                    ),
                    if (isExpanded)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: Text(
                          question.explanation!,
                          style: GoogleFonts.poppins(
                            color: Colors.white70,
                            fontSize: 13,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                  ],
                ],
              ),
            );
          }),

          const SizedBox(height: 32),
          Container(
            width: double.infinity,
            height: 56,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(16),
              gradient: AppColors.buttonGradient,
            ),
            child: ElevatedButton(
              onPressed: () {
                setState(() {
                  _quizData = null;
                  _expandedExplanations.clear();
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: const Text(
                'TRY ANOTHER TOPIC',
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('BACK TO DASHBOARD', style: TextStyle(color: Colors.white38)),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
