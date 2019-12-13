const passport = require('passport');
const createError = require('http-errors');
const Admin = require('../models/Admin');

const protectedGetme = (req, res, next) => {
    passport.authenticate('jwt', {
        session: false,
    }, async (error, jwtPayload) => {
        if (error || !jwtPayload) {
            return next(new createError(401, 'Please sign in to continue'));
        }

        admin = await Admin.findById(jwtPayload.id);
        if (!admin) {
            return next(new createError(401, 'Token invalid'));
        }

        req.user = admin;
        next();
    })(req, res, next);
}


const protected = (req, res, next) => {
    passport.authenticate('jwt', {
        session: false,
    }, async (error, jwtPayload) => {
        if (error || !jwtPayload) {
            return next(new createError(401, 'Token invalid'));
        }
        console.log('in protected jwtPaylod');
        console.log(jwtPayload);

        req.user = jwtPayload;
        next();
    })(req, res, next);
}



const authorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new createError(403, 'You are not authorized to access this page'));
        }
        next();
    };
};

module.exports = {
    protectedGetme,
    protected,
    authorized
};