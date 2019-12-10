const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');


exports.getAdmins = asyncHandler(async (req, res, next) => {
    const admins = await Admin.find();

    res.status(200).json({
        success: true,
        data: admins
    });
});



exports.getAdmin = asyncHandler(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);

    res.status(200).json({
        success: true,
        data: admin
    });
});



exports.createAdmin = asyncHandler(async (req, res, next) => {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    req.body.password = password;
    const admin = await Admin.create(req.body);

    res.status(201).json({
        success: true,
        data: admin
    });
});



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

