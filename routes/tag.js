const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

const {
    getTags,
    getTag,
    createTag,
    updateTag,
    deleteTag
} = require('../controllers/tag');

const advancedSearch =  require('../middleware/advancedSearch');

const {
    protected
} = require('../middleware/auth');

router.use(protected);

router
    .route('/')
    .get(advancedSearch(Tag), getTags)
    .post(createTag);

router
    .route('/:id')
    .get(getTag)
    .put(updateTag)
    .delete(deleteTag)


module.exports = router;
