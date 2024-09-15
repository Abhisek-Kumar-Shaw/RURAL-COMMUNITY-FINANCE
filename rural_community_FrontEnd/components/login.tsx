'use client';
import Link from 'next/link';
import React, { useState } from 'react';


function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault(); // Prevent the default form submission

        const loginData = { email, password };

        try {
            const response = await fetch('http://localhost:9009/api/ruralcommunity/login',{
                method: 'POST',
                // credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
            
            if (response.ok) { 
                
                // cookies.set('token', response.token, { expires: 1 });
                const result = await response.json();
                setMessage('Login successful!');
                // window.location.href ='/'
            } else {
                const error = await response.json();
                setMessage(`Error: ${error.message}`);
            }
        } catch (error:any) {
            setMessage(`Network error: ${error.message}`);
        }
    };

    return (
        <>
            <div className="frame">
                <div className="left-part">
                    <h1>Rural Community</h1>
                    <p>Now You Can Make Your Dream True</p>
                </div>
                <div className="right-part">
                    <div className="login-container">
                        <h2>Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-container">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder=" "
                                    required
                                />
                                <label for="email">Email</label>
                            </div>

                            <div className="input-container">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder=" "
                                    required
                                />
                                <label for="password">Password</label>
                            </div>

                            <button type="submit" className="login-button">Login</button>
                            <div className="forgot-password">
                                <a href="/login/forgot_password">Forgot Password?</a>
                            </div>
                            <div className="separator">
                                <hr />
                            </div>
                            <Link href={'/signup'}>
                        <button className="sign-up-button" type="button" >
                            Sign Up
                        </button>
                        </Link>
                        </form>
                        <p className="message">{message}</p>
                    </div>
                </div>
            </div>

            <div className="mobile-view">
                <h1>Rural Community</h1>
                <p>Now You can Make Your Dream True</p>
                <div className="login-container">
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label>Email</label>
                        </div>
                        <div className="input-container">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label>Password</label>
                        </div>
                        <button type="submit"  className="login-button" >Login</button>
                        <div className="forgot-password">
                            <a href="/forgot-password">Forgot Password?</a>
                        </div>
                        <div className="separator">
                            <hr />
                        </div>
                        <Link href={'/signup'}>
                        <button className="sign-up-button" type="button" >
                            Sign Up
                        </button>
                        </Link>
                    </form>
                    <p className="message">{message}</p>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
