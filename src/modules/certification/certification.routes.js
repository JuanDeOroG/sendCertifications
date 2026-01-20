const express = require('express');
const router = express.Router();
const { downloadCertifications } = require('./certification.controller');
const validate = require('../../middlewares/validate');
const { downloadCertificationSchema } = require('./certification.validation');
const authMiddleware = require("../auth/auth.middleware");


router.post('/download',authMiddleware, validate(downloadCertificationSchema), downloadCertifications);

module.exports = router;
