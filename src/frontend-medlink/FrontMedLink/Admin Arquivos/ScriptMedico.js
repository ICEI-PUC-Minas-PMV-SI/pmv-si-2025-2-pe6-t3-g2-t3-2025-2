// Função para mostrar erro em um campo
function mostrarErro(campoId, mensagem) {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    // Adicionar classe de erro
    campo.classList.add('error');

    // Remover mensagem de erro anterior se existir
    const mensagemAnterior = campo.parentElement.querySelector('.error-message');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }

    // Criar nova mensagem de erro
    const erroDiv = document.createElement('div');
    erroDiv.className = 'error-message';
    erroDiv.textContent = mensagem;
    campo.parentElement.appendChild(erroDiv);
}

// Função para remover erro de um campo
function removerErro(campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return;

    campo.classList.remove('error');
    const mensagemErro = campo.parentElement.querySelector('.error-message');
    if (mensagemErro) {
        mensagemErro.remove();
    }
}

// Função para mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
    const container = document.querySelector('.container');
    const sucessoDiv = document.createElement('div');
    sucessoDiv.className = 'success-message';
    sucessoDiv.textContent = mensagem;
    
    // Inserir no início do container
    container.insertBefore(sucessoDiv, container.firstChild);
    
    // Remover após 3 segundos
    setTimeout(() => {
        sucessoDiv.remove();
    }, 3000);
}

// Função para formatar telefone
function formatarTelefone(telefone) {
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length === 11) {
        return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
    } else if (apenasNumeros.length === 10) {
        return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
    }
    return telefone;
}

// Função para formatar horário
function formatarHorario(horario) {
    // Aceita formatos como: 09:00 - 17:00 ou 9h - 17h
    return horario.replace(/(\d{1,2})[hH]/g, '$1:00');
}

// Validação de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validação de CRM
function validarCRM(crm) {
    const regex = /^\d{6}-\w{2}$/;
    return regex.test(crm);
}

// Salvar alterações do perfil médico
function salvarAlteracoesMedico() {
    // Limpar erros anteriores
    const campos = ['nome', 'crm', 'email'];
    let temErro = false;

    const dadosMedico = {
        nome: document.getElementById('nome').value,
        crm: document.getElementById('crm').value,
        especialidade: document.getElementById('especialidade').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        bio: document.getElementById('bio').value
    };

    // Validações
    if (!dadosMedico.nome || dadosMedico.nome.trim().length < 3) {
        mostrarErro('nome', 'Por favor, preencha o nome completo.');
        temErro = true;
    } else {
        removerErro('nome');
    }

    if (!validarCRM(dadosMedico.crm)) {
        mostrarErro('crm', 'Por favor, informe um CRM válido (formato: 123456-SP).');
        temErro = true;
    } else {
        removerErro('crm');
    }

    if (!validarEmail(dadosMedico.email)) {
        mostrarErro('email', 'Por favor, informe um e-mail válido.');
        temErro = true;
    } else {
        removerErro('email');
    }

    if (temErro) {
        return false;
    }

    // Salvar no localStorage
    localStorage.setItem('perfilMedico', JSON.stringify(dadosMedico));
    
    mostrarSucesso('Perfil salvo com sucesso!');
    return true;
}

// Salvar disponibilidade
function salvarDisponibilidade() {
    const disponibilidade = {
        segunda: document.getElementById('segunda').value,
        terca: document.getElementById('terca').value,
        quarta: document.getElementById('quarta').value,
        quinta: document.getElementById('quinta').value,
        sexta: document.getElementById('sexta').value
    };

    localStorage.setItem('disponibilidadeMedico', JSON.stringify(disponibilidade));
    
    mostrarSucesso('Disponibilidade salva com sucesso!');
    return true;
}

