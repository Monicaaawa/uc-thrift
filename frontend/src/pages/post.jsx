import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import ImageUpload from '../components/ImageUpload';
import './post.css';

const URL = 'http://localhost:8080';

export default function PostPage({ userId: propUserId }) {
  let userId;

  if (propUserId) 
  {
    userId = propUserId;
  } 
  
  else 
  { 
    userId = sessionStorage.getItem('userId')
  }

  const [userData, setUserData] = useState(userId); 

  const getUser = async (userId) => {
    try 
    {
      if (userData === 'null') 
      {
        return;
      }

      const response = await axios.get(URL + '/users/' + userId);
      setUserData(response.data);
    }
    
    catch (error) 
    {
      console.error('Error fetching user data:', error);
    }
  };
    
  useEffect(() => {
    getUser(userId);
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    sellerId: userId,
    price: '',
    condition: 'new',
    description: '',
    image: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (image) => {
    setFormData((prevData) => ({
      ...prevData,
      image
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
      {userId ? (
        <form className="post-container" onSubmit={handleSubmit}>
          <div className="not-button">
            <div className="image">
              <h2 style={{ marginBottom: 5 }}> Image(s) </h2>
              <ImageUpload onImageUpload={handleImageUpload} />
            </div>

            <div className="not-image">
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
              <div className="first-row">
                <div className='price-container'>
                  <h2 style={{ marginBottom: 5 }}> Price </h2>
                  <span className="currency-format">
                    <span className="dollar-sign"> $&nbsp; </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </span>
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
                    <option value="like new">Like New</option>
                    <option value="very good">Very Good</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>           
              <div className="desc-container">
                <h2 style={{ marginBottom: 5 }}> Description </h2>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the item that you want to sell!"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
          </div>
        </div>
        <button type="submit">POST</button>
      </form> ) : (
        <h2 className = "page-center"> Please log in or sign up to post an item. </h2>
      )}
    </>
  );
};
