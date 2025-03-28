const QRCode = require('qrcode');

class QRCodeService {
    async generateQRCode(data) {
        try {
            return await QRCode.toDataURL(data);
        } catch (err) {
            console.error('QR code generation failed:', err);
            throw err;
        }
    }
}

module.exports = QRCodeService;