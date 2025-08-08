document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const modalIframe = document.getElementById('modal-iframe');
    const closeBtn = document.querySelector('.close');
    const actionButtons = document.querySelectorAll('.action-btn');

    // Função para expandir/recolher cards
    window.toggleCard = function(header) {
        const card = header.closest('.item-card');
        const isExpanded = card.classList.contains('expanded');
        
        if (isExpanded) {
            card.classList.remove('expanded');
            card.classList.add('collapsed');
        } else {
            card.classList.remove('collapsed');
            card.classList.add('expanded');
        }
    };

    // Função para abrir modal
    function openModal(url) {
        if (url.startsWith('//')) {
            // Para URLs internas que começam com //, mostrar alerta
            alert('Link interno: ' + url + '\n\nEste é um link interno do sistema. Em um ambiente real, seria redirecionado para a página correspondente.');
            return;
        }
        
        modalIframe.src = url;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Animação de entrada
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    // Função para mostrar popup com descrição
    function showDescriptionPopup(description, title) {
        // Criar modal customizado para descrição
        const descModal = document.createElement('div');
        descModal.className = 'description-modal';
        descModal.innerHTML = `
            <div class="description-modal-content">
                <span class="description-close">&times;</span>
                <h2>${title}</h2>
                <div class="description-text">
                    <p>${description}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(descModal);
        
        // Mostrar modal
        setTimeout(() => {
            descModal.style.opacity = '1';
        }, 10);
        
        // Fechar modal
        const closeDescBtn = descModal.querySelector('.description-close');
        closeDescBtn.addEventListener('click', () => {
            descModal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(descModal);
            }, 300);
        });
        
        // Fechar clicando fora
        descModal.addEventListener('click', (e) => {
            if (e.target === descModal) {
                descModal.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(descModal);
                }, 300);
            }
        });
    }

    // Função para fechar modal
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modalIframe.src = '';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    // Event listeners para os botões
    actionButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.item-card');
            const url = card.getAttribute('data-url');
            const description = card.getAttribute('data-description');
            const title = card.querySelector('h3').textContent;
            
            // Efeito visual no botão
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Se é link interno e tem descrição, mostrar popup com descrição
            if (url.startsWith('//') && description) {
                showDescriptionPopup(description, title);
            } else {
                openModal(url);
            }
        });
    });

    // Fechar modal
    closeBtn.addEventListener('click', closeModal);

    // Fechar modal clicando fora do conteúdo
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // Efeito de partículas no fundo (opcional)
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(255, 215, 0, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '-1';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        const animation = particle.animate([
            { transform: 'translateY(0px)', opacity: 1 },
            { transform: 'translateY(-' + (window.innerHeight + 100) + 'px)', opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'linear'
        });
        
        animation.onfinish = () => {
            particle.remove();
        };
    }

    // Criar partículas periodicamente
    setInterval(createParticle, 500);

    // Animação de loading para o iframe
    modalIframe.addEventListener('load', function() {
        this.style.opacity = '1';
    });

    modalIframe.addEventListener('loadstart', function() {
        this.style.opacity = '0.5';
    });
});

