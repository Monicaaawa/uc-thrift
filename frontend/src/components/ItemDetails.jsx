import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemDetails.css';
import TimeAgo from './TimeAgo';
import Header from './Header';

const URL = 'http://localhost:8080';

export default function ItemDetails({ item, userId: propUserId }) {
  const [seller, setSeller] = useState(null);

  async function fetchSellerInfo() {
    try {
      const response = await axios.get(URL + '/users/' + item.sellerId);
      setSeller(response.data);
    } catch (e) {
      console.error('Error fetching seller details:', e);
    }
  }
  
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
    fetchSellerInfo();
    getUser(userId);
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
            {userId ? (
              <>
                {seller ? (
                  <>
                    <p>{seller.firstName} {seller.lastName} ({calculateRating(seller.soldRatings)}★)</p>
                    <p>{seller.email}</p>
                  </>
                ) : (
                  <p> This seller no longer exists. </p>
                )}
              </>
            ) : (
              <p> Please log in or sign up to see the seller information. </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
