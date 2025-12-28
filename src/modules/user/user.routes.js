const express = require("express")
const router = express.Router()
// Functiones del controlador
const {create, update} = require("./user.controller")

const validate = require("../../middlewares/validate")
const {createUserSchema, updateUserSchema} = require("./user.validation")
const authMiddleware = require("../auth/auth.middleware");


router.post("/create", authMiddleware, validate(createUserSchema), create);
router.put("/update", authMiddleware, validate(updateUserSchema), update);


module.exports = router