const QRCode = require('../valueObjects/QRCode');

class QRCodeService {
    //Генерация QR-кода
    generateQRCode(eventId) {
        const value = `EVENT_${eventId}_${Date.now()}`; //Уникальное значение для QR-кода
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); //QR-код действителен 24 часа
        return new QRCode(value, expirationDate);
    }

    //Проверка QR-кода
    verifyQRCode(qrCode, expectedValue) {
        if (qrCode.isExpired()) {
            return false; //QR-код истёк
        }
        return qrCode.matches(expectedValue); //Проверка совпадения значения
    }
}

module.exports = QRCodeService;