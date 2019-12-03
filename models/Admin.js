const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Vui lòng điền địa chỉ email'],
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Địa chỉ email không hợp lệ']
    },
    password: {
        type: String,
        required: [true, 'Vui lòng điền mật khẩu'],
        minlength: 6,
        select: false // không select password khi get single user
    },
    name: {
        type: String,
        required: [true, 'Vui lòng điền họ tên']
    },
    avatar: String,
    role: {
        type: String,
        default: 'admin'
    }
})



module.exports = mongoose.model('Admin', AdminSchema);