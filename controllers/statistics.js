const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const Contract = require('../models/Contract');
const Complaint = require('../models/Complaint');
const Tag = require('../models/Tag');
const Specialization = require('../models/Specialization');
const User = require('../models/User');

const {Completed} = require('../constants/constant');

exports.getStatistics = asyncHandler(async (req, res, next) => {
    let { period, month, year } = req.query;
    year = year ? parseInt(year,10) : new Date().getFullYear();
    month = month ? parseInt(month,10) : new Date().getMonth() + 1;

    const pipeline = [
        {
            $match: {
                status: {$eq: Completed}
            }
        },
        {
            $project: {
                year: {
                    $year: "$createdAt"
                },
                quarter: {
                    $cond: [{$lte: [{$month: "$createdAt"}, 3]}, 1,
                    {
                        $cond: [{$lte: [{$month: "$createdAt"}, 6]}, 2,
                        {
                            $cond: [{$lte: [{$month: "$createdAt"}, 9]}, 3,4]
                        }
                    ]
                }]},
                month: {
                    $month: "$createdAt"
                },
                week: {
                    $week: "$createdAt"
                },
                day: {
                    $dayOfMonth: "$createdAt"
                },
                contractAmount: '$contractAmount'
            }
        }, {
            $match: {
                year: {
                    $eq: year
                }
            }
        }, 
        {
            $group: 
            {
                '_id': {},    // all
                'total': {
                    $sum: '$contractAmount'
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ];

    pipeline[3].$group._id[period] = `$${period}`;
    
    if (period === 'day') {
        pipeline[2].$match.month = {
            $eq: month
        };
        pipeline[3].$group._id.month = '$month';
    }

    console.log(period);
    
    // has 1 case override line 66
    pipeline[3].$group._id.year = '$year';

    const results = await Contract.aggregate(pipeline);

    res.status(200).json({
        success: true,
        count: results.length,
        data: results
    });
});

exports.getDashboard = asyncHandler(async (req, res, next) => {
    const tagLength = await Tag.find().countDocuments();
    const specializationLlength = await Specialization.find().countDocuments();
    const userLength = await User.find().countDocuments();
    const contractLength = await Contract.find().countDocuments();
    const complaintLength = await Complaint.find().countDocuments();
    
    res.status(200).json({
        success: true,
        data: [
            {
                name: 'Tag',
                length: tagLength
            },
            {
                name: 'Specialization',
                length: specializationLlength
            },
            {
                name: 'User',
                length: userLength
            },
            {
                name: 'Contract',
                length: contractLength
            },
            {
                name: 'Complaint',
                length: complaintLength
            },
        ]
    });

})