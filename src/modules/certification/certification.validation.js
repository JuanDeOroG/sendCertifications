const { z } = require('zod');

const downloadCertificationSchema = z.object({
  user: z.string({ required_error: 'El usuario es obligatorio' }).min(1, { message: 'El usuario es obligatorio' }),
  password: z.string({ required_error: 'La contraseña es obligatoria' }).min(1, { message: 'La contraseña es obligatoria' }),
  classroom: z.string({ required_error: 'El aula es obligatoria' }).min(1, { message: 'El aula es obligatoria' })
});

module.exports = { downloadCertificationSchema };