const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const Contract = require('../models/Contract');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const constants = require('../constants/constant');

const {
    Requesting,
    Happening,
    Completed,
    Canceled
} = constants;

const contractPipeline = [{
        path: 'tutor',
        populate: [{
            path: 'userInfo',
            select: '-password',
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
            select: '-password',
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
    res.status(200).json({
        success: true,
        data: 'OK'
    });
});
