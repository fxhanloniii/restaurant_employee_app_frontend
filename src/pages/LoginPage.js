import React from 'react'
import LogIn from '../components/LogIn'
import { Link } from 'react-router-dom';
const LoginPage = ({ onLogin }) => {
  return (
    <div>LoginPage
        <LogIn onLogin={onLogin} />

        <p>No Account? Sign Up Here</p>
        <Link className="navbar-link" to='/signup'>Sign Up</Link>
    </div>
  )
}

export default LoginPage