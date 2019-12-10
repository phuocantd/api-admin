const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const Tag = require('../models/Tag');


exports.getTags = asyncHandler(async (req, res, next) => {
    const tags = await Tag.find({isActive: true});

    return res.status(200).json({
        success: true,
        length: tags.length,
        data: tags
    })
});



exports.getTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: tag
    });
});


// @desc      Add new course to bootcamp
// @route     POST /api/tags
// @access    Private
exports.createTag = asyncHandler(async (req, res, next) => {

    const tag = await Tag.create(req.body);

    res.status(200).json({
        success: true,
        data: tag
    });
});


// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // return new version of document
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: tag
    });
});


// @desc      Deactivate tag
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteTag = asyncHandler(async (req, res, next) => {
    const tag = await Tag.findByIdAndUpdate(req.params.id, {isActive: false}, {
        new: true, // return new version of document
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: tag
    });
});
