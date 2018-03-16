const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'sales', 'employee', 'helpdesk', 'admin'],
        default: 'user',
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

UserSchema.pre('save', function userPreSave(next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        return bcrypt.hash(user.password, 10)
            .then((hash) => {
                user.password = hash;
                return next();
            })
            .catch(err => next(err));
    }
    return next();
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.comparePassword = function userComparePassword(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);