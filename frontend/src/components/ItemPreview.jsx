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

  return (
    <div className="item-preview">
        <Link to={`/item-details/${item._id}`}>
            {item.image && <img src={item.image} alt={item.title} />}
            <p>{timeAgo}</p>
            <h2>{item.title}</h2>
            <p>{item.condition}</p>
            <div className="seller-info">
            {seller ? (
                <>
                <p>{seller.firstName} {seller.lastName} ({seller.rating}★)</p>
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
