import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class RegisterMedicoScreen extends StatefulWidget {
  @override
  _RegisterMedicoScreenState createState() => _RegisterMedicoScreenState();
}

class _RegisterMedicoScreenState extends State<RegisterMedicoScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nomeController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _telefoneController = TextEditingController();
  final _crmController = TextEditingController();
  final _enderecoController = TextEditingController();
  
  String? _especialidadeSelecionada;
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

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
    _confirmPasswordController.dispose();
    _telefoneController.dispose();
    _crmController.dispose();
    _enderecoController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;

    if (_especialidadeSelecionada == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Por favor, selecione uma especialidade'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final token = authService.token;
      
      if (token == null) {
        throw Exception('Token não encontrado. Faça login como administrador.');
      }
      
      final apiService = ApiService();
      
      // Cadastrar médico via endpoint admin
      final medico = await apiService.createMedico(
        token: token,
        nome: _nomeController.text.trim(),
        email: _emailController.text.trim(),
        password: _passwordController.text,
        telefone: _telefoneController.text.trim(),
        especialidade: _especialidadeSelecionada!,
        crm: _crmController.text.trim(),
        endereco: _enderecoController.text.trim().isEmpty 
            ? null
            : _enderecoController.text.trim(),
      );
      
      setState(() {
        _isLoading = false;
      });
      
      if (medico != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Médico cadastrado com sucesso!'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );
        
        // Aguarda um momento para o usuário ler a mensagem
        await Future<void>.delayed(Duration(seconds: 2));
        
        // Volta para a tela anterior
        Navigator.of(context).pop();
      }
      
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      
      String errorMessage = e.toString().replaceAll('Exception: ', '');
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMessage),
          backgroundColor: Colors.red,
          duration: Duration(seconds: 4),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text('Cadastrar Médico'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppTheme.textColor,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Icon(
                Icons.admin_panel_settings,
                size: 80,
                color: AppTheme.primaryColor,
              ),
              SizedBox(height: 16),
              Text(
                'Área do Administrador',
                style: Theme.of(context).textTheme.headlineMedium,
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 8),
              Text(
                'Cadastrar novo profissional de saúde no sistema',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppTheme.greyColor,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 32),
              Card(
                elevation: 8,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: EdgeInsets.all(24.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        // Nome
                        TextFormField(
                          controller: _nomeController,
                          decoration: InputDecoration(
                            labelText: 'Nome Completo',
                            prefixIcon: Icon(Icons.person),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor, digite seu nome';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 16),
                        
                        // Email
                        TextFormField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: InputDecoration(
                            labelText: 'Email',
                            prefixIcon: Icon(Icons.email),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor, digite seu email';
                            }
                            if (!value.contains('@')) {
                              return 'Digite um email válido';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 16),
                        
                        // Telefone
                        TextFormField(
                          controller: _telefoneController,
                          keyboardType: TextInputType.phone,
                          decoration: InputDecoration(
                            labelText: 'Telefone',
                            prefixIcon: Icon(Icons.phone),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor, digite seu telefone';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 16),
                        
                        // CRM
                        TextFormField(
                          controller: _crmController,
                          decoration: InputDecoration(
                            labelText: 'CRM',
                            prefixIcon: Icon(Icons.badge),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor, digite seu CRM';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 16),
                        
                        // Especialidade
                        DropdownButtonFormField<String>(
                          value: _especialidadeSelecionada,
                          decoration: InputDecoration(
                            labelText: 'Especialidade',
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
                              return 'Por favor, selecione uma especialidade';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 16),
                        
                        // Endereço
                        TextFormField(
                          controller: _enderecoController,
                          decoration: InputDecoration(
                            labelText: 'Endereço (opcional)',
                            prefixIcon: Icon(Icons.location_on),
                          ),
                        ),
                        SizedBox(height: 16),
                        
                        // Senha
                        TextFormField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          decoration: InputDecoration(
                            labelText: 'Senha',
                            prefixIcon: Icon(Icons.lock),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscurePassword
                                    ? Icons.visibility
                                    : Icons.visibility_off,
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscurePassword = !_obscurePassword;
                                });
                              },
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor, digite sua senha';
                            }
                            if (value.length < 6) {
                              return 'A senha deve ter pelo menos 6 caracteres';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 16),
                        
                        // Confirmar Senha
                        TextFormField(
                          controller: _confirmPasswordController,
                          obscureText: _obscureConfirmPassword,
                          decoration: InputDecoration(
                            labelText: 'Confirmar Senha',
                            prefixIcon: Icon(Icons.lock_outline),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscureConfirmPassword
                                    ? Icons.visibility
                                    : Icons.visibility_off,
                              ),
                              onPressed: () {
                                setState(() {
                                  _obscureConfirmPassword = !_obscureConfirmPassword;
                                });
                              },
                            ),
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Por favor, confirme sua senha';
                            }
                            if (value != _passwordController.text) {
                              return 'As senhas não coincidem';
                            }
                            return null;
                          },
                        ),
                        SizedBox(height: 32),
                        
                        // Botão de Cadastro
                        ElevatedButton(
                          onPressed: _isLoading ? null : _register,
                          style: ElevatedButton.styleFrom(
                            padding: EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: _isLoading
                              ? SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                )
                              : Text(
                                  'Solicitar Cadastro',
                                  style: TextStyle(fontSize: 16),
                                ),
                        ),
                        
                        SizedBox(height: 16),
                        
                        Container(
                          padding: EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.blue.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.info_outline, color: Colors.blue, size: 20),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  'O cadastro de médicos requer aprovação administrativa',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.blue[800],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
