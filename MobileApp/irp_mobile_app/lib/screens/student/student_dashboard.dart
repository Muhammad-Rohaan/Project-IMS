import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/student_provider.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';
import 'announcement_screen.dart';
import 'student_fees_screen.dart';
import 'student_results_screen.dart';
import 'notes_screen.dart';
import 'student_profile_screen.dart';
import '../student/generate_quiz_screen.dart';
import '../auth/change_password_screen.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class StudentDashboard extends StatefulWidget {
  const StudentDashboard({super.key});

  @override
  State<StudentDashboard> createState() => _StudentDashboardState();
}

class _StudentDashboardState extends State<StudentDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<StudentProvider>(context, listen: false).fetchProfile();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final studentProvider = Provider.of<StudentProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: AppColors.backgroundGradient,
        ),
        child: SafeArea(
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.all(24.0.r),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: GradientText(
                              'Student Portal',
                              gradient: AppColors.textGradient,
                              style: GoogleFonts.poppins(
                                fontSize: 32.sp,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                          IconButton(
                            icon: Icon(Icons.power_settings_new, color: AppColors.danger, size: 24.sp),
                            onPressed: () => authProvider.logout(),
                          ),
                        ],
                      ),
                      Text(
                        'Welcome back, ${user?.fullName ?? 'Student'}',
                        style: GoogleFonts.poppins(
                          color: Colors.white70,
                          fontSize: 16.sp,
                        ),
                      ),
                      SizedBox(height: 32.h),
                      
                      // AI MCQs Banner
                      Container(
                        padding: EdgeInsets.all(24.r),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppColors.accent.withOpacity(0.1),
                              AppColors.primary.withOpacity(0.1),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(30.r),
                          border: Border.all(
                            color: AppColors.accent.withOpacity(0.2),
                          ),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'AI MCQs Generator',
                                    style: GoogleFonts.poppins(
                                      color: AppColors.accent,
                                      fontSize: 20.sp,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(height: 4.h),
                                  Text(
                                    'Practice smarter with AI-generated quizzes.',
                                    style: TextStyle(color: Colors.white60, fontSize: 13.sp),
                                  ),
                                  SizedBox(height: 16.h),
                                  ElevatedButton(
                                    onPressed: () => Navigator.push(
                                      context,
                                      MaterialPageRoute(builder: (_) => const GenerateQuizScreen()),
                                    ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppColors.primary,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12.r),
                                      ),
                                      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
                                    ),
                                    child: Text('🚀 Start Quiz', style: TextStyle(fontSize: 14.sp)),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 32.h),
                      
                      // Profile Card
                      Container(
                        width: double.infinity,
                        padding: EdgeInsets.all(24.r),
                        decoration: BoxDecoration(
                          color: AppColors.cardBg,
                          borderRadius: BorderRadius.circular(24.r),
                          border: Border.all(
                            color: AppColors.accent.withOpacity(0.3),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Your Profile',
                              style: GoogleFonts.poppins(
                                color: AppColors.accent,
                                fontSize: 18.sp,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Divider(color: Colors.white10, height: 24.h),
                            _buildProfileItem('Full Name', user?.fullName ?? 'N/A'),
                            SizedBox(height: 16.h),
                            _buildProfileItem('Email Address', user?.email ?? 'N/A'),
                            SizedBox(height: 16.h),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 4.h),
                              decoration: BoxDecoration(
                                color: AppColors.accent.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20.r),
                              ),
                              child: Text(
                                user?.role?.toUpperCase() ?? 'STUDENT',
                                style: TextStyle(
                                  color: AppColors.accent,
                                  fontSize: 10.sp,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 32.h),
                    ],
                  ),
                ),
              ),
              SliverPadding(
                padding: EdgeInsets.symmetric(horizontal: 24.w),
                sliver: SliverGrid(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16.w,
                    mainAxisSpacing: 16.h,
                    childAspectRatio: 1.0,
                  ),
                  delegate: SliverChildListDelegate([
                    _buildActionCard(
                      context,
                      'Announcements',
                      Icons.campaign_rounded,
                      AppColors.accent,
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AnnouncementScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Fees Status',
                      Icons.account_balance_wallet_rounded,
                      AppColors.success,
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentFeesScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'My Results',
                      Icons.auto_awesome_rounded,
                      Colors.amber,
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const StudentResultsScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Study Notes',
                      Icons.menu_book_rounded,
                      Colors.indigoAccent,
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotesScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Password',
                      Icons.lock_reset_rounded,
                      Colors.pinkAccent,
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChangePasswordScreen())),
                    ),
                  ]),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 32)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: TextStyle(
            color: Colors.white38,
            fontSize: 10.sp,
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        SizedBox(height: 4.h),
        Text(
          value,
          style: TextStyle(
            color: Colors.white,
            fontSize: 16.sp,
          ),
        ),
      ],
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.cardBg,
        borderRadius: BorderRadius.circular(24.r),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(24.r),
          child: Padding(
            padding: EdgeInsets.all(16.r),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: EdgeInsets.all(12.r),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: color, size: 32.sp),
                ),
                SizedBox(height: 12.h),
                Flexible(
                  child: Text(
                    title,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 13.sp,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
