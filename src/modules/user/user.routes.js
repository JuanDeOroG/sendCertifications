const express = require("express")
const router = express.Router()
// Functiones del controlador
const {create} = require("./user.controller")

const validate = require("../../middlewares/validate")
const {createUserSchema} = require("./user.validation")
const authMiddleware = require("../auth/auth.middleware");


router.post("/create", authMiddleware, validate(createUserSchema), create);



module.exports = router