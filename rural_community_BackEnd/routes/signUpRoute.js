const express = require('express');
const router = express.Router();
const signUpController = require('../controllers/signupcontroller')
const loginController = require('../controllers/logincontroller')

router.post('/signup',signUpController.signUp);
router.post('/emailGenerateOtp',signUpController.emailGenerateOtp)
router.post('/emailVerifyOtp',signUpController.emailVerifyOtp)
// router.post('/phoneGenerateOtp',signUpController.phoneGenerateOtp)
// router.post('/phoneVerifyOtp',signUpController.PhoneVerifyOtp)
router.get('/userData',signUpController.getUser)
router.delete('/userData/:userId',signUpController.deleteUser)
router.post('/login',loginController.loginUser)


module.exports = router;
