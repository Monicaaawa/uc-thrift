import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemDetails.css';
import Navbar from './navigation/Navbar';

const URL = 'http://localhost:8080';

export default function ItemDetails({ item }) {
  const [seller, setSeller] = useState(null);
  const [previousPage, setPreviousPage] = useState('');

  async function fetchSellerInfo() {
    try {
      const response = await axios.get(URL + '/users/' + item.sellerId);
      setSeller(response.data);
    } catch (e) {
      console.error('Error fetching seller details:', e);
    }
  } 

  useEffect(() => {
    fetchSellerInfo();
  }, []);
  
  const getTimeFromNow = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date().getTime();

    const timeDifference = now - date; 

    console.log(date)
    console.log(now)
    console.log(timeDifference)

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) 
    {
      return (`${days} days ago`);
    } 
    
    else if (hours > 0) 
    {
      return (`${hours} hours ago`);
    } 
    
    else if (minutes > 0) 
    {
      return (`${minutes} minutes ago`);
    } 
    
    else 
    {
      return (`${seconds} seconds ago`);
    }
};

  return (
    <>
      <Navbar />
      <div className = "item-details">
        {/* {item.image && <img src={item.image} alt={item.title} />} */}
        <img src = "https://via.placeholder.com/400x400" alt = "placeholder" />
        <div className = "everything-but-image">
          <div>
            <div className = "title">
              <h1 style = {{ maxWidth: 600 }}> {item.title} </h1>
              <h1> ${item.price}  </h1>
            </div>
            <div className = "caption">
              <p> Posted {getTimeFromNow(item.timestamp)} </p>
              <p> Condition: {item.condition} </p>
            </div>
          </div>
          <div>
            <h2 style = {{ marginBottom: 5 }}> Description </h2>
            <p> {item.description} </p>
          </div>
          <div className="seller-info">
            <h2 style = {{ marginBottom: 5 }}> Seller Information </h2>
            {seller ? (
              <>
                <p>{seller.firstName} {seller.lastName} ({seller.rating}★)</p>
                <p>{seller.email}</p>
              </>
            ) : (
              <p> This seller no longer exists. </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
