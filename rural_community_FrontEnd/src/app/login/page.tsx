import React from 'react'
import LoginForm from '../../../components/login'
import '../../../style/LoginForm.css'
import { headers,cookies } from 'next/headers'

const LoginPage = () => {
  
  return (
      <div className="App">
      <LoginForm />
  </div>
  )
}

export default LoginPage
