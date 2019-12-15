const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// @route     GET /api/admins
// @access    Private: root
exports.getAdmins = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: res.advancedSearch
    });
});


// @route     GET /api/admins/:id
// @access    Private: root
exports.getAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
        return next(new createError(404, 'User not found'));
    }


    res.status(200).json({
        success: true,
        data: admin
    });
});


// @route     POST /api/admins
// @access    Private: root
exports.createAdmin = asyncHandler(async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    req.body.password = password;

    if (req.body.role === 'root') {
        return next(new createError(403, 'You are not authorized to access this feature'));
    }

    const admin = await Admin.create(req.body);
    res.status(201).json({
        success: true,
        data: admin
    });
});


// @route     DELETE /api/admins/:id
// @access    Private: root
exports.updateAdmin = asyncHandler(async (req, res, next) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        req.body.password = password;
    }

    if (req.body.role === 'root') {
        return next(new createError(403, 'You are not authorized to access this feature'));
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: admin
    });
});

// @route     DELETE /api/admins/:id
// @access    Private: root
exports.deleteAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
        return next(new createError(404, 'User not found'));
    }

    if (admin.role === 'root') {
        return next(new createError(403, 'You are not authorized to access this feature'));
    }

    res.status(200).json({
        success: true,
        data: admin
    });
});
