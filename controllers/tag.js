const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const Tag = require('../models/Tag');


exports.getTags = asyncHandler(async (req, res, next) => {
    const results = await Tag.find();
    res.status(200).json({
        success: true,
        data: {
            count: results.length,
            results
        }
    });
});



exports.getTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
        return next(new createError(404, `Tag not found with id ${req.params.id}`));
    }


    res.status(200).json({
        success: true,
        data: tag
    });
});



exports.createTag = asyncHandler(async (req, res, next) => {

    const tag = await Tag.create(req.body);

    res.status(200).json({
        success: true,
        data: tag
    });
});



exports.updateTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!tag) {
        return next(new createError(404, `Tag not found with id ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        data: tag
    });
});
