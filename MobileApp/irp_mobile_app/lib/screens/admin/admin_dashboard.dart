import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/admin_provider.dart';
import '../../constants/app_colors.dart';
import '../../widgets/gradient_text.dart';
import 'register_teacher_screen.dart';
import 'register_receptionist_screen.dart';
import 'teacher_list_screen.dart';
import 'receptionist_list_screen.dart';
import '../student/announcement_screen.dart';
import 'post_announcement_screen.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AdminProvider>(context, listen: false).fetchStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final adminProvider = Provider.of<AdminProvider>(context);
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
                              'Admin Portal',
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
                        'Welcome back, ${user?.fullName ?? 'Admin'}',
                        style: GoogleFonts.poppins(
                          color: Colors.white70,
                          fontSize: 16.sp,
                        ),
                      ),
                      SizedBox(height: 32.h),

                      // Stats Grid
                      Row(
                        children: [
                          Expanded(
                            child: _buildStatCard(
                              'Students',
                              adminProvider.stats['students'].toString(),
                              Icons.people_alt_rounded,
                              const [Color(0xFF6366F1), Color(0xFF4F46E5)],
                            ),
                          ),
                          SizedBox(width: 12.w),
                          Expanded(
                            child: _buildStatCard(
                              'Teachers',
                              adminProvider.stats['teachers'].toString(),
                              Icons.school_rounded,
                              const [Color(0xFF06B6D4), Color(0xFF0891B2)],
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 12.h),
                      _buildStatCard(
                        'Active Announcements',
                        adminProvider.stats['announcements'].toString(),
                        Icons.campaign_rounded,
                        const [Color(0xFFEC4899), Color(0xFFDB2777)],
                        isFullWidth: true,
                      ),
                      SizedBox(height: 32.h),

                      Text(
                        'Quick Actions',
                        style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 20.sp,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16.h),
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
                      'Add Teacher',
                      Icons.person_add_rounded,
                      const Color(0xFF3B82F6),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterTeacherScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Add Receptionist',
                      Icons.how_to_reg_rounded,
                      const Color(0xFF6366F1),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RegisterReceptionistScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'View Teachers',
                      Icons.groups_rounded,
                      const Color(0xFF14B8A6),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TeacherListScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'View Receptionists',
                      Icons.badge_rounded,
                      const Color(0xFF06B6D4),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ReceptionistListScreen())),
                    ),
                    _buildActionCard(
                      context,
                      'Post Announcement',
                      Icons.add_alert_rounded,
                      const Color(0xFFEC4899),
                      () => Navigator.push(context, MaterialPageRoute(builder: (_) => const PostAnnouncementScreen())),
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

  Widget _buildStatCard(String label, String value, IconData icon, List<Color> colors, {bool isFullWidth = false}) {
    return Container(
      width: isFullWidth ? double.infinity : null,
      padding: EdgeInsets.all(20.r),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [colors[0].withOpacity(0.8), colors[1].withOpacity(0.9)],
        ),
        borderRadius: BorderRadius.circular(24.r),
        boxShadow: [
          BoxShadow(
            color: colors[0].withOpacity(0.3),
            blurRadius: 10.r,
            offset: Offset(0, 4.h),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(color: Colors.white70, fontSize: 12.sp, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4.h),
              Text(
                value,
                style: TextStyle(color: Colors.white, fontSize: 28.sp, fontWeight: FontWeight.w900),
              ),
            ],
          ),
          Container(
            padding: EdgeInsets.all(10.r),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: Colors.white, size: 24.sp),
          ),
        ],
      ),
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
