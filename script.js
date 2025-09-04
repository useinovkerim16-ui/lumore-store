// Данные о подписках
const subscriptionData = {
    individual: {
        name: 'Индивидуальная',
        prices: {
            1: 300,
            3: 600,
            6: 1500,
            12: 3000
        }
    },
    duo: {
        name: 'Дуо',
        prices: {
            1: 450,
            3: 750,
            6: 2000,
            12: 4500
        }
    },
    family: {
        name: 'Семейная',
        prices: {
            1: 600,
            3: 900,
            6: 2500,
            12: 5000
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
    const buyButtons = document.querySelectorAll('.buy-button');
    buyButtons.forEach(button => {
        button.addEventListener('click', handleBuyButtonClick);
    });

    // Обработчики для выбора периода
    const priceOptions = document.querySelectorAll('.price-option');
    priceOptions.forEach(option => {
        option.addEventListener('click', handlePriceOptionClick);
    });
}

// Плавная прокрутка для навигации
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
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

// Выбор периода и цены
function initializePriceSelection() {
    const priceOptions = document.querySelectorAll('.price-option');
    
    priceOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Убираем выделение со всех опций в этой карточке
            const card = this.closest('.plan-card');
            const allOptionsInCard = card.querySelectorAll('.price-option');
            allOptionsInCard.forEach(opt => opt.classList.remove('selected'));
            
            // Выделяем выбранную опцию
            this.classList.add('selected');
            
            // Обновляем данные о выборе
            selectedPlan = this.dataset.plan;
            selectedPeriod = parseInt(this.dataset.period);
            selectedPrice = parseInt(this.dataset.price);
            
            // Обновляем текст кнопки
            const buyButton = card.querySelector('.buy-button');
            if (buyButton) {
                buyButton.textContent = `Купить за ${selectedPrice}₽`;
            }
        });
    });
}

// Обработка клика по кнопке покупки
function handleBuyButtonClick(e) {
    const planType = e.target.dataset.plan;
    const card = e.target.closest('.plan-card');
    const selectedOption = card.querySelector('.price-option.selected');
    
    if (!selectedOption) {
        // Если период не выбран, выбираем первый по умолчанию
        const firstOption = card.querySelector('.price-option');
        firstOption.classList.add('selected');
        selectedPlan = firstOption.dataset.plan;
        selectedPeriod = parseInt(firstOption.dataset.period);
        selectedPrice = parseInt(firstOption.dataset.price);
    }
    
    showPurchaseModal();
}

// Обработка клика по опции цены
function handlePriceOptionClick(e) {
    const card = e.target.closest('.plan-card');
    const allOptionsInCard = card.querySelectorAll('.price-option');
    
    // Убираем выделение со всех опций в этой карточке
    allOptionsInCard.forEach(opt => opt.classList.remove('selected'));
    
    // Выделяем выбранную опцию
    e.target.closest('.price-option').classList.add('selected');
    
    // Обновляем данные о выборе
    selectedPlan = e.target.closest('.price-option').dataset.plan;
    selectedPeriod = parseInt(e.target.closest('.price-option').dataset.period);
    selectedPrice = parseInt(e.target.closest('.price-option').dataset.price);
    
    // Обновляем текст кнопки
    const buyButton = card.querySelector('.buy-button');
    if (buyButton) {
        buyButton.textContent = `Купить за ${selectedPrice}₽`;
    }
}

