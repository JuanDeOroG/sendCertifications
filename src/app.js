const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./config/logger');
require('dotenv').config();

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes')

const app = express();

// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(express.json());
// Middleware de logging con winston
app.use((req, res, next) => {
	res.on('finish', () => {
		logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`);
	});
	next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/user', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
	res.json({ message: 'API funcionando' });
});

module.exports = app
