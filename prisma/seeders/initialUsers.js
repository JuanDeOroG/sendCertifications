module.exports = async (prisma, bcrypt) => {
  const password = await bcrypt.hash('123123123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@catin.com' },
    update: {},
    create: {
      code: Math.random().toString(36).slice(2, 10),
      email: 'admin@catin.com',
      password,
      username: 'admin',
      remember_token: Math.random().toString(36).slice(2, 18),
      updatedAt: new Date(),
    },
  });
  console.log('Usuario admin@catin.com creado o actualizado');
};