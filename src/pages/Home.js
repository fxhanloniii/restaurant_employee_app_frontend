import React, { useEffect, useState } from 'react';


const Home = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/')  
          .then(response => response.json())
          .then(data => {
            setMessage(data.message);
          })
          .catch(error => {
            console.error(error);
          });
      }, []);
    
  return (
    <div>Message: {message}</div>
  )
}

export default Home