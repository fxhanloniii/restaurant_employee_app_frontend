import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';

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
  const [image_file, setImage_file] = useState(null);

  const { name, description, region, year, image_url } = wineData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrl = await uploadToCloudinaryAndGetUrl();
    createWine(imageUrl);
  };

  const handleChangeStatus = ({ meta, file }, status) => {
    if (status === 'done') {
      setImage_file(file);
    }
  };

  const NoSubmitButton = () => null;

  const uploadToCloudinaryAndGetUrl = async () => {
    if (!image_file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', image_file);
    formData.append('upload_preset', 'ml_default');
    console.log(formData)
  
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dph0opk9j/upload',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Data from Cloudinary: ", data);
      return data.url;
      console.log(data.url)
    } catch (error) {
      console.error(error);
    }
  };


  const createWine = async (imageUrl) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/wines/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
            region,
            year,
            image_url: imageUrl,
        }),
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/wines/${id}/`, {
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
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/wines/${id}/`, {
        method: 'DELETE',
      });
      fetchWines();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchWines = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/wines/`);
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
              {/* <label>
                
                <input
                  type="text"
                  value={image_url}
                  onChange={(e) =>
                    setWineData((prevData) => ({ ...prevData, image_url: e.target.value }))
                  }
                  placeholder="Image URL"
                  required
                />
              </label> */}
              <Dropzone
                        SubmitButtonComponent={NoSubmitButton}
                        onChangeStatus={handleChangeStatus}
                        onSubmit={handleSubmit}
                        accept="image/*"
                        />
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
                <div className="winebuttons">
                    <button className="ingredients">Description</button>
                    <button className="allergies" >{wine.region}</button>
                    <button className={`c1`}>{wine.year}</button>
                </div>
                <p>Description: {wine.description}</p>
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
