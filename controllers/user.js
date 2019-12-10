const createError = require('http-errors');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const User = require('../models/user');


exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        data: users
    });
});


// can lookup in student then tutor, this may be faster, but i want to write different type of query
exports.getUser = asyncHandler(async (req, res, next) => {
    let user, users;
    // issues: 
    // https://stackoverflow.com/questions/36193289/moongoose-aggregate-match-does-not-match-ids
    const id = mongoose.Types.ObjectId(req.params.id);

    user = await User.findById(req.params.id);

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