// Carregar dados salvos
function carregarDadosMedico() {
    const perfilSalvo = localStorage.getItem('perfilMedico');
    const disponibilidadeSalva = localStorage.getItem('disponibilidadeMedico');

    if (perfilSalvo) {
        const dados = JSON.parse(perfilSalvo);
        document.getElementById('nome').value = dados.nome || 'Dr. Felipe Almeida';
        document.getElementById('crm').value = dados.crm || '123456-SP';
        document.getElementById('especialidade').value = dados.especialidade || 'Clínico Geral';
        document.getElementById('email').value = dados.email || 'dr.felipe@medlink.com';
        document.getElementById('telefone').value = dados.telefone || '(11) 99999-9999';
        document.getElementById('bio').value = dados.bio || '';
    }

    if (disponibilidadeSalva) {
        const disponibilidade = JSON.parse(disponibilidadeSalva);
        document.getElementById('segunda').value = disponibilidade.segunda || '09:00 - 17:00';
        document.getElementById('terca').value = disponibilidade.terca || '09:00 - 17:00';
        document.getElementById('quarta').value = disponibilidade.quarta || '09:00 - 17:00';
        document.getElementById('quinta').value = disponibilidade.quinta || '09:00 - 17:00';
        document.getElementById('sexta').value = disponibilidade.sexta || '09:00 - 17:00';
    }
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    // Simulação de consultas agendadas
    const consultasAgendadas = localStorage.getItem('consultasAgendadas') || '14';
    document.querySelector('.card-link:first-child .card-value').textContent = consultasAgendadas;

    // Simulação de pacientes ativos
    const pacientesAtivos = localStorage.getItem('pacientesAtivos') || '57';
    document.querySelector('.card-link:nth-child(2) .card-value').textContent = pacientesAtivos;

    // Avaliações já fixo no HTML
}

// Função principal ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados salvos
    carregarDadosMedico();
    atualizarEstatisticas();

    // Botão de salvar alterações
    const botaoSalvar = document.querySelector('.content-header button');
    if (botaoSalvar) {
        botaoSalvar.addEventListener('click', function() {
            if (salvarAlteracoesMedico() && salvarDisponibilidade()) {
                atualizarEstatisticas();
            }
        });
    }

    // Formatação automática de telefone
    const campoTelefone = document.getElementById('telefone');
    if (campoTelefone) {
        campoTelefone.addEventListener('input', function(e) {
            const valor = e.target.value;
            const valorFormatado = formatarTelefone(valor);
            if (valorFormatado !== valor) {
                e.target.value = valorFormatado;
            }
        });
    }

    // Formatação automática de horário
    const camposHorario = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
    camposHorario.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('blur', function(e) {
                const valor = e.target.value;
                const valorFormatado = formatarHorario(valor);
                e.target.value = valorFormatado || '09:00 - 17:00';
            });
        }
    });

    // Validação em tempo real do CRM
    const campoCRM = document.getElementById('crm');
    if (campoCRM) {
        campoCRM.addEventListener('input', function(e) {
            if (e.target.value) {
                removerErro('crm');
            }
        });
        campoCRM.addEventListener('blur', function(e) {
            const crm = e.target.value;
            if (crm && !validarCRM(crm)) {
                mostrarErro('crm', 'Formato de CRM inválido. Use o formato: 123456-SP');
            } else if (crm) {
                removerErro('crm');
            }
        });
    }

    // Validação em tempo real do email
    const campoEmail = document.getElementById('email');
    if (campoEmail) {
        campoEmail.addEventListener('input', function(e) {
            if (e.target.value) {
                removerErro('email');
            }
        });
        campoEmail.addEventListener('blur', function(e) {
            const email = e.target.value;
            if (email && !validarEmail(email)) {
                mostrarErro('email', 'Por favor, informe um e-mail válido.');
            } else if (email) {
                removerErro('email');
            }
        });
    }

    // Validação em tempo real do nome
    const campoNome = document.getElementById('nome');
    if (campoNome) {
        campoNome.addEventListener('input', function(e) {
            if (e.target.value) {
                removerErro('nome');
            }
        });
        campoNome.addEventListener('blur', function(e) {
            const nome = e.target.value;
            if (nome && nome.trim().length < 3) {
                mostrarErro('nome', 'O nome deve ter pelo menos 3 caracteres.');
            } else if (nome) {
                removerErro('nome');
            }
        });
    }
});

