import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/consulta.dart';
import '../models/user.dart';
import '../utils/theme.dart';

class MedicoConsultasScreen extends StatefulWidget {
  @override
  _MedicoConsultasScreenState createState() => _MedicoConsultasScreenState();
}

class _MedicoConsultasScreenState extends State<MedicoConsultasScreen> {
  List<Consulta> _consultas = [];
  bool _isLoading = true;
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _loadConsultas();
  }

  Future<void> _loadConsultas() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    if (authService.token != null && authService.currentUser != null) {
      final consultas = await _apiService.getConsultasMedico(
        authService.token!,
        authService.currentUser!.id,
      );
      
      setState(() {
        _consultas = consultas;
        _isLoading = false;
      });
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
            'Suas consultas aparecerão aqui quando os pacientes agendarem.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppTheme.greyColor,
            ),
            textAlign: TextAlign.center,
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
        statusColor = Colors.orange;
        statusIcon = Icons.schedule;
        break;
      case 'confirmada':
        statusColor = Colors.blue;
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

    List<String> availableActions = [];
    if (consulta.status.toLowerCase() == 'agendada') {
      availableActions.addAll(['Confirmar', 'Cancelar']);
    } else if (consulta.status.toLowerCase() == 'confirmada') {
      availableActions.addAll(['Finalizar', 'Cancelar']);
    }

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
                        consulta.pacienteNome,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        'Paciente',
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
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Observações do Paciente:',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.greyColor,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            consulta.observacoes!,
                            style: TextStyle(fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
            if (availableActions.isNotEmpty) ...[
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: availableActions.map((action) {
                  Color buttonColor;
                  String newStatus;
                  
                  switch (action) {
                    case 'Confirmar':
                      buttonColor = Colors.blue;
                      newStatus = 'CONFIRMADA';
                      break;
                    case 'Finalizar':
                      buttonColor = AppTheme.secondaryColor;
                      newStatus = 'REALIZADA';
                      break;
                    case 'Cancelar':
                      buttonColor = Colors.red;
                      newStatus = 'CANCELADA';
                      break;
                    default:
                      buttonColor = AppTheme.greyColor;
                      newStatus = '';
                  }
                  
                  return Padding(
                    padding: EdgeInsets.only(left: 8),
                    child: ElevatedButton(
                      onPressed: () => _updateConsultaStatus(consulta, newStatus),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: buttonColor,
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      ),
                      child: Text(
                        action,
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Future<void> _updateConsultaStatus(Consulta consulta, String newStatus) async {
    String actionText;
    switch (newStatus) {
      case 'CONFIRMADA':
        actionText = 'confirmar';
        break;
      case 'REALIZADA':
        actionText = 'finalizar';
        break;
      case 'CANCELADA':
        actionText = 'cancelar';
        break;
      default:
        actionText = 'atualizar';
    }

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('${actionText.substring(0, 1).toUpperCase()}${actionText.substring(1)} Consulta'),
        content: Text('Tem certeza que deseja $actionText esta consulta com ${consulta.pacienteNome}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: Text('Não'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: newStatus == 'CANCELADA' ? Colors.red : AppTheme.primaryColor,
            ),
            child: Text(actionText.substring(0, 1).toUpperCase() + actionText.substring(1)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final authService = Provider.of<AuthService>(context, listen: false);
      if (authService.token != null && consulta.id != null) {
        final success = await _apiService.updateConsultaStatus(
          token: authService.token!,
          consultaId: consulta.id!,
          status: newStatus,
        );

        if (success) {
          _loadConsultas(); // Reload consultations
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Consulta ${actionText}da com sucesso'),
              backgroundColor: AppTheme.secondaryColor,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Erro ao $actionText consulta'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }
}