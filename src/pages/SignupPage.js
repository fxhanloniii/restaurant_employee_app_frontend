import React from 'react'
import SignUp from '../components/SignUp'
const SignupPage = ({ onSignup }) => {
  return (
    <div className="loginpage">
        <SignUp onSignup={onSignup} />
    </div>
  )
}

export default SignupPage