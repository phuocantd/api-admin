const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const Specialization = require('../models/Specialization');


exports.getSpecializations = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: res.advancedSearch
    });
});



exports.getSpecialization = asyncHandler(async (req, res, next) => {
    const specialization = await Specialization.findById(req.params.id);

    if (!specialization) {
        return next(new createError(404, `Specialization not found with id ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        data: specialization
    });
});



exports.createSpecialization = asyncHandler(async (req, res, next) => {
    const specialization = await Specialization.create(req.body);

    res.status(200).json({
        success: true,
        data: specialization
    });
});



exports.updateSpecialization = asyncHandler(async (req, res, next) => {
    const specialization = await Specialization.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!specialization) {
        return next(new createError(404, `Specialization not found with id ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        data: specialization
    });
});
