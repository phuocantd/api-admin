const express = require('express');
const passport = require('passport');

const router = express.Router();
const {login, getMe} = require('../controllers/auth');
const {protected} = require('../middleware/auth');

router.post('/login', login);
router.post('/me', protected, getMe);

module.exports = router;
