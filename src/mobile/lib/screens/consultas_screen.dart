import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/consulta.dart';
import '../utils/theme.dart';

class ConsultasScreen extends StatefulWidget {
  @override
  _ConsultasScreenState createState() => _ConsultasScreenState();
}

class _ConsultasScreenState extends State<ConsultasScreen> {
  List<Consulta> _consultas = [];
  bool _isLoading = true;
  final ApiService _apiService = ApiService();
  
  // Configuração: tempo mínimo antes da consulta para permitir cancelamento/remarcação
  static const int HOURS_BEFORE_MIN = 2; // Temporariamente 2h para testes

  @override
  void initState() {
    super.initState();
    _loadConsultas();
  }

  Future<void> _loadConsultas() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    if (authService.token != null && authService.currentUser != null) {
      final consultas = await _apiService.getConsultas(
        authService.token!,
        pacienteId: authService.currentUser!.id,
      );
      
      setState(() {
        _consultas = consultas;
        _isLoading = false;
      });
    }
  }

  // Verifica se a consulta pode ser cancelada/remarcada baseado no tempo
  bool _canModifyConsulta(Consulta consulta) {
    final now = DateTime.now();
    final hoursUntilConsulta = consulta.dataHora.difference(now).inHours;
    return hoursUntilConsulta >= HOURS_BEFORE_MIN;
  }

  // Retorna mensagem de erro se não puder modificar
  String _getModifyErrorMessage(Consulta consulta) {
    final now = DateTime.now();
    final hoursUntilConsulta = consulta.dataHora.difference(now).inHours;
    
    if (hoursUntilConsulta < 0) {
      return 'Esta consulta já passou.';
    } else if (hoursUntilConsulta < HOURS_BEFORE_MIN) {
      return 'Cancelamento/remarcação deve ser feito com no mínimo $HOURS_BEFORE_MIN horas de antecedência. Faltam apenas $hoursUntilConsulta horas.';
    }
    return '';
  }

  Future<void> _cancelConsulta(Consulta consulta) async {
    // Validação de tempo
    if (!_canModifyConsulta(consulta)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_getModifyErrorMessage(consulta)),
          backgroundColor: Colors.orange,
          duration: Duration(seconds: 4),
        ),
      );
      return;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Cancelar Consulta'),
        content: Text('Tem certeza que deseja cancelar esta consulta?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Não'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: Text('Cancelar Consulta'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final authService = Provider.of<AuthService>(context, listen: false);
      if (authService.token != null && consulta.id != null) {
        final success = await _apiService.cancelConsulta(
          authService.token!,
          consulta.id!,
        );

        if (success) {
          _loadConsultas(); // Reload consultations
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Consulta cancelada com sucesso'),
              backgroundColor: AppTheme.secondaryColor,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Erro ao cancelar consulta'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  Future<void> _rescheduleConsulta(Consulta consulta) async {
    // Validação de tempo
    if (!_canModifyConsulta(consulta)) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_getModifyErrorMessage(consulta)),
          backgroundColor: Colors.orange,
          duration: Duration(seconds: 4),
        ),
      );
      return;
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Remarcar Consulta'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Você será redirecionado para agendar uma nova consulta.'),
            SizedBox(height: 12),
            Text(
              'A consulta atual será cancelada.',
              style: TextStyle(
                fontSize: 12,
                color: AppTheme.greyColor,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Voltar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: Text('Continuar'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final authService = Provider.of<AuthService>(context, listen: false);
      if (authService.token != null && consulta.id != null) {
        // Primeiro cancela a consulta atual
        final success = await _apiService.cancelConsulta(
          authService.token!,
          consulta.id!,
        );

        if (success) {
          _loadConsultas(); // Reload consultations
          
          // Navega para a tela de agendamento
          // O HomeScreen gerencia a navegação para AgendarConsultaScreen
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Consulta cancelada. Selecione uma nova data.'),
              backgroundColor: AppTheme.secondaryColor,
              duration: Duration(seconds: 3),
            ),
          );
          
          // Notifica o parent para mudar de tab
          // Esta solução simples usa Navigator para voltar e assumir que o usuário vai para a aba de agendamento
          Navigator.of(context).pop(); // Volta para HomeScreen
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Erro ao cancelar consulta para remarcação'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Minhas Consultas'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadConsultas,
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _consultas.isEmpty
              ? _buildEmptyState()
              : RefreshIndicator(
                  onRefresh: _loadConsultas,
                  child: ListView.builder(
                    padding: EdgeInsets.all(16.0),
                    itemCount: _consultas.length,
                    itemBuilder: (context, index) {
                      final consulta = _consultas[index];
                      return _buildConsultaCard(consulta);
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
            Icons.calendar_today,
            size: 80,
            color: AppTheme.greyColor,
          ),
          SizedBox(height: 16),
          Text(
            'Nenhuma consulta agendada',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: AppTheme.greyColor,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Que tal agendar sua primeira consulta?',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.greyColor,
            ),
          ),
          SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              // Navigate to schedule consultation
              // This would be handled by the parent HomeScreen
            },
            child: Text('Agendar Consulta'),
          ),
        ],
      ),
    );
  }

  Widget _buildConsultaCard(Consulta consulta) {
    final dateFormatter = DateFormat('dd/MM/yyyy');
    final timeFormatter = DateFormat('HH:mm');
    
    Color statusColor;
    IconData statusIcon;
    
    switch (consulta.status.toLowerCase()) {
      case 'agendada':
        statusColor = Colors.blue;
        statusIcon = Icons.schedule;
        break;
      case 'confirmada':
        statusColor = AppTheme.secondaryColor;
        statusIcon = Icons.check_circle;
        break;
      case 'realizada':
        statusColor = Colors.green;
        statusIcon = Icons.done_all;
        break;
      case 'cancelada':
        statusColor = Colors.red;
        statusIcon = Icons.cancel;
        break;
      default:
        statusColor = AppTheme.greyColor;
        statusIcon = Icons.help;
    }

    final bool canModify = _canModifyConsulta(consulta);
    final bool isActiveConsulta = consulta.status.toLowerCase() == 'agendada' ||
                                  consulta.status.toLowerCase() == 'confirmada';

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
                  backgroundColor: statusColor,
                  child: Icon(statusIcon, color: Colors.white),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Dr. ${consulta.medicoNome}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      if (consulta.especialidade != null)
                        Text(
                          consulta.especialidade!,
                          style: TextStyle(
                            color: AppTheme.greyColor,
                            fontSize: 14,
                          ),
                        ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    consulta.statusDisplay,
                    style: TextStyle(
                      color: statusColor,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Icon(Icons.calendar_today, size: 16, color: AppTheme.greyColor),
                SizedBox(width: 8),
                Text(
                  dateFormatter.format(consulta.dataHora),
                  style: TextStyle(fontSize: 14),
                ),
                SizedBox(width: 16),
                Icon(Icons.access_time, size: 16, color: AppTheme.greyColor),
                SizedBox(width: 8),
                Text(
                  timeFormatter.format(consulta.dataHora),
                  style: TextStyle(fontSize: 14),
                ),
              ],
            ),
            if (isActiveConsulta && !canModify) ...[
              SizedBox(height: 12),
              Container(
                padding: EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.orange.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info_outline, size: 16, color: Colors.orange),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Consulta próxima - não pode ser cancelada/remarcada',
                        style: TextStyle(fontSize: 12, color: Colors.orange.shade800),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            if (consulta.observacoes != null && consulta.observacoes!.isNotEmpty) ...[
              SizedBox(height: 12),
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.backgroundColor,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.note, size: 16, color: AppTheme.greyColor),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        consulta.observacoes!,
                        style: TextStyle(fontSize: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            if (consulta.status.toLowerCase() == 'agendada' ||
                consulta.status.toLowerCase() == 'confirmada' ||
                consulta.status.toLowerCase() == 'confirmado') ...[
              SizedBox(height: 16),
              Divider(),
              SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _rescheduleConsulta(consulta),
                      icon: Icon(Icons.calendar_month, size: 18),
                      label: Text('Remarcar'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.primaryColor,
                      ),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _cancelConsulta(consulta),
                      icon: Icon(Icons.cancel, size: 18),
                      label: Text('Cancelar'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.red,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
}