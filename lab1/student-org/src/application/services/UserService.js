const UserRepository = require('../../infrastructure/repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerStudent({ email, password, firstName, lastName, middleName, studyGroup }) {
        //Проверка, что email принадлежит домену ВШЭ
        if (!email.endsWith('@edu.hse.ru')) {
            throw new Error('Разрешены только корпоративные электронные письма HSE');
        }

        //Проверка, что пользователь уже существует
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Пользователь уже существует');
        }

        //Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        //Создание пользователя
        const user = await this.userRepository.save({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            middleName,
            studyGroup,
            role: 'student'
        });

        return user;
    }

    async login(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Пользователь не найден');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Неверный пароль');
        }

        //Генерация JWT токена
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { user, token };
    }

    async getUserProfile(userId) {
        return this.userRepository.findById(userId);
    }
}

module.exports = UserService;