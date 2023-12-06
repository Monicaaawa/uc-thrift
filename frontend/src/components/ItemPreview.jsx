import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ItemPreview.css';
import TimeAgo from './TimeAgo';
import axios from 'axios';

const URL = 'http://localhost:8080';

export default function ItemPreview({ item }) {
  const [seller, setSeller] = useState();

  async function fetchSellerInfo() {
    try {
      const response = await axios.get(URL + '/users/' + item.sellerId);
      setSeller(response.data);
    } catch (e) {
      console.error('Error fetching seller details:', e);
    }
  } 

  useEffect(() => {
    if (item.sellerId) {
      fetchSellerInfo();
    }
  }, [item.sellerId]);

  const calculateRating = (soldRatings) => {
    const allRatings = soldRatings;
  
    if(allRatings.length === 0) {
      return 5;
    }
  
    // calculate average rating with equal weight given to sold and bought ratings
    const sum = allRatings.reduce((total, rating) => total + rating, 0);
    const averageRating = allRatings.length > 0 ? sum / allRatings.length : 0;
    const roundedRating = Number(averageRating.toFixed(1)); 
    return roundedRating;
   }

  return (
    <div className="item-preview">
        <Link to={`/item/${item._id}`}>
            <div className = "image-container">
              <span className = "mini-chip"> {item.condition} </span>
              <span className = "price-chip">${item.price} </span>
              <img className = "item-image" src = {item.image} alt={item.title} />
            </div>
            <p> <TimeAgo timestamp={item.timestamp} /> </p>
            <div className="seller-info">
            {seller ? (
                <>
                <p>{seller.firstName} {seller.lastName} ({calculateRating(seller.soldRatings)}★)</p>
                </>
            ) : (
                <p>Loading seller information...</p>
            )}
            </div>
            <span className = "title">{item.title}</span>
        </Link>
    </div>
  );
}
