const express = require('express');
const router = express.Router();
const { downloadCertifications, index } = require('./certification.controller');
const validate = require('../../middlewares/validate');
const { downloadCertificationSchema } = require('./certification.validation');
const authMiddleware = require("../auth/auth.middleware");



router.post('/download',authMiddleware, validate(downloadCertificationSchema), downloadCertifications);

// Listar carpetas de certificados
router.get('/folders', authMiddleware, index);

module.exports = router;
