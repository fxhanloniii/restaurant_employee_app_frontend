import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ currentUser }) => {
    
  const [messages, setMessages] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newItemName, setNewItemName] = useState('');
  
  useEffect(() => {
    fetchMessages();
    fetchOutOfStockItems();
  },[]);

  
    
  return (
    <div className="homepage">
      <div className="imageHero">
        <img src="images/image1.jpg" alt="restaurant photo" className="heroImage" />
      </div>
      <div className='homepage-body'>
        <div className="dashboard">
          {/* <div className="dashboard-header">
            {currentUser ? (
            <h1>Welcome {currentUser && currentUser.username}</h1>
            ) : (
              <h1>Dashboard</h1>
              )}
          </div> */}
          <div className="dashboard-sections">
            <Link className="dashboard-section dashboard-dinner" to='/foodmenu'>
              <h1>Dinner</h1>
            </Link>
            <Link className="dashboard-section dashboard-cocktails" to='/cocktails'>
              <h1>Cocktails</h1>
            </Link>
            <Link className="dashboard-section dashboard-wine" to='/wine'>
              <h1>Wine</h1>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home