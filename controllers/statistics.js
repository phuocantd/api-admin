const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const Contract = require('../models/Contract');

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

    if (period !== year) pipeline[3].$group._id.year = '$year';

    const results = await Contract.aggregate(pipeline);

    res.status(200).json({
        success: true,
        count: results.length,
        data: results
    });
});
