const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const Admin = require('../models/Admin');

const localStratery = new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    const user = await Admin.findOne({
        email: email
    }).select('+password');

    if (!user) return done('Account doesnt exist', false);
    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        return done(null, user);
    } else {
        return done('Invalid credentials', false);
    }
})

const jwtStrategy = new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, done) => {
    if (!jwtPayload) {
        return done(true, null);
    }
    return done(null, jwtPayload);
});


const passportConfig = () => {
    passport.use(localStratery);
    passport.use(jwtStrategy);
}


module.exports = passportConfig;
