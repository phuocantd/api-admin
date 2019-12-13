const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please fill in email address'],
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email invalid']
    },
    password: {
        type: String,
        required: [true, 'Please fill in password'],
        minlength: 6,
        select: false
    },
    name: {
        type: String,
        required: [true, 'Please fill in your name']
    },
    avatar: {
        type: String,
        default: 'https://my-final-project-ptudwnc.s3-ap-southeast-1.amazonaws.com/firefly_by_guweiz_d9kjcqt-fullview/40c8569c-aaa2-4cca-bd67-d2876632b366.jpg'
    },
    role: {
        type: String,
        default: 'admin'
    }
})



module.exports = mongoose.model('Admin', AdminSchema);