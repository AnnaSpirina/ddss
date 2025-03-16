class QRCode {
    constructor(value, expirationDate) {
        this.value = value; //Строка, представляющая QR-код
        this.expirationDate = expirationDate; //Дата истечения срока действия QR-кода
    }

    //Проверка, истек ли срок действия QR-кода
    isExpired() {
        return new Date() > this.expirationDate;
    }

    //Проверка, совпадает ли значение QR-кода с переданным
    matches(value) {
        return this.value === value;
    }
}

module.exports = QRCode;