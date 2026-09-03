import 'package:flutter/material.dart';

class AppColors {
  static const Color background = Color(0xFF0F172A);
  static const Color indigo950 = Color(0xFF1E1B4B);
  static const Color cardBg = Color(0x0DFFFFFF); // white/5
  static const Color primary = Color(0xFF8B5CF6); // Purple
  static const Color accent = Color(0xFF06B6D4); // Cyan
  static const Color neon = Color(0xFFC084FC);
  static const Color danger = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  
  static const Color cyan400 = Color(0xFF22D3EE);
  static const Color purple500 = Color(0xFFA855F7);
  static const Color pink500 = Color(0xFFEC4899);

  static const LinearGradient backgroundGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      background,
      indigo950,
      background,
    ],
  );

  static const LinearGradient buttonGradient = LinearGradient(
    colors: [
      Color(0xFF9333EA), // purple-600
      Color(0xFF0891B2), // cyan-600
    ],
  );

  static const LinearGradient textGradient = LinearGradient(
    colors: [
      cyan400,
      purple500,
      pink500,
    ],
  );
}
