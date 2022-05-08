var express = require('express');
var router = express.Router();
const { loginPage, registerPage, register, login, logout } = require('./../controllers/user.controller');

router.get('/login', loginPage);
router.get('/register', registerPage);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;