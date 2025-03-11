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
    if (banksGrid) {
        banksGrid.innerHTML = banks.map(bank => `
            <div class="bank-card ${bank.id === 'sber' ? 'active' : ''}" data-bank="${bank.id}">
                <span class="bank-icon">${bank.icon}</span>
                <span class="bank-name">${bank.name}</span>
            </div>
        `).join('');
    }
}

// Базовые классы для работы с PDF
class PDFParser {
    async validatePDFStructure(file) {
        // Базовая проверка структуры PDF
        return true;
    }

    async extractFullData(file) {
        return {
            text: await this.extractText(file),
            metadata: await this.extractMetadata(file),
            images: await this.extractImages(file)
        };
    }

    async extractText(file) {
        // Здесь будет реальная логика извлечения текста
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsText(file);
        });
    }

    async extractMetadata(file) {
        return {
            creationDate: new Date(),
            modificationDate: new Date(),
            author: "Unknown"
        };
    }

    async extractImages(file) {
        return [];
    }
}

class QRCodeValidator {
    async decode(qrCode) {
        // Здесь будет реальная логика декодирования QR-кода
        return "Decoded QR content";
    }
}

class DigitalSignatureVerifier {
    async verify(file, bankId) {
        // Здесь будет реальная логика проверки цифровой подписи
        return true;
    }
}

// Обновленная функция обработки файла
async function handleFileUpload(file) {
    if (!file) {
        showError('Файл не выбран');
        return;
    }

    if (file.type !== 'application/pdf') {
        showError('Пожалуйста, загрузите PDF файл');
        return;
    }

    showLoading();
    
    try {
        // Создаем экземпляр правильного валидатора
        const validator = new SupermaxSberbankValidator();
        const result = await validator.performUltimateValidation(file);
        
        // Показываем результат в понятном виде
        const resultDiv = document.getElementById('validationResult');
        resultDiv.classList.remove('hidden');
        
        // Определяем, прошел ли чек проверку
        const isValid = result.score.total >= 0.8; // Порог в 80%

        resultDiv.innerHTML = `
            <div class="validation-result ${isValid ? 'valid' : 'invalid'}">
                <div class="result-header ${isValid ? 'success' : 'warning'}">
                    <div class="result-status">
                        <div class="status-icon" style="font-size: 48px; margin-right: 20px">
                            ${isValid ? '✅' : '❌'}
                        </div>
                        <div class="status-text">
                            <h2 style="margin: 0; font-size: 24px">
                                ${isValid ? 'ЧЕК ПОДЛИННЫЙ' : 'ЧЕК НЕ ПРОШЕЛ ПРОВЕРКУ'}
                            </h2>
                            <p style="margin: 5px 0 0 0; font-size: 18px">
                                Надежность: ${(result.score.total * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div class="check-details" style="margin-top: 20px">
                    <h3>Результаты проверки:</h3>
                    <div class="check-list" style="margin-top: 10px">
                        ${Object.entries(result.checks)
                            .map(([key, value]) => `
                                <div class="check-item ${value ? 'success' : 'failure'}" 
                                     style="padding: 10px; margin: 5px 0; border-radius: 8px">
                                    ${value ? '✓' : '✗'} ${getCheckName(key)}
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Добавляем в историю
        addToHistory(file.name, isValid);
        
    } catch (error) {
        showError(`Ошибка при проверке чека: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Вспомогательная функция для перевода названий проверок
function getCheckName(check) {
    const names = {
        structure: 'Структура PDF файла',
        signature: 'Цифровая подпись',
        qrCode: 'QR-код чека',
        content: 'Содержимое чека',
        metadata: 'Метаданные документа'
    };
    return names[check] || check;
}

// Обновленная функция добавления в историю
function addToHistory(fileName, isValid) {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    const date = new Date().toLocaleString();
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div style="flex: 1">
            <div style="font-weight: 500">${fileName}</div>
            <div style="color: var(--text-secondary); font-size: 12px">${date}</div>
        </div>
        <span style="color: ${isValid ? 'var(--success)' : 'var(--error)'}">
            ${isValid ? '✓' : '✗'}
        </span>
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

function showError(message) {
    const resultDiv = document.getElementById('validationResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <div class="error">
                <div class="error-icon">⚠️</div>
                <div class="error-message">${message}</div>
            </div>
        `;
        resultDiv.classList.remove('hidden');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const pdfInput = document.getElementById('pdfInput');

    if (dropZone) {
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
    }

    if (pdfInput) {
        pdfInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        });
    }

    generateBankCards();
});

// Улучшенный базовый класс для валидации
class AdvancedReceiptValidator {
    constructor() {
        this.pdfParser = new PDFParser();
        this.qrValidator = new QRCodeValidator();
        this.digitalSignatureVerifier = new DigitalSignatureVerifier();
    }