// Модальное окно покупки
function initializeModal() {
    const modal = document.getElementById('purchaseModal');
    const closeBtn = modal.querySelector('.close');
    
    // Закрытие по клику на крестик
    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Показать модальное окно покупки
function showPurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    const modalContent = document.getElementById('modalContent');
    
    if (selectedPlan && selectedPeriod && selectedPrice) {
        const planData = subscriptionData[selectedPlan];
        const periodText = getPeriodText(selectedPeriod);
        
        modalContent.innerHTML = `
            <div class="purchase-summary">
                <h3>Подтверждение покупки</h3>
                <div class="purchase-details">
                    <div class="detail-item">
                        <span class="label">Тип подписки:</span>
                        <span class="value">${planData.name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Период:</span>
                        <span class="value">${periodText}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Стоимость:</span>
                        <span class="value">${selectedPrice}₽</span>
                    </div>
                </div>
                <form class="purchase-form">
                    <input type="text" placeholder="Ваше имя" required>
                    <input type="email" placeholder="Email" required>
                    <input type="tel" placeholder="Номер телефона" required>
                    <button type="submit" class="confirm-button">Подтвердить покупку</button>
                </form>
            </div>
        `;
        
        // Обработчик формы покупки
        const purchaseForm = modalContent.querySelector('.purchase-form');
        purchaseForm.addEventListener('submit', handlePurchaseSubmit);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Закрыть модальное окно
function closeModal() {
    const modal = document.getElementById('purchaseModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Обработка отправки формы покупки
function handlePurchaseSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const phone = formData.get('phone') || e.target.querySelector('input[type="tel"]').value;
    
    // Отправляем заказ админу через Telegram-бота
    fetch('http://localhost:8080/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: 'subscription',
            plan: selectedPlan,
            period: selectedPeriod,
            price: selectedPrice,
            name,
            email,
            phone
        })
    })
    .then(r => r.json())
    .then(() => {
        showSuccessMessage();
    })
    .catch(() => {
        showContactError('Не удалось отправить заказ. Попробуйте ещё раз.');
    });
}

// Показать сообщение об успешной покупке
function showSuccessMessage() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Покупка оформлена!</h3>
            <p>Спасибо за покупку! Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
            <button class="close-success" onclick="closeModal()">Закрыть</button>
        </div>
    `;
}

// Получить текст периода
function getPeriodText(period) {
    const periodTexts = {
        1: '1 месяц',
        3: '3 месяца',
        6: '6 месяцев',
        12: '12 месяцев'
    };
    return periodTexts[period] || `${period} месяцев`;
}

// Инициализация формы контактов
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем данные формы
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Валидация на клиенте
            if (!name || !email || !message) {
                showContactError('Пожалуйста, заполните все поля');
                return;
            }
            
            if (!isValidEmail(email)) {
                showContactError('Пожалуйста, введите корректный email адрес');
                return;
            }
            
            const submitButton = this.querySelector('.submit-button');
            const originalText = submitButton.textContent;
            
            // Показываем индикатор загрузки
            submitButton.textContent = '📤 Отправка...';
            submitButton.disabled = true;
            
            // Добавляем дополнительную информацию
            formData.append('timestamp', new Date().toISOString());
            formData.append('user_agent', navigator.userAgent);
            
            // Отправляем данные на Formspree
            fetch('https://formspree.io/f/xpwgqkqk', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showContactSuccess(data.message);
                    this.reset();
                    
                    // Отправляем событие в Google Analytics (если есть)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'contact',
                            'event_label': 'contact_form'
                        });
                    }
                } else {
                    showContactError(data.message);
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                showContactError('Произошла ошибка при отправке. Попробуйте еще раз или свяжитесь с нами через Telegram.');
            })
            .finally(() => {
                // Восстанавливаем кнопку
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            });
        });
        
        // Добавляем валидацию в реальном времени
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
}

// Функция валидации email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция валидации поля
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Убираем предыдущие ошибки
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Проверяем поле
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Имя должно содержать минимум 2 символа';
            }
            break;
        case 'email':
            if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            }
            break;
        case 'message':
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Сообщение должно содержать минимум 10 символов';
            }
            break;
    }
    
    // Показываем ошибку если есть
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    }
    
    return isValid;
}

// Показать сообщение об успешной отправке формы контактов
function showContactSuccess(message = 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.') {
    const contactSection = document.querySelector('.contact');
    const successMessage = document.createElement('div');
    successMessage.className = 'contact-success';
    successMessage.innerHTML = `
        <div class="success-alert">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    contactSection.appendChild(successMessage);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

