let tg = window.Telegram.WebApp;
tg.expand();

// Список поддерживаемых банков
const banks = [
    { id: 'sber', name: 'Сбербанк', icon: '🏦' },
    { id: 'tinkoff', name: 'Т-банк', icon: '🏦' },
    { id: 'alfa', name: 'Альфа банк', icon: '🏦' },
    { id: 'raif', name: 'Райффайзен', icon: '🏦' },
    { id: 'vtb', name: 'ВТБ', icon: '🏦' },
    { id: 'otp', name: 'ОТП', icon: '🏦' },
    { id: 'ozon', name: 'Озон', icon: '🏦' },
    { id: 'psb', name: 'ПСБ', icon: '🏦' },
    { id: 'yandex', name: 'Яндекс', icon: '🏦' },
    { id: 'uralsib', name: 'Уралсиб', icon: '🏦' },
    { id: 'mts-money', name: 'МТС деньги', icon: '🏦' },
    { id: 'mts-wallet', name: 'Кошелек (МТС)', icon: '🏦' },
    { id: 'mts-bank', name: 'МТС Банк', icon: '🏦' },
    { id: 'gazprom', name: 'Газпромбанк', icon: '🏦' },
    { id: 'sovkom', name: 'Совкомбанк', icon: '🏦' },
    { id: 'russia', name: 'АБ Россия', icon: '🏦' },
    { id: 'pochta', name: 'Почта Банк', icon: '🏦' },
    { id: 'domrf', name: 'Дом.РФ', icon: '🏦' },
    { id: 'rosselhoz', name: 'Россельхозбанк', icon: '🏦' },
    { id: 'mkb', name: 'МКБ', icon: '🏦' },
    { id: 'ubrir', name: 'УБРиР', icon: '🏦' }
];

// Генерация карточек банков
function generateBankCards() {
    const banksGrid = document.querySelector('.banks-grid');
    banksGrid.innerHTML = banks.map(bank => `
        <div class="bank-card active" data-bank="${bank.id}">
            <span class="bank-icon">${bank.icon}</span>
            <span class="bank-name">${bank.name}</span>
        </div>
    `).join('');
}

// Обработка загрузки файла
function handleFileUpload(file) {
    if (file.type !== 'application/pdf') {
        alert('Пожалуйста, загрузите PDF файл');
        return;
    }

    showLoading();
    
    // Здесь будет логика проверки чека
    setTimeout(() => {
        hideLoading();
        addToHistory(file.name);
    }, 1500);
}

// Добавление записи в историю
function addToHistory(fileName) {
    const historyList = document.getElementById('historyList');
    const date = new Date().toLocaleString();
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div style="flex: 1">
            <div style="font-weight: 500">${fileName}</div>
            <div style="color: var(--text-secondary); font-size: 12px">${date}</div>
        </div>
        <span style="color: var(--success)">✓</span>
    `;
    
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Показ/скрытие индикатора загрузки
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    generateBankCards();
    
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');

    // Обработка клика по кнопке загрузки
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Обработка выбора файла
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Обработка drag & drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });
});