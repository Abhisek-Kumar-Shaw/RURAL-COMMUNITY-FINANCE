const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const signUpSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure unique emails
        match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Validate email format
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'], // Set a minimum password length
    },
    phoneNo: {
        type: Number,   // Missing type added (it can also be a Number if preferred)
        required: true,
        unique: true
    }
});

signUpSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); // Hash password with salt factor 10
    }
    next();
});
const signUpModel = mongoose.model('signUpModel', signUpSchema);
module.exports = signUpModel;
