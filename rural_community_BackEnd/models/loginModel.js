const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // To hash passwords

const loginSchema = mongoose.Schema({
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
    }
});

// Hash password before saving the user
loginSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); // Hash password with salt factor 10
    }
    next();
});

const LoginModel = mongoose.model('loginModel', loginSchema);
module.exports = LoginModel;
