const bcrypt = require("bcrypt");
const validate = require("../../middlewares/validate");
const { empty } = require("@prisma/client/runtime/library");
const userService = require("./services/createUser.service");


async function create(req, res) {
  try {
    const result = await userService.create(req.validatedData);

    if (result && result.valid === false) {
      return res.status(409).json({ message: result.message });
    }

    return res.status(201).json({ message:"Usuario creado Exitosamente.",user: {code: result.code, username:result.username, email:result.email} });
  } catch (error) {
    return res.status(500).json({ message: "Error interno", error: error.message });
  }
}

module.exports = {
    create
};