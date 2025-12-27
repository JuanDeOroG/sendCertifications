const bcrypt = require("bcrypt")

const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()


async function create(data){

    validations = await databaseValidations(data);

    if(!validations.valid){
        return validations;
    }

    const code = Math.random().toString(36).slice(2, 10);
    const rememberToken = Math.random().toString(36).slice(2, 10);
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data:{
            code: code,
            username: data.username,
            email: data.email,
            password: hashedPassword,
            remember_token: rememberToken,
        }
    })
    

    return user;

}


async function databaseValidations(data) {
  const emailExist = await prisma.user.findUnique({ where: { email: data.email } });
  if (emailExist) {
    return { valid: false, message: "El email ya existe. Por favor, usa otro." };
  }
  // Aquí podrías agregar más validaciones y mensajes
  return { valid: true };
}

module.exports = {
  create
};