const express = require('express');
const { check, body } = require("express-validator/check")
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', authController.postLogin);

router.post('/signup',
[
check("email")
.isEmail()
.withMessage("Please add a valid email!")
.custom((value, {req}) => {
    if(value === "test@test.com") {
        throw new Error("This email address is forbidden")
    }
    return true;
}),
//body("password").isLength({min:12}).withMessage("Please enter at least 12 characters!")
body("password", "Please enter at least 12 characters!").isLength({min:12}), // To avoid repeating message
body("confirmPassword").custom((value, {req}) => {
    if(value !== req.body.password) {
        throw new Error("Passwords have to match!")
    }
    return true
})
], 
authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);


module.exports = router;