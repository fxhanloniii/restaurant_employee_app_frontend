import React, { useEffect, useState } from 'react';

const FoodMenu = ({ currentUser }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [allergies, setAllergies] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('');
  const [image_url, setImage_url] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

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
            image_url,
          }),
        });
        if (response.ok) {
          const newItem = await response.json();
          setMenuItems([...menuItems, newItem]);
          setShowForm(false);
          // Reset the form fields
          setName('');
          setIngredients('');
          setAllergies('');
          setDescription('');
          setCourse('');
          setImage_url('');
        } else {
          console.error('Error creating menu item:', response.status);
        }
      } catch (error) {
        console.error('Error creating menu item:', error);
      }
    };

    createMenuItem();
  };

  const handleEdit = (id) => {
    // Set the editing state for the item with the provided id
    setEditItemId(id);

    // Populate the form fields with the current values
    const itemToEdit = menuItems.find((item) => item.id === id);
    setName(itemToEdit.name);
    setIngredients(itemToEdit.ingredients);
    setAllergies(itemToEdit.allergies);
    setDescription(itemToEdit.description);
    setCourse(itemToEdit.course);
    setImage_url(itemToEdit.image_url);
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();

    // Find the item being edited
    const itemToEdit = menuItems.find((item) => item.id === id);

    try {
      const response = await fetch(`http://localhost:8000/menu-items/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          ingredients,
          allergies,
          description,
          course,
          image_url,
        }),
      });
      if (response.ok) {
        const updatedItem = await response.json();

        // Update the menu items array with the edited item
        setMenuItems((prevItems) => {
          return prevItems.map((item) => (item.id === id ? updatedItem : item));
        });

        // Reset the form fields and editing state
        setEditItemId(null);
        setName('');
        setIngredients('');
        setAllergies('');
        setDescription('');
        setCourse('');
        setImage_url('');
      } else {
        console.error('Error updating menu item:', response.status);
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
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
            // headers: {
            //     Authorization: `Token ${token}`,
            // },
        });
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data);
          console.log(menuItems)
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
        <div>
            {!showForm && (
            <button onClick={() => setShowForm(true)}>Add Menu Item</button>
          )}
            {showForm && (
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
                        <input type="text" value={image_url} onChange={(e) => setImage_url(e.target.value)} />
                    </label>
                    <br />
                    <button type="submit">Create Menu Item</button>
                </form>
            )}
        </div>


      )}
      <h2>Menu Items</h2>
      <div className="menu-cards">
        {menuItems.map((menuItem) => (
          <div key={menuItem.id} className="menu-card">
            <div className="item-image">
              {editItemId === menuItem.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, menuItem.id)}>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
                  <input
                    type="text"
                    value={image_url}
                    onChange={(e) => setImage_url(e.target.value)}
                  />
                  <button type="submit">Save</button>
                </form>
              ) : (
                <div>
                  <img src={menuItem.image_url} alt={menuItem.name} />
                  <h3 className="item-name">{menuItem.name}</h3>
                </div>
              )}
            </div>
            <div className="item-info">
              <p>Ingredients: {menuItem.ingredients}</p>
              <p>Allergies: {menuItem.allergies}</p>
              <p>Description: {menuItem.description}</p>
              <p>Course: {menuItem.course}</p>
              {currentUser && currentUser.group === 'Manager' && (
                    <div>
                      <button onClick={() => handleEdit(menuItem.id)}>Edit</button>
                      <button onClick={() => handleDelete(menuItem.id)}>Delete</button>
                    </div>
                  )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMenu;