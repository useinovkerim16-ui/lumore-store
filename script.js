// Данные о подписках
const subscriptionData = {
    individual: {
        name: 'Индивидуальная',
        prices: {
            1: 300,
            3: 1200,
            6: 1600,
            12: 2500
        }
    },
    duo: {
        name: 'Дуо',
        prices: {
            1: 450,
            3: 1600,
            6: 2100,
            12: 3300
        }
    },
    family: {
        name: 'Семейная',
        prices: {
            1: 600,
            3: 2000,
            6: 2600,
            12: 4100
        }
    }
};

// Глобальные переменные
let selectedPlan = null;
let selectedPeriod = null;
let selectedPrice = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializePriceSelection();
    initializeModal();
    initializeContactForm();
    initializeAnimations();
});

// Инициализация обработчиков событий
function initializeEventListeners() {
    // Обработчики для кнопок покупки
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.getAttribute('data-plan');
            const priceOptions = this.closest('.plan-card').querySelectorAll('.price-option');
            
            // Находим выбранную опцию цены
            let selectedOption = null;
            priceOptions.forEach(option => {
                if (option.classList.contains('selected')) {
                    selectedOption = option;
                }
            });
            
            if (selectedOption) {
                const period = selectedOption.getAttribute('data-period');
                const price = selectedOption.getAttribute('data-price');
                showPurchaseModal(plan, period, price);
            } else {
                alert('Пожалуйста, выберите период подписки');
            }
        });
    });
}

// Плавная прокрутка
function initializeSmoothScrolling() {
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
}

// Мобильное меню
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Выбор цены
function initializePriceSelection() {
    document.querySelectorAll('.price-option').forEach(option => {
        option.addEventListener('click', function() {
            // Убираем выделение с других опций в той же карточке
            const card = this.closest('.plan-card');
            card.querySelectorAll('.price-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Выделяем текущую опцию
            this.classList.add('selected');
        });
    });
}

// Модальное окно
function initializeModal() {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
    modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePurchaseModal();
            }
        });
    }
}

// Контактная форма
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Отправка через Formspree
            fetch('https://formspree.io/f/xpwgqkqk', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(response => {
                if (response.ok) {
                    showContactSuccess();
                    form.reset();
                } else {
                    showContactError();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showContactError();
            });
        });
    }
}

// Анимации
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.feature-card, .plan-card, .contact-item, .hero-content h1, .hero-content p, .hero-buttons').forEach(el => {
        observer.observe(el);
    });
}

// Показать модальное окно покупки
function showPurchaseModal(plan, period, price) {
    const modal = document.getElementById('purchaseModal');
    const modalContent = document.getElementById('purchaseModalContent');
    
    // Сохраняем данные заказа в глобальные переменные
    window.selectedPlan = plan;
    window.selectedPeriod = period;
    window.selectedPrice = price;
    
    modalContent.innerHTML = `
        <div class="purchase-header">
            <h3>Подтверждение заказа</h3>
            <button class="close-modal" onclick="closePurchaseModal()">&times;</button>
        </div>
        <form class="purchase-form">
            <div class="messenger-selection">
                <div class="messenger-options">
                    <label class="messenger-option">
                        <input type="radio" name="messenger" value="telegram" checked>
                        <span class="messenger-icon">📱</span>
                        <span>Telegram</span>
                    </label>
                    <label class="messenger-option">
                        <input type="radio" name="messenger" value="whatsapp">
                        <span class="messenger-icon">💬</span>
                        <span>WhatsApp</span>
                    </label>
                </div>
            </div>
            <input type="text" name="name" placeholder="Ваше имя" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="tel" name="phone" placeholder="Номер телефона" required>
            <button type="submit" class="confirm-button">Подтвердить покупку</button>
        </form>
    `;
    
    modal.style.display = 'flex';
    
    // Добавляем обработчик формы
    const form = modalContent.querySelector('.purchase-form');
    console.log('Найдена форма:', form);
    form.addEventListener('submit', handlePurchaseSubmit);
    console.log('Обработчик события добавлен');
}

// Закрыть модальное окно
function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    modal.style.display = 'none';
}

// Обработка отправки формы покупки
function handlePurchaseSubmit(e) {
    e.preventDefault();
    console.log('Форма отправлена!');
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const messenger = formData.get('messenger');
    
    console.log('Данные формы:', { name, email, phone, messenger });
    
    // Получаем данные заказа из глобальных переменных
    const plan = window.selectedPlan || 'Не указано';
    const period = window.selectedPeriod || 'Не указано';
    const price = window.selectedPrice || 'Не указано';
    
    // Формируем сообщение для клиента
    const message = `Привет! Хочу оформить заказ:

📋 Данные:
• Имя: ${name}
• Email: ${email}
• Телефон: ${phone}

🛒 Заказ:
• План: ${plan}
• Период: ${period}
• Цена: ${price}₽

Готов к оплате! 💳`;
    
    // Перенаправляем клиента в выбранный мессенджер
    console.log('Перенаправляем в мессенджер:', messenger);
    console.log('Сообщение для отправки:', message);
    
    if (messenger === 'telegram') {
        const telegramUrl = `https://t.me/VashBrat0?start=${encodeURIComponent(message)}`;
        console.log('Открываем Telegram:', telegramUrl);
        const newWindow = window.open(telegramUrl, '_blank');
        if (newWindow) {
            console.log('Окно Telegram открыто успешно');
        } else {
            console.log('Не удалось открыть окно Telegram - возможно заблокировано блокировщиком');
            alert('Не удалось открыть Telegram. Возможно, заблокировано блокировщиком рекламы. Попробуйте отключить блокировщик или скопируйте ссылку: ' + telegramUrl);
        }
    } else if (messenger === 'whatsapp') {
        const whatsappUrl = `https://wa.me/905073535468?text=${encodeURIComponent(message)}`;
        console.log('Открываем WhatsApp:', whatsappUrl);
        const newWindow = window.open(whatsappUrl, '_blank');
        if (newWindow) {
            console.log('Окно WhatsApp открыто успешно');
        } else {
            console.log('Не удалось открыть окно WhatsApp - возможно заблокировано блокировщиком');
            alert('Не удалось открыть WhatsApp. Возможно, заблокировано блокировщиком рекламы. Попробуйте отключить блокировщик или скопируйте ссылку: ' + whatsappUrl);
        }
    } else {
        console.log('Неизвестный мессенджер:', messenger);
        alert('Ошибка: неизвестный мессенджер');
    }
    
    alert('Отлично! Сейчас откроется чат с нами. Скопируйте и отправьте готовое сообщение!');
    closePurchaseModal();
}

