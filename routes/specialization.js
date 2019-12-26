const express = require('express');
const router = express.Router();

const {
    getSpecializations,
    getSpecialization,
    createSpecialization,
    updateSpecialization
} = require('../controllers/specializations');


const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(getSpecializations)
    .post(createSpecialization);

router
    .route('/:id')
    .get(getSpecialization)
    .put(updateSpecialization)


module.exports = router;
