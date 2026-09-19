import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:irp_mobile_app/screens/auth/login_screen.dart';
import 'package:irp_mobile_app/providers/auth_provider.dart';

void main() {
  testWidgets('LoginScreen UI components test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => AuthProvider()),
        ],
        child: const MaterialApp(
          home: LoginScreen(),
        ),
      ),
    );

    // Verify if email and password fields exist
    expect(find.byType(TextFormField), findsNWidgets(2));
    expect(find.text('Email'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);

    // Verify if Login button exists
    expect(find.byType(ElevatedButton), findsOneWidget);
    expect(find.text('LOGIN'), findsOneWidget);
  });
}
