'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import '../../../../style/forgotPasswordForm.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // To track the current step

  // Step 1: Send OTP
  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9009/api/ruralcommunity/forgotpassword/generateOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("OTP sent to your email!");
        setCurrentStep(2); // Move to OTP input step
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Network Error: ${error.message}`);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9009/api/ruralcommunity/forgotpassword/verifyOtp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setMessage("OTP Verified!");
        setCurrentStep(3); // Move to password reset step
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Network Error: ${error.message}`);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:9009/api/ruralcommunity/forgotpassword/resetPassword", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        setMessage("Password reset successfully!");
        // Redirect to login page
        setTimeout(() => window.location.href = '/login', 2000); // Redirect after 2 seconds
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Network Error: ${error.message}`);
    }
  };

  return (
    <div className="forgotPassword">
      <div className="top-nav">
        <span className="title">Rural Community</span>
        <Link href="/signup" className="create-account">Create a New Account</Link>
      </div>

      {currentStep === 1 && (
        <div className='forgotPasswordMain'>
              <h1>Forgot Password ?</h1>
          <p>No worries, we'll send you reset instructions.</p>
          <form onSubmit={handleSendOtp}>
            <div className="input-container">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
            </div>
            <button type="submit" className="resetpassword">Send OTP</button>
            <Link href="/login" className="back-to-login">
              <span className="arrow-left">&#9664;</span> Back to Login
            </Link>
          </form>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h1>Password Reset</h1>
          <p>We sent a code to {email}</p>
          <div className="otp-inputs">
            <input type="text" value={otp[0] || ''} onChange={(e) => setOtp(prev => e.target.value + prev.slice(1))} maxLength={1} />
            <input type="text" value={otp[1] || ''} onChange={(e) => setOtp(prev => prev[0] + e.target.value + prev.slice(2))} maxLength={1} />
            <input type="text" value={otp[2] || ''} onChange={(e) => setOtp(prev => prev.slice(0, 2) + e.target.value + prev.slice(3))} maxLength={1} />
            <input type="text" value={otp[3] || ''} onChange={(e) => setOtp(prev => prev.slice(0, 3) + e.target.value)} maxLength={1} />
          </div>
          <button onClick={handleVerifyOtp} className="resetpassword">Verify OTP</button>
          <p>Didn't receive the OTP? <a href="/login/forget_password" className="back-to-login" onClick={handleSendOtp}>Resend</a></p>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <h1>Set New Password</h1>
          <p>Must be at least 8 character</p>
          <form onSubmit={handleResetPassword}>
            <div className="input-container">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <label>New Password</label>
            </div>
            <div className="input-container">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label>Confirm Password</label>
            </div>
            <button type="submit" className="resetpassword">Reset Password</button>
            <Link href="/" className="back-to-login">
              <span className="arrow-left">&#9664;</span> Back to Login
            </Link>
          </form>
        </div>
      )}

      <div className="pagination-bar-container">
        <div
          className={`pagination-bar pagination-bar-step-${currentStep}`}
        ></div>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
