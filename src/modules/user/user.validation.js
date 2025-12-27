const { z } = require('zod');

// Esquema para creacion de usuario
const createUserSchema = z.object({
    email: z.string({
            required_error: 'El email es obligatorio'
        })
        .min(1, { message: 'El email es obligatorio' })
        .email({ message: 'Email inválido' }),
    password: z.string({
            required_error: 'La contraseña es obligatoria'
        })
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    username: z.string({
            required_error: 'El nombre de usuario es obligatorio'
        })
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});


module.exports = {
    createUserSchema,
};
