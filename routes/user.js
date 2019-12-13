const express = require('express');
const router = express.Router();
const User = require('../models/User');
const advancedSearch = require('../middleware/advancedSearch');

const {
    getUsers,
    getUser
} = require('../controllers/user');

const {
    protected,
    authorized
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(advancedSearch(User), getUsers)

router
    .route('/:id')
    .get(getUser)


module.exports = router;
