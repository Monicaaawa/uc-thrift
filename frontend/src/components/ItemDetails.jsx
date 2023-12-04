import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemDetails.css';
import TimeAgo from './TimeAgo';
import Header from './Header';

const URL = 'http://localhost:8080';

export default function ItemDetails({ item }) {
  const [seller, setSeller] = useState(null);

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

  return (
    <>
      <Header />
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
              <p> Posted <TimeAgo timestamp={item.timestamp} /> </p>
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
