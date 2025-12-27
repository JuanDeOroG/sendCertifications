const express = require('express');
const router = express.Router();
const { register, login } = require('./auth.controller');
const validate = require('../../middlewares/validate');
const { registerSchema, loginSchema } = require('./auth.validation');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Ejemplo de ruta protegida
// const authMiddleware = require('./auth.middleware');
// router.get('/me', authMiddleware, (req, res) => res.json({ user: req.user }));

module.exports = router;