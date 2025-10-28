// Função para redirecionar para as páginas
function redirecionarPara(pagina) {
    switch(pagina) {
        case 'agendamento':
            window.location.href = '../Agendamento Arquivos/agendamento.html';
            break;
        case 'admin-medico':
            window.location.href = '../Admin Arquivos/medico.html';
            break;
        case 'admin-paciente':
            window.location.href = '../Admin Arquivos/paciente.html';
            break;
        default:
            console.log('Página não encontrada');
    }
}

// Adicionar event listeners aos cards de navegação
document.addEventListener('DOMContentLoaded', function() {
    // Pegar todos os cards de navegação
    const navCards = document.querySelectorAll('.nav-card');
    
    // Adicionar evento de clique em cada card
    navCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Evitar clique no botão, apenas no card
            if (e.target.tagName !== 'BUTTON') {
                const page = card.getAttribute('data-page');
                redirecionarPara(page);
            }
        });

        // Adicionar efeito de hover no card
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Adicionar evento aos botões
    const botoes = document.querySelectorAll('.nav-card button');
    botoes.forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar propagação do evento
            const card = this.closest('.nav-card');
            const page = card.getAttribute('data-page');
            redirecionarPara(page);
        });
    });

    // Adicionar animação de entrada aos cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Observar cards de navegação
    navCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });

    // Observar itens de features
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });

    // Observar stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    console.log('Medlink Home — Sistema carregado com sucesso!');
});

