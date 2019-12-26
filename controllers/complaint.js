const createError = require('http-errors');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async');
const Contract = require('../models/Contract');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

const {
    Happening,
    Processing,
    Completed,
    Canceled
} = require('../constants/constant');

const contractPipeline = [{
        path: 'tutor',
        populate: [{
            path: 'userInfo',
            select: '-password -balance -accountToken',
            match: {
                isActive: true
            }
        }, {
            path: 'tags',
            select: 'name',
            match: {
                isActive: true
            }
        }, {
            path: 'specialization',
            select: 'name',
            match: {
                isActive: true
            }
        }]
    },
    {
        path: 'student',
        populate: {
            path: 'userInfo',
            select: '-password -balance -accountToken',
        }
    }
]


exports.getComplaints = asyncHandler(async (req, res, next) => {
    const results = await Complaint.find();
    const count = results.length;

    res.status(200).json({
        success: true,
        data: {
            count,
            results
        }
    });
});


exports.getComplaint = asyncHandler(async (req, res, next) => {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
        return next(new createError(404, `Complaint not found`));
    }


    res.status(200).json({
        success: true,
        data: complaint
    });
});


exports.updateComplaint = asyncHandler(async (req, res, next) => {
    let isUpdated = false;
    const {status} = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (complaint.status !== Processing) {
        return next(new createError(400, `Complaint has been saved, can not update`));
    }

    if (!complaint) {
        return next(new createError(404, `Complaint not found`));
    }

    const contract = await Contract.findById(complaint.contract).populate(contractPipeline);

    if (status === Canceled) {
        complaint.status = Canceled;
        contract.status = Happening;
        isUpdated = true;
    } else
    if (status === Completed) {
        // sent back money to student
        const user = await User.findById(contract.student.userInfo._id);
        user.balance += contract.contractAmount;
        await user.save();
        complaint.status = Completed;
        contract.status = Canceled;
        isUpdated = true;
    }

    if (!isUpdated) {
        return next(new createError(404, `Invalid Request`));
    }

    await complaint.save();
    await contract.save();

    res.status(200).json({
        success: true,
        data: {
            complaint,
            contract
        }
    });
});



