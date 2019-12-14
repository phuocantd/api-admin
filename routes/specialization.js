const express = require('express');
const router = express.Router();
const Specialization = require('../models/Specialization');

const {
    getSpecializations,
    getSpecialization,
    createSpecialization,
    updateSpecialization
} = require('../controllers/specializations');

const advancedSearch = require('../middleware/advancedSearch');

const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(advancedSearch(Specialization), getSpecializations)
    .post(createSpecialization);

router
    .route('/:id')
    .get(getSpecialization)
    .put(updateSpecialization)


module.exports = router;