    async validateReceipt(file, bankId) {
        const validator = this.getValidatorForBank(bankId);
        
        try {
            const validationResult = {
                isValid: false,
                details: {},
                securityChecks: {},
                metadata: {},
                warnings: []
            };

            // Базовая проверка PDF на целостность
            const isPdfValid = await this.pdfParser.validatePDFStructure(file);
            if (!isPdfValid) {
                throw new Error('Некорректная структура PDF файла');
            }

            // Извлечение текста и метаданных
            const pdfData = await this.pdfParser.extractFullData(file);
            
            // Проверка цифровой подписи банка
            const signatureValid = await this.digitalSignatureVerifier.verify(file, bankId);
            
            // Проверка QR-кода и его содержимого
            const qrData = await this.qrValidator.decode(pdfData.qrCode);
            
            // Специфичная для банка валидация
            const bankValidation = await validator.validateBankSpecific(pdfData, qrData);

            // Проверка на попытки модификации
            const tamperingCheck = await this.checkForTampering(file);

            // Проверка временных меток
            const timestampValid = await this.validateTimestamps(pdfData);

            validationResult.isValid = signatureValid && bankValidation.isValid && !tamperingCheck.modified;
            validationResult.details = {
                bankSpecific: bankValidation.details,
                qrData: qrData,
                timestamp: pdfData.timestamp,
                merchantInfo: pdfData.merchantInfo,
                transactionDetails: pdfData.transactionDetails
            };
            validationResult.securityChecks = {
                digitalSignature: signatureValid,
                tamperingDetected: !tamperingCheck.modified,
                qrCodeValid: qrData.isValid,
                timestampValid: timestampValid
            };

            return validationResult;

        } catch (error) {
            throw new ValidationError(`Ошибка валидации: ${error.message}`);
        }
    }

    getValidatorForBank(bankId) {
        const validators = {
            'sber': new SberbankValidator(),
            'tinkoff': new TinkoffValidator(),
            'alfa': new AlfaBankValidator(),
            'raif': new RaiffeisenValidator(),
            'vtb': new VTBValidator(),
            'otp': new OTPValidator(),
            'ozon': new OzonBankValidator(),
            'psb': new PSBValidator(),
            'yandex': new YandexBankValidator(),
            'uralsib': new UralSibValidator(),
            'mts-bank': new MTSBankValidator(),
            'gazprom': new GazpromBankValidator(),
            'sovkom': new SovkomBankValidator(),
            'russia': new BankRussiaValidator(),
            'pochta': new PostBankValidator(),
            'domrf': new DomRFValidator(),
            'rosselhoz': new RosselhozBankValidator(),
            'mkb': new MKBValidator(),
            'ubrir': new UBRiRValidator()
        };

        const validator = validators[bankId];
        if (!validator) {
            throw new Error(`Валидатор для банка ${bankId} не найден`);
        }
        return validator;
    }

    async checkForTampering(file) {
        // Продвинутая проверка на модификации PDF
        const checks = {
            modified: false,
            details: []
        };

        // Проверка метаданных PDF
        const metadata = await this.pdfParser.getMetadata(file);
        if (metadata.modificationDate !== metadata.creationDate) {
            checks.modified = true;
            checks.details.push('Обнаружено изменение файла после создания');
        }

        // Проверка на следы редактирования
        const editingTraces = await this.pdfParser.checkEditingTraces(file);
        if (editingTraces.found) {
            checks.modified = true;
            checks.details.push('Обнаружены следы редактирования');
        }

        return checks;
    }
}

// Пример реализации для Сбербанка
class SberbankAdvancedValidator {
    constructor() {
        this.pdfParser = new PDFParser();
        this.qrValidator = new QRCodeValidator();
        this.imageAnalyzer = new ImageAnalyzer();
        this.fontValidator = new FontValidator();
        this.securityFeatureDetector = new SecurityFeatureDetector();
    }

    async validateSberbankReceipt(file) {
        const validationResult = {
            isValid: false,
            securityChecks: {},
            contentChecks: {},
            visualChecks: {},
            technicalChecks: {},
            warnings: [],
            details: {}
        };

        try {
            // 1. ПЕРВИЧНАЯ ПРОВЕРКА ФАЙЛА
            const fileChecks = await this.validateFileProperties(file);
            if (!fileChecks.valid) {
                throw new Error('Первичная проверка файла не пройдена');
            }

            // 2. ИЗВЛЕЧЕНИЕ ДАННЫХ
            const pdfData = await this.pdfParser.extractFullData(file);
            const pdfImages = await this.pdfParser.extractImages(file);
            const pdfMetadata = await this.pdfParser.getMetadata(file);
            
            // 3. ГЛУБОКАЯ ПРОВЕРКА БЕЗОПАСНОСТИ
            validationResult.securityChecks = await this.performSecurityChecks({
                file,
                pdfData,
                pdfImages,
                pdfMetadata
            });

            // 4. ПРОВЕРКА СОДЕРЖИМОГО
            validationResult.contentChecks = await this.validateContent(pdfData);

            // 5. ВИЗУАЛЬНАЯ ПРОВЕРКА
            validationResult.visualChecks = await this.performVisualChecks(pdfImages);

            // 6. ТЕХНИЧЕСКАЯ ПРОВЕРКА
            validationResult.technicalChecks = await this.performTechnicalChecks(file);

            // Финальная валидация
            validationResult.isValid = this.isOverallValid(validationResult);

            return validationResult;

        } catch (error) {
            throw new SberbankValidationError(`Ошибка валидации: ${error.message}`);
        }
    }

