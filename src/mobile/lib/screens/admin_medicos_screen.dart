import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/medico.dart';
import '../models/user.dart';
import '../utils/theme.dart';

class AdminMedicosScreen extends StatefulWidget {
  @override
  _AdminMedicosScreenState createState() => _AdminMedicosScreenState();
}

class _AdminMedicosScreenState extends State<AdminMedicosScreen> {
  final ApiService _apiService = ApiService();
  List<Medico> _medicos = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMedicos();
  }

  Future<void> _loadMedicos() async {
    setState(() {
      _isLoading = true;
    });
    
    final authService = Provider.of<AuthService>(context, listen: false);
    if (authService.token != null) {
      try {
        print('🔍 Buscando médicos...');
        final medicos = await _apiService.getMedicos(authService.token!);
        print('✅ Médicos recebidos: ${medicos.length}');
        print('📋 Lista de médicos: ${medicos.map((m) => m.nome).toList()}');
        
        setState(() {
          _medicos = medicos;
          _isLoading = false;
        });
        
        print('✅ Estado atualizado! _medicos.length = ${_medicos.length}');
      } catch (e) {
        setState(() {
          _isLoading = false;
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao carregar médicos: ${e.toString()}'),
            backgroundColor: Colors.red,
            duration: Duration(seconds: 5),
          ),
        );
        
        // Se for erro de token, redirecionar para login
        if (e.toString().contains('Token inválido')) {
          await authService.logout();
          Navigator.of(context).pushReplacementNamed('/login');
        }
      }
    } else {
      setState(() {
        _isLoading = false;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Token de autenticação não encontrado'),
          backgroundColor: Colors.red,
        ),
      );
      
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    print('🎨 BUILD: _isLoading = $_isLoading, _medicos.length = ${_medicos.length}');
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Gerenciar Médicos'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadMedicos,
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showCreateMedicoDialog(),
        child: Icon(Icons.add),
        tooltip: 'Adicionar Médico',
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _medicos.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: _loadMedicos,
                  child: ListView.builder(
                    padding: EdgeInsets.all(16.0),
                    itemCount: _medicos.length,
                    itemBuilder: (context, index) {
                      final medico = _medicos[index];
                      return _buildMedicoCard(medico);
                    },
                  ),
                ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.local_hospital,
            size: 80,
            color: AppTheme.greyColor,
          ),
          SizedBox(height: 16),
          Text(
            'Nenhum médico cadastrado',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: AppTheme.greyColor,
            ),
          ),
          SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => _showCreateMedicoDialog(),
            icon: Icon(Icons.add),
            label: Text('Adicionar Primeiro Médico'),
          ),
        ],
      ),
    );
  }

  Widget _buildMedicoCard(Medico medico) {
    return Card(
      margin: EdgeInsets.only(bottom: 16.0),
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                  child: Text(
                    medico.nome.split(' ').map((name) => name[0]).take(2).join(),
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryColor,
                      fontSize: 18,
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Dr. ${medico.nome}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        medico.especialidade,
                        style: TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      if (medico.crm != null) ...[
                        SizedBox(height: 2),
                        Text(
                          'CRM: ${medico.crm}',
                          style: TextStyle(
                            color: AppTheme.greyColor,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  onSelected: (value) {
                    if (value == 'delete') {
                      _confirmDeleteMedico(medico);
                    }
                  },
                  itemBuilder: (context) => [
                    PopupMenuItem(
                      value: 'delete',
                      child: Row(
                        children: [
                          Icon(Icons.delete, color: Colors.red),
                          SizedBox(width: 8),
                          Text('Remover'),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            SizedBox(height: 16),
            
            Row(
              children: [
                Icon(Icons.email, size: 16, color: AppTheme.greyColor),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    medico.email,
                    style: TextStyle(fontSize: 14),
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.phone, size: 16, color: AppTheme.greyColor),
                SizedBox(width: 8),
                Text(
                  medico.telefone,
                  style: TextStyle(fontSize: 14),
                ),
                Spacer(),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: medico.disponivel 
                        ? AppTheme.secondaryColor.withOpacity(0.1)
                        : Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    medico.disponivel ? 'Disponível' : 'Indisponível',
                    style: TextStyle(
                      color: medico.disponivel ? AppTheme.secondaryColor : Colors.red,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showCreateMedicoDialog() {
    showDialog<void>(
      context: context,
      builder: (context) => CreateMedicoDialog(
        onMedicoCreated: _loadMedicos,
      ),
    );
  }

  Future<void> _confirmDeleteMedico(Medico medico) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Remover Médico'),
        content: Text('Tem certeza que deseja remover Dr. ${medico.nome}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text('Remover'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final authService = Provider.of<AuthService>(context, listen: false);
      if (authService.token != null) {
        final success = await _apiService.deleteMedico(
          authService.token!,
          medico.id,
        );

        if (success) {
          _loadMedicos();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Médico removido com sucesso'),
              backgroundColor: AppTheme.secondaryColor,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Erro ao remover médico'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }
}

class CreateMedicoDialog extends StatefulWidget {
  final VoidCallback onMedicoCreated;

  const CreateMedicoDialog({Key? key, required this.onMedicoCreated}) : super(key: key);

  @override
  _CreateMedicoDialogState createState() => _CreateMedicoDialogState();
}

class _CreateMedicoDialogState extends State<CreateMedicoDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nomeController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _telefoneController = TextEditingController();
  final _crmController = TextEditingController();
  
  String? _especialidadeSelecionada;
  bool _isLoading = false;
  final ApiService _apiService = ApiService();
  
  final List<Map<String, String>> especialidades = [
    {'value': 'OFTALMOLOGIA', 'label': 'Oftalmologia'},
    {'value': 'CARDIOLOGIA', 'label': 'Cardiologia'},
    {'value': 'ORTOPEDIA', 'label': 'Ortopedia'},
    {'value': 'PEDIATRIA', 'label': 'Pediatria'},
  ];

  @override
  void dispose() {
    _nomeController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _telefoneController.dispose();
    _crmController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Adicionar Médico'),
      content: Container(
        width: double.maxFinite,
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextFormField(
                  controller: _nomeController,
                  decoration: InputDecoration(
                    labelText: 'Nome Completo *',
                    prefixIcon: Icon(Icons.person),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Nome é obrigatório';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    labelText: 'Email *',
                    prefixIcon: Icon(Icons.email),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Email é obrigatório';
                    }
                    if (!value.contains('@')) {
                      return 'Digite um email válido';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Senha *',
                    prefixIcon: Icon(Icons.lock),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Senha é obrigatória';
                    }
                    if (value.length < 6) {
                      return 'Senha deve ter pelo menos 6 caracteres';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _telefoneController,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                    labelText: 'Telefone *',
                    prefixIcon: Icon(Icons.phone),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Telefone é obrigatório';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _especialidadeSelecionada,
                  decoration: InputDecoration(
                    labelText: 'Especialidade *',
                    prefixIcon: Icon(Icons.medical_services),
                  ),
                  items: especialidades.map((esp) {
                    return DropdownMenuItem<String>(
                      value: esp['value'],
                      child: Text(esp['label']!),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _especialidadeSelecionada = value;
                    });
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Especialidade é obrigatória';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _crmController,
                  decoration: InputDecoration(
                    labelText: 'CRM',
                    prefixIcon: Icon(Icons.badge),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: _isLoading ? null : _createMedico,
          child: _isLoading
              ? SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : Text('Adicionar'),
        ),
      ],
    );
  }

  Future<void> _createMedico() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final authService = Provider.of<AuthService>(context, listen: false);
    if (authService.token != null) {
      if (_especialidadeSelecionada == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Por favor, selecione uma especialidade'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }
      
      final medico = await _apiService.createMedico(
        token: authService.token!,
        nome: _nomeController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
        telefone: _telefoneController.text.trim(),
        especialidade: _especialidadeSelecionada!,
        crm: _crmController.text.trim(),
        endereco: null,
      );

      setState(() {
        _isLoading = false;
      });

      if (medico != null) {
        Navigator.of(context).pop();
        widget.onMedicoCreated();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Médico adicionado com sucesso!'),
            backgroundColor: AppTheme.secondaryColor,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao adicionar médico. Tente novamente.'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}