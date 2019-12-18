const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const User = require('../models/User');

// @route:      GET /api/users
// @access:     private (root, admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
    const results = await User.find();
    res.status(200).json({
        success: true,
        data: {
            count: results.length,
            results
        }
    });
});


// @route:      GET /api/users
// @access:     private (root, admin)
// @note:       can lookup in student then tutor, this may be faster, 
//              but i want to write different type of query
exports.getUser = asyncHandler(async (req, res, next) => {
    let user, users;

    // issues: https://stackoverflow.com/questions/36193289/moongoose-aggregate-match-does-not-match-ids 
    const id = mongoose.Types.ObjectId(req.params.id);

    user = await User.findById(req.params.id);
    if (!user) {
        return next(new createError(404, 'User not found'));
    }

    // now reverse popolate user -> tutor
    // FROM users INNER JOIN tutors WHERE users._ID = tutors.tutorInfo
    // Then we have tutorInfo is a array of object tutors, use unwind to transform property
    // FROM currents INNER JOIN tags WHERE tutorInfo.tags = tags._id
    // Again we receive tutorInfo.tags as array, but now we dont want unwind
    // 51-67 tsdf

    if (user.role === 'tutor') {
        user = null;
        users = await User.aggregate([{
            $match: {
                _id: id
            }
        }, {
            $lookup: {
                from: 'tutors',
                localField: '_id',
                foreignField: 'userInfo',
                as: 'tutorInfo'
            },
        }, {
            $unwind: "$tutorInfo"
        }, {
            $lookup: {
                from: 'tags',
                localField: 'tutorInfo.tags',
                foreignField: '_id',
                as: 'tutorInfo.tags'
            }
        }, {
            $project: {
                password: 0,
                // tags: `$tutorInfo.tags`,
                // paymentPerHour: `$tutorInfo.paymentPerHour`,
                // selfIntro: `$tutorInfo.selfIntro`
            }
        }])
    }

    res.status(200).json({
        success: true,
        data: user !== null ? user : users[0]
    });
});


// @des:        Lock/ Unlock user account
// @route:      PUT /api/users/:id
// @access:     private (root, admin)
exports.setActiveUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new createError(404, 'User not found'));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});