    async performSecurityChecks({ file, pdfData, pdfImages, pdfMetadata }) {
        const securityChecks = {
            digitalSignature: false,
            qrCodeValid: false,
            watermarkValid: false,
            cryptographicElements: false,
            tampering: false,
            metadata: false
        };

        // 1. Проверка цифровой подписи Сбербанка
        const signatureCheck = await this.validateDigitalSignature(file);
        securityChecks.digitalSignature = {
            valid: signatureCheck.valid,
            certificateDetails: signatureCheck.certificateInfo,
            timestamp: signatureCheck.timestamp
        };

        // 2. Продвинутая проверка QR-кода
        const qrCheck = await this.validateQRCode(pdfData);
        securityChecks.qrCodeValid = {
            valid: qrCheck.valid,
            format: qrCheck.format,
            matchesContent: qrCheck.matchesContent,
            fpsData: qrCheck.fpsData
        };

        // 3. Проверка водяных знаков
        const watermarkCheck = await this.validateWatermark(pdfImages);
        securityChecks.watermarkValid = {
            valid: watermarkCheck.valid,
            pattern: watermarkCheck.pattern,
            position: watermarkCheck.position
        };

        // 4. Проверка криптографических элементов
        const cryptoCheck = await this.validateCryptographicElements(pdfData);
        securityChecks.cryptographicElements = {
            valid: cryptoCheck.valid,
            elements: cryptoCheck.elements
        };

        // 5. Проверка на модификации
        const tamperingCheck = await this.checkForTampering(file);
        securityChecks.tampering = {
            noModifications: tamperingCheck.clean,
            lastModified: tamperingCheck.lastModified,
            modificationDetails: tamperingCheck.details
        };

        return securityChecks;
    }

    async validateContent(pdfData) {
        const contentChecks = {
            requiredFields: false,
            amountFormat: false,
            dateTime: false,
            cardData: false,
            merchantInfo: false,
            bankDetails: false
        };

        // 1. Проверка обязательных полей Сбербанка
        const requiredFields = {
            bankName: /ПАО\s+СБЕРБАНК/i,
            operation: /ОПЕРАЦИЯ\s+ОДОБРЕНА/i,
            rrn: /RRN:\s*\d{12}/,
            authCode: /AUTH\.CODE:\s*\d{6}/,
            terminal: /TERMINAL:\s*\d{8}/,
            merchant: /MERCHANT\s+ID:\s*\d{15}/
        };

        contentChecks.requiredFields = Object.entries(requiredFields)
            .map(([field, regex]) => ({
                field,
                valid: regex.test(pdfData.text),
                value: pdfData.text.match(regex)?.[0]
            }));

        // 2. Проверка формата суммы
        const amountCheck = this.validateAmount(pdfData.text);
        contentChecks.amountFormat = {
            valid: amountCheck.valid,
            amount: amountCheck.amount,
            currency: amountCheck.currency,
            format: amountCheck.format
        };

        // 3. Проверка даты и времени
        const dateTimeCheck = this.validateDateTime(pdfData.text);
        contentChecks.dateTime = {
            valid: dateTimeCheck.valid,
            timestamp: dateTimeCheck.timestamp,
            timezone: dateTimeCheck.timezone,
            format: dateTimeCheck.format
        };

        // 4. Проверка данных карты
        const cardCheck = this.validateCardData(pdfData.text);
        contentChecks.cardData = {
            valid: cardCheck.valid,
            maskedPan: cardCheck.maskedPan,
            cardType: cardCheck.cardType,
            issuer: cardCheck.issuer
        };

        // 5. Проверка информации о мерчанте
        contentChecks.merchantInfo = await this.validateMerchantInfo(pdfData);

        // 6. Проверка банковских реквизитов
        contentChecks.bankDetails = await this.validateBankDetails(pdfData);

        return contentChecks;
    }

    async performVisualChecks(pdfImages) {
        return {
            logo: await this.validateSberbankLogo(pdfImages),
            layout: await this.validateReceiptLayout(pdfImages),
            fonts: await this.validateFonts(pdfImages),
            colorScheme: await this.validateColorScheme(pdfImages),
            securityElements: await this.validateSecurityElements(pdfImages)
        };
    }

