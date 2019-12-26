const express = require('express');
const router = express.Router();

const {
    getContracts,
    getContract,
    updateContract
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
    .put(updateContract)

module.exports = router;
