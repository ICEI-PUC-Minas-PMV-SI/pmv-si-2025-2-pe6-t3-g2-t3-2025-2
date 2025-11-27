enum UserRole {
  ADMIN,
  MEDICO,
  PACIENTE,
}

class User {
  final String id;  // Mudado para String (UUID)
  final String email;
  final String nome;
  final String telefone;
  final UserRole role;
  final String? cpf;
  final DateTime? dataNascimento;
  final String? especialidade; // Para médicos
  final String? crm; // Para médicos
  final bool? disponivel; // Para médicos

  User({
    required this.id,
    required this.email,
    required this.nome,
    required this.telefone,
    required this.role,
    this.cpf,
    this.dataNascimento,
    this.especialidade,
    this.crm,
    this.disponivel,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    UserRole role;
    String roleString = (json['role'] ?? json['tipo'] ?? 'PACIENTE').toString().toUpperCase();
    
    switch (roleString) {
      case 'ADMIN':
        role = UserRole.ADMIN;
        break;
      case 'MEDICO':
        role = UserRole.MEDICO;
        break;
      case 'PACIENTE':
      default:
        role = UserRole.PACIENTE;
        break;
    }

    return User(
      id: json['id'].toString(),
      email: (json['email'] ?? '').toString(),
      nome: (json['nome'] ?? '').toString(),
      telefone: (json['telefone'] ?? '').toString(),
      role: role,
      cpf: json['cpf']?.toString(),
      dataNascimento: json['dataNascimento'] != null
          ? DateTime.parse(json['dataNascimento'].toString())
          : null,
      especialidade: json['especialidade']?.toString(),
      crm: json['crm']?.toString(),
      disponivel: json['disponivel'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'nome': nome,
      'telefone': telefone,
      'role': role.name,
      'cpf': cpf,
      'dataNascimento': dataNascimento?.toIso8601String(),
      'especialidade': especialidade,
      'crm': crm,
      'disponivel': disponivel,
    };
  }

  bool get isAdmin => role == UserRole.ADMIN;
  bool get isMedico => role == UserRole.MEDICO;
  bool get isPaciente => role == UserRole.PACIENTE;

  String get roleDisplay {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.MEDICO:
        return 'Médico';
      case UserRole.PACIENTE:
        return 'Paciente';
    }
  }

  User copyWith({
    String? id,
    String? email,
    String? nome,
    String? telefone,
    UserRole? role,
    String? cpf,
    DateTime? dataNascimento,
    String? especialidade,
    String? crm,
    bool? disponivel,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      nome: nome ?? this.nome,
      telefone: telefone ?? this.telefone,
      role: role ?? this.role,
      cpf: cpf ?? this.cpf,
      dataNascimento: dataNascimento ?? this.dataNascimento,
      especialidade: especialidade ?? this.especialidade,
      crm: crm ?? this.crm,
      disponivel: disponivel ?? this.disponivel,
    );
  }
}