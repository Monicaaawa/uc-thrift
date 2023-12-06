import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './review.css';

const URL = 'http://localhost:8080';

export default function RatingForm() {
  const [formData, setFormData] = useState({
    userEmail: '',
    userRating: 5, // Default rating
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
      const response = await axios.put(`${URL}/users/ratings`, formData);
      console.log('Form submitted:', response.data);

      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className = "page-center review-container">
      <h1>User Rating Form</h1>
      <form className = "gap" onSubmit={handleSubmit}>
        <div className = "title-content">
          <label htmlFor="userEmail">Ratee's email</label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
        </div>
        <div className = "title-content">
          <label htmlFor="userRating">Rating</label>
          <select
            id="userRating"
            name="userRating"
            value={formData.userRating}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>
        <button style = {{ marginTop: 75 }} type="submit">Submit</button>
      </form>
    </div>
  );
};
