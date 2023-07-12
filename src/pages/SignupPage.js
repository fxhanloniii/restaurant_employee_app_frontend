import React from 'react'
import SignUp from '../components/SignUp'
const SignupPage = ({ onSignup }) => {
  return (
    <div>SignupPage
        <SignUp onSignup={onSignup} />
    </div>
  )
}

export default SignupPage