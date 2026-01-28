
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./config/logger');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes')
const certificationRoutes = require('./modules/certification/certification.routes')
const app = express();


// Middlewares globales
app.use(cors());
app.use(helmet());
app.use(express.json());

// Considerar la carpeta /storage/certificates como estatica
app.use('/certificates', express.static(path.join(__dirname, '..', 'storage', 'certificates')));

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

app.use('/certification', certificationRoutes)


// Ruta ping
app.get('/', (req, res) => {
	res.json({ message: 'API funcionando' });
});

module.exports = app