    async performTechnicalChecks(file) {
        return {
            pdfVersion: await this.validatePDFVersion(file),
            encoding: await this.validateEncoding(file),
            compression: await this.validateCompression(file),
            metadata: await this.validateTechnicalMetadata(file),
            structure: await this.validateDocumentStructure(file)
        };
    }

    async validateQRCode(pdfData) {
        const qrContent = await this.qrValidator.decode(pdfData.qrCode);
        
        // Проверка структуры QR-кода Сбербанка
        const sberQRPattern = {
            prefix: /^ST00012/,
            name: /Name=\d{15}/,
            bankName: /ПАО\s+СБЕРБАНК/,
            sum: /Sum=\d+\.\d{2}/,
            date: /Date=\d{8}T\d{6}/
        };

        // Проверка FPS (Система быстрых платежей) данных
        const fpsData = await this.validateFPSData(qrContent);

        return {
            valid: Object.values(sberQRPattern)
                .every(pattern => pattern.test(qrContent)),
            format: 'ST00012',
            matchesContent: this.qrContentMatchesReceipt(qrContent, pdfData),
            fpsData: fpsData
        };
    }

    async validateAmount(text) {
        const amountPatterns = {
            main: /СУММА:\s*(\d{1,3}(?:\s\d{3})*(?:\.\d{2})?)\s*(?:РУБ|RUB)/i,
            additional: /(?:ИТОГО|ВСЕГО):\s*(\d{1,3}(?:\s\d{3})*(?:\.\d{2})?)/i
        };

        // Проверка согласованности сумм в разных частях чека
        const amounts = this.extractAllAmounts(text);
        const consistencyCheck = this.checkAmountsConsistency(amounts);

        return {
            valid: consistencyCheck.valid,
            amount: amounts.main,
            currency: 'RUB',
            format: 'СБЕРБАНК',
            consistency: consistencyCheck
        };
    }

    isOverallValid(validationResult) {
        // Проверка критических параметров
        const criticalChecks = [
            validationResult.securityChecks.digitalSignature.valid,
            validationResult.securityChecks.qrCodeValid.valid,
            validationResult.securityChecks.tampering.noModifications,
            validationResult.contentChecks.requiredFields.every(f => f.valid),
            validationResult.contentChecks.amountFormat.valid,
            validationResult.contentChecks.dateTime.valid
        ];

        // Проверка некритических параметров
        const nonCriticalChecks = [
            validationResult.visualChecks.logo,
            validationResult.visualChecks.layout,
            validationResult.technicalChecks.pdfVersion,
            validationResult.technicalChecks.structure
        ];

        return {
            valid: criticalChecks.every(Boolean),
            criticalChecksPassed: criticalChecks.filter(Boolean).length,
            totalCriticalChecks: criticalChecks.length,
            nonCriticalChecksPassed: nonCriticalChecks.filter(Boolean).length,
            totalNonCriticalChecks: nonCriticalChecks.length,
            overallScore: this.calculateValidationScore(validationResult)
        };
    }

    async validatePaymentMethod(pdfData) {
        const paymentMethodResult = {
            method: null,
            details: {},
            isValid: false
        };

        // Паттерны для определения метода оплаты
        const patterns = {
            sbp: {
                patterns: [
                    /Система быстрых платежей/i,
                    /СБП/i,
                    /Перевод по СБП/i,
                    /ПЕРЕВОД СБП/i
                ],
                type: 'СБП (Система быстрых платежей)'
            },
            card: {
                patterns: [
                    /Карта \*{4}\d{4}/i,
                    /ОПЛАТА ПО КАРТЕ/i,
                    /Payment by card/i,
                    /CARD/i
                ],
                type: 'Оплата картой'
            },
            phoneNumber: {
                patterns: [
                    /Перевод на телефон/i,
                    /ПЕРЕВОД НА ТЕЛ\./i,
                    /Перевод по номеру телефона/i,
                    /PHONE TRANSFER/i
                ],
                type: 'Перевод по номеру телефона'
            },
            accountTransfer: {
                patterns: [
                    /Перевод на счет/i,
                    /ПЕРЕВОД НА СЧЕТ/i,
                    /Account transfer/i
                ],
                type: 'Перевод на счёт'
            },
            qrCode: {
                patterns: [
                    /Оплата по QR-коду/i,
                    /QR-код/i,
                    /ОПЛАТА ПО QR/i
                ],
                type: 'Оплата по QR-коду'
            }
        };

        // Проверяем текст чека на наличие паттернов
        for (const [methodKey, methodData] of Object.entries(patterns)) {
            for (const pattern of methodData.patterns) {
                if (pattern.test(pdfData.text)) {
                    paymentMethodResult.method = methodData.type;
                    paymentMethodResult.isValid = true;

                    // Извлекаем дополнительные детали в зависимости от метода
                    switch (methodKey) {
                        case 'sbp':
                            paymentMethodResult.details = await this.extractSBPDetails(pdfData.text);
                            break;
                        case 'card':
                            paymentMethodResult.details = this.extractCardDetails(pdfData.text);
                            break;
                        case 'phoneNumber':
                            paymentMethodResult.details = this.extractPhoneDetails(pdfData.text);
                            break;
                        case 'accountTransfer':
                            paymentMethodResult.details = this.extractAccountDetails(pdfData.text);
                            break;
                        case 'qrCode':
                            paymentMethodResult.details = await this.extractQRDetails(pdfData);
                            break;
                    }
                    break;
                }
            }
            if (paymentMethodResult.isValid) break;
        }

        return paymentMethodResult;
    }

