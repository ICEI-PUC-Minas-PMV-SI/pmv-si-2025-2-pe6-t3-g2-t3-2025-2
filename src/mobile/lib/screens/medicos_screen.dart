import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../models/medico.dart';
import '../utils/theme.dart';
import 'agendar_consulta_screen.dart';

class MedicosScreen extends StatefulWidget {
  @override
  _MedicosScreenState createState() => _MedicosScreenState();
}

class _MedicosScreenState extends State<MedicosScreen> {
  List<Medico> _medicos = [];
  List<Medico> _filteredMedicos = [];
  bool _isLoading = true;
  String? _selectedEspecialidade;
  List<String> _especialidades = [];
  final ApiService _apiService = ApiService();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadMedicos();
    _searchController.addListener(_filterMedicos);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadMedicos() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    if (authService.token != null) {
      final medicos = await _apiService.getMedicos(authService.token!);

      setState(() {
        _medicos = medicos;
        _especialidades = medicos
            .map((m) => m.especialidade)
            .where((s) => s.isNotEmpty)
            .toSet()
            .toList();
        _especialidades.sort((a, b) => a.toLowerCase().compareTo(b.toLowerCase()));
        _filteredMedicos = medicos;
        _isLoading = false;
      });
    }
  }

  void _filterMedicos() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredMedicos = _medicos.where((medico) {
        final matchesQuery = medico.nome.toLowerCase().contains(query) ||
            medico.especialidade.toLowerCase().contains(query);
        final matchesEspecialidade = _selectedEspecialidade == null || _selectedEspecialidade!.isEmpty
            ? true
            : medico.especialidade.toLowerCase() == _selectedEspecialidade!.toLowerCase();
        return matchesQuery && matchesEspecialidade;
      }).toList();
    });
  }

  void _selectEspecialidade(String? especialidade) {
    setState(() {
      if (especialidade == null || especialidade.isEmpty) {
        _selectedEspecialidade = null;
      } else {
        _selectedEspecialidade = especialidade;
      }
    });
    _filterMedicos();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Médicos'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadMedicos,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: EdgeInsets.all(16.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Buscar médico ou especialidade...',
                prefixIcon: Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
                filled: true,
                fillColor: Colors.grey[100],
                
              ),
            ),
          ),
          if (_especialidades.isNotEmpty) ...[
            SizedBox(height: 8),
            Container(
              height: 52,
              padding: EdgeInsets.only(left: 16.0),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    Padding(
                      padding: EdgeInsets.only(right: 8.0),
                      child: ChoiceChip(
                        label: Text('Todos'),
                        selected: _selectedEspecialidade == null,
                        onSelected: (_) => _selectEspecialidade(null),
                      ),
                    ),
                    ..._especialidades.map((esp) {
                      return Padding(
                        padding: EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(esp),
                          selected: _selectedEspecialidade?.toLowerCase() == esp.toLowerCase(),
                          onSelected: (_) => _selectEspecialidade(esp),
                        ),
                      );
                    }).toList(),
                  ],
                ),
              ),
            ),
          ],
          
          // Medicos List
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : _filteredMedicos.isEmpty
                    ? _buildEmptyState()
                    : RefreshIndicator(
                        onRefresh: _loadMedicos,
                        child: ListView.builder(
                          padding: EdgeInsets.symmetric(horizontal: 16.0),
                          itemCount: _filteredMedicos.length,
                          itemBuilder: (context, index) {
                            final medico = _filteredMedicos[index];
                            return _buildMedicoCard(medico);
                          },
                        ),
                      ),
          ),
        ],
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
            _searchController.text.isEmpty 
                ? 'Nenhum médico disponível' 
                : 'Nenhum resultado encontrado',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
              color: AppTheme.greyColor,
            ),
          ),
          if (_searchController.text.isNotEmpty) ...[
            SizedBox(height: 8),
            Text(
              'Tente buscar por outro termo',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppTheme.greyColor,
              ),
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                _searchController.clear();
              },
              child: Text('Limpar Busca'),
            ),
          ],
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
            SizedBox(height: 16),
            
            // Contact Info
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
              ],
            ),
            
            SizedBox(height: 16),
            
            // Action Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (medico.disponivel) ...[
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => AgendarConsultaScreen(
                            medicoSelecionado: medico,
                          ),
                        ),
                      );
                    },
                    icon: Icon(Icons.calendar_today, size: 16),
                    label: Text('Agendar'),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    ),
                  ),
                ] else ...[
                  ElevatedButton(
                    onPressed: null,
                    child: Text('Indisponível'),
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}