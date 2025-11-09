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

  Future<void> _cancelConsulta(Consulta consulta) async {
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
                consulta.status.toLowerCase() == 'confirmada') ...[
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => _cancelConsulta(consulta),
                    child: Text(
                      'Cancelar',
                      style: TextStyle(color: Colors.red),
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