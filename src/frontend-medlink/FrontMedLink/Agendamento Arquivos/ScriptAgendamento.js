// Script de interatividade para página de agendamento

document.addEventListener('DOMContentLoaded', function() {
    
    // Estado da aplicação
    const estado = {
        medicoSelecionado: null,
        dataSelecionada: null,
        horarioSelecionado: null,
        modalidade: 'online',
        valorConsulta: 150.00
    };

    // Elementos DOM
    const doctorCards = document.querySelectorAll('.doctor-card');
    const timeSlots = document.querySelectorAll('.time-slot');
    const dataInput = document.getElementById('data-consulta');
    const modalidadeSelect = document.getElementById('modalidade-consulta');
    const confirmButton = document.getElementById('botao-confirmar');
    const searchInput = document.querySelector('.search-box input');
    const especialidadeSelect = document.getElementById('especialidade');
    const modalidadeFilter = document.getElementById('modalidade');

    // Informações dos médicos
    const medicos = {
        'Dr. Felipe Almeida': {
            nome: 'Dr. Felipe Almeida',
            especialidade: 'Clínico Geral',
            avaliacao: '4.9',
            avaliacoes: '124 avaliações',
            crm: '123456-SP',
            modalidade: 'online'
        },
        'Dra. Ana Paula Costa': {
            nome: 'Dra. Ana Paula Costa',
            especialidade: 'Cardiologia',
            avaliacao: '4.8',
            avaliacoes: '89 avaliações',
            crm: '654321-SP',
            modalidade: 'presencial'
        },
        'Dra. Juliana Ferreira': {
            nome: 'Dra. Juliana Ferreira',
            especialidade: 'Dermatologia',
            avaliacao: '4.9',
            avaliacoes: '156 avaliações',
            crm: '789012-SP',
            modalidade: 'online'
        },
        'Dr. Roberto Silva': {
            nome: 'Dr. Roberto Silva',
            especialidade: 'Ortopedia',
            avaliacao: '4.7',
            avaliacoes: '67 avaliações',
            crm: '345678-SP',
            modalidade: 'presencial'
        }
    };

    // Função para selecionar um médico
    function selecionarMedico(medicoNome, cardElement) {
        // Remove seleção anterior
        doctorCards.forEach(card => {
            card.classList.remove('selected');
            const checkmark = card.querySelector('.doctor-checkmark');
            if (checkmark) checkmark.remove();
        });

        // Adiciona seleção nova
        cardElement.classList.add('selected');
        
        // Adiciona checkmark visual
        const header = cardElement.querySelector('.doctor-header');
        if (header && !header.querySelector('.doctor-checkmark')) {
            const checkmark = document.createElement('div');
            checkmark.className = 'doctor-checkmark';
            checkmark.textContent = '✓';
            checkmark.style.cssText = 'color: var(--green); font-size: 32px; font-weight: bold;';
            header.appendChild(checkmark);
        }

        estado.medicoSelecionado = medicoNome;
        atualizarResumo();
    }

    // Event listeners para cards de médicos
    doctorCards.forEach(card => {
        card.addEventListener('click', function() {
            const nomeElement = card.querySelector('.doctor-info h3');
            if (nomeElement) {
                selecionarMedico(nomeElement.textContent, card);
            }
        });
    });

    // Função para selecionar horário
    function selecionarHorario(slotElement) {
        if (slotElement.classList.contains('disabled')) {
            return;
        }

        // Remove seleção anterior
        timeSlots.forEach(slot => slot.classList.remove('selected'));

        // Adiciona nova seleção
        slotElement.classList.add('selected');
        estado.horarioSelecionado = slotElement.textContent;
        atualizarResumo();
    }

    // Event listeners para horários
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            if (!this.classList.contains('disabled')) {
                selecionarHorario(this);
            }
        });
    });

    // Função para atualizar data
    dataInput.addEventListener('change', function() {
        estado.dataSelecionada = this.value;
        atualizarResumo();
    });

    // Função para atualizar modalidade
    modalidadeSelect.addEventListener('change', function() {
        estado.modalidade = this.value.toLowerCase().includes('online') ? 'online' : 'presencial';
        atualizarResumo();
    });

    // Função para atualizar resumo
    function atualizarResumo() {
        const medicoNome = estado.medicoSelecionado ? 
            document.querySelector('.doctor-card.selected .doctor-info h3')?.textContent : 'Não selecionado';
        
        const especialidade = estado.medicoSelecionado ? 
            document.querySelector('.doctor-card.selected .doctor-specialty')?.textContent : '-';

        const data = estado.dataSelecionada ? 
            formatarData(estado.dataSelecionada) : 'Data não selecionada';

        const horario = estado.horarioSelecionado ? estado.horarioSelecionado : '-';
        
        const tipo = estado.modalidade === 'online' ? 'Online (Videoconferência)' : 'Presencial';

        // Atualiza os valores no resumo
        const summaryItems = document.querySelectorAll('.summary-item');
        if (summaryItems.length >= 5) {
            summaryItems[0].querySelector('.summary-value').textContent = medicoNome;
            summaryItems[1].querySelector('.summary-value').textContent = especialidade;
            summaryItems[2].querySelector('.summary-value').textContent = data;
            summaryItems[3].querySelector('.summary-value').textContent = horario;
            
            const modalidadeElement = summaryItems[4].querySelector('.summary-value');
            modalidadeElement.textContent = tipo;
            if (estado.modalidade === 'online') {
                modalidadeElement.style.color = 'var(--green)';
            } else {
                modalidadeElement.style.color = '';
            }
        }

        // Habilita/desabilita botão de confirmação
        if (estado.medicoSelecionado && estado.dataSelecionada && estado.horarioSelecionado) {
            confirmButton.disabled = false;
            confirmButton.style.opacity = '1';
        } else {
            confirmButton.disabled = true;
            confirmButton.style.opacity = '0.6';
        }
    }

    // Função para formatar data
    function formatarData(dateString) {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('pt-BR', options);
    }

    // Função de busca
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        doctorCards.forEach(card => {
            const medicoNome = card.querySelector('.doctor-info h3')?.textContent.toLowerCase();
            const especialidade = card.querySelector('.doctor-specialty')?.textContent.toLowerCase();
            
            const matchNome = medicoNome?.includes(searchTerm);
            const matchEspecialidade = especialidade?.includes(searchTerm);
            
            card.style.display = (matchNome || matchEspecialidade || !searchTerm) ? 'block' : 'none';
        });
    });

    // Filtros por especialidade
    especialidadeSelect.addEventListener('change', function() {
        const filtro = this.value.toLowerCase();
        
        doctorCards.forEach(card => {
            const especialidade = card.querySelector('.doctor-specialty')?.textContent.toLowerCase();
            
            if (filtro === 'todas' || especialidade === filtro || 
                especialidade?.includes(filtro)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Filtro por modalidade
    modalidadeFilter.addEventListener('change', function() {
        const filtro = this.value.toLowerCase();
        
        doctorCards.forEach(card => {
            const badge = card.querySelector('.modalidade-badge')?.textContent.toLowerCase();
            
            if (filtro === 'ambas' || badge === filtro) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Botão de busca
    const buscarButton = document.querySelector('.search-box button');
    if (buscarButton) {
        buscarButton.addEventListener('click', function(e) {
            e.preventDefault();
            searchInput.focus();
        });
    }

    // Função de confirmação de agendamento
    if (confirmButton) {
        confirmButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (!estado.medicoSelecionado || !estado.dataSelecionada || !estado.horarioSelecionado) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            // Simulação de envio
            const motivo = document.getElementById('motivo')?.value;
            const sintomas = document.getElementById('sintomas')?.value;

            const dados = {
                medico: estado.medicoSelecionado,
                data: estado.dataSelecionada,
                horario: estado.horarioSelecionado,
                modalidade: estado.modalidade,
                valor: estado.valorConsulta,
                motivo: motivo || '',
                sintomas: sintomas || ''
            };

            // Animação de loading
            confirmButton.textContent = 'Processando...';
            confirmButton.disabled = true;
            confirmButton.style.opacity = '0.7';

            // Simulação de envio ao servidor
            setTimeout(() => {
                alert(`✅ Agendamento confirmado!\n\nMédico: ${dados.medico}\nData: ${formatarData(dados.data)}\nHorário: ${dados.horario}\nModalidade: ${dados.modalidade}\nValor: R$ ${dados.valor.toFixed(2)}`);
                
                confirmButton.textContent = 'Agendamento Confirmado!';
                confirmButton.style.background = '#16a34a';
                
                // Redirect após 2 segundos para a home
                setTimeout(() => {
                    if (window.location.href.includes('agendamento.html')) {
                        window.location.href = '../Home Arquivos/home.html';
                    }
                }, 2000);
            }, 1500);
        });
    }

    // Inicialização: Seleciona o primeiro médico por padrão
    if (doctorCards.length > 0) {
        const primeiroCard = doctorCards[0];
        const nomeMedico = primeiroCard.querySelector('.doctor-info h3')?.textContent;
        selecionarMedico(nomeMedico, primeiroCard);
    }

    // Atualiza resumo inicial
    atualizarResumo();
});

