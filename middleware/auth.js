const passport = require('passport');
const createError = require('http-errors');
const Admin = require('../models/Admin');

const protected = (req, res, next) => {
    passport.authenticate('jwt', {session: false,}, async (error, jwtPayload) => {
        if (error || !jwtPayload) {
            return next(new createError(401, 'Bạn không thể truy cập trang này'));
        }

        admin = await Admin.findById(jwtPayload.id);
        if (!admin) {
            return next(new createError(401, 'Bạn không thể truy cập trang này'));
        }

        req.user = admin;
        next();
    })(req, res, next);
}


const authorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new createError(403, 'Bạn không thể đủ quyền hạn truy cập trang này'));
        }
        next();
    };
};

module.exports = {
    protected,
    authorized
};