const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const Contract = require('../models/Contract');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const constants = require('../constants/constant');

const {
    Requesting,
    Happening,
    Complaining,
    Completed,
    Canceled
} = constants;

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


exports.getContracts = asyncHandler(async (req, res, next) => {
    const results = await Contract.find().populate(contractPipeline).sort({
        updatedAt: -1
    });

    if (!results) {
        return next(new createError(404, 'Resource not found'));
    }
        
    res.status(200).json({
        success: true,
        data: {
            count: results.length,
            results
        }
    });
});


exports.getContract = asyncHandler(async (req, res, next) => {
    const contract = await Contract.findById(req.params.id).populate(contractPipeline);

    if (!contract) {
        return next(new createError(404, `Contract not found`));
    }


    res.status(200).json({
        success: true,
        data: contract
    });
});


exports.updateContract = asyncHandler(async (req, res, next) => {
    const {status} = req.body;
    let updated = false;
    const contract = await Contract.findById(req.params.id).populate(contractPipeline);

    if (!contract) {
        return next(new createError(404, `Contract not found`));
    }

    if (contract.status === Complaining) {
        return next(new createError(403, `Please use handle complaint feature`));
    }

    if (contract.status === Canceled || contract.status === Completed) {
        return next(new createError(403, `Contract has been saved, can not update.`));
    }

    if (contract.status === Requesting && status === Canceled) {
        // sent back money to student
        const user = await User.findById(contract.student.userInfo._id);
        user.balance += contract.contractAmount;
        await user.save();
        contract.status = Canceled;
        updated = true;
    }

    if (contract.status === Happening && status === Completed) {
        // sent money to tutor
        const user = await User.findById(contract.tutor.userInfo._id);
        user.balance += contract.contractAmount;
        await user.save();
        contract.status = Completed;
        updated = true;
    }

    if (!updated) {
        return next(new createError(400, `Invalid request`));
    }

    await contract.save();

    res.status(200).json({
        success: true,
        data: {
            contract
        }
    });
});
