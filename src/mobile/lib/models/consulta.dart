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
    return Consulta(
      id: json['id']?.toString(),
      dataHora: DateTime.parse((json['dataHora'] ?? DateTime.now().toIso8601String()).toString()),
      status: (json['status'] ?? 'PENDENTE').toString(),
      observacoes: json['observacoes']?.toString(),
      pacienteId: (json['paciente']?['id'] ?? '').toString(),
      pacienteNome: (json['paciente']?['nome'] ?? 'Desconhecido').toString(),
      medicoId: (json['medico']?['id'] ?? '').toString(),
      medicoNome: (json['medico']?['nome'] ?? 'Desconhecido').toString(),
      especialidade: json['medico']?['especialidade']?.toString(),
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