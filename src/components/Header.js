import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Header = ({ currentUser, logOut }) => {

  const [dropDown, setDropDown] = useState(false)

  const toggleDropdown = () => {
    setDropDown(prevState => !prevState);
  };

  return (
    <div className="header">
      <div className="logo">
        <img src="images/logo.png" alt="logo" />
      </div>
      <button className="dropdown-button" onClick={toggleDropdown}>
            &#9776;
      </button>
      <div className="navbar"> 
        <Link className="navbar-link" to='/'>Home</Link>
        <Link className="navbar-link" to='/foodmenu'>Dinner</Link>
        <Link className="navbar-link" to='/cocktails'>Cocktails</Link>
        <Link className="navbar-link" to='/wine'>Wine</Link>
        {currentUser ? null : <Link className="navbar-link loginbutton" to='/login'>Log In</Link>}
        {currentUser && <button onClick={logOut} className="logoutbutton">Logout</button>}
      </div>
      <div className="dropdown-menu">
          
          {dropDown && (
            <div className="dropdown-content">
              <Link className="dropdown-link" to="/" onClick={toggleDropdown} >Home</Link>
              <Link className="dropdown-link" to="/foodmenu" onClick={toggleDropdown} >Dinner</Link>
              <Link className="dropdown-link" to="/cocktails" onClick={toggleDropdown} >Cocktails</Link>
              <Link className="dropdown-link" to="/wine" onClick={toggleDropdown} >Wine</Link>
              {currentUser ? null : <Link className="navbar-link loginbutton" to="/login" onClick={toggleDropdown} >Log In</Link>}
              {currentUser && (
                <button onClick={() => { logOut(); toggleDropdown(); }} className="logoutbutton">
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
        
      </div>

    // </div>
  )
}

export default Header