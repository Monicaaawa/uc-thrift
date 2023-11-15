import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="item-details">
      {item.image && <img src={item.image} alt={item.title} />}
      <h2>{item.title}</h2>
      <p>Price: ${item.price}</p>
      <p>Condition: {item.condition}</p>
      <div className="seller-info">
        <h3>Seller Information</h3>
        {seller ? (
          <>
            <p>{seller.name} {seller.rating}</p>
            <p>{seller.email}</p>
          </>
        ) : (
          <p>Loading seller information...</p>
        )}
      </div>
    </div>
  );
};
