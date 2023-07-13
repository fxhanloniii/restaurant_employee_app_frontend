import React, { useEffect, useState } from 'react';

const Cocktails = ({ currentUser }) => {
    const [cocktails, setCocktails] = useState([]);
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [description, setDescription] = useState('');
    const [image_url, setImage_url] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editCocktailId, setEditCocktailId] = useState(null);
    
  return (
    <div>Cocktails</div>
  )
}

export default Cocktails