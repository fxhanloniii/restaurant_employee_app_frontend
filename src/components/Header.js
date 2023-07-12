import React from 'react'
import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <div className="header">
      <div className="logo">
        <img src="images/logo.png" alt="logo" />
      </div>
      <div className="navbar"> 
        <Link className="navbar-link" to='/'>Home</Link>
        <Link className="navbar-link" to='/login'>Log In</Link>
        <Link className="navbar-link" to='/foodmenu'>Dinner Menu</Link>

      </div>
    </div>
  )
}

export default Header