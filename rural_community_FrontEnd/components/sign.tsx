"use client";
import Link from "next/link";
import React, { useState } from "react";

function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailOtp: "",
    phoneNo: "",
    phoneOtp: "",
    password: "",
    confirmPassword: "",
  });


  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSendOtp = async (type: string) => {
    
    try {
      const response = await fetch(`http://localhost:9009/api/ruralcommunity/emailGenerateOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [type]:type === "email" ? formData.email:formData.phoneNo,
          // value: type === "email" ? formData.email : formData.phoneNo,
        })
      });

      if (response.ok) {
        if (type === "email") {
          setEmailOtpSent(true);
        } 
        // else {
        //   setPhoneOtpSent(true);
        // }
        setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} OTP sent!`);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error:any) {
      setMessage(`Network error: ${error.message}`);
    }
  };

  const handleVerifyOtp = async (type: string) => {
    
    try {
      const response = await fetch(`http://localhost:9009/api/ruralcommunity/emailVerifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [type]:type === "email" ? formData.email:formData.phoneNo,
          
          otp: type === "email" ? formData.emailOtp : formData.phoneOtp,
        }),
      });

      if (response.ok) {
        if (type === "email") {
          setEmailOtpVerified(true);
        }
        //  else {
        //   setPhoneOtpVerified(true);
        // }
        setMessage(
          `${type.charAt(0).toUpperCase() + type.slice(1)} OTP verified!`
        );
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent default form submission

    if (!validatePasswords()) {
      return;
    }
    if (!emailOtpVerified) {
      setMessage("Please verify both Email and Phone OTPs before signing up.");
      return;
    }

    // Form data to be sent to backend
    const signupData = {
      name: formData.name,
      email: formData.email,
      phoneNo: formData.phoneNo,
      password: formData.password,
    };
    try {
      const response = await fetch("http://localhost:9009/api/ruralcommunity/signup", {
        // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage("Signup successful!");  
        setFormData({ name: "",
          email: "",
          emailOtp: "",
          phoneNo: "",
          phoneOtp: "",
          password: "",
          confirmPassword: "",})
        window.location.href = '/login';
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error:any) {
      setMessage(`Network error: ${error.message}`);
    }
  };

  return (
    <div className="signup-form-container">
    <div className="top-nav">
    <span className="title">Rural Community</span>
    <Link href="/login" className="login-account">Login</Link>
  </div>
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Name</label>
          </div>

          <div className="input-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Email</label>
          </div>
         

          <div className="input-container">
              
          <div className="otp-button-container">
              {!emailOtpSent ? (
                <button
                  type="button"
                  className="otp-button"
                  onClick={() => handleSendOtp("email")}
                >
                  Send OTP
                </button>
              ) : (
                <button
                  type="button"
                  className="otp-button"
                  onClick={() => handleVerifyOtp("email")}
                  disabled={emailOtpVerified}
                >
                  {emailOtpVerified ? "Verified" : "Verify OTP"}
                </button>
              )}
            </div>
            <input
              type="text"
              name="emailOtp"
              value={formData.emailOtp}
              onChange={handleChange}
              placeholder=" "
              disabled={!emailOtpSent || emailOtpVerified}
              required
            />
            <label>Email OTP</label>
         
            
          </div>

          <div className="input-container">
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Phone Number</label>
            {/* <div className="otp-button-container">
              {!phoneOtpSent ? (
                <button
                  type="button"
                  className="otp-button"
                  onClick={() => handleSendOtp("phone")}
                >
                  Send OTP
                </button>
              ) : (
                <button
                  type="button"
                  className="otp-button"
                  onClick={() => handleVerifyOtp("phone")}
                  disabled={phoneOtpVerified}
                >
                  {phoneOtpVerified ? "Verified" : "Verify OTP"}
                </button>
              )}
            </div> */}
          </div>

          {/* <div className="input-container">
            <input
              type="text"
              name="phoneOtp"
              value={formData.phoneOtp}
              onChange={handleChange}
              placeholder=" "
              disabled={!phoneOtpSent || phoneOtpVerified}
              required
            />
            <label>Phone OTP</label>
          </div> */}

          <div className="input-container">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Password</label>
          </div>

          <div className="input-container">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Confirm Password</label>
            {passwordError && <p className="error">{passwordError}</p>}
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
          <div className="separator">
                                <hr />
                            </div>
          <div className="forgot-password">
                                <a href="/login">Already have account ? please login</a>
                            </div>
                          
        </form>
        <p className="message">{message}</p>
      </div>
    </div>
  );
}

export default SignUpForm;
