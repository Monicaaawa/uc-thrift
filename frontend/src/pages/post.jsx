import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/navigation/Navbar";
import './post.css';

const URL = 'http://localhost:8080';

export default function PostPage() {
  const [formData, setFormData] = useState({
    title: '',
    sellerId: '65684f18a6deda4a8a7a03a1', // You might get the sellerId from your authentication system
    price: '',
    condition: '',
    description: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);
      const response = await axios.post(`${URL}/items/new`, formData);
      console.log('Item created:', response.data);
      // Redirect to the item details page after creating the item
      navigate(`/item/${response.data._id}`);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="post-page">
        <img src = "https://via.placeholder.com/400x400" alt = "placeholder" />
        <form onSubmit={handleSubmit}>     
          <div className = "everything-but-image">
            <div>               
              <div className="title-container">
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <div className='price-container'>
                  <h1>$</h1>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  {/* Need to handle negative input */}
                </div>
              </div>
              <div className='condition-container'>
                <p>Condition: </p>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="new">New</option>
                  <option value="excellent">Excellent</option>
                  <option value="very-good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
            <div>
              <h2 style={{ marginBottom: 5 }}> Description </h2>
              <textarea
                id="description"
                name="description"
                placeholder="Desribe the item that you want to sell!"
                value={formData.description}
                onChange={handleChange}
              />              
            </div>

            <button type="submit">POST</button>
            </div>
        </form>
      </div>
    </>
  );
};
