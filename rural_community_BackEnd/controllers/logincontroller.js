const loginModel = require('../models/loginModel');
const { setUser } = require('../service/jwtService');
const signUpModel = require('../models/signupModel')
const bcrypt = require('bcrypt');
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;   

    try {

        // Find the user by email
        const userData = await signUpModel.findOne({ email: email });

        if (!userData) {
            return res.status(400).json({ message: 'Email is not registered' });
        }

        // Compare the input password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Password is incorrect' });
        }

        // Generate a JWT token using the setUser function from jwtService
        const token = setUser(userData);
        

        // Send the token as a cookie
        res.cookie('uid', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // Expires in 1 hour
        res.setHeader('Authorization', `Bearer ${token}`);


        res.status(200).json({ message: 'Login successful', token: token });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
