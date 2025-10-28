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

// Função para formatar CPF
function formatarCPF(cpf) {
    const apenasNumeros = cpf.replace(/\D/g, '');
    if (apenasNumeros.length === 11) {
        return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
    }
    return cpf;
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

// Validação de CPF (apenas formato)
function validarCPF(cpf) {
    const apenasNumeros = cpf.replace(/\D/g, '');
    // Verificar apenas se tem 11 dígitos
    return apenasNumeros.length === 11;
}

// Validação de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Calcular IMC automaticamente
function calcularIMC() {
    const altura = parseFloat(document.getElementById('altura').value) / 100; // converter cm para m
    const peso = parseFloat(document.getElementById('peso').value);
    
    if (altura > 0 && peso > 0) {
        const imc = (peso / (altura * altura)).toFixed(1);
        document.getElementById('imc').value = imc;
        
        // Adicionar classificação
        const classificacao = obterClassificacaoIMC(imc);
        localStorage.setItem('imcPaciente', imc);
        localStorage.setItem('classificacaoIMC', classificacao);
    }
}

// Classificar IMC
function obterClassificacaoIMC(imc) {
    const valor = parseFloat(imc);
    if (valor < 18.5) return 'Abaixo do peso';
    if (valor < 25) return 'Peso normal';
    if (valor < 30) return 'Sobrepeso';
    if (valor < 35) return 'Obesidade grau I';
    if (valor < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
}

// Salvar alterações do perfil paciente
function salvarAlteracoesPaciente() {
    let temErro = false;

    const dadosPessoais = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        nascimento: document.getElementById('nascimento').value,
        genero: document.getElementById('genero').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value
    };

    const dadosSaude = {
        tipoSanguineo: document.getElementById('tipo-sanguineo').value,
        plano: document.getElementById('plano').value,
        convenio: document.getElementById('convenio').value,
        altura: document.getElementById('altura').value,
        peso: document.getElementById('peso').value,
        imc: document.getElementById('imc').value,
        medicamentos: document.getElementById('medicamentos').value,
        alergias: document.getElementById('alergias').value,
        doencas: document.getElementById('doencas').value
    };

    const preferencias = {
        modalidade: document.getElementById('modalidade').value,
        horario: document.getElementById('horario').value,
        obs: document.getElementById('obs').value
    };

    // Validações básicas
    if (!dadosPessoais.nome || dadosPessoais.nome.trim().length < 3) {
        mostrarErro('nome', 'Por favor, preencha o nome completo.');
        temErro = true;
    } else {
        removerErro('nome');
    }

    if (!validarCPF(dadosPessoais.cpf)) {
        mostrarErro('cpf', 'Por favor, informe um CPF com formato válido (11 dígitos).');
        temErro = true;
    } else {
        removerErro('cpf');
    }

    if (!validarEmail(dadosPessoais.email)) {
        mostrarErro('email', 'Por favor, informe um e-mail válido.');
        temErro = true;
    } else {
        removerErro('email');
    }

    if (temErro) {
        return false;
    }

    // Salvar no localStorage
    localStorage.setItem('perfilPaciente', JSON.stringify(dadosPessoais));
    localStorage.setItem('saudePaciente', JSON.stringify(dadosSaude));
    localStorage.setItem('preferenciasPaciente', JSON.stringify(preferencias));
    
    mostrarSucesso('Perfil atualizado com sucesso!');
    return true;
}

// Carregar dados salvos
function carregarDadosPaciente() {
    const perfilSalvo = localStorage.getItem('perfilPaciente');
    const saudeSalva = localStorage.getItem('saudePaciente');
    const preferenciasSalvas = localStorage.getItem('preferenciasPaciente');

    if (perfilSalvo) {
        const dados = JSON.parse(perfilSalvo);
        document.getElementById('nome').value = dados.nome || 'Maria Silva Santos';
        document.getElementById('cpf').value = dados.cpf || '123.456.789-00';
        document.getElementById('nascimento').value = dados.nascimento || '1990-05-15';
        document.getElementById('genero').value = dados.genero || 'Feminino';
        document.getElementById('email').value = dados.email || 'maria.silva@email.com';
        document.getElementById('telefone').value = dados.telefone || '(11) 98888-7777';
        document.getElementById('endereco').value = dados.endereco || '';
    }

    if (saudeSalva) {
        const dados = JSON.parse(saudeSalva);
        document.getElementById('tipo-sanguineo').value = dados.tipoSanguineo || 'A+';
        document.getElementById('plano').value = dados.plano || 'Unimed';
        document.getElementById('convenio').value = dados.convenio || '123456789';
        document.getElementById('altura').value = dados.altura || '165';
        document.getElementById('peso').value = dados.peso || '62';
        document.getElementById('imc').value = dados.imc || '22.8';
        document.getElementById('medicamentos').value = dados.medicamentos || '';
        document.getElementById('alergias').value = dados.alergias || '';
        document.getElementById('doencas').value = dados.doencas || '';
        
        // Recalcular IMC se necessário
        if (dados.altura && dados.peso) {
            calcularIMC();
        }
    }

    if (preferenciasSalvas) {
        const dados = JSON.parse(preferenciasSalvas);
        document.getElementById('modalidade').value = dados.modalidade || 'Online';
        document.getElementById('horario').value = dados.horario || 'Manhã (8h - 12h)';
        document.getElementById('obs').value = dados.obs || '';
    }
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    // Simulação de consultas marcadas
    const consultasMarcadas = localStorage.getItem('consultasMarcadas') || '3';
    document.querySelector('.card-link:first-child .card-value').textContent = consultasMarcadas;

    // Simulação de histórico de consultas
    const historicoConsultas = localStorage.getItem('historicoConsultas') || '28';
    document.querySelector('.card-link:nth-child(2) .card-value').textContent = historicoConsultas;

    // Médicos favoritos
    const medicosFavoritos = localStorage.getItem('medicosFavoritos') || '5';
    document.querySelector('.card-link:nth-child(3) .card-value').textContent = medicosFavoritos;
}

// Função principal ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados salvos
    carregarDadosPaciente();
    atualizarEstatisticas();

    // Botão de atualizar perfil
    const botaoAtualizar = document.querySelector('.content-header button');
    if (botaoAtualizar) {
        botaoAtualizar.addEventListener('click', function() {
            salvarAlteracoesPaciente();
        });
    }

    // Formatação automática de CPF
    const campoCPF = document.getElementById('cpf');
    if (campoCPF) {
        campoCPF.addEventListener('input', function(e) {
            const valor = e.target.value;
            const valorFormatado = formatarCPF(valor);
            if (valorFormatado !== valor) {
                e.target.value = valorFormatado;
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

    // Cálculo automático de IMC
    const campoAltura = document.getElementById('altura');
    const campoPeso = document.getElementById('peso');
    
    if (campoAltura) {
        campoAltura.addEventListener('input', calcularIMC);
        campoAltura.addEventListener('blur', calcularIMC);
    }
    
    if (campoPeso) {
        campoPeso.addEventListener('input', calcularIMC);
        campoPeso.addEventListener('blur', calcularIMC);
    }

    // Validação em tempo real do CPF
    if (campoCPF) {
        campoCPF.addEventListener('input', function(e) {
            if (e.target.value) {
                removerErro('cpf');
            }
        });
        campoCPF.addEventListener('blur', function(e) {
            const cpf = e.target.value;
            if (cpf && !validarCPF(cpf)) {
                mostrarErro('cpf', 'CPF inválido. O CPF deve ter 11 dígitos.');
            } else if (cpf) {
                removerErro('cpf');
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

    // Validação de altura e peso
    if (campoAltura) {
        campoAltura.addEventListener('blur', function(e) {
            const altura = parseInt(e.target.value);
            if (altura < 50 || altura > 250) {
                mostrarErro('altura', 'Por favor, informe uma altura válida (entre 50 e 250 cm).');
            } else if (altura) {
                removerErro('altura');
            }
        });
    }

    if (campoPeso) {
        campoPeso.addEventListener('blur', function(e) {
            const peso = parseFloat(e.target.value);
            if (peso < 10 || peso > 300) {
                mostrarErro('peso', 'Por favor, informe um peso válido (entre 10 e 300 kg).');
            } else if (peso) {
                removerErro('peso');
            }
        });
    }
});