// Показать сообщение об ошибке
function showContactError(message) {
    const contactSection = document.querySelector('.contact');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'contact-error';
    errorMessage.innerHTML = `
        <div class="error-alert">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    contactSection.appendChild(errorMessage);
    
    // Удаляем сообщение через 5 секунд
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// Инициализация анимаций
function initializeAnimations() {
    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами для анимации
    const animateElements = document.querySelectorAll('.feature-card, .plan-card, .contact-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Функция покупки только аккаунта
function buyAccountOnly() {
    const modal = document.getElementById('purchaseModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <div class="purchase-summary">
            <h3>Покупка аккаунта Spotify Premium</h3>
            <div class="purchase-details">
                <div class="detail-item">
                    <span class="label">Товар:</span>
                    <span class="value">Готовый аккаунт Spotify Premium</span>
                </div>
                <div class="detail-item">
                    <span class="label">Стоимость:</span>
                    <span class="value">100₽</span>
                </div>
                <div class="detail-item">
                    <span class="label">Доставка:</span>
                    <span class="value">Мгновенно</span>
                </div>
            </div>
            <form class="purchase-form">
                <input type="text" placeholder="Ваше имя" required>
                <input type="email" placeholder="Email" required>
                <input type="tel" placeholder="Номер телефона" required>
                <button type="submit" class="confirm-button">Купить аккаунт за 100₽</button>
            </form>
        </div>
    `;
    
    // Обработчик формы покупки аккаунта
    const purchaseForm = modalContent.querySelector('.purchase-form');
    purchaseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const phone = formData.get('phone') || e.target.querySelector('input[type="tel"]').value;
        
        // Отправляем заказ только аккаунта админу через Telegram-бота
        fetch('http://localhost:8080/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'account_only',
                name,
                email,
                phone
            })
        })
        .then(r => r.json())
        .then(() => {
            showAccountSuccessMessage();
        })
        .catch(() => {
            showContactError('Не удалось отправить заказ. Попробуйте ещё раз.');
        });
    });
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Показать сообщение об успешной покупке аккаунта
function showAccountSuccessMessage() {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="success-message">
            <i class="fas fa-user-check"></i>
            <h3>Аккаунт заказан!</h3>
            <p>Спасибо за заказ! Мы свяжемся с вами в ближайшее время для передачи данных аккаунта.</p>
            <p><strong>Стоимость: 100₽</strong></p>
            <button class="close-success" onclick="closeModal()">Закрыть</button>
        </div>
    `;
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    .feature-card, .plan-card, .contact-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .feature-card.animate-in, .plan-card.animate-in, .contact-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .purchase-summary {
        text-align: center;
    }
    
    .purchase-details {
        margin: 2rem 0;
        text-align: left;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .detail-item:last-child {
        border-bottom: none;
    }
    
    .purchase-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .purchase-form input {
        padding: 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        font-size: 1rem;
    }
    
    .purchase-form input:focus {
        outline: none;
        border-color: #1DB954;
    }
    
    .confirm-button {
        background: #1DB954;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .confirm-button:hover {
        background: #4CAF50;
    }
    
    .success-message {
        text-align: center;
        padding: 2rem 0;
    }
    
    .success-message i {
        font-size: 4rem;
        color: #1DB954;
        margin-bottom: 1rem;
    }
    
    .success-message h3 {
        margin-bottom: 1rem;
        color: #333;
    }
    
    .success-message p {
        color: #666;
        margin-bottom: 2rem;
    }
    
    .close-success {
        background: #1DB954;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .close-success:hover {
        background: #4CAF50;
    }
    
    .contact-success {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    }
    
    .success-alert {
        background: #1DB954;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 10px 30px rgba(29, 185, 84, 0.3);
    }
    
    .success-alert i {
        font-size: 1.5rem;
    }
    
    .contact-error {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    }
    
    .error-alert {
        background: #f44336;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 10px 30px rgba(244, 67, 54, 0.3);
    }
    
    .error-alert i {
        font-size: 1.5rem;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        padding: 2rem;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;

document.head.appendChild(style);
