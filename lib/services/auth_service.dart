import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService extends ChangeNotifier {
  User? _currentUser;
  String? _token;
  bool _isAuthenticated = false;

  User? get currentUser => _currentUser;
  String? get token => _token;
  bool get isAuthenticated => _isAuthenticated;

  final ApiService _apiService = ApiService();

  AuthService() {
    _loadToken();
  }

  Future<void> _loadToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _token = prefs.getString('token');
      if (_token != null) {
        // Verify token with backend
        final user = await _apiService.getCurrentUser(_token!);
        if (user != null) {
          _currentUser = user;
          _isAuthenticated = true;
          notifyListeners();
        } else {
          await logout();
        }
      }
    } catch (e) {
      print('Error loading token: $e');
      await logout();
    }
  }

  Future<bool> login(String email, String password) async {
    try {
      final response = await _apiService.login(email, password);
      print('Login response: $response');
      
      if (response['token'] != null && response['user'] != null) {
        _token = response['token'] as String;
        _currentUser = User.fromJson(response['user'] as Map<String, dynamic>);
        _isAuthenticated = true;

        // Save token to storage
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', _token!);

        print('Login successful - User: ${_currentUser?.nome}, Role: ${_currentUser?.role}');
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Login error: $e');
      return false;
    }
  }

  Future<bool> register({
    required String nome,
    required String email,
    required String password,
    required String telefone,
    String? cpf,
    DateTime? dataNascimento,
  }) async {
    try {
      final response = await _apiService.register(
        nome: nome,
        email: email,
        password: password,
        telefone: telefone,
        cpf: cpf,
        dataNascimento: dataNascimento,
      );
      
      if (response['success'] == true) {
        // Auto login after registration
        return await login(email, password);
      }
      return false;
    } catch (e) {
      print('Registration error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    _token = null;
    _currentUser = null;
    _isAuthenticated = false;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');

    notifyListeners();
  }

  Future<bool> updateProfile({
    required String nome,
    required String telefone,
    String? cpf,
    DateTime? dataNascimento,
  }) async {
    try {
      if (_token == null || _currentUser == null) return false;

      final updatedUser = await _apiService.updateUser(
        token: _token!,
        userId: _currentUser!.id,
        nome: nome,
        telefone: telefone,
        cpf: cpf,
        dataNascimento: dataNascimento,
      );

      if (updatedUser != null) {
        _currentUser = updatedUser;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Update profile error: $e');
      return false;
    }
  }
}