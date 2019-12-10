const express = require('express');
const router = express.Router();

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
    .get(getUsers)

router
    .route('/:id')
    .get(getUser)


module.exports = router;
