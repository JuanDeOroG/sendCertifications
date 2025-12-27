const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Cambia esta clave por una segura y guárdala en .env
const JWT_SECRET = process.env.JWT_SECRET;

// Registro de usuario
async function register(req, res) {
    try {
        // Los datos ya están validados por el middleware y disponibles en req.validatedData
        const { email, password, username } = req.validatedData;

        // Verificar si el email ya existe
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return res.status(409).json({ message: 'El email ya está registrado' });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const code = Math.random().toString(36).slice(2, 10);
        const remeberToken = Math.random().toString(36).slice(2, 10);

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                code,
                remember_token: remeberToken,
                state: 1,
            },
        });

        return res.status(201).json({ message: 'Usuario registrado', user: { id: user.id, email: user.email, username: user.username, code: user.code } });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el registro', error: error.message });
    }
}

// Login de usuario
async function login(req, res) {
    try {
        // Los datos ya están validados por el middleware y disponibles en req.validatedData
        const { email, password } = req.validatedData;

        // Buscar usuario
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

        return res.json({ token, user: { code: user.code, email: user.email, username: user.username } });
    } catch (error) {
        return res.status(500).json({ message: 'Error en el login', error: error.message });
    }
}

module.exports = {
    register,
    login,
};
