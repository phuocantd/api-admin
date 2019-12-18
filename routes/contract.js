const express = require('express');
const router = express.Router();

const {
    getContracts,
    getContract
} = require('../controllers/contract');


const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(getContracts)

router
    .route('/:id')
    .get(getContract)


module.exports = router;
