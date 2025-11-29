import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/medico.dart';
import '../utils/theme.dart';

class AgendarConsultaScreen extends StatefulWidget {
  final Medico? medicoSelecionado;

  const AgendarConsultaScreen({Key? key, this.medicoSelecionado}) : super(key: key);

  @override
  _AgendarConsultaScreenState createState() => _AgendarConsultaScreenState();
}

class _AgendarConsultaScreenState extends State<AgendarConsultaScreen> {
  final _formKey = GlobalKey<FormState>();
  final _observacoesController = TextEditingController();
  final ApiService _apiService = ApiService();

  List<Medico> _medicos = [];
  Medico? _medicoSelecionado;
  DateTime? _dataSelecionada;
  Map<String, dynamic>? _slotSelecionado; // Armazena o slot completo com id
  List<Map<String, dynamic>> _slotsDisponiveis = []; // Lista de slots com id
  bool _isLoading = false;
  bool _isLoadingHorarios = false;

  @override
  void initState() {
    super.initState();
    _medicoSelecionado = widget.medicoSelecionado;
    _loadMedicos();
  }

  @override
  void dispose() {
    _observacoesController.dispose();
    super.dispose();
  }

  Future<void> _loadMedicos() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    if (authService.token != null) {
      final medicos = await _apiService.getMedicos(authService.token!);
      setState(() {
        _medicos = medicos;
      });
    }
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(Duration(days: 1)),
      firstDate: DateTime.now().add(Duration(days: 1)),
      lastDate: DateTime.now().add(Duration(days: 90)),
    );
    
    if (picked != null && picked != _dataSelecionada) {
      setState(() {
        _dataSelecionada = picked;
        _slotSelecionado = null;
        _slotsDisponiveis = [];
      });
      
      if (_medicoSelecionado != null) {
        await _loadAvailableSlots();
      }
    }
  }

  Future<void> _loadAvailableSlots() async {
    if (_medicoSelecionado == null || _dataSelecionada == null) return;

    setState(() {
      _isLoadingHorarios = true;
    });

    final authService = Provider.of<AuthService>(context, listen: false);
    if (authService.token != null) {
      final slots = await _apiService.getAvailableSlots(
        token: authService.token!,
        medicoId: _medicoSelecionado!.id,
        date: _dataSelecionada!,
      );
      
      setState(() {
        _slotsDisponiveis = slots;
        _isLoadingHorarios = false;
      });
    }
  }

  Future<void> _agendarConsulta() async {
    if (!_formKey.currentState!.validate()) return;
    if (_medicoSelecionado == null || _slotSelecionado == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Por favor, selecione um médico e horário'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    final authService = Provider.of<AuthService>(context, listen: false);
    if (authService.token != null) {
      try {
        // Usar o novo método agendarConsultaPorSlot (igual ao frontend)
        final resultado = await _apiService.agendarConsultaPorSlot(
          token: authService.token!,
          slotId: _slotSelecionado!['id'].toString(),
          observacoes: _observacoesController.text.trim().isNotEmpty 
              ? _observacoesController.text.trim() 
              : null,
        );

        setState(() {
          _isLoading = false;
        });

        if (resultado != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Consulta agendada com sucesso!'),
              backgroundColor: AppTheme.secondaryColor,
            ),
          );
          Navigator.of(context).pop(true); // Return success
        }
      } catch (e) {
        setState(() {
          _isLoading = false;
        });
        
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erro ao agendar consulta: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        title: Text('Agendar Consulta'),
      ),
      body: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: EdgeInsets.only(
              left: 16.0,
              right: 16.0,
              top: 16.0,
              bottom: 16.0 + MediaQuery.of(context).viewInsets.bottom,
            ),
            child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Medico Selection
              Text(
                'Selecionar Médico',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              SizedBox(height: 16),
              
              if (widget.medicoSelecionado != null) ...[
                Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppTheme.primaryColor,
                      child: Text(
                        widget.medicoSelecionado!.nome.split(' ').map((name) => name[0]).take(2).join(),
                        style: TextStyle(color: Colors.white),
                      ),
                    ),
                    title: Text('Dr. ${widget.medicoSelecionado!.nome}'),
                    subtitle: Text(widget.medicoSelecionado!.especialidade),
                    trailing: IconButton(
                      icon: Icon(Icons.close),
                      onPressed: () {
                        setState(() {
                          _medicoSelecionado = null;
                          _dataSelecionada = null;
                          _slotSelecionado = null;
                          _slotsDisponiveis = [];
                        });
                      },
                    ),
                  ),
                ),
              ] else ...[
                DropdownButtonFormField<Medico>(
                  value: _medicoSelecionado,
                  decoration: InputDecoration(
                    labelText: 'Escolha um médico',
                    border: OutlineInputBorder(),
                  ),
                  items: _medicos.map((medico) {
                    return DropdownMenuItem<Medico>(
                      value: medico,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Dr. ${medico.nome}'),
                          Text(
                            medico.especialidade,
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.greyColor,
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                  onChanged: (medico) async {
                    setState(() {
                      _medicoSelecionado = medico;
                      _slotSelecionado = null;
                      _slotsDisponiveis = [];
                    });
                    
                    if (_dataSelecionada != null && medico != null) {
                      await _loadAvailableSlots();
                    }
                  },
                  validator: (value) {
                    if (value == null) {
                      return 'Por favor, selecione um médico';
                    }
                    return null;
                  },
                ),
              ],
              
              SizedBox(height: 24),
              
              // Date Selection
              Text(
                'Selecionar Data',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              SizedBox(height: 16),
              
              InkWell(
                onTap: _selectDate,
                child: Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.calendar_today, color: AppTheme.primaryColor),
                      SizedBox(width: 12),
                      Text(
                        _dataSelecionada != null
                            ? DateFormat('dd/MM/yyyy').format(_dataSelecionada!)
                            : 'Escolha uma data',
                        style: TextStyle(fontSize: 16),
                      ),
                    ],
                  ),
                ),
              ),
              
              if (_dataSelecionada != null && _medicoSelecionado != null) ...[
                SizedBox(height: 24),
                
                // Time Selection
                Text(
                  'Selecionar Horário',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                SizedBox(height: 16),
                
                if (_isLoadingHorarios) ...[
                  Center(child: CircularProgressIndicator()),
                ] else if (_slotsDisponiveis.isEmpty) ...[
                  Container(
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.orange.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.warning, color: Colors.orange),
                        SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            'Nenhum horário disponível para esta data',
                            style: TextStyle(color: Colors.orange),
                          ),
                        ),
                      ],
                    ),
                  ),
                ] else ...[
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _slotsDisponiveis.map((slot) {
                      final isSelected = _slotSelecionado?['id'] == slot['id'];
                      final horario = DateTime.parse(slot['inicio'].toString());
                      return ChoiceChip(
                        label: Text(DateFormat('HH:mm').format(horario)),
                        selected: isSelected,
                        onSelected: (selected) {
                          setState(() {
                            _slotSelecionado = selected ? slot : null;
                          });
                        },
                        selectedColor: AppTheme.primaryColor,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : AppTheme.textColor,
                        ),
                      );
                    }).toList(),
                  ),
                ],
                
                SizedBox(height: 24),
                
                // Observações
                Text(
                  'Observações (Opcional)',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                SizedBox(height: 16),
                
                TextFormField(
                  controller: _observacoesController,
                  maxLines: 3,
                  decoration: InputDecoration(
                    labelText: 'Descreva seus sintomas ou motivo da consulta',
                    border: OutlineInputBorder(),
                    alignLabelWithHint: true,
                  ),
                ),
                
                SizedBox(height: 32),
                
                // Submit Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _agendarConsulta,
                    child: _isLoading
                        ? SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              color: Colors.white,
                              strokeWidth: 2.0,
                            ),
                          )
                        : Text('Agendar Consulta'),
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
    );
  }
}