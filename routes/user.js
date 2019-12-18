const express = require('express');
const router = express.Router();

const {
    getUsers,
    getUser,
    setActiveUser
} = require('../controllers/user');

const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(getUsers)

router
    .route('/:id')
    .get(getUser)
    .put(setActiveUser)

module.exports = router;
