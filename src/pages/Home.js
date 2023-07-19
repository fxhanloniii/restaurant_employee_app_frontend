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

  const fetchMessages = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/messages/`);
    const data = await response.json();
    setMessages(data);
  }

  const fetchOutOfStockItems = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/out-of-stock-items/`);
    const data = await response.json();
    setOutOfStockItems(data);
  };

  const handlePostMessage = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ 
        content: newMessage,
        username: currentUser.username 
       }),
    });
    if (response.ok) {
      fetchMessages();
      setNewMessage('');
    }
  };

  const handlePostOutOfStockItem = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/out-of-stock-items/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Token ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ 
        name: newItemName,
        username: currentUser.username 
       }),
    });
    if (response.ok) {
      fetchOutOfStockItems();
      setNewItemName('');
    }
  };

  const deleteMessage = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/messages/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      fetchMessages();
    }
  };

  const deleteOutOfStockItem = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/out-of-stock-items/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Token ${localStorage.getItem('token')}`,
      },
    });
    if (response.ok) {
      fetchOutOfStockItems();
    }
  };
    
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
        <div className="message-board">
        <h2 className="messageBoard">Message Board</h2>
        {currentUser && currentUser.group === 'Manager' && (
          <div className="inputbutton">
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Write a message..." />
            <button className="loginbutton" onClick={handlePostMessage}>Post Message</button>
          </div>
        )}
        <div className="messageBox">
          {messages.map((message) => (
            <div className="message" key={message.id}>
              <p>{message.content}:{message.username}</p>
              {currentUser && currentUser.group === 'Manager' && (
                <button className="delete" onClick={() => deleteMessage(message.id)}>X</button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="out-of-stock">
        <h2 className="bar86">Bar 86 List</h2>
        {currentUser && currentUser.group === 'Manager' && (
          <div className="inputbutton">
            <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Out of stock item" />
            <button className="loginbutton" onClick={handlePostOutOfStockItem}>Post Item</button>
          </div>
        )}
        <div className="messageBox">
          {outOfStockItems.map((item) => (
            <div className="message" key={item.id}>
              <p>{item.name}</p>
              {currentUser && currentUser.group === 'Manager' && (
                <button className="delete" onClick={() => deleteOutOfStockItem(item.id)}>X</button>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default Home