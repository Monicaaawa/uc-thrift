import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './ItemPreview.css';
import axios from 'axios';

const URL = 'http://localhost:8080';

export default function ItemPreview({ item }) {
  let timeAgo;

  try {
    timeAgo = formatDistanceToNow(new Date(item.timestamp), { addSuffix: true });
  } catch (error) {
    console.error('Error calculating relative time:', error);
    timeAgo = 'Unknown time';
  }

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
            {item.image && <img src={item.image} alt={item.title} />}
            <p>{timeAgo}</p>
            <h2>{item.title}</h2>
            <p>{item.condition}</p>
            <div className="seller-info">
            {seller ? (
                <>
                <p>{seller.firstName} {seller.lastName} ({calculateRating(seller.soldRatings)}★)</p>
                </>
            ) : (
                <p>Loading seller information...</p>
            )}
            </div>
            <p>${item.price}</p>
        </Link>
    </div>
  );
}
