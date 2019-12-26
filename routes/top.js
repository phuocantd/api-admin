const express = require('express');
const router = express.Router();

const {
    getTopByTutor,
    getTopByTag
} = require('../controllers/top');


const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/users')
    .get(getTopByTutor)

    router
    .route('/tags')
    .get(getTopByTag)

module.exports = router;
