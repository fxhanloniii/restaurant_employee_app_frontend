import React, { useEffect, useState } from 'react';

const Cocktails = ({ currentUser }) => {
  const [cocktails, setCocktails] = useState([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [description, setDescription] = useState('');
  const [image_url, setImage_url] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCocktailId, setEditCocktailId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const createCocktail = async () => {
      try {
        const response = await fetch('http://localhost:8000/cocktails/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            ingredients,
            description,
            image_url,
          }),
        });
        if (response.ok) {
          const newCocktail = await response.json();
          setCocktails([...cocktails, newCocktail]);
          setShowForm(false);
          setName('');
          setIngredients('');
          setDescription('');
          setImage_url('');
        } else {
          console.error('Error creating cocktail:', response.status);
        }
      } catch (error) {
        console.error('Error creating cocktail:', error);
      }
    };

    createCocktail();
  };

  const handleEdit = (id) => {
    setEditCocktailId(id);
    const cocktailToEdit = cocktails.find((cocktail) => cocktail.id === id);
    setName(cocktailToEdit.name);
    setIngredients(cocktailToEdit.ingredients);
    setDescription(cocktailToEdit.description);
    setImage_url(cocktailToEdit.image_url);
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    const cocktailToEdit = cocktails.find((cocktail) => cocktail.id === id);

    try {
      const response = await fetch(`http://localhost:8000/cocktails/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          ingredients,
          description,
          image_url,
        }),
      });
      if (response.ok) {
        const updatedCocktail = await response.json();
        setCocktails((prevCocktails) =>
          prevCocktails.map((cocktail) => (cocktail.id === id ? updatedCocktail : cocktail))
        );
        setEditCocktailId(null);
        setName('');
        setIngredients('');
        setDescription('');
        setImage_url('');
      } else {
        console.error('Error updating cocktail:', response.status);
      }
    } catch (error) {
      console.error('Error updating cocktail:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/cocktails/${id}/`, {
        method: 'DELETE',
      });
      fetchCocktails();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCocktails = async () => {
    try {
      const response = await fetch('http://localhost:8000/cocktails/');
      if (response.ok) {
        const data = await response.json();
        setCocktails(data);
      } else {
        console.error('Error fetching cocktails:', response.status);
      }
    } catch (error) {
      console.error('Error fetching cocktails:', error);
    }
  };

  useEffect(() => {
    fetchCocktails();
  }, []);

  return (
    <div className="cocktails">
      <div className="dinnerImageHero">
        <img src="/images/image3.jpg" alt="table with a view" className="heroImage" /> 
        <h1 className="dinnerText">Cocktails</h1>
    </div>
      {currentUser && currentUser.group === 'Manager' && (
        <div className="buttonForm">
          {!showForm && (
            <button onClick={() => setShowForm(true)}>Add Cocktail</button>
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
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                />
              </label>
              <br />
              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <br />
              <label>
                Image URL:
                <input
                  type="text"
                  value={image_url}
                  onChange={(e) => setImage_url(e.target.value)}
                />
              </label>
              <br />
              <button type="submit">Create Cocktail</button>
            </form>
          )}
        </div>
      )}
      
      <div className="cocktail-cards">
        {cocktails.map((cocktail) => (
          <div key={cocktail.id} className="cocktail-card">
            <div className="cocktail-image">
              {editCocktailId === cocktail.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, cocktail.id)}>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <input
                    type="text"
                    value={image_url}
                    onChange={(e) => setImage_url(e.target.value)}
                  />
                  <button type="submit">Save</button>
                </form>
              ) : (
                <div>
                  <img src={cocktail.image_url} alt={cocktail.name} />
                  <h3 className="cocktail-name">{cocktail.name}</h3>
                </div>
              )}
            </div>
            <div className="cocktail-info">
              <p>Ingredients: {cocktail.ingredients}</p>
              <p>Description: {cocktail.description}</p>
              {currentUser && currentUser.group === 'Manager' && (
                <div>
                  <button onClick={() => handleEdit(cocktail.id)}>Edit</button>
                  <button onClick={() => handleDelete(cocktail.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cocktails;