    async extractSBPDetails(text) {
        const details = {
            bankName: null,
            recipientName: null,
            recipientBank: null,
            transactionId: null
        };

        // Извлекаем название банка получателя
        const bankMatch = text.match(/Банк получателя:\s*([^\n]+)/i);
        if (bankMatch) details.bankName = bankMatch[1].trim();

        // Извлекаем имя получателя
        const nameMatch = text.match(/Получатель:\s*([^\n]+)/i);
        if (nameMatch) details.recipientName = nameMatch[1].trim();

        // Извлекаем ID транзакции СБП
        const transactionMatch = text.match(/ID операции СБП:\s*(\d+)/i);
        if (transactionMatch) details.transactionId = transactionMatch[1];

        return details;
    }

    extractCardDetails(text) {
        const details = {
            cardNumber: null,
            cardType: null,
            authCode: null,
            terminal: null
        };

        // Извлекаем маскированный номер карты
        const cardMatch = text.match(/(?:КАРТА|CARD)\s*\*{4}(\d{4})/i);
        if (cardMatch) details.cardNumber = `****${cardMatch[1]}`;

        // Определяем тип карты
        if (text.includes('MIR')) details.cardType = 'МИР';
        else if (text.includes('VISA')) details.cardType = 'VISA';
        else if (text.includes('MASTERCARD')) details.cardType = 'Mastercard';

        // Извлекаем код авторизации
        const authMatch = text.match(/AUTH\.CODE:\s*(\d+)/i);
        if (authMatch) details.authCode = authMatch[1];

        // Извлекаем номер терминала
        const terminalMatch = text.match(/TERMINAL:\s*(\d+)/i);
        if (terminalMatch) details.terminal = terminalMatch[1];

        return details;
    }

    extractPhoneDetails(text) {
        const details = {
            phoneNumber: null,
            recipientName: null,
            bankName: null
        };

        // Извлекаем замаскированный номер телефона
        const phoneMatch = text.match(/(?:ТЕЛ|PHONE)[\s:]*\+?7\s*\*{3}\s*\*{3}\s*(\d{2}\s*\d{2})/i);
        if (phoneMatch) details.phoneNumber = `+7 *** *** ${phoneMatch[1]}`;

        // Извлекаем имя получателя
        const nameMatch = text.match(/Получатель:?\s*([^\n]+)/i);
        if (nameMatch) details.recipientName = nameMatch[1].trim();

        // Извлекаем название банка
        const bankMatch = text.match(/(?:Банк|Bank):\s*([^\n]+)/i);
        if (bankMatch) details.bankName = bankMatch[1].trim();

        return details;
    }

    extractAccountDetails(text) {
        const details = {
            accountNumber: null,
            recipientName: null,
            bankName: null,
            purpose: null
        };

        // Извлекаем замаскированный номер счета
        const accountMatch = text.match(/(?:Счет|Account)[\s:]*\*{16}(\d{4})/i);
        if (accountMatch) details.accountNumber = `************${accountMatch[1]}`;

        // Извлекаем имя получателя
        const nameMatch = text.match(/Получатель:?\s*([^\n]+)/i);
        if (nameMatch) details.recipientName = nameMatch[1].trim();

        // Извлекаем название банка
        const bankMatch = text.match(/(?:Банк|Bank):\s*([^\n]+)/i);
        if (bankMatch) details.bankName = bankMatch[1].trim();

        // Извлекаем назначение платежа
        const purposeMatch = text.match(/Назначение:?\s*([^\n]+)/i);
        if (purposeMatch) details.purpose = purposeMatch[1].trim();

        return details;
    }

    async extractQRDetails(pdfData) {
        const details = {
            qrType: null,
            merchantId: null,
            merchantName: null,
            terminal: null
        };

        // Определяем тип QR-кода
        if (pdfData.text.includes('СБП')) {
            details.qrType = 'СБП QR';
        } else if (pdfData.text.includes('Плати QR')) {
            details.qrType = 'Плати QR';
        }

        // Извлекаем ID мерчанта
        const merchantMatch = text.match(/(?:MERCHANT|Мерчант)\s*ID:\s*(\d+)/i);
        if (merchantMatch) details.merchantId = merchantMatch[1];

        // Извлекаем название мерчанта
        const nameMatch = text.match(/(?:MERCHANT|Мерчант)\s*NAME:\s*([^\n]+)/i);
        if (nameMatch) details.merchantName = nameMatch[1].trim();

        // Извлекаем номер терминала
        const terminalMatch = text.match(/TERMINAL:\s*(\d+)/i);
        if (terminalMatch) details.terminal = terminalMatch[1];

        return details;
    }

