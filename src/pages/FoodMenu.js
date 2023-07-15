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
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedInfo, setSelectedInfo] = useState('Ingredients');

  // Info Selection Function
  const handleInfoClick = (info) => {
    setSelectedInfo(info);
  };

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
          const updatedMenuItems = [...menuItems, newItem];
          setMenuItems(updatedMenuItems);
          setFilteredMenuItems(updatedMenuItems);
          setShowForm(false);
          // Reset the form fields
          setName('');
          setIngredients('');
          setAllergies('');
          setDescription('');
          setCourse('');
          setImage_url('');
          fetchMenuItems();
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
        const updatedMenuItems = menuItems.map((item) =>
        item.id === id ? updatedItem : item
          );
        setMenuItems(updatedMenuItems);
        setFilteredMenuItems(updatedMenuItems);

        // Reset the form fields and editing state
        setEditItemId(null);
        setName('');
        setIngredients('');
        setAllergies('');
        setDescription('');
        setCourse('');
        setImage_url('');
        fetchMenuItems();
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
          // sorting menu items so they are listed 1st, 2nd, 3rd
          const sortedMenuItems = data.sort((a,b) => a.course - b.course);
          setMenuItems(sortedMenuItems);
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

    useEffect(() => {
        // filter menu items based on the selected course
        if (selectedCourse === '') {
          setFilteredMenuItems(menuItems);
        } else {
          const filteredItems = menuItems.filter((item) => item.course === selectedCourse);
          setFilteredMenuItems(filteredItems);
        }
      }, [selectedCourse, menuItems]);

      const handleFilter = (course) => {
        setSelectedCourse(course);
        if (course === '') {
          setFilteredMenuItems(menuItems);
        } else {
            setTimeout(() => {
                const filteredItems = menuItems.filter((item) => item.course.toString() === course.toString());
                setFilteredMenuItems(filteredItems);
              }, 0);
        }
      };
      

  return (
    <div className="foodMenu">
      <div className="dinnerImageHero">
        <img src="/images/image2.jpg" alt="table with a view" className="heroImage" /> 
        <h1 className="dinnerText">Dinner</h1>
      </div> 
      {currentUser && currentUser.group === 'Manager' && (
        <div className="buttonForm">
            {!showForm && (
            <button onClick={() => setShowForm(true)}>Add Menu Item</button>
          )}
            {showForm && (
                <form onSubmit={handleSubmit} className="form">
                    <label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                    </label>
                    <br />
                    <label>
                        <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Ingredients" required />
                    </label>
                    <br />
                    <label>
                        <input type="text" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Allergies" required />
                    </label>
                    <br />
                    <label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)}  placeholder="Description" required />
                    </label>
                    <br />
                    <label>
                        <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course" required />
                    </label>
                    <br />
                    <label>
                        <input type="text" value={image_url} onChange={(e) => setImage_url(e.target.value)} placeholder="Image URL" required />
                    </label>
                    <br />
                    <button type="submit">Create Menu Item</button>
                </form>
            )}
        </div>
      )}
      {/* Selected Course Buttons */}
      <div className="courseButtons">
        <button onClick={() => handleFilter(1)}>1st</button>
        <button onClick={() => handleFilter(2)}>2nd</button>
        <button onClick={() => handleFilter(3)}>3rd</button>
      </div>
      <div className="menu-cards">
         {filteredMenuItems.map((menuItem) => (
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
                <div>
                    <button className="ingredients" onClick={() => handleInfoClick('Ingredients')}>Ingredients</button>
                    <button className="allergies" onClick={() => handleInfoClick('Allergies')}>Allergies</button>
                    <button className={`c${menuItem.course}`}>C{menuItem.course}</button>
                </div>
                <div>
                {selectedInfo === 'Ingredients' && <p>{menuItem.ingredients}</p>}
                {selectedInfo === 'Allergies' && <p>{menuItem.allergies}</p>}
                </div>
              {/* <p>Description: {menuItem.description}</p> */}
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
