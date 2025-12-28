const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const prisma = new PrismaClient()



async function update(data) {

    const validations = await databaseValidations(data);

    if(!validations.valid){
        return validations;
    }

    const updateData = {};
    if (data.email) updateData.email = data.email;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    if (data.username) updateData.username = data.username;
    if (typeof data.state !== 'undefined') updateData.state = data.state;

    const user = await prisma.user.update({
        where: { code: data.code },
        data: updateData
    });

    return user;
}


async function databaseValidations(data){

    const exist = await prisma.user.findUnique({
        where: {code: data.code}
    })

    if(!exist){
        return {valid: false, message: "El usuario con el codigo digitado no existe."}
    }

    return {valid: true}

}

module.exports = {
    update
}