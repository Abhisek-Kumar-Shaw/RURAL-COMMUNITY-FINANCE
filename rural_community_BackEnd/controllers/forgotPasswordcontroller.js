const signUpModel = require('../models/signupModel')
const crypto = require('crypto');
const nodemailer = require('nodemailer');


let otpStorage = {}; // Store OTPs for simplicity, replace with a DB in production

// Configure the email transporter using your email service
const transporter = nodemailer.createTransport({
    service: 'gmail', // For Gmail, use 'gmail'. For other services, use their respective SMTP settings.
    auth: {
        user: 'mdadilkhan.dev@gmail.com', // Your email address
        pass: 'pfcl ycta uexc xtll',  // Your email password or app password (if 2FA is enabled)
    },
});

// Generate OTP and send it to the user's email
exports.GenerateOtpForgotPassword = async (req, res) => {
    const { email } = req.body;    
    const userData = await signUpModel.findOne({ email: email });

    if (!userData) {
        return res.status(400).json({ message: 'Email is not registered' });
    }
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(1000, 9999).toString();

    // Store OTP with expiry time (e.g., 5 minutes)
    otpStorage[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    // Setup email data
    const mailOptions = {
        from: '"RuralCommunity" <RuralCommunityemail@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Your OTP Code', // Subject line
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`, // plain text body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }
        console.log('OTP email sent:', info.response);
        res.status(200).json({ message: 'OTP sent to your email' });
    });
};

// Verify OTP
exports.VerifyOtp = (req, res) => {
    const { email, otp } = req.body;
    const storedOtpData = otpStorage[email];

    if (!storedOtpData) {
        return res.status(400).json({ message: 'No OTP found for this email' });
    }

    if (storedOtpData.expiresAt < Date.now()) {
        return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedOtpData.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid
    res.status(200).json({ message: 'OTP verified successfully' });
};
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Validate input
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required' });
        }

        // Find the user by email
        const user = await signUpModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Set the new password (middleware will handle hashing)
        user.password = newPassword;

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Password changed successfully!' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};
