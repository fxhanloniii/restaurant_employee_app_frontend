import React, { useState, useEffect } from 'react';
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Checkin if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo(token);
    }
  },[]);

  const fetchUserInfo = async (token) => {
    try {
      
      // API call to fetch user info
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      
      setCurrentUser({ username: data.username, group: data.group });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Log In
  const handleLogin = async (username, password) => {
    try {
      // Perform login API call
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      if (data.token) {
        // Login successful
        localStorage.setItem('token', data.token);
        setCurrentUser({ username, group: data.group });
        
      } else {
        // Login failed
        console.log('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  console.log(currentUser);

  // Sign Up

  const handleSignup = async (username, password) => {
    try {
      // Perform signup API call
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Signup failed');
      }
      const data = await response.json();
      if (data.token) {
        // Signup successful
        localStorage.setItem('token', data.token);
        setCurrentUser({ username });
      } else {
        // Signup failed
        console.error('Signup failed:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Logout

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/logout/`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        // Logout successful
        localStorage.removeItem('token');
        setCurrentUser(null);
      } else {
        // Logout failed
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <Header currentUser={currentUser} logOut={handleLogout} />
      <Main onLogin={handleLogin} onSignup={handleSignup} currentUser={currentUser}  />
      <Footer />
    </div>
  );
}

export default App;


// https://github.com/fortana-co/react-dropzone-uploader
// https://react-dropzone-uploader.js.org/docs/quick-start
// https://www.geeksforgeeks.org/python-uploading-images-in-django/
