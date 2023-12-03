import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import './post.css';
import ImageUpload from '../components/ImageUpload';

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
      <Header />
      <form className = "post-container" onSubmit={handleSubmit}>  
        <div className = "not-button">
          <div className = "image">
            <h2 style={{ marginBottom: 5 }}> Image(s) </h2>
            <ImageUpload />
          </div>
    
          <div className = "not-image">
            <div className="title-container">
                <h2 style={{ marginBottom: 5 }}> Title </h2>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
            </div>
            <div className = "first-row">
              <div className='price-container'>
                  <h2 style={{ marginBottom: 5 }}> Price </h2>
                  <span className = "currency-format">
                    <span className = "dollar-sign"> $&nbsp; </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </span>
                  {/* Need to handle negative input */}   
              </div>         
              <div className='condition-container'>
                <h2 style={{ marginBottom: 5 }}> Condition </h2>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="new">New</option>
                  <option value="excellent">Like New</option>
                  <option value="very-good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>           
            <div className = "desc-container">
              <h2 style={{ marginBottom: 5 }}> Description </h2>
              <textarea
                id="description"
                name="description"
                placeholder="Desribe the item that you want to sell!"
                value={formData.description}
                onChange={handleChange}
              />              
            </div>
          </div>
        </div> 
        <button type="submit">POST</button>
      </form>
    </>
  );
};
