import React, { useEffect, useState } from 'react';

const Wines = ({ currentUser }) => {
  const [wines, setWines] = useState([]);
  const [wineData, setWineData] = useState({
    name: '',
    description: '',
    region: '',
    year: '',
    image_url: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editWineId, setEditWineId] = useState(null);

  const { name, description, region, year, image_url } = wineData;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/wines/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wineData),
      });

      if (response.ok) {
        const newWine = await response.json();
        setWines([...wines, newWine]);
        resetForm();
      } else {
        console.error('Error creating wine:', response.status);
      }
    } catch (error) {
      console.error('Error creating wine:', error);
    }
  };

  const handleEdit = (id) => {
    setEditWineId(id);
    const wineToEdit = wines.find((wine) => wine.id === id);
    setWineData({
      name: wineToEdit.name,
      description: wineToEdit.description,
      region: wineToEdit.region,
      year: wineToEdit.year,
      image_url: wineToEdit.image_url,
    });
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/wines/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wineData),
      });

      if (response.ok) {
        const updatedWine = await response.json();
        setWines((prevWines) =>
          prevWines.map((wine) => (wine.id === id ? updatedWine : wine))
        );
        setEditWineId(null);
        resetForm();
      } else {
        console.error('Error updating wine:', response.status);
      }
    } catch (error) {
      console.error('Error updating wine:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/wines/${id}/`, {
        method: 'DELETE',
      });
      fetchWines();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchWines = async () => {
    try {
      const response = await fetch('http://localhost:8000/wines/');
      if (response.ok) {
        const data = await response.json();
        setWines(data);
      } else {
        console.error('Error fetching wines:', response.status);
      }
    } catch (error) {
      console.error('Error fetching wines:', error);
    }
  };

  const resetForm = () => {
    setWineData({
      name: '',
      description: '',
      region: '',
      year: '',
      image_url: '',
    });
    setShowForm(false);
  };

  useEffect(() => {
    fetchWines();
  }, []);

  return (
    <div className="wines">
      <div className="dinnerImageHero">
        <img src="/images/wine.jpg" alt="table with a view" className="heroImage" />
        <h1 className="dinnerText">Wines</h1>
      </div>
      {currentUser && currentUser.group === 'Manager' && (
        <div className="buttonForm">
          {!showForm ? (
            <button onClick={() => setShowForm(true)}>Add Wine</button>
          ) : (
            <form onSubmit={handleSubmit} className="form">
              <label>
                
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setWineData((prevData) => ({ ...prevData, name: e.target.value }))
                  }
                  placeholder="Name"
                  required
                />
              </label>
              <br />
              <label>
                
                <textarea
                  value={description}
                  onChange={(e) =>
                    setWineData((prevData) => ({ ...prevData, description: e.target.value }))
                  }
                  placeholder="Description"
                  required
                />
              </label>
              <br />
              <label>
                
                <input
                  type="text"
                  value={region}
                  onChange={(e) =>
                    setWineData((prevData) => ({ ...prevData, region: e.target.value }))
                  }
                  placeholder="Region"
                  required
                />
              </label>
              <br />
              <label>
                
                <input
                  type="text"
                  value={year}
                  onChange={(e) =>
                    setWineData((prevData) => ({ ...prevData, year: e.target.value }))
                  }
                  placeholder="Year"
                  required
                />
              </label>
              <br />
              <label>
                
                <input
                  type="text"
                  value={image_url}
                  onChange={(e) =>
                    setWineData((prevData) => ({ ...prevData, image_url: e.target.value }))
                  }
                  placeholder="Image URL"
                  required
                />
              </label>
              <br />
              <button type="submit">Create Wine</button>
            </form>
          )}
        </div>
      )}

      <div className="wine-cards">
        {wines.map((wine) => (
          <div key={wine.id} className="wine-card">
            <div className="wine-image">
              {editWineId === wine.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, wine.id)}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setWineData((prevData) => ({ ...prevData, name: e.target.value }))
                    }
                  />
                </label>
                <br />
                <label>
                  Description:
                  <textarea
                    value={description}
                    onChange={(e) =>
                      setWineData((prevData) => ({ ...prevData, description: e.target.value }))
                    }
                  />
                </label>
                <br />
                <label>
                  Region:
                  <input
                    type="text"
                    value={region}
                    onChange={(e) =>
                      setWineData((prevData) => ({ ...prevData, region: e.target.value }))
                    }
                  />
                </label>
                <br />
                <label>
                  Year:
                  <input
                    type="text"
                    value={year}
                    onChange={(e) =>
                      setWineData((prevData) => ({ ...prevData, year: e.target.value }))
                    }
                  />
                </label>
                <br />
                <label>
                  Image URL:
                  <input
                    type="text"
                    value={image_url}
                    onChange={(e) =>
                      setWineData((prevData) => ({ ...prevData, image_url: e.target.value }))
                    }
                  />
                </label>
                <br />
                <button type="submit">Save</button>
              </form>
              ) : (
                <div>
                  <img src={wine.image_url} alt={wine.name} />
                  <h3 className="wine-name">{wine.name}</h3>
                </div>
              )}
            </div>
            <div className="wine-info">
                <p>Description: {wine.description}</p>
                <p>Region: {wine.region}</p>
                <p>Year: {wine.year}</p>
              {currentUser && currentUser.group === 'Manager' && (
                <div>
                  <button onClick={() => handleEdit(wine.id)}>Edit</button>
                  <button onClick={() => handleDelete(wine.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wines;
