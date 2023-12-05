import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div>
      <h2>User Rating Form</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userEmail">Please enter the email address of the user that you are rating:</label>
        <input
          type="email"
          id="userEmail"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          required
        />

        <label htmlFor="userRating">Rate your overall experience with this user:</label>
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
