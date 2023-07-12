import React, { useEffect, useState } from 'react';

const FoodMenu = ({ currentUser }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergies, setAllergies] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const createMenuItem = async () => {
      try {
        const response = await fetch('http://localhost:8000/menu-items/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            ingredients,
            allergies,
            description,
            course,
            imageUrl,
          }),
        });
        if (response.ok) {
          const newItem = await response.json();
          setMenuItems([...menuItems, newItem]);
          // Reset the form fields
          setName('');
          setIngredients('');
          setAllergies('');
          setDescription('');
          setCourse('');
          setImageUrl('');
        } else {
          console.error('Error creating menu item:', response.status);
        }
      } catch (error) {
        console.error('Error creating menu item:', error);
      }
    };

    createMenuItem();
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await fetch(`http://localhost:8000/menu-items/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    try {
      await fetch(`http://localhost:8000/menu-items/${id}/`, {
        method: 'DELETE',
      });
      fetchMenuItems();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch the existing menu items on component mount
  
    const fetchMenuItems = async () => {
        const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8000/menu-items/', {
            headers: {
                Authorization: `Token ${token}`,
            },
        });
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
        } else {
          console.error('Error fetching menu items:', response.status);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

  return (
    <div className="foodMenu">
      <h1>Dinner</h1>
      {currentUser && currentUser.group === 'Manager' && (
      
      <form onSubmit={handleSubmit}>
        <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
            Ingredients:
            <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </label>
        <br />
        <label>
            Allergies:
            <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
        </label>
        <br />
        <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <br />
        <label>
            Course:
            <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
        </label>
        <br />
        <label>
            Image URL:
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </label>
        <br />
        <button type="submit">Create Menu Item</button>
      </form>


      )}
      <h2>Menu Items</h2>
      <ul>
        {menuItems.map((menuItem) => (
          <li key={menuItem.id}>
            <h3>{menuItem.name}</h3>
            <p>Ingredients: {menuItem.ingredients}</p>
            <p>Allergies: {menuItem.allergies}</p>
            <p>Description: {menuItem.description}</p>
            <p>Course: {menuItem.course}</p>
            <img src={menuItem.imageUrl} alt={menuItem.name} />
            {currentUser && currentUser.group === 'Manager' && (
                <div>
                    <button onClick={() => handleEdit(menuItem.id)}>Edit</button>
                    <button onClick={() => handleDelete(menuItem.id)}>Delete</button>
                </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodMenu;
