import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_service.dart';
import '../utils/theme.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nomeController = TextEditingController();
  final _telefoneController = TextEditingController();
  final _cpfController = TextEditingController();
  final _dateController = TextEditingController();
  
  DateTime? _selectedDate;
  bool _isEditing = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  @override
  void dispose() {
    _nomeController.dispose();
    _telefoneController.dispose();
    _cpfController.dispose();
    _dateController.dispose();
    super.dispose();
  }

  void _loadUserData() {
    final authService = Provider.of<AuthService>(context, listen: false);
    final user = authService.currentUser;
    
    if (user != null) {
      _nomeController.text = user.nome;
      _telefoneController.text = user.telefone;
      _cpfController.text = user.cpf ?? '';
      
      if (user.dataNascimento != null) {
        _selectedDate = user.dataNascimento;
        _dateController.text = DateFormat('dd/MM/yyyy').format(user.dataNascimento!);
      }
    }
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now().subtract(Duration(days: 6570)), // 18 years ago
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
        _dateController.text = DateFormat('dd/MM/yyyy').format(picked);
      });
    }
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    final authService = Provider.of<AuthService>(context, listen: false);
    final success = await authService.updateProfile(
      nome: _nomeController.text.trim(),
      telefone: _telefoneController.text.trim(),
      cpf: _cpfController.text.trim().isNotEmpty ? _cpfController.text.trim() : null,
      dataNascimento: _selectedDate,
    );

    setState(() {
      _isLoading = false;
      _isEditing = false;
    });

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Perfil atualizado com sucesso!'),
          backgroundColor: AppTheme.secondaryColor,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao atualizar perfil. Tente novamente.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _logout() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Sair'),
        content: Text('Tem certeza que deseja sair da sua conta?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text('Sair'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final authService = Provider.of<AuthService>(context, listen: false);
      await authService.logout();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthService>(
      builder: (context, authService, _) {
        final user = authService.currentUser;
        
        return Scaffold(
          appBar: AppBar(
            title: Text('Meu Perfil'),
            actions: [
              if (!_isEditing)
                IconButton(
                  icon: Icon(Icons.edit),
                  onPressed: () {
                    setState(() {
                      _isEditing = true;
                    });
                  },
                ),
              if (_isEditing)
                IconButton(
                  icon: Icon(Icons.close),
                  onPressed: () {
                    _loadUserData(); // Reset data
                    setState(() {
                      _isEditing = false;
                    });
                  },
                ),
            ],
          ),
          body: SingleChildScrollView(
            padding: EdgeInsets.all(16.0),
            child: Column(
              children: [
                // Profile Header
                Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Container(
                    padding: EdgeInsets.all(20.0),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      gradient: LinearGradient(
                        colors: [AppTheme.primaryColor, AppTheme.primaryColor.withOpacity(0.8)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: Colors.white.withOpacity(0.2),
                          child: Text(
                            user?.nome.split(' ').map((name) => name[0]).take(2).join() ?? 'U',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        SizedBox(height: 16),
                        Text(
                          user?.nome ?? 'Usuário',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          user?.email ?? '',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                SizedBox(height: 24),
                
                // Profile Form
                Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: EdgeInsets.all(20.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Informações Pessoais',
                            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 20),
                          
                          TextFormField(
                            controller: _nomeController,
                            enabled: _isEditing,
                            decoration: InputDecoration(
                              labelText: 'Nome Completo',
                              prefixIcon: Icon(Icons.person),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Por favor, digite seu nome';
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 16),
                          
                          TextFormField(
                            controller: TextEditingController(text: user?.email ?? ''),
                            enabled: false,
                            decoration: InputDecoration(
                              labelText: 'Email',
                              prefixIcon: Icon(Icons.email),
                            ),
                          ),
                          SizedBox(height: 16),
                          
                          TextFormField(
                            controller: _telefoneController,
                            enabled: _isEditing,
                            keyboardType: TextInputType.phone,
                            decoration: InputDecoration(
                              labelText: 'Telefone',
                              prefixIcon: Icon(Icons.phone),
                            ),
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Por favor, digite seu telefone';
                              }
                              return null;
                            },
                          ),
                          SizedBox(height: 16),
                          
                          TextFormField(
                            controller: _cpfController,
                            enabled: _isEditing,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              labelText: 'CPF',
                              prefixIcon: Icon(Icons.badge),
                            ),
                          ),
                          SizedBox(height: 16),
                          
                          TextFormField(
                            controller: _dateController,
                            enabled: _isEditing,
                            readOnly: true,
                            decoration: InputDecoration(
                              labelText: 'Data de Nascimento',
                              prefixIcon: Icon(Icons.calendar_today),
                            ),
                            onTap: _isEditing ? _selectDate : null,
                          ),
                          
                          if (_isEditing) ...[
                            SizedBox(height: 24),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _isLoading ? null : _saveProfile,
                                child: _isLoading
                                    ? CircularProgressIndicator(color: Colors.white)
                                    : Text('Salvar Alterações'),
                                style: ElevatedButton.styleFrom(
                                  padding: EdgeInsets.symmetric(vertical: 16),
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
                
                SizedBox(height: 24),
                
                // Account Actions
                Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    children: [
                      ListTile(
                        leading: Icon(Icons.lock, color: AppTheme.primaryColor),
                        title: Text('Alterar Senha'),
                        subtitle: Text('Mude sua senha de acesso'),
                        trailing: Icon(Icons.arrow_forward_ios),
                        onTap: () {
                          // TODO: Implement change password
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Funcionalidade em desenvolvimento')),
                          );
                        },
                      ),
                      Divider(height: 1),
                      ListTile(
                        leading: Icon(Icons.help, color: Colors.orange),
                        title: Text('Ajuda e Suporte'),
                        subtitle: Text('Central de ajuda'),
                        trailing: Icon(Icons.arrow_forward_ios),
                        onTap: () {
                          // TODO: Implement help screen
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Funcionalidade em desenvolvimento')),
                          );
                        },
                      ),
                      Divider(height: 1),
                      ListTile(
                        leading: Icon(Icons.info, color: Colors.blue),
                        title: Text('Sobre o App'),
                        subtitle: Text('Versão 1.0.0'),
                        trailing: Icon(Icons.arrow_forward_ios),
                        onTap: () {
                          showAboutDialog(
                            context: context,
                            applicationName: 'Medical Consultation',
                            applicationVersion: '1.0.0',
                            applicationLegalese: '© 2025 Medical Consultation App',
                          );
                        },
                      ),
                      Divider(height: 1),
                      ListTile(
                        leading: Icon(Icons.logout, color: Colors.red),
                        title: Text('Sair'),
                        subtitle: Text('Desconectar da conta'),
                        trailing: Icon(Icons.arrow_forward_ios),
                        onTap: _logout,
                      ),
                    ],
                  ),
                ),
                
                SizedBox(height: 32),
              ],
            ),
          ),
        );
      },
    );
  }
}