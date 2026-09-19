import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'dart:convert';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();
  static Database? _database;

  factory DatabaseHelper() => _instance;

  DatabaseHelper._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'az_school.db');
    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE offline_data (
        key TEXT PRIMARY KEY,
        value TEXT,
        updated_at INTEGER
      )
    ''');
  }

  Future<void> saveData(String key, dynamic data) async {
    final db = await database;
    await db.insert(
      'offline_data',
      {
        'key': key,
        'value': json.encode(data),
        'updated_at': DateTime.now().millisecondsSinceEpoch,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<dynamic> getData(String key) async {
    final db = await database;
    final List<Map<String, dynamic>> maps = await db.query(
      'offline_data',
      where: 'key = ?',
      whereArgs: [key],
    );

    if (maps.isNotEmpty) {
      return json.decode(maps.first['value']);
    }
    return null;
  }

  Future<void> clearDatabase() async {
    final db = await database;
    await db.delete('offline_data');
  }
}