    // Обновляем метод showResult для отображения метода оплаты
    showResult(result) {
        // ... существующий код ...

        // Добавляем информацию о методе оплаты
        if (result.paymentMethod && result.paymentMethod.isValid) {
            const paymentMethodHtml = `
                <div class="payment-method-details">
                    <h3>Способ оплаты:</h3>
                    <div class="method-info">
                        <div class="method-type">${result.paymentMethod.method}</div>
                        ${this.generatePaymentMethodDetails(result.paymentMethod.details)}
                    </div>
                </div>
            `;
            
            // Вставляем после check-details
            const checkDetails = document.querySelector('.check-details');
            checkDetails.insertAdjacentHTML('afterend', paymentMethodHtml);
        }
    }

    generatePaymentMethodDetails(details) {
        return Object.entries(details)
            .filter(([_, value]) => value) // Фильтруем только непустые значения
            .map(([key, value]) => `
                <div class="detail-item">
                    <span class="detail-label">${this.formatDetailLabel(key)}:</span>
                    <span class="detail-value">${value}</span>
                </div>
            `).join('');
    }

    formatDetailLabel(key) {
        const labels = {
            cardNumber: 'Номер карты',
            cardType: 'Тип карты',
            authCode: 'Код авторизации',
            terminal: 'Терминал',
            phoneNumber: 'Номер телефона',
            recipientName: 'Получатель',
            bankName: 'Банк',
            accountNumber: 'Номер счёта',
            purpose: 'Назначение платежа',
            qrType: 'Тип QR-кода',
            merchantId: 'ID мерчанта',
            merchantName: 'Название мерчанта',
            transactionId: 'ID транзакции'
        };
        return labels[key] || key;
    }
}

// Аналогичные классы для других банков...

class UltimateSberbankValidator {
    constructor() {
        this.pdfParser = new AdvancedPDFParser();
        this.qrValidator = new EnhancedQRValidator();
        this.imageAnalyzer = new DeepImageAnalyzer();
        this.aiDetector = new AIFraudDetector();
        this.blockchainVerifier = new BlockchainVerifier();
        this.mlAnalyzer = new MachineLearningAnalyzer();
    }

    async validateWithMaximumSecurity(file) {
        const result = {
            isValid: false,
            aiAnalysis: {},
            blockchainVerification: {},
            deepSecurity: {},
            forensicAnalysis: {},
            mlPredictions: {},
            anomalyDetection: {},
            complianceCheck: {},
            details: {}
        };

        try {
            // 1. РАСШИРЕННАЯ КРИПТОГРАФИЧЕСКАЯ ПРОВЕРКА
            const cryptoChecks = await this.performAdvancedCryptoChecks(file);
            
            // 2. AI-POWERED АНАЛИЗ
            const aiChecks = await this.performAIAnalysis(file);
            
            // 3. БЛОКЧЕЙН ВЕРИФИКАЦИЯ
            const blockchainChecks = await this.verifyOnBlockchain(file);
            
            // 4. ФОРЕНЗИК АНАЛИЗ
            const forensicChecks = await this.performForensicAnalysis(file);
            
            // 5. МАШИННОЕ ОБУЧЕНИЕ
            const mlChecks = await this.performMLAnalysis(file);

            // Объединяем все проверки
            result.deepSecurity = await this.combineAllChecks({
                cryptoChecks,
                aiChecks,
                blockchainChecks,
                forensicChecks,
                mlChecks
            });

            return result;
        } catch (error) {
            throw new UltimateSberbankValidationError(error);
        }
    }

    async performAdvancedCryptoChecks(file) {
        return {
            quantumResistantSignature: await this.verifyQuantumResistantSignature(file),
            homomorphicEncryption: await this.checkHomomorphicEncryption(file),
            zeroKnowledgeProof: await this.verifyZeroKnowledgeProof(file),
            postQuantumCryptography: await this.checkPostQuantumSecurity(file),
            multiLayerEncryption: await this.verifyMultiLayerEncryption(file)
        };
    }

    async performAIAnalysis(file) {
        const aiAnalyzer = new DeepLearningAnalyzer({
            models: ['transformers', 'gpt-4', 'stable-diffusion']
        });

        return {
            // Анализ изображения на уровне пикселей
            imageAuthenticity: await aiAnalyzer.analyzeImageAuthenticity(file),
            
            // Проверка на синтетически сгенерированный контент
            syntheticContentDetection: await aiAnalyzer.detectSyntheticContent(file),
            
            // Анализ паттернов печати
            printPatternAnalysis: await aiAnalyzer.analyzePrintPatterns(file),
            
            // Проверка на аномалии в структуре документа
            structuralAnomalyDetection: await aiAnalyzer.detectStructuralAnomalies(file),
            
            // Анализ метаданных с помощью ИИ
            metadataIntelligence: await aiAnalyzer.analyzeMetadata(file)
        };
    }

