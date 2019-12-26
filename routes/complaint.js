const express = require('express');
const router = express.Router();

const {
    getComplaints,
    getComplaint,
    updateComplaint
} = require('../controllers/complaint');


const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(getComplaints)

router
    .route('/:id')
    .get(getComplaint)
    .put(updateComplaint)

module.exports = router;
