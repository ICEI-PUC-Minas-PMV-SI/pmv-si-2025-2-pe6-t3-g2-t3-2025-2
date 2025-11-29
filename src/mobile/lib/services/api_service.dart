import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../models/consulta.dart';
import '../models/medico.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8080';
  
  // Headers padrão
  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  Map<String, String> _headersWithAuth(String token) {
    print('🔑 Usando token: ${token.length > 50 ? "${token.substring(0, 50)}..." : token}');
    
    // Testar diferentes formatos de Authorization header
    Map<String, String> headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };
    
    print('📤 Headers de autenticação: ${headers.keys}');
    return headers;
  }

  // Auth endpoints - Configuração baseada no Swagger
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      print('=== LOGIN MEDLINK ===');
      print('Email: $email');
      print('Endpoint: $baseUrl/medlink/login');
      
      final response = await http.post(
        Uri.parse('$baseUrl/medlink/login'),
        headers: _headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      print('Status: ${response.statusCode}');
      print('Resposta: ${response.body}');
      print('Headers: ${response.headers}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        print('✅ LOGIN SUCESSO!');
        
        // Extrair token
        String? token = (data['token'] ?? 
                        data['accessToken'] ?? 
                        data['jwt'] ?? 
                        data['access_token']) as String?;
        
        print('Token encontrado: ${token != null ? "SIM" : "NÃO"}');
        
        if (token != null) {
          // Tentar obter dados do usuário usando o token
          try {
            print('Buscando dados do usuário...');
            final userResponse = await getCurrentUser(token);
            
            if (userResponse != null) {
              print('✅ Dados do usuário obtidos!');
              return {
                'token': token,
                'user': userResponse.toJson(),
              };
            }
          } catch (e) {
            print('Erro ao buscar usuário: $e');
          }
          
          // Se não conseguir buscar dados do usuário, criar um usuário básico
          print('Criando usuário básico a partir do email');
          
          // Determinar role baseado no email para teste
          String role = 'PACIENTE';
          if (email.contains('admin')) {
            role = 'ADMIN';
          } else if (email.contains('medico')) {
            role = 'MEDICO';
          }
          
          return {
            'token': token,
            'user': {
              'id': 1,
              'email': email,
              'nome': email.split('@')[0].toUpperCase(),
              'telefone': '',
              'role': role
            },
          };
        }
        
        // Se chegou até aqui, não conseguiu processar o token
        throw Exception('Token não encontrado na resposta');
        
      } else if (response.statusCode == 401) {
        throw Exception('Credenciais inválidas');
      } else if (response.statusCode == 403) {
        throw Exception('Acesso negado - Verifique suas credenciais');
      } else {
        throw Exception('Erro no servidor: ${response.statusCode}');
      }
    } catch (e) {
      print('Erro detalhado: $e');
      throw Exception('Erro de login: $e');
    }
  }

  Future<Map<String, dynamic>> register({
    required String nome,
    required String email,
    required String password,
    required String telefone,
    String? cpf,
    DateTime? dataNascimento,
  }) async {
    try {
      print('👤 === REGISTRANDO NOVO PACIENTE ===');
      
      // According to SecurityConfig: /medlink/paciente/register
      final response = await http.post(
        Uri.parse('$baseUrl/medlink/paciente/register'),
        headers: _headers,
        body: jsonEncode({
          'nome': nome,
          'email': email,
          'password': password, // Usar 'password' conforme o padrão do login
          'telefone': telefone,
          'cpf': cpf,
          'dataNascimento': dataNascimento?.toIso8601String(),
        }),
      );

      print('Register Status: ${response.statusCode}');
      print('Register Body: ${response.body}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        return {'success': true};
      } else {
        throw Exception('Registration failed: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Registration error: $e');
    }
  }

  // Método para testar se o token é válido
  Future<bool> validateToken(String token) async {
    print('🔐 === VALIDANDO TOKEN ===');
    
    // Endpoints para testar o token
    List<String> testEndpoints = [
      '$baseUrl/medlink/auth/validate',
      '$baseUrl/medlink/test',
      '$baseUrl/medlink/health',
      '$baseUrl/medlink/me',
    ];

    for (String endpoint in testEndpoints) {
      try {
        print('🧪 Testando token em: $endpoint');
        final response = await http.get(
          Uri.parse(endpoint),
          headers: _headersWithAuth(token),
        );
        
        print('🔍 Status: ${response.statusCode}');
        if (response.statusCode == 200) {
          print('✅ Token válido!');
          return true;
        }
      } catch (e) {
        print('❌ Erro ao testar token em $endpoint: $e');
      }
    }
    
    print('❌ Token pode estar inválido ou expirado');
    return false;
  }

  Future<User?> getCurrentUser(String token) async {
    print('👤 === BUSCANDO DADOS DO USUÁRIO ===');
    
    // Based on SecurityConfig, use singular 'paciente' not 'pacientes'
    List<Map<String, String>> userEndpoints = [
      {'endpoint': '$baseUrl/medlink/paciente', 'role': 'PACIENTE'},
      {'endpoint': '$baseUrl/medlink/medico', 'role': 'MEDICO'}, 
      {'endpoint': '$baseUrl/medlink/admin/pacientes', 'role': 'ADMIN'},
    ];
    
    for (Map<String, String> endpointInfo in userEndpoints) {
      try {
        String endpoint = endpointInfo['endpoint']!;
        String role = endpointInfo['role']!;
        
        print('🔍 Testando endpoint para $role: $endpoint');
        final response = await http.get(
          Uri.parse(endpoint),
          headers: _headersWithAuth(token),
        );

        print('📊 Status: ${response.statusCode}');
        print('📄 Body: ${response.body}');

        if (response.statusCode == 200) {
          try {
            final responseData = jsonDecode(response.body);
            
            // Se conseguiu acessar este endpoint, o usuário tem este papel
            if (responseData is Map<String, dynamic>) {
              // É um objeto direto (paciente ou médico)
              print('✅ Usuário $role encontrado!');
              final user = User.fromJson(responseData);
              return user.copyWith(
                role: UserRole.values.firstWhere((r) => r.toString().split('.').last == role),
              );
            } else if (responseData is List && responseData.isNotEmpty) {
              // Se é uma lista, pegar o primeiro item
              print('✅ Lista de $role encontrada!');
              final user = User.fromJson(responseData[0] as Map<String, dynamic>);
              return user.copyWith(
                role: UserRole.values.firstWhere((r) => r.toString().split('.').last == role),
              );
            }
          } catch (e) {
            print('❌ Erro ao parsear dados do usuário: $e');
          }
        } else if (response.statusCode == 403) {
          print('🚫 Usuário não tem permissão para $role');
          continue;
        }
      } catch (e) {
        print('❌ Erro no endpoint ${endpointInfo['endpoint']}: $e');
        continue;
      }
    }
    
    print('😞 Não foi possível identificar o papel do usuário');
    return null;
  }

  Future<User?> updateUser({
    required String token,
    required String userId,
    required String nome,
    required String telefone,
    String? cpf,
    DateTime? dataNascimento,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/medlink/paciente/$userId'),
        headers: _headersWithAuth(token),
        body: jsonEncode({
          'nome': nome,
          'telefone': telefone,
          'cpf': cpf,
          'dataNascimento': dataNascimento?.toIso8601String(),
        }),
      );

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
      }
      return null;
    } catch (e) {
      print('Update user error: $e');
      return null;
    }
  }

  // ========== ADMIN ENDPOINTS ==========
  
  Future<Medico?> createMedico({
    required String token,
    required String nome,
    required String email,
    required String password,
    required String telefone,
    required String especialidade,
    required String crm,
    String? endereco,
  }) async {
    try {
      print('👨‍⚕️ === CRIANDO MÉDICO (ADMIN) ===');
      
      final response = await http.post(
        Uri.parse('$baseUrl/medlink/medico/register'),
        headers: _headersWithAuth(token),
        body: jsonEncode({
          'nome': nome,
          'email': email,
          'password': password,
          'telefone': telefone,
          'especialidade': especialidade,
          'crm': crm,
          'endereco': endereco,
        }),
      );

      print('Create Medico Status: ${response.statusCode}');
      print('Create Medico Body: ${response.body}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        print('✅ Médico criado com sucesso!');
        return Medico(
          id: email, // Backend retorna apenas mensagem de sucesso
          nome: nome,
          email: email,
          telefone: telefone,
          especialidade: especialidade,
          crm: crm,
        );
      } else if (response.statusCode == 403) {
        throw Exception('Acesso negado - Apenas administradores podem criar médicos');
      } else if (response.statusCode == 409) {
        throw Exception('E-mail já cadastrado no sistema');
      } else {
        throw Exception('Erro ao criar médico: ${response.body}');
      }
    } catch (e) {
      print('Create medico error: $e');
      rethrow;
    }
  }

  Future<bool> deleteMedico(String token, String medicoId) async {
    try {
      print('🗑️ === DELETANDO MÉDICO (ADMIN) ===');
      
      // According to Swagger, this should be an admin endpoint  
      final response = await http.delete(
        Uri.parse('$baseUrl/medlink/admin/medicos/$medicoId'),
        headers: _headersWithAuth(token),
      );

      print('Delete Medico Status: ${response.statusCode}');
      
      if (response.statusCode == 403) {
        print('🚫 Acesso negado - Apenas administradores podem deletar médicos');
      }
      
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      print('Delete medico error: $e');
      return false;
    }
  }

  Future<List<User>> getAllPacientes(String token) async {
    try {
      print('👥 === BUSCANDO TODOS PACIENTES (ADMIN) ===');
      
      // According to Swagger, admin can access all patients
      final response = await http.get(
        Uri.parse('$baseUrl/medlink/admin/pacientes'),
        headers: _headersWithAuth(token),
      );

      print('Get All Pacientes Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> pacientesJson = jsonDecode(response.body) as List<dynamic>;
        return pacientesJson.map((json) => User.fromJson(json as Map<String, dynamic>)).toList();
      } else if (response.statusCode == 403) {
        print('🚫 Acesso negado - Apenas administradores podem ver todos os pacientes');
      }
      return [];
    } catch (e) {
      print('Get all pacientes error: $e');
      return [];
    }
  }

  // ========== MEDICO ENDPOINTS ==========

  Future<List<Consulta>> getConsultasMedico(String token, String medicoId) async {
    try {
      print('🩺 === BUSCANDO CONSULTAS DO MÉDICO ===');
      
      // According to SecurityConfig: /medlink/medico/consultas
      final response = await http.get(
        Uri.parse('$baseUrl/medlink/medico/consultas'),
        headers: _headersWithAuth(token),
      );

      print('Get Consultas Medico Status: ${response.statusCode}');
      if (response.statusCode == 200) {
        final List<dynamic> consultasJson = jsonDecode(response.body) as List<dynamic>;
        return consultasJson.map((json) => Consulta.fromJson(json as Map<String, dynamic>)).toList();
      } else if (response.statusCode == 403) {
        print('🚫 Acesso negado - Apenas médicos podem ver suas consultas');
      }
      return [];
    } catch (e) {
      print('Get consultas medico error: $e');
      return [];
    }
  }

  Future<bool> updateConsultaStatus({
    required String token,
    required String consultaId,
    required String status,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/medlink/consultas/$consultaId/status'),
        headers: _headersWithAuth(token),
        body: jsonEncode({'status': status}),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Update consulta status error: $e');
      return false;
    }
  }

  // Consultas endpoints - Based on Swagger documentation
  Future<List<Consulta>> getConsultas(String token, {String? pacienteId}) async {
    try {
      print('📋 === BUSCANDO CONSULTAS ===');
      
      // According to SecurityConfig, try different endpoints based on role
      List<String> consultasEndpoints = [
        '$baseUrl/medlink/admin/consultas',     // Admin view of all consultations
        '$baseUrl/medlink/medico/consultas',   // Doctor's consultations
        '$baseUrl/medlink/paciente/consultas', // Patient's own consultations
      ];

      for (String endpoint in consultasEndpoints) {
        try {
          String url = endpoint;
          if (pacienteId != null && endpoint.contains('paciente')) {
            url += '?pacienteId=$pacienteId';
          }

          print('🔍 Testando endpoint: $url');
          final response = await http.get(
            Uri.parse(url),
            headers: _headersWithAuth(token),
          );

          print('Get Consultas Status: ${response.statusCode}');
          if (response.statusCode == 200) {
            final List<dynamic> consultasJson = jsonDecode(response.body) as List<dynamic>;
            print('✅ Encontradas ${consultasJson.length} consultas');
            
            // Buscar dados dos médicos para enriquecer as consultas
            final medicos = await getMedicos(token);
            final medicosMap = {for (var m in medicos) m.id: m};
            
            // Enriquecer consultas com dados dos médicos
            final consultas = consultasJson.map((json) {
              final consultaJson = json as Map<String, dynamic>;
              final medicoId = consultaJson['medicoId']?.toString();
              
              // Se a consulta não tem dados do médico completos, adicionar
              if (medicoId != null && medicosMap.containsKey(medicoId)) {
                final medico = medicosMap[medicoId]!;
                consultaJson['medico'] = {
                  'id': medico.id,
                  'nome': medico.nome,
                  'especialidade': medico.especialidade,
                };
              }
              
              return Consulta.fromJson(consultaJson);
            }).toList();
            
            return consultas;
          } else if (response.statusCode == 403) {
            print('🚫 Acesso negado para $endpoint');
            continue; // Try next endpoint
          }
        } catch (e) {
          print('❌ Erro no endpoint $endpoint: $e');
          continue;
        }
      }
      
      return [];
    } catch (e) {
      print('Get consultas error: $e');
      return [];
    }
  }

  Future<Consulta?> createConsulta({
    required String token,
    required DateTime dataHora,
    required String medicoId,
    String? observacoes,
  }) async {
    try {
      print('📅 === CRIANDO CONSULTA ===');
      
      // According to SecurityConfig: /medlink/paciente/consultas
      final response = await http.post(
        Uri.parse('$baseUrl/medlink/paciente/consultas'),
        headers: _headersWithAuth(token),
        body: jsonEncode({
          'dataHora': dataHora.toIso8601String(),
          'medicoId': medicoId,
          'observacoes': observacoes,
          'status': 'AGENDADA',
        }),
      );

      print('Create Consulta Status: ${response.statusCode}');
      print('Create Consulta Body: ${response.body}');

      if (response.statusCode == 201 || response.statusCode == 200) {
        return Consulta.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
      } else if (response.statusCode == 403) {
        print('🚫 Acesso negado - Verifique se o usuário pode agendar consultas');
      }
      return null;
    } catch (e) {
      print('Create consulta error: $e');
      return null;
    }
  }

  Future<bool> cancelConsulta(String token, String consultaId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/medlink/paciente/consulta/$consultaId'),
        headers: _headersWithAuth(token),
      );

      print('Cancel Consulta Status: ${response.statusCode}');
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      print('Cancel consulta error: $e');
      return false;
    }
  }

  // Médicos endpoints - Based on Security Configuration
  Future<List<Medico>> getMedicos(String token) async {
    print('🏥 === BUSCANDO MÉDICOS ===');
    
    // Endpoint correto para PACIENTE (igual ao frontend)
    final String endpoint = '$baseUrl/medlink/paciente/medicos';
    
    print('🔍 Usando endpoint PACIENTE: $endpoint');

    try {
      final response = await http.get(
        Uri.parse(endpoint),
        headers: _headersWithAuth(token),
      );

      print('📊 Status: ${response.statusCode}');
      print('📄 Response Headers: ${response.headers}');
      
      if (response.statusCode == 200) {
        print('✅ Sucesso! Resposta: ${response.body}');
        
        try {
          final responseData = jsonDecode(response.body);
          
          if (responseData is List) {
            final List<dynamic> medicosJson = responseData;
            print('📋 Encontrados ${medicosJson.length} médicos');
            return medicosJson.map((json) => Medico.fromJson(json as Map<String, dynamic>)).toList();
          } else if (responseData is Map && responseData['content'] != null) {
            // Caso seja uma resposta paginada
            final List<dynamic> medicosJson = responseData['content'] as List<dynamic>;
            print('📋 Encontrados ${medicosJson.length} médicos (paginado)');
            return medicosJson.map((json) => Medico.fromJson(json as Map<String, dynamic>)).toList();
          } else if (responseData is Map) {
            // Pode ser um objeto único
            print('📋 Encontrado 1 médico (objeto único)');
            return [Medico.fromJson(responseData as Map<String, dynamic>)];
          } else {
            print('⚠️ Formato de resposta inesperado: ${responseData.runtimeType}');
            return [];
          }
        } catch (e) {
          print('❌ Erro ao parsear JSON: $e');
          print('📄 Raw response: ${response.body}');
          return [];
        }
      } else {
        print('❌ Erro ${response.statusCode}: ${response.body}');
        
        if (response.statusCode == 401) {
          print('🚫 Token inválido ou expirado');
          throw Exception('Token inválido. Faça login novamente.');
        } else if (response.statusCode == 403) {
          print('🚫 Acesso negado. Usuário não tem permissão ADMIN');
          throw Exception('Acesso negado. Você precisa de permissões de administrador.');
        } else {
          throw Exception('Erro ao buscar médicos: ${response.statusCode}');
        }
      }
    } catch (e) {
      print('❌ Erro na requisição: $e');
      if (e.toString().contains('Token inválido') || e.toString().contains('Acesso negado')) {
        rethrow;
      }
      throw Exception('Erro de conexão ao buscar médicos');
    }
  }

  /// Retorna lista de slots com ID, início, fim e status (igual ao frontend)
  Future<List<Map<String, dynamic>>> getAvailableSlots({
    required String token,
    required String medicoId,
    required DateTime date,
  }) async {
    try {
      print('⏰ === BUSCANDO HORÁRIOS DISPONÍVEIS ===');
      
      // Endpoint correto do PACIENTE (igual ao frontend)
      final dateStr = date.toIso8601String().split('T')[0];
      final url = '$baseUrl/medlink/paciente/medicos/$medicoId/slots?data=$dateStr';
      print('📍 URL: $url');
      
      final response = await http.get(
        Uri.parse(url),
        headers: _headersWithAuth(token),
      );

      print('Get Available Slots Status: ${response.statusCode}');
      print('Response body: ${response.body}');
      
      if (response.statusCode == 200) {
        final List<dynamic> slotsJson = jsonDecode(response.body) as List<dynamic>;
        // Backend retorna objetos com {id, inicio, fim, status}
        // Retornar o objeto completo para usar o slotId depois
        return slotsJson.map((slot) => slot as Map<String, dynamic>).toList();
      } else if (response.statusCode == 403) {
        print('🚫 Acesso negado - Verifique permissões para ver disponibilidade');
      }
      return [];
    } catch (e) {
      print('Get available slots error: $e');
      return [];
    }
  }

  /// Cria slots de atendimento para o médico no intervalo [inicio, fim]
  /// com duração em minutos `duracaoMin`.
  /// Caso o backend retorne erro, lança Exception.
  Future<void> createSlots({
    required String token,
    required DateTime inicio,
    required DateTime fim,
    required int duracaoMin,
  }) async {
    try {
      print('⏳ === CRIANDO SLOTS ===');
      final url = '$baseUrl/medlink/medico/slots';
      print('📍 URL: $url');

      final payload = {
        'inicio': inicio.toIso8601String(),
        'fim': fim.toIso8601String(),
        'duracaoMin': duracaoMin,
      };

      print('📦 Payload: $payload');

      final response = await http.post(
        Uri.parse(url),
        headers: _headersWithAuth(token),
        body: jsonEncode(payload),
      );

      print('Create Slots Status: ${response.statusCode}');
      print('Create Slots Body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('✅ Slots criados com sucesso');
        return;
      } else if (response.statusCode == 403) {
        throw Exception('Acesso negado ao criar slots');
      } else {
        throw Exception('Erro ao criar slots: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Create slots error: $e');
      rethrow;
    }
  }

  /// Agenda consulta usando slotId (igual ao frontend: useAgendarConsultaPorSlot)
  Future<Map<String, dynamic>?> agendarConsultaPorSlot({
    required String token,
    required String slotId,
    String? observacoes,
  }) async {
    try {
      print('📅 === AGENDANDO CONSULTA POR SLOT ===');
      print('SlotId: $slotId');
      
      final url = '$baseUrl/medlink/paciente/consulta/por-slot';
      print('📍 URL: $url');
      
      // Payload exatamente igual ao frontend: {slotId: string, observacoes?: string}
      final payload = {
        'slotId': slotId,
        if (observacoes != null && observacoes.isNotEmpty) 'observacoes': observacoes,
      };
      
      print('📦 Payload: $payload');
      
      final response = await http.post(
        Uri.parse(url),
        headers: _headersWithAuth(token),
        body: jsonEncode(payload),
      );

      print('Status: ${response.statusCode}');
      print('Response body: ${response.body}');
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        print('✅ Consulta agendada com sucesso!');
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        print('❌ Erro ao agendar: ${response.statusCode}');
        throw Exception('Erro ao agendar consulta: ${response.body}');
      }
    } catch (e) {
      print('❌ Erro ao agendar consulta: $e');
      rethrow;
    }
  }
}