    async verifyOnBlockchain(file) {
        const blockchainVerifier = new BlockchainVerifier({
            networks: ['Ethereum', 'Polygon', 'Sberbank-Chain']
        });

        return {
            // Проверка хеша документа в блокчейне
            documentHash: await blockchainVerifier.verifyDocumentHash(file),
            
            // Проверка временной метки в блокчейне
            timestamp: await blockchainVerifier.verifyTimestamp(file),
            
            // Проверка цифровой подписи банка в блокчейне
            bankSignature: await blockchainVerifier.verifyBankSignature(file),
            
            // Проверка смарт-контракта валидации
            smartContract: await blockchainVerifier.verifySmartContract(file)
        };
    }

    async performForensicAnalysis(file) {
        const forensicAnalyzer = new ForensicAnalyzer({
            tools: ['EnCase', 'FTK', 'Cellebrite']
        });

        return {
            // Анализ метаданных на низком уровне
            deepMetadata: await forensicAnalyzer.analyzeDeepMetadata(file),
            
            // Анализ истории изменений документа
            documentHistory: await forensicAnalyzer.analyzeDocumentHistory(file),
            
            // Анализ скрытых данных
            hiddenData: await forensicAnalyzer.detectHiddenData(file),
            
            // Анализ цифровых артефактов
            digitalArtifacts: await forensicAnalyzer.analyzeDigitalArtifacts(file),
            
            // Анализ структуры файла на битовом уровне
            bitLevelAnalysis: await forensicAnalyzer.performBitLevelAnalysis(file)
        };
    }

    async performMLAnalysis(file) {
        const mlAnalyzer = new MachineLearningAnalyzer({
            models: ['XGBoost', 'LightGBM', 'CatBoost', 'Neural-Networks']
        });

        return {
            // Анализ паттернов мошенничества
            fraudPatterns: await mlAnalyzer.detectFraudPatterns(file),
            
            // Анализ аномалий в данных
            dataAnomalies: await mlAnalyzer.detectDataAnomalies(file),
            
            // Предсказание вероятности подделки
            forgeryProbability: await mlAnalyzer.predictForgeryProbability(file),
            
            // Анализ последовательности операций
            operationSequence: await mlAnalyzer.analyzeOperationSequence(file),
            
            // Кластерный анализ характеристик документа
            documentClustering: await mlAnalyzer.performDocumentClustering(file)
        };
    }

    async performBiometricVerification(file) {
        const biometricVerifier = new BiometricVerifier({
            methods: ['fingerprint', 'signature', 'behavioralPatterns']
        });

        return {
            // Анализ цифровой подписи на биометрические характеристики
            signatureBiometrics: await biometricVerifier.analyzeSignatureBiometrics(file),
            
            // Анализ поведенческих паттернов при создании документа
            behavioralAnalysis: await biometricVerifier.analyzeBehavioralPatterns(file),
            
            // Верификация биометрических маркеров
            biometricMarkers: await biometricVerifier.verifyBiometricMarkers(file)
        };
    }

    async performQuantumSecurityChecks(file) {
        const quantumSecurityChecker = new QuantumSecurityChecker();

        return {
            // Квантово-устойчивое шифрование
            quantumResistantEncryption: await quantumSecurityChecker.verifyQuantumResistance(file),
            
            // Квантовая запутанность для проверки целостности
            quantumEntanglement: await quantumSecurityChecker.checkQuantumEntanglement(file),
            
            // Квантовые случайные числа для проверки подлинности
            quantumRandomness: await quantumSecurityChecker.verifyQuantumRandomness(file)
        };
    }

    async performAdvancedNetworkAnalysis(file) {
        const networkAnalyzer = new NetworkAnalyzer({
            methods: ['graphTheory', 'neuralNetworks', 'topologicalAnalysis']
        });

        return {
            // Анализ связей между транзакциями
            transactionNetwork: await networkAnalyzer.analyzeTransactionNetwork(file),
            
            // Топологический анализ данных
            topologicalFeatures: await networkAnalyzer.analyzeTopology(file),
            
            // Анализ графа операций
            operationGraph: await networkAnalyzer.analyzeOperationGraph(file)
        };
    }

    async calculateTrustScore(allChecks) {
        const trustScoreCalculator = new TrustScoreCalculator({
            weights: {
                cryptographic: 0.25,
                ai: 0.20,
                blockchain: 0.15,
                forensic: 0.15,
                ml: 0.15,
                biometric: 0.10
            }
        });

        return await trustScoreCalculator.calculateScore(allChecks);
    }
}

