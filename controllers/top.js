const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const Contract = require('../models/Contract');

const { Completed } = require('../constants/constant');


exports.getTopByTutor = asyncHandler(async (req, res, next) => {
    let {day, week, month, quarter, year, all} = req.query;
    year = year ? parseInt(year, 10) : new Date().getFullYear();
    if (quarter) quarter = parseInt(quarter, 10);
    if (month) month = parseInt(month, 10);
    if (week) week = parseInt(week, 10);
    if (week) week = parseInt(week, 10);
    if (day) day = parseInt(day, 10);
    
    const pipeline = [
        {
            $match: {status: {$eq: Completed}}
        },
        {
            $lookup: {
                from: 'tutors',
                localField: 'tutor',
                foreignField: '_id',
                as: 'tutor'
            }
        },
        {
            $unwind: {path: '$tutor'}
        },
        {
            $lookup: {
                from: 'users',
                localField: 'tutor.userInfo',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $unwind: {path: '$userInfo'}
        },
        {
            $project: 
            {
                year: {$year: "$createdAt"},
                quarter: {
                    $cond: [{$lte: [{$month: "$createdAt"}, 3]}, 1,{
                        $cond: [{$lte: [{$month: "$createdAt"}, 6]}, 2,{
                            $cond: [{$lte: [{$month: "$createdAt"}, 9]}, 3, 4]
                        }]}]
                },
                month: {$month: "$createdAt"},
                week: {$week: "$createdAt"},
                day: {$dayOfMonth: "$createdAt"},
                userId: '$userInfo._id',
                name: '$userInfo.name',
                contractAmount: '$contractAmount'
            }
        },
        {
            $match: {}
        },
        {
            $group: {
                '_id': {
                    //year: '$year',
                    //month: '$month',
                    //day: '$day',
                    'userId': '$userId',
                    'name': '$name'
                },
                'total': {
                    $sum: '$contractAmount'
                }
            }
        },
        {
            $sort: {total: -1} 
        },
        {
            $group: 
            {
                '_id': {
                    // year: '$_id.year',
                    // month: '$_id.month'
                    // day: '$_id.day'
                },
                tutors: 
                {
                    $push: 
                        {
                            userId: '$_id.userId',
                            name: '$_id.name',
                            total: '$total'
                        }
                }
            }
        },
        {
            $project: {
                _id: '$_id',
                tutors: {
                    $slice: [ '$tutors', 5]
                }
            }
        },
    ];

    if (!all) {
        if (year) {
            pipeline[6].$match.year = {$eq: year};
            pipeline[7].$group._id.year = '$year';
            pipeline[9].$group._id.year = '$_id.year';
        }

        if (quarter) {
            pipeline[6].$match.quarter = {$eq: quarter};
            pipeline[7].$group._id.quarter = '$quarter';
            pipeline[9].$group._id.quarter = '$_id.quarter';
        }        

        if (month) { 
            pipeline[6].$match.month = {$eq: month};
            pipeline[7].$group._id.month = '$month';
            pipeline[9].$group._id.month = '$_id.month';
        }

        if (week) {
            pipeline[6].$match.week = {$eq: week};
            pipeline[7].$group._id.week = '$week';
            pipeline[9].$group._id.week = '$_id.week';
        }

        if (day) { 
            pipeline[6].$match.day = {$eq: day};
            pipeline[7].$group._id.day = '$day';
            pipeline[9].$group._id.day = '$_id.day';
        }
    }                    
    
    const results = await Contract.aggregate(pipeline);

    res.status(200).json({
        success: true,
        data: results
    });
});


exports.getTopByTag = asyncHandler(async (req, res, next) => {
    let { day, week, month, quarter, year, all } = req.query;
    year = year ? parseInt(year, 10) : new Date().getFullYear();
    if (quarter) quarter = parseInt(quarter, 10);
    if (month) month = parseInt(month, 10);
    if (week) week = parseInt(week, 10);
    if (week) week = parseInt(week, 10);
    if (day) day = parseInt(day, 10);

    const pipeline = [
        {
            $match: { status: { $eq: Completed }}
        },
        {
            $lookup: {
                from: 'tutors',
                localField: 'tutor',
                foreignField: '_id',
                as: 'tutor'
            }
        },
        {
            $unwind: {
                path: '$tutor'
            }
        },
        {
            $lookup: 
            {
                from: 'tags',
                let: {'tagIds': '$tutor.tags'},
                pipeline: [{
                    $match: {
                        $expr: { $in: ['$_id', '$$tagIds'] }
                    }
                }],
                as: 'tutor.tags'
            }
        },
        {
            $unwind: { path: '$tutor.tags'}
        },
        {
            $project: {
                year: {
                    $year: "$createdAt"
                },
                quarter: {
                    $cond: [{
                        $lte: [{ $month: "$createdAt"}, 3]}, 1, {
                        $cond: [{
                            $lte: [{ $month: "$createdAt" }, 6]}, 2, {
                            $cond: [{
                                $lte: [{ $month: "$createdAt"}, 9]
                            }, 3, 4]
                        }]
                    }]
                },
                month: {
                    $month: "$createdAt"
                },
                week: {
                    $week: "$createdAt"
                },
                day: {
                    $dayOfMonth: "$createdAt"
                },
                tagId: '$tutor.tags._id',
                tagName: '$tutor.tags.name',
                contractAmount: '$contractAmount'
            }
        },
        {
            $match: {}
        },
        {
            $group: {
                '_id': {
                    tagId: '$tagId',
                    tagName: '$tagName',
                },
                'total': {
                    $sum: '$contractAmount'
                }
            }
        },
        {
            $sort: {total: -1}
        },
        {
            $group: {
                '_id': {},
                tags: {
                    $push: {
                        tagId: '$_id.tagId',
                        tagName: '$_id.tagName',
                        total: '$total'
                    }
                }
            }
        },
        {
            $project: {
                _id: '$_id',
                tags: {
                    $slice: ['$tags', 5]
                }
            }
        },
    ];

    if (!all) {
        if (year) {
            pipeline[6].$match.year = {
                $eq: year
            };
            pipeline[7].$group._id.year = '$year';
            pipeline[9].$group._id.year = '$_id.year';
        }

        if (quarter) {
            pipeline[6].$match.quarter = {
                $eq: quarter
            };
            pipeline[7].$group._id.quarter = '$quarter';
            pipeline[9].$group._id.quarter = '$_id.quarter';
        }

        if (month) {
            pipeline[6].$match.month = {
                $eq: month
            };
            pipeline[7].$group._id.month = '$month';
            pipeline[9].$group._id.month = '$_id.month';
        }

        if (week) {
            pipeline[6].$match.week = {
                $eq: week
            };
            pipeline[7].$group._id.week = '$week';
            pipeline[9].$group._id.week = '$_id.week';
        }

        if (day) {
            pipeline[6].$match.day = {
                $eq: day
            };
            pipeline[7].$group._id.day = '$day';
            pipeline[9].$group._id.day = '$_id.day';
        }
    }

    const results = await Contract.aggregate(pipeline);

    res.status(200).json({
        success: true,
        data: results
    });
});


// exports.getTopByTag = asyncHandler(async (req, res, next) => {
//     let {period, month, year} = req.query;
//     year = year ? parseInt(year, 10) : new Date().getFullYear();
//     month = month ? parseInt(month, 10) : new Date().getMonth() + 1;

//     const pipeline = [
//         {
//             $match: {status: { $eq: Completed }}
//         },
//         {
//             $lookup: {
//                 from: 'tutors',
//                 localField: 'tutor',
//                 foreignField: '_id',
//                 as: 'tutor'
//             }
//         },
//         {
//             $unwind: { path: '$tutor'}
//         },
//         {
//             $lookup: {
//                 from: 'tags',
//                 let: {
//                     'tagIds': '$tutor.tags'
//                 },
//                 pipeline: [{
//                     $match: {
//                         $expr: {
//                             $in: ['$_id', '$$tagIds']
//                         }
//                     }
//                 }],
//                 as: 'tutor.tags'
//             }
//         },
//         {
//             $unwind: {
//                 path: '$tutor.tags'
//             }
//         },
//         {
//             $project: {
//                 year: {
//                     $year: "$createdAt"
//                 },
//                 quarter: {
//                     $cond: [{
//                         $lte: [{$month: "$createdAt"}, 3]}, 1, {
//                         $cond: [{
//                             $lte: [{$month: "$createdAt"}, 6]}, 2, {
//                             $cond: [{
//                                 $lte: [{$month: "$createdAt"}, 9]
//                             }, 3, 4]
//                         }]
//                     }]
//                 },
//                 month: {
//                     $month: "$createdAt"
//                 },
//                 week: {
//                     $week: "$createdAt"
//                 },
//                 day: {
//                     $dayOfMonth: "$createdAt"
//                 },
//                 tagId: '$tutor.tags._id',
//                 tagName: '$tutor.tags.name',
//                 contractAmount: '$contractAmount'
//             }
//         },
//         {
//             $match: { year: { $eq: year } }
//         },
//         {
//             $group: {
//                 '_id': { tagId: '$tagId', tagName: '$tagName' },
//                 'total': { $sum: '$contractAmount' }
//             }
//         },
//         {
//             $sort: {
//                 // '_id.year': 1, '_id.month': 1, '_id.day': 1, 'total': -1 // time ascending, total descending
//             }
//         },
//         {
//             $group: {
//                 '_id': {}, // all
//                 tags: {
//                     $push: {
//                         tagId: '$_id.tagId',
//                         name: '$_id.tagName',
//                         total: '$total'
//                     }
//                 }
//             }
//         },
//         {
//             $project: {
//                 _id: '$_id',
//                 tags: {
//                     $slice: ['$tags', 5]    // select top 3
//                 }
//             }
//         },
//         {
//             $sort: {
//                 _id: 1
//             } // rememer sort date ascending after all
//         }
//     ];

//     pipeline[7].$group._id.year = '$year';
//     if (period === 'day') {
//         pipeline[6].$match.month = {
//             $eq: month
//         };
//         pipeline[7].$group._id.month = '$month';
//     }
//     pipeline[7].$group._id[period] = `$${period}`;

//     pipeline[8].$sort['_id.year'] = 1;
//     if (period === 'day') {
//         pipeline[8].$sort['_id.month'] = 1;
//     }
//     pipeline[8].$sort[`_id.${period}`] = 1; // sort by date ascending
//     pipeline[8].$sort['total'] = -1;


//     pipeline[9].$group._id[period] = `$_id.${period}`;
//     if (period === 'day') {
//         pipeline[9].$group._id.month = `$_id.month`;
//     }
//     pipeline[9].$group._id.year = `$_id.year`;

//     const results = await Contract.aggregate(pipeline);

//     res.status(200).json({
//         success: true,
//         data: results
//     });
    
// });


// exports.getTopByTutor = asyncHandler(async (req, res, next) => {
//     let {period, month, year} = req.query;
//     year = year ? parseInt(year, 10) : new Date().getFullYear();
//     month = month ? parseInt(month, 10) : new Date().getMonth() + 1;

//     const pipeline = [
//         {
//             $match: {status: {$eq: Completed}}
//         },
//         {
//             $lookup: {
//                 from: 'tutors',
//                 localField: 'tutor',
//                 foreignField: '_id',
//                 as: 'tutor'
//             }
//         },
//         {
//             $unwind: {path: '$tutor'}
//         },
//         {
//             $lookup: {
//                 from: 'users',
//                 localField: 'tutor.userInfo',
//                 foreignField: '_id',
//                 as: 'userInfo'
//             }
//         },
//         {
//             $unwind: {path: '$userInfo'}
//         },
//         {
//             $project: 
//             {
//                 year: {$year: "$createdAt"},
//                 quarter: {
//                     $cond: [{$lte: [{$month: "$createdAt"}, 3]}, 1,{
//                         $cond: [{$lte: [{$month: "$createdAt"}, 6]}, 2,{
//                             $cond: [{$lte: [{$month: "$createdAt"}, 9]}, 3, 4]
//                         }]}]
//                 },
//                 month: {$month: "$createdAt"},
//                 week: {$week: "$createdAt"},
//                 day: {$dayOfMonth: "$createdAt"},
//                 userId: '$userInfo._id',
//                 name: '$userInfo.name',
//                 contractAmount: '$contractAmount'
//             }
//         },
//         {
//             $match: {year: {$eq: year}}
//         },
//         {
//             $group: {
//                 '_id': {userId: '$userId', name: '$name'}, // all
//                 'total': {$sum: '$contractAmount'}
//             }
//         },
//         {
//             $sort: {
//                 // '_id.year': 1, '_id.month': 1, '_id.day': 1, 'total': -1 // time ascending, total descending
//             } 
//         },
//         {
//             $group: {
//                 '_id': {},  // all
//                 tutors: {$push: {
//                     userId: '$_id.userId',
//                     name: '$_id.name',
//                     total: '$total'
//                 }}
//             }
//         },
//         {
//             $project: {
//                 _id: '$_id',
//                 tutors: {
//                     $slice: [
//                         '$tutors',
//                         3
//                     ]
//                 }
//             }
//         },
//         {
//             $sort: {_id: 1} // rememer sort date ascending after all
//         }
//     ];

//     pipeline[7].$group._id.year = '$year';
//     if (period === 'day') {
//         pipeline[6].$match.month = {$eq: month};
//         pipeline[7].$group._id.month = '$month';
//     }
//     pipeline[7].$group._id[period] = `$${period}`;

//     pipeline[8].$sort['_id.year'] = 1;
//     if (period === 'day') {
//         pipeline[8].$sort['_id.month'] = 1;
//     } 
//     pipeline[8].$sort[`_id.${period}`] = 1;    // sort by date ascending
//     pipeline[8].$sort['total'] = -1;


//     pipeline[9].$group._id[period] = `$_id.${period}`;
//     if (period === 'day') {
//         pipeline[9].$group._id.month = `$_id.month`;
//     }
//     pipeline[9].$group._id.year = `$_id.year`;

//     const results = await Contract.aggregate(pipeline);

//     res.status(200).json({
//         success: true,
//         data: results
//     });
// });
