const bcrypt = require("bcrypt");
const validate = require("../../middlewares/validate");
const { empty } = require("@prisma/client/runtime/library");
const createUserService = require("./services/createUser.service");
const updateUserService = require("./services/updateUser.service");

function userResponse(user) {
  return {
    code: user.code, email: user.email, username: user.username, state: user.state
  };
}

async function create(req, res) {
  try {
    const result = await createUserService.create(req.validatedData);

    if (result && result.valid === false) {
      return res.status(409).json({ message: result.message });
    }

    return res.status(201).json({ message: "Usuario creado Exitosamente.", user: userResponse(result) });
  } catch (error) {
    return res.status(500).json({ message: "Error interno", error: error.message });
  }
}


async function update(req, res) {
  try {
    const result = await updateUserService.update(req.validatedData);

    if(result && result.valid === false){
      return res.status(409).json({message:result.message});
    }

    return res.status(200).json({message:"Usuario actualizado Exitosamente.",user: userResponse(result)});

  } catch (error) {
    return res.status(500).json({ message: "Error interno", error: error.message });
  }

}



module.exports = {
  create,
  update
};