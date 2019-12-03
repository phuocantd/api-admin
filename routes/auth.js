const express = require('express');
const passport = require('passport');

const router = express.Router();
const {login} = require('../controllers/auth');


router.post('/login', login);


module.exports = router;
