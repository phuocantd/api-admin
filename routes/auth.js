const express = require('express');

const router = express.Router();
const {login, getMe} = require('../controllers/auth');
const {protectedGetme} = require('../middleware/auth');

router.post('/login', login);
router.post('/me', protectedGetme, getMe);

module.exports = router;
