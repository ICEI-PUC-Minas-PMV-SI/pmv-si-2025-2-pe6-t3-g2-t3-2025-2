import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../utils/theme.dart';
import '../models/user.dart';
import 'consultas_screen.dart';
import 'medicos_screen.dart';
import 'profile_screen.dart';
import 'agendar_consulta_screen.dart';
import 'admin_medicos_screen.dart';
import 'medico_consultas_screen.dart';

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  List<Widget> _getScreensForUser(User? user) {
    if (user == null) return [HomeContent(), ProfileScreen()];

    if (user.isAdmin) {
      return [
        HomeContent(),
        ConsultasScreen(), // Todas as consultas
        AdminMedicosScreen(), // Gerenciar médicos
        ProfileScreen(),
      ];
    } else if (user.isMedico) {
      return [
        HomeContent(),
        MedicoConsultasScreen(), // Consultas do médico
        ProfileScreen(),
      ];
    } else {
      // Paciente
      return [
        HomeContent(),
        ConsultasScreen(), // Consultas do paciente
        MedicosScreen(), // Lista de médicos para agendar
        ProfileScreen(),
      ];
    }
  }

  List<BottomNavigationBarItem> _getNavItemsForUser(User? user) {
    if (user == null) {
      return [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Início'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Perfil'),
      ];
    }

    if (user.isAdmin) {
      return [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Início'),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: 'Consultas'),
        BottomNavigationBarItem(icon: Icon(Icons.local_hospital), label: 'Médicos'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Perfil'),
      ];
    } else if (user.isMedico) {
      return [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Início'),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: 'Consultas'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Perfil'),
      ];
    } else {
      // Paciente
      return [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Início'),
        BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: 'Consultas'),
        BottomNavigationBarItem(icon: Icon(Icons.local_hospital), label: 'Médicos'),
        BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Perfil'),
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthService>(
      builder: (context, authService, _) {
        final user = authService.currentUser;
        final screens = _getScreensForUser(user);
        final navItems = _getNavItemsForUser(user);

        // Garantir que o índice atual não exceda o número de telas
        if (_currentIndex >= screens.length) {
          _currentIndex = 0;
        }

        return Scaffold(
          body: screens[_currentIndex],
          bottomNavigationBar: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            currentIndex: _currentIndex,
            onTap: (index) {
              setState(() {
                _currentIndex = index;
              });
            },
            selectedItemColor: AppTheme.primaryColor,
            unselectedItemColor: AppTheme.greyColor,
            items: navItems,
          ),
        );
      },
    );
  }
}

class HomeContent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context);
    final user = authService.currentUser;

    return Scaffold(
      appBar: AppBar(
        title: Text('Medlink'),
        actions: [
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {
              // TODO: Implement notifications
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Olá, ${user?.nome ?? 'Usuário'}!',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Como podemos ajudá-lo hoje?',
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
            
            // Quick Actions
            Text(
              'Ações Rápidas',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            
            // Quick Actions
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: _buildQuickActions(user, context),
            ),
            
            SizedBox(height: 24),
            
            // Recent Activity or Tips
            Text(
              'Dicas de Saúde',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            
            Card(
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: AppTheme.secondaryColor,
                  child: Icon(Icons.tips_and_updates, color: Colors.white),
                ),
                title: Text('Mantenha seus exames em dia'),
                subtitle: Text('Realize check-ups regulares para manter sua saúde sempre em dia.'),
              ),
            ),
            
            Card(
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: Colors.blue,
                  child: Icon(Icons.water_drop, color: Colors.white),
                ),
                title: Text('Hidrate-se adequadamente'),
                subtitle: Text('Beba pelo menos 2 litros de água por dia.'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> _buildQuickActions(User? user, BuildContext context) {
    if (user == null) {
      return [
        _buildQuickActionCard(
          context,
          icon: Icons.person,
          title: 'Meu Perfil',
          subtitle: 'Dados pessoais',
          color: Colors.purple,
          onTap: () => _navigateToTab(context, 1),
        ),
      ];
    } else if (user.isAdmin) {
      return [
        _buildQuickActionCard(
          context,
          icon: Icons.calendar_today,
          title: 'Todas Consultas',
          subtitle: 'Gerenciar consultas',
          color: AppTheme.primaryColor,
          onTap: () => _navigateToTab(context, 1),
        ),
        _buildQuickActionCard(
          context,
          icon: Icons.local_hospital,
          title: 'Gerenciar Médicos',
          subtitle: 'Adicionar/remover',
          color: Colors.orange,
          onTap: () => _navigateToTab(context, 2),
        ),
        _buildQuickActionCard(
          context,
          icon: Icons.admin_panel_settings,
          title: 'Painel Admin',
          subtitle: 'Configurações',
          color: Colors.red,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Funcionalidade em desenvolvimento')),
            );
          },
        ),
        _buildQuickActionCard(
          context,
          icon: Icons.person,
          title: 'Meu Perfil',
          subtitle: 'Dados pessoais',
          color: Colors.purple,
          onTap: () => _navigateToTab(context, 3),
        ),
      ];
    } else if (user.isMedico) {
      return [
        _buildQuickActionCard(
          context,
          icon: Icons.calendar_today,
          title: 'Minhas Consultas',
          subtitle: 'Gerenciar agenda',
          color: AppTheme.primaryColor,
          onTap: () => _navigateToTab(context, 1),
        ),
        _buildQuickActionCard(
          context,
          icon: Icons.schedule,
          title: 'Horários',
          subtitle: 'Definir disponibilidade',
          color: Colors.green,
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Funcionalidade em desenvolvimento')),
            );
          },
        ),
        _buildQuickActionCard(
          context,
          icon: Icons.person,
          title: 'Meu Perfil',
          subtitle: 'Dados pessoais',
          color: Colors.purple,
          onTap: () => _navigateToTab(context, 2),
        ),
      ];
    } else {
      // Paciente
      return [
        _buildQuickActionCard(
          context,
          icon: Icons.add_circle,
          title: 'Agendar Consulta',
          subtitle: 'Nova consulta',
          color: AppTheme.secondaryColor,
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => AgendarConsultaScreen()),
            );
          },
        ),
        _buildQuickActionCard(
          context,
          icon: Icons.calendar_today,
          title: 'Minhas Consultas',
          subtitle: 'Ver agendamentos',
          color: AppTheme.primaryColor,
          onTap: () => _navigateToTab(context, 1),
        ),
        _buildQuickActionCard(
          context,
          icon: Icons.local_hospital,
          title: 'Médicos',
          subtitle: 'Ver especialistas',
          color: Colors.orange,
          onTap: () => _navigateToTab(context, 2),
        ),
        _buildQuickActionCard(
          context,
          icon: Icons.person,
          title: 'Meu Perfil',
          subtitle: 'Dados pessoais',
          color: Colors.purple,
          onTap: () => _navigateToTab(context, 3),
        ),
      ];
    }
  }

  void _navigateToTab(BuildContext context, int index) {
    final homeState = context.findAncestorStateOfType<_HomeScreenState>();
    if (homeState != null) {
      homeState.setState(() {
        homeState._currentIndex = index;
      });
    }
  }

  Widget _buildQuickActionCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: color,
                child: Icon(icon, color: Colors.white, size: 28),
              ),
              SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  color: AppTheme.greyColor,
                  fontSize: 12,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}