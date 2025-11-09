import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DebugScreen extends StatefulWidget {
  @override
  _DebugScreenState createState() => _DebugScreenState();
}

class _DebugScreenState extends State<DebugScreen> {
  final List<String> _logs = [];
  bool _isTestingConnectivity = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Debug Backend'),
      ),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              children: [
                ElevatedButton(
                  onPressed: _isTestingConnectivity ? null : _testBackendConnectivity,
                  child: _isTestingConnectivity 
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text('Testar Conectividade Backend'),
                ),
                SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    setState(() {
                      _logs.clear();
                    });
                  },
                  child: Text('Limpar Logs'),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.orange),
                ),
              ],
            ),
          ),
          Expanded(
            child: Container(
              margin: EdgeInsets.all(16.0),
              padding: EdgeInsets.all(12.0),
              decoration: BoxDecoration(
                color: Colors.black87,
                borderRadius: BorderRadius.circular(8),
              ),
              child: ListView.builder(
                itemCount: _logs.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: EdgeInsets.symmetric(vertical: 2.0),
                    child: Text(
                      _logs[index],
                      style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'monospace',
                        fontSize: 12,
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _addLog(String message) {
    setState(() {
      _logs.add('${DateTime.now().toIso8601String().substring(11, 19)} - $message');
    });
  }

  Future<void> _testBackendConnectivity() async {
    setState(() {
      _isTestingConnectivity = true;
      _logs.clear();
    });

    _addLog('=== INICIANDO TESTE DE CONECTIVIDADE ===');

    // Testar conectividade básica
    List<String> baseUrls = [
      'http://localhost:8080',
      'http://127.0.0.1:8080',
      'http://192.168.1.100:8080', // exemplo de IP local
    ];

    for (String baseUrl in baseUrls) {
      _addLog('Testando conectividade com: $baseUrl');
      
      try {
        final response = await http.get(
          Uri.parse(baseUrl),
          headers: {'Accept': 'application/json'},
        ).timeout(Duration(seconds: 5));
        
        _addLog('✅ $baseUrl - Status: ${response.statusCode}');
        if (response.body.isNotEmpty) {
          _addLog('Resposta: ${response.body.substring(0, response.body.length > 200 ? 200 : response.body.length)}...');
        }
        
        // Se conectou, tentar descobrir endpoints
        await _discoverEndpoints(baseUrl);
        
      } catch (e) {
        _addLog('❌ $baseUrl - Erro: $e');
      }
    }

    // Testar endpoints específicos
    await _testSpecificEndpoints();

    setState(() {
      _isTestingConnectivity = false;
    });
    
    _addLog('=== TESTE FINALIZADO ===');
  }

  Future<void> _discoverEndpoints(String baseUrl) async {
    _addLog('--- Descobrindo endpoints para $baseUrl ---');
    
    List<String> commonEndpoints = [
      '/actuator/health',
      '/api/health',
      '/health',
      '/api',
      '/swagger-ui.html',
      '/v3/api-docs',
      '/api/auth',
      '/auth',
      '/api/pacientes',
      '/pacientes',
      '/api/medicos',
      '/medicos',
      '/api/consultas',
      '/consultas',
    ];

    for (String endpoint in commonEndpoints) {
      try {
        final response = await http.get(
          Uri.parse('$baseUrl$endpoint'),
          headers: {'Accept': 'application/json'},
        ).timeout(Duration(seconds: 3));
        
        if (response.statusCode < 500) {
          _addLog('✅ $endpoint - Status: ${response.statusCode}');
        }
      } catch (e) {
        // Ignorar erros silenciosamente para não poluir logs
      }
    }
  }

  Future<void> _testSpecificEndpoints() async {
    _addLog('--- Testando endpoints de autenticação ---');
    
    String baseUrl = 'http://localhost:8080';
    
    List<String> authEndpoints = [
      '/api/auth/login',
      '/auth/login',
      '/login',
      '/api/login',
      '/api/auth/authenticate',
    ];

    Map<String, String> headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    Map<String, dynamic> testPayload = {
      'email': 'test@test.com',
      'password': 'test123'
    };

    for (String endpoint in authEndpoints) {
      try {
        _addLog('POST $endpoint');
        
        final response = await http.post(
          Uri.parse('$baseUrl$endpoint'),
          headers: headers,
          body: jsonEncode(testPayload),
        ).timeout(Duration(seconds: 5));
        
        _addLog('Status: ${response.statusCode}');
        _addLog('Headers: ${response.headers}');
        
        if (response.body.isNotEmpty) {
          try {
            final jsonResponse = jsonDecode(response.body);
            _addLog('JSON Response: $jsonResponse');
          } catch (e) {
            _addLog('Text Response: ${response.body.substring(0, response.body.length > 300 ? 300 : response.body.length)}');
          }
        }
        
        _addLog('---');
        
      } catch (e) {
        _addLog('❌ Erro em $endpoint: $e');
      }
    }
  }
}