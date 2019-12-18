const express = require('express');
const router = express.Router();

const {
    getTags,
    getTag,
    createTag,
    updateTag
} = require('../controllers/tag');


const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(getTags)
    .post(createTag);

router
    .route('/:id')
    .get(getTag)
    .put(updateTag)


module.exports = router;
