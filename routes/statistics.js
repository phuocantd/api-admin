const express = require('express');
const router = express.Router();

const {
    getStatistics
} = require('../controllers/statistics');


const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(getStatistics)

module.exports = router;
