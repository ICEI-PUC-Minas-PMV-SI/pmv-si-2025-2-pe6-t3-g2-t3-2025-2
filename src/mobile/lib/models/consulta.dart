class Consulta {
  final String? id;  // Mudado para String (UUID)
  final DateTime dataHora;
  final String status;
  final String? observacoes;
  final String pacienteId;  // Mudado para String (UUID)
  final String pacienteNome;
  final String medicoId;  // Mudado para String (UUID)
  final String medicoNome;
  final String? especialidade;

  Consulta({
    this.id,
    required this.dataHora,
    required this.status,
    this.observacoes,
    required this.pacienteId,
    required this.pacienteNome,
    required this.medicoId,
    required this.medicoNome,
    this.especialidade,
  });

  factory Consulta.fromJson(Map<String, dynamic> json) {
    // Backend pode retornar medicoId diretamente ou dentro de um objeto medico
    String medicoIdValue = '';
    String medicoNomeValue = 'Dr. Desconhecido';
    String? especialidadeValue;
    
    if (json['medico'] != null && json['medico'] is Map) {
      // Se medico é um objeto completo
      medicoIdValue = (json['medico']['id'] ?? '').toString();
      medicoNomeValue = (json['medico']['nome'] ?? 'Dr. Desconhecido').toString();
      especialidadeValue = json['medico']['especialidade']?.toString();
    } else if (json['medicoId'] != null) {
      // Se só tem medicoId (resposta de criação de consulta)
      medicoIdValue = json['medicoId'].toString();
    }
    
    // Backend pode retornar pacienteId diretamente ou dentro de um objeto paciente
    String pacienteIdValue = '';
    String pacienteNomeValue = 'Desconhecido';
    
    if (json['paciente'] != null && json['paciente'] is Map) {
      pacienteIdValue = (json['paciente']['id'] ?? '').toString();
      pacienteNomeValue = (json['paciente']['nome'] ?? 'Desconhecido').toString();
    } else if (json['pacienteId'] != null) {
      pacienteIdValue = json['pacienteId'].toString();
    }
    
    return Consulta(
      id: json['id']?.toString(),
      dataHora: DateTime.parse((json['dataHora'] ?? DateTime.now().toIso8601String()).toString()),
      status: (json['status'] ?? 'PENDENTE').toString(),
      observacoes: json['observacoes']?.toString(),
      pacienteId: pacienteIdValue,
      pacienteNome: pacienteNomeValue,
      medicoId: medicoIdValue,
      medicoNome: medicoNomeValue,
      especialidade: especialidadeValue,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'dataHora': dataHora.toIso8601String(),
      'status': status,
      'observacoes': observacoes,
      'pacienteId': pacienteId,
      'medicoId': medicoId,
    };
  }

  String get statusDisplay {
    switch (status.toLowerCase()) {
      case 'agendada':
        return 'Agendada';
      case 'confirmada':
        return 'Confirmada';
      case 'realizada':
        return 'Realizada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  }
}