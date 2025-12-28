const { z } = require('zod');
const { update } = require('./user.controller');

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
const updateUserSchema = z.object({
    code: z.string({
        required_error: 'El código es obligatorio'
    }).min(1, { message: 'El código es obligatorio' }),
    email: z.string().email({ message: 'Email inválido' }).optional(),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }).optional(),
    username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' }).optional(),
    state: z.number().int().min(1, {message: 'Estado Invalido'}).max(3, {message: "Estado Invalido"}).optional(),
});


module.exports = {
    createUserSchema,
    updateUserSchema
};
