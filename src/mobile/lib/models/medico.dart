class Medico {
  final String id;  // Mudado de int para String (UUID)
  final String nome;
  final String email;
  final String telefone;
  final String especialidade;
  final String? crm;
  final bool disponivel;

  Medico({
    required this.id,
    required this.nome,
    required this.email,
    required this.telefone,
    required this.especialidade,
    this.crm,
    this.disponivel = true,
  });

  factory Medico.fromJson(Map<String, dynamic> json) {
    return Medico(
      id: json['id'].toString(),  // Converte para String (suporta int ou UUID)
      nome: (json['nome'] ?? '').toString(),
      email: (json['email'] ?? '').toString(),
      telefone: (json['telefone'] ?? '').toString(),
      especialidade: (json['especialidade'] ?? '').toString(),
      crm: json['crm']?.toString(),
      disponivel: json['disponivel'] == true || json['disponivel'] == 'true',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nome': nome,
      'email': email,
      'telefone': telefone,
      'especialidade': especialidade,
      'crm': crm,
      'disponivel': disponivel,
    };
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Medico &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}