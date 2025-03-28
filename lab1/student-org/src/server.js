const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./interfaces/routes');
const pool = require('./infrastructure/db/pool');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

// Проверка подключения к БД и запуск сервера
pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.error('Не удалось подключиться к базе данных', err);
        process.exit(1);
    }
    
    console.log('Успешное подключение к базе данных');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});