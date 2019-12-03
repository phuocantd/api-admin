const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');


// @desc      Get all administrators
// @route     GET /api/admins
// @access    Private
exports.getAdmins = asyncHandler(async (req, res, next) => {
    const admins = await Admin.find();

    res.status(200).json({
        success: true,
        data: admins
    });
});


// @desc      Get single administrator
// @route     GET /api/admins/:id
// @access    Private
exports.getAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: admin
    });
});


// @desc      Create administrator
// @route     POST /api/admins
// @access    Private
exports.createAdmin = asyncHandler(async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const admin = await Admin.create(req.body);

    res.status(201).json({
        success: true,
        data: admin
    });
});


// @desc      Update administrator
// @route     PUT /api/admins/:id
// @access    Private
exports.updateAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: admin
    });
});

