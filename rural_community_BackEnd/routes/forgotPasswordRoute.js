const express = require('express');
const router = express.Router();
const forgotPasswordcontroller = require('../controllers/forgotPasswordcontroller')


router.post('/generateOtp',forgotPasswordcontroller.GenerateOtpForgotPassword)
router.post('/verifyOtp',forgotPasswordcontroller.VerifyOtp)
router.patch('/resetPassword',forgotPasswordcontroller.resetPassword)


module.exports = router;
