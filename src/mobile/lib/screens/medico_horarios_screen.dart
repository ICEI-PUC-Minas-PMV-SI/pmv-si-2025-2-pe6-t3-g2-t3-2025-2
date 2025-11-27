import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../utils/theme.dart';

class MedicoHorariosScreen extends StatefulWidget {
  @override
  _MedicoHorariosScreenState createState() => _MedicoHorariosScreenState();
}

class _MedicoHorariosScreenState extends State<MedicoHorariosScreen> {
  final ApiService _apiService = ApiService();
  DateTime _selectedDate = DateTime.now();
  List<TimeOfDay> _horariosSelecionados = [];
  bool _isLoading = false;

  final List<TimeOfDay> _horariosDisponiveis = [
    TimeOfDay(hour: 8, minute: 0),
    TimeOfDay(hour: 9, minute: 0),
    TimeOfDay(hour: 10, minute: 0),
    TimeOfDay(hour: 11, minute: 0),
    TimeOfDay(hour: 13, minute: 0),
    TimeOfDay(hour: 14, minute: 0),
    TimeOfDay(hour: 15, minute: 0),
    TimeOfDay(hour: 16, minute: 0),
    TimeOfDay(hour: 17, minute: 0),
  ];

  @override
  void initState() {
    super.initState();
    _loadHorarios();
  }

  Future<void> _loadHorarios() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      if (authService.token != null && authService.currentUser?.id != null) {
        // Aqui você pode carregar os horários já cadastrados do backend
        // Por enquanto, vamos deixar vazio para o médico adicionar novos
      }
    } catch (e) {
      print('Erro ao carregar horários: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(Duration(days: 90)),
      locale: const Locale('pt', 'BR'),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: AppTheme.primaryColor,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: AppTheme.textColor,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
        _horariosSelecionados.clear();
      });
    }
  }

  void _toggleHorario(TimeOfDay horario) {
    setState(() {
      final index = _horariosSelecionados.indexWhere(
        (h) => h.hour == horario.hour && h.minute == horario.minute,
      );
      
      if (index >= 0) {
        _horariosSelecionados.removeAt(index);
      } else {
        _horariosSelecionados.add(horario);
      }
    });
  }

  bool _isHorarioSelecionado(TimeOfDay horario) {
    return _horariosSelecionados.any(
      (h) => h.hour == horario.hour && h.minute == horario.minute,
    );
  }

  Future<void> _salvarHorarios() async {
    if (_horariosSelecionados.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Selecione pelo menos um horário'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      
      if (authService.token == null) {
        throw Exception('Usuário não autenticado');
      }

      // Ordena os horários selecionados
      _horariosSelecionados.sort((a, b) {
        if (a.hour != b.hour) return a.hour.compareTo(b.hour);
        return a.minute.compareTo(b.minute);
      });

      // Pega o primeiro e último horário para criar o intervalo
      final primeiroHorario = _horariosSelecionados.first;
      final ultimoHorario = _horariosSelecionados.last;

      final DateTime inicio = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        primeiroHorario.hour,
        primeiroHorario.minute,
      );

      // Adiciona 1 hora ao último horário para cobrir todo o intervalo
      final DateTime fim = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        ultimoHorario.hour + 1,
        ultimoHorario.minute,
      );

      // Chama o endpoint do backend para criar os slots
      await _apiService.createSlots(
        token: authService.token!,
        inicio: inicio,
        fim: fim,
        duracaoMin: 60, // cada slot tem 1 hora
      );

      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Horários salvos com sucesso!'),
          backgroundColor: Colors.green,
        ),
      );

      setState(() {
        _horariosSelecionados.clear();
      });

    } catch (e) {
      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao salvar horários: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  String _formatTimeOfDay(TimeOfDay time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: Text('Meus Horários'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        foregroundColor: AppTheme.textColor,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Card(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Selecione a data',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 16),
                          InkWell(
                            onTap: () => _selectDate(context),
                            child: Container(
                              padding: EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                border: Border.all(color: AppTheme.greyColor),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Row(
                                children: [
                                  Icon(Icons.calendar_today, color: AppTheme.primaryColor),
                                  SizedBox(width: 16),
                                  Text(
                                    '${_selectedDate.day.toString().padLeft(2, '0')}/${_selectedDate.month.toString().padLeft(2, '0')}/${_selectedDate.year}',
                                    style: TextStyle(fontSize: 16),
                                  ),
                                  Spacer(),
                                  Icon(Icons.arrow_drop_down),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  SizedBox(height: 24),
                  Text(
                    'Horários Disponíveis',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Selecione os horários em que você estará disponível',
                    style: TextStyle(
                      color: AppTheme.greyColor,
                      fontSize: 14,
                    ),
                  ),
                  SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: NeverScrollableScrollPhysics(),
                    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      childAspectRatio: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: _horariosDisponiveis.length,
                    itemBuilder: (context, index) {
                      final horario = _horariosDisponiveis[index];
                      final isSelecionado = _isHorarioSelecionado(horario);

                      return InkWell(
                        onTap: () => _toggleHorario(horario),
                        child: Container(
                          decoration: BoxDecoration(
                            color: isSelecionado
                                ? AppTheme.primaryColor
                                : Colors.white,
                            border: Border.all(
                              color: isSelecionado
                                  ? AppTheme.primaryColor
                                  : AppTheme.greyColor,
                              width: 2,
                            ),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Center(
                            child: Text(
                              _formatTimeOfDay(horario),
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: isSelecionado
                                    ? Colors.white
                                    : AppTheme.textColor,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                  SizedBox(height: 24),
                  if (_horariosSelecionados.isNotEmpty)
                    Card(
                      color: AppTheme.primaryColor.withOpacity(0.1),
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  Icons.check_circle,
                                  color: AppTheme.primaryColor,
                                ),
                                SizedBox(width: 8),
                                Text(
                                  '${_horariosSelecionados.length} horário(s) selecionado(s)',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 8),
                            Wrap(
                              spacing: 8,
                              runSpacing: 8,
                              children: _horariosSelecionados.map((h) {
                                return Chip(
                                  label: Text(_formatTimeOfDay(h)),
                                  backgroundColor: AppTheme.primaryColor,
                                  labelStyle: TextStyle(color: Colors.white),
                                  deleteIcon: Icon(
                                    Icons.close,
                                    color: Colors.white,
                                    size: 18,
                                  ),
                                  onDeleted: () => _toggleHorario(h),
                                );
                              }).toList(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: _horariosSelecionados.isEmpty ? null : _salvarHorarios,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryColor,
                      padding: EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: Text(
                      'Salvar Horários',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