// Покупка только аккаунта
function buyAccountOnly() {
    const modal = document.getElementById('purchaseModal');
    const modalContent = document.getElementById('purchaseModalContent');
    
    modalContent.innerHTML = `
        <div class="purchase-header">
            <h3>Подтверждение заказа</h3>
            <button class="close-modal" onclick="closePurchaseModal()">&times;</button>
        </div>
        <form class="purchase-form">
            <div class="messenger-selection">
                <div class="messenger-options">
                    <label class="messenger-option">
                        <input type="radio" name="messenger" value="telegram" checked>
                        <span class="messenger-icon">📱</span>
                        <span>Telegram</span>
                    </label>
                    <label class="messenger-option">
                        <input type="radio" name="messenger" value="whatsapp">
                        <span class="messenger-icon">💬</span>
                        <span>WhatsApp</span>
                    </label>
                </div>
            </div>
            <input type="text" name="name" placeholder="Ваше имя" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="tel" name="phone" placeholder="Номер телефона" required>
            <button type="submit" class="confirm-button">Подтвердить покупку</button>
        </form>
    `;
    
    modal.style.display = 'flex';
    
    // Добавляем обработчик формы
    const form = modalContent.querySelector('.purchase-form');
    console.log('Найдена форма в buyAccountOnly:', form);
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Форма buyAccountOnly отправлена!');
        
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const messenger = formData.get('messenger');
        
        console.log('Данные формы buyAccountOnly:', { name, email, phone, messenger });
        
        // Формируем сообщение для клиента
        const message = `Привет! Хочу оформить заказ:

📋 Данные:
• Имя: ${name}
• Email: ${email}
• Телефон: ${phone}

🛒 Заказ:
• Товар: Пустой аккаунт Spotify
• Цена: 100₽

Готов к оплате! 💳`;
        
        // Перенаправляем клиента в выбранный мессенджер
        console.log('Перенаправляем в мессенджер (account_only):', messenger);
        console.log('Сообщение для отправки (account_only):', message);
        
        if (messenger === 'telegram') {
            const telegramUrl = `https://t.me/VashBrat0?start=${encodeURIComponent(message)}`;
            console.log('Открываем Telegram (account_only):', telegramUrl);
            const newWindow = window.open(telegramUrl, '_blank');
            if (newWindow) {
                console.log('Окно Telegram открыто успешно (account_only)');
            } else {
                console.log('Не удалось открыть окно Telegram (account_only) - возможно заблокировано блокировщиком');
                alert('Не удалось открыть Telegram. Возможно, заблокировано блокировщиком рекламы. Попробуйте отключить блокировщик или скопируйте ссылку: ' + telegramUrl);
            }
        } else if (messenger === 'whatsapp') {
            const whatsappUrl = `https://wa.me/905073535468?text=${encodeURIComponent(message)}`;
            console.log('Открываем WhatsApp (account_only):', whatsappUrl);
            const newWindow = window.open(whatsappUrl, '_blank');
            if (newWindow) {
                console.log('Окно WhatsApp открыто успешно (account_only)');
            } else {
                console.log('Не удалось открыть окно WhatsApp (account_only) - возможно заблокировано блокировщиком');
                alert('Не удалось открыть WhatsApp. Возможно, заблокировано блокировщиком рекламы. Попробуйте отключить блокировщик или скопируйте ссылку: ' + whatsappUrl);
            }
        } else {
            console.log('Неизвестный мессенджер (account_only):', messenger);
            alert('Ошибка: неизвестный мессенджер');
        }
        
        alert('Отлично! Сейчас откроется чат с нами. Скопируйте и отправьте готовое сообщение!');
        closePurchaseModal();
    });
}

// Показать успешное сообщение контакта
function showContactSuccess() {
    const alert = document.createElement('div');
    alert.className = 'contact-success';
    alert.innerHTML = `
        <div class="success-alert">
            <i class="fas fa-check-circle"></i>
            <span>Сообщение отправлено успешно!</span>
        </div>
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Показать ошибку контакта
function showContactError() {
    const alert = document.createElement('div');
    alert.className = 'contact-error';
    alert.innerHTML = `
        <div class="error-alert">
            <i class="fas fa-exclamation-circle"></i>
            <span>Ошибка отправки сообщения</span>
        </div>
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