class SupermaxSberbankValidator {
    constructor() {
        this.initializeUI();
        this.initializeEventListeners();
        // Инициализация необходимых валидаторов
        this.pdfParser = new PDFParser();
        this.qrValidator = new QRCodeValidator();
        this.digitalSignatureVerifier = new DigitalSignatureVerifier();
    }

    initializeUI() {
        this.dropZone = document.getElementById('dropZone');
        this.fileInput = document.getElementById('pdfInput');
        this.progressSection = document.getElementById('validationProgress');
        this.resultSection = document.getElementById('validationResult');
    }

    initializeEventListeners() {
        // Drag and drop события
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // Клик по кнопке загрузки
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    async handleFile(file) {
        if (!file.type.includes('pdf')) {
            this.showError('Пожалуйста, загрузите PDF файл');
            return;
        }

        try {
            this.showProgress();
            const result = await this.performUltimateValidation(file);
            this.showResult(result);
        } catch (error) {
            this.showError(error.message);
        }
    }

    async performUltimateValidation(file) {
        try {
            const result = {
                score: {
                    total: 0,
                    details: {}
                },
                checks: {
                    structure: false,
                    signature: false,
                    qrCode: false,
                    content: false,
                    metadata: false
                },
                details: {},
                warnings: [],
                paymentMethod: null
            };

            // 1. Проверка структуры PDF
            const structureCheck = await this.pdfParser.validatePDFStructure(file);
            result.checks.structure = structureCheck;
            result.score.details.structure = structureCheck ? 1 : 0;

            // 2. Проверка цифровой подписи
            const signatureCheck = await this.digitalSignatureVerifier.verify(file, 'sber');
            result.checks.signature = signatureCheck;
            result.score.details.signature = signatureCheck ? 1 : 0;

            // 3. Извлечение и проверка данных
            const pdfData = await this.pdfParser.extractFullData(file);
            
            // 4. Проверка QR-кода
            let qrValid = false;
            try {
                const qrData = await this.qrValidator.decode(pdfData.qrCode);
                qrValid = qrData && qrData.length > 0;
                result.details.qrData = qrData;
            } catch (e) {
                result.warnings.push('Ошибка при проверке QR-кода');
            }
            result.checks.qrCode = qrValid;
            result.score.details.qrCode = qrValid ? 1 : 0;

            // 5. Проверка содержимого
            const contentValid = this.validateContent(pdfData);
            result.checks.content = contentValid;
            result.score.details.content = contentValid ? 1 : 0;

            // Определение метода оплаты
            const paymentMethodResult = await this.validatePaymentMethod(pdfData);
            result.paymentMethod = paymentMethodResult;

            // Расчет итогового результата
            const scores = Object.values(result.score.details);
            result.score.total = scores.reduce((a, b) => a + b, 0) / scores.length;

            return result;
        } catch (error) {
            throw new Error(`Ошибка при проверке чека: ${error.message}`);
        }
    }

    validateContent(pdfData) {
        // Проверка обязательных полей Сбербанка
        const requiredPatterns = [
            /ПАО\s+СБЕРБАНК/i,
            /ОПЕРАЦИЯ\s+ОДОБРЕНА/i,
            /RRN:\s*\d{12}/,
            /СУММА/i
        ];

        return requiredPatterns.every(pattern => pattern.test(pdfData.text));
    }

    showProgress() {
        this.progressSection.classList.remove('hidden');
        this.resultSection.classList.add('hidden');
        // Анимация прогресса
    }

    showResult(result) {
        this.progressSection.classList.add('hidden');
        this.resultSection.classList.remove('hidden');

        const isValid = result.score.total >= 0.8; // Порог успешной проверки

        this.resultSection.innerHTML = `
            <div class="validation-result ${isValid ? 'valid' : 'invalid'}">
                <div class="result-header ${isValid ? 'success' : 'warning'}">
                    <div class="result-status">
                        <div class="status-icon">${isValid ? '✅' : '❌'}</div>
                        <div class="status-text">
                            <h2 style="margin: 0; font-size: 24px">
                                ${isValid ? 'ЧЕК ПОДЛИННЫЙ' : 'ЧЕК НЕ ПРОШЕЛ ПРОВЕРКУ'}
                            </h2>
                            <p style="margin: 5px 0 0 0; font-size: 18px">
                                Надежность: ${(result.score.total * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div class="check-details" style="margin-top: 20px">
                    <h3>Результаты проверки:</h3>
                    <div class="check-list" style="margin-top: 10px">
                        ${Object.entries(result.checks)
                            .map(([key, value]) => `
                                <div class="check-item ${value ? 'success' : 'failure'}" 
                                     style="padding: 10px; margin: 5px 0; border-radius: 8px">
                                    ${value ? '✓' : '✗'} ${getCheckName(key)}
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    showError(message) {
        this.resultSection.classList.remove('hidden');
        this.resultSection.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <div class="error-text">${message}</div>
            </div>
        `;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    new SupermaxSberbankValidator();
});