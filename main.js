// main.js - Scripts principais do Verdelis RP

// Configurações globais
const CONFIG = {
    serverIP: 'verdelisrp.com',
    discordURL: 'https://discord.gg/verdelis',
    storeURL: 'https://loja.verdelisrp.com'
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeHeader();
    initializeAnimations();
    initializeNavigation();
    initializeForms();
    initializeInteractiveElements();
    initializeFortalezas(); // Nova inicialização para fortalezas
});

// Sistema de Header dinâmico
function initializeHeader() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(22, 33, 62, 0.98)';
                header.style.padding = '0.5rem 0';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'rgba(22, 33, 62, 0.95)';
                header.style.padding = '1rem 0';
                header.style.backdropFilter = 'blur(5px)';
            }
        });
    }
}

// Sistema de animações scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observar elementos com classes de animação
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
    });
}

// Sistema de navegação suave
function initializeNavigation() {
    // Smooth scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Ativar link ativo na navegação
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Sistema de formulários
function initializeForms() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }

    // Validação de formulários
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            }
        });
    });
}

// Validação de formulário
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = 'var(--accent-red)';
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}

// Envio de formulário
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Simular loading
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simular envio (substituir por AJAX real)
    setTimeout(() => {
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        form.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar estilos dinamicamente
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: 'var(--success-green)',
        error: 'var(--accent-red)',
        warning: 'var(--warning-orange)',
        info: 'var(--accent-blue)'
    };
    return colors[type] || 'var(--accent-blue)';
}

// SISTEMA ESPECÍFICO PARA FORTALEZAS
function initializeFortalezas() {
    // Filtros de produtos
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active de todos os botões
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Adiciona active ao botão clicado
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                const products = document.querySelectorAll('.product-card');
                
                products.forEach(product => {
                    if (filter === 'all' || product.getAttribute('data-category') === filter) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    }

    // Modal de compra para fortalezas
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        const modalProduct = document.getElementById('modalProduct');
        const modalPrice = document.getElementById('modalPrice');
        const currentBalance = document.getElementById('currentBalance');
        const confirmBtn = document.getElementById('confirmPurchase');
        const cancelBtn = document.getElementById('cancelPurchase');
        const closeBtn = document.querySelector('.modal-close');

        let selectedProduct = null;
        let selectedPrice = null;

        // Simular saldo do usuário (em produção, viria do backend)
        let userBalance = 25000;

        // Atualizar saldo exibido
        if (currentBalance) {
            currentBalance.textContent = userBalance.toLocaleString();
        }

        // Event listeners para botões de compra
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                selectedProduct = button.getAttribute('data-product');
                selectedPrice = parseInt(button.getAttribute('data-price'));
                
                if (modalProduct) modalProduct.textContent = `Produto: ${selectedProduct}`;
                if (modalPrice) modalPrice.textContent = `Preço: ${selectedPrice.toLocaleString()} Verdelium`;
                
                modal.style.display = 'flex';
            });
        });

        // Fechar modal
        function closeModal() {
            modal.style.display = 'none';
            selectedProduct = null;
            selectedPrice = null;
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // Confirmar compra
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (selectedProduct && selectedPrice) {
                    if (userBalance >= selectedPrice) {
                        // Simular compra (em produção, chamaria API)
                        userBalance -= selectedPrice;
                        if (currentBalance) currentBalance.textContent = userBalance.toLocaleString();
                        
                        showNotification(`✅ Compra realizada com sucesso! ${selectedProduct} - ${selectedPrice.toLocaleString()} Verdelium`, 'success');
                        closeModal();
                        
                        // Aqui em produção você enviaria uma requisição para o servidor
                        console.log(`Compra processada: ${selectedProduct} - ${selectedPrice} Verdelium`);
                        
                    } else {
                        showNotification('❌ Saldo insuficiente! Compre mais Verdelium para realizar esta compra.', 'error');
                    }
                }
            });
        }

        // Fechar modal clicando fora
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// Sistema de elementos interativos
function initializeInteractiveElements() {
    // Sistema de abas
    initializeTabs();
    
    // Sistema de FAQ
    initializeFAQ();
    
    // Sistema de compras
    initializeStore();
    
    // Sistema de timeline
    initializeTimeline();
}

// Sistema de abas
function initializeTabs() {
    document.querySelectorAll('.store-tab, .class-nav-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabContainer = this.closest('.container') || document;
            const tabType = this.classList.contains('store-tab') ? 'store' : 'class';
            
            // Remover active de todas as abas
            tabContainer.querySelectorAll(`.${tabType}-tab, .${tabType}-nav-btn`).forEach(t => {
                t.classList.remove('active');
            });
            
            // Adicionar active à aba clicada
            this.classList.add('active');
            
            // Mostrar conteúdo correspondente
            const targetId = this.getAttribute('data-tab') || this.getAttribute('data-class');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Esconder todos os conteúdos
                tabContainer.querySelectorAll('.products-section, .class-details').forEach(content => {
                    content.style.display = 'none';
                });
                
                // Mostrar conteúdo alvo
                targetElement.style.display = 'block';
            }
        });
    });
}

// Sistema de FAQ
function initializeFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Fechar todos os outros
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Abrir/clicar atual
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Sistema de loja
function initializeStore() {
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = this.getAttribute('data-price');
            const currency = this.getAttribute('data-currency') || 'BRL';
            
            let message, confirmMessage;
            
            if (currency === 'verdelium') {
                message = `Confirmar compra de ${product} por ${price} Verdelium?`;
                confirmMessage = `Compra de ${product} confirmada! ${price} Verdelium foram debitados da sua conta.`;
            } else {
                message = `Confirmar compra de ${product} por R$ ${price},00?`;
                confirmMessage = `Compra de ${product} confirmada! Redirecionando para o pagamento...`;
            }
            
            if (confirm(message)) {
                showNotification(confirmMessage, 'success');
                
                // Simular redirecionamento para pagamento
                if (currency !== 'verdelium') {
                    setTimeout(() => {
                        window.location.href = CONFIG.storeURL;
                    }, 2000);
                }
            }
        });
    });
}

// Sistema de timeline
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }
}

// Sistema de contador de jogadores (exemplo)
function updatePlayerCount() {
    // Simular atualização de contador de jogadores
    const playerCountElements = document.querySelectorAll('.player-count');
    
    if (playerCountElements.length > 0) {
        // Número simulado - substituir por API real
        const fakeCount = Math.floor(Math.random() * 50) + 80;
        
        playerCountElements.forEach(element => {
            element.textContent = fakeCount;
        });
    }
}

// Atualizar contador a cada 30 segundos
setInterval(updatePlayerCount, 30000);
updatePlayerCount(); // Chamar inicialmente

// Sistema de detectar dispositivo
function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.add('desktop-device');
    }
}

detectDevice();

// Utilitários globais
window.VerdelisRP = {
    showNotification,
    updatePlayerCount,
    config: CONFIG
};

// Prevenir comportamentos indesejados
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// Loading da página
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Remover loading spinner se existir
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
});

// Manipular erros de imagem
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Imagem não carregada:', e.target.src);
    }
}, true);