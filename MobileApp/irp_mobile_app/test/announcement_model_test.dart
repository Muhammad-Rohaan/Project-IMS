import 'package:flutter_test/flutter_test.dart';
import 'package:irp_mobile_app/models/announcement_model.dart';

void main() {
  group('AnnouncementModel Tests', () {
    test('should create an AnnouncementModel from JSON', () {
      final json = {
        '_id': '1',
        'title': 'Test Title',
        'message': 'Test Message',
        'target': 'all',
        'createdBy': 'Admin',
        'createdAt': '2024-01-01T00:00:00.000Z',
      };

      final announcement = AnnouncementModel.fromJson(json);

      expect(announcement.id, '1');
      expect(announcement.title, 'Test Title');
      expect(announcement.message, 'Test Message');
      expect(announcement.createdBy, 'Admin');
    });

    test('should convert AnnouncementModel to JSON', () {
      final announcement = AnnouncementModel(
        id: '1',
        title: 'Test Title',
        message: 'Test Message',
        target: 'all',
        createdBy: 'Admin',
        createdAt: DateTime.parse('2024-01-01T00:00:00.000Z'),
      );

      final json = announcement.toJson();

      expect(json['_id'], '1');
      expect(json['title'], 'Test Title');
      expect(json['message'], 'Test Message');
      expect(json['createdBy'], 'Admin');
    });
  });
}
