import React from 'react'
import { Link } from 'react-router-dom';

const Header = ({ currentUser, logOut }) => {

 

  return (
    <div className="header">
      <div className="logo">
        <img src="images/logo.png" alt="logo" />
      </div>
      <div className="navbar"> 
        <Link className="navbar-link" to='/'>Home</Link>
        <Link className="navbar-link" to='/foodmenu'>Dinner</Link>
        <Link className="navbar-link" to='/cocktails'>Cocktails</Link>
        <Link className="navbar-link" to='/wine'>Wine</Link>
        {currentUser ? null : <Link className="navbar-link loginbutton" to='/login'>Log In</Link>}
        {currentUser && <button onClick={logOut} className="logoutbutton">Logout</button>}
      </div>
    </div>
  )
}

export default Header