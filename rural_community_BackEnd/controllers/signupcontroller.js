const signUpModel = require('../models/signupModel')
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.signUp = async (req, res) => {
    const { name, email, phoneNo, password } = req.body;
  
    try {
      const userData = await signUpModel.create({ name, email, phoneNo, password });
      return res.status(201).json({ message: 'Data posted successfully', userData });
    } catch (error) {
      return res.status(500).json({ message: 'Error saving data', error });
    }
  };

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
exports.emailGenerateOtp = (req, res) => {
    const { email } = req.body;
    console.log(req.body);
    

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

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
exports.emailVerifyOtp = (req, res) => {
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

exports.getUser = async (req, res) => {
    try {
        // Read query parameters for pagination (defaults: page=1, limit=10)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Calculate the number of documents to skip based on the page number
        const skip = (page - 1) * limit;

        // Fetch the users with pagination and get the total number of documents for metadata
        const [users, totalUsers] = await Promise.all([
            signUpModel.find().skip(skip).limit(limit),
            signUpModel.countDocuments()
        ]);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalUsers / limit);

        // Send paginated data along with metadata
        res.status(200).json({
            users,
            meta:{totalUsers,
            totalPages,
            currentPage: page,
            usersPerPage: limit},
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
      const { userId } = req.params; // Assuming the user ID is passed as a URL parameter
  
      const result = await signUpModel.deleteOne({ _id: userId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  };
  



