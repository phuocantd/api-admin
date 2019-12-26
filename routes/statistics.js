const express = require('express');
const router = express.Router();

const {
    getStatistics,
    getDashboard
} = require('../controllers/statistics');


const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(getStatistics)

router
    .route('/dashboard')
    .get(getDashboard)

module.exports = router;
