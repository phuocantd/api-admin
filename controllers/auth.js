const createError = require('http-errors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async');

exports.login = (req, res, next) => {
    passport.authenticate('local', {
        session: false
    }, (errMessage, user) => {
        if (errMessage || !user) {
            return next(new createError(400, errMessage));
        }
        sendTokenResponse(200, res, user);
    })(req, res)
};


exports.getMe = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new createError(400, 'Đăng nhập không thành công'));
    }

    res.status(200).json({
        success: true,
        data: req.user
    });

});


const sendTokenResponse = (statusCode, res, user) => {
    const payload = {
        id: user.id,
        role: user.role
    }

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET);

    res.status(statusCode).json({
        success: true,
        token
    });
}
