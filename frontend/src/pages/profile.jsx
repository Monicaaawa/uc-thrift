import React from 'react';
import './profile.css';
import Header from '../components/Header';
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

const ProfilePage = ( { userId: propUserId } ) => {

let userId;
 const [boughtItems, setBoughtItems] = useState([]);
 const [soldItems, setSoldItems] = useState([]);
 const [soldRatings, setSoldRatings] = useState([]);
 const navigate = useNavigate()

 if (propUserId) {
  userId = propUserId;
} else { 
  userId = sessionStorage.getItem('userId')
}

const [userData, setUserData] = useState(userId); 


 const URL = "http://localhost:8080"

 const getUser = async (userId) => {
   try {
    if (userId === null) {
      return;
    }
   const response = await axios.get(URL + '/users/' + userId);
   setUserData(response.data);
     
   const { soldRatings, boughtItems, soldItems } = response.data;
  
    if (Array.isArray(soldRatings)) {
        setSoldRatings(soldRatings);
      }

   // Fetch sold items details
   const fetchedSoldItems = await Promise.all(
     soldItems.map(async (itemId) => {
       const itemResponse = await axios.get(URL + '/items/' + itemId);
       return itemResponse.data;
     })
   );
   setSoldItems(fetchedSoldItems);
    // Fetch bought items details
    const fetchedBoughtItems = await Promise.all(
      boughtItems.map(async (itemId) => {
        const itemResponse = await axios.get(URL + '/items/' + itemId);
        return itemResponse.data;
      })
    );
    setBoughtItems(fetchedBoughtItems);
   }
   catch (error) {
   console.error('Error fetching user data:', error);
 }
};

 useEffect(() => {
  getUser(userId);
 }, [userId]);

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

 const handleSignOut = () => {
  // Clear user session data 
  sessionStorage.removeItem('userId');
  navigate('/');
};

 return (
  <div className="page-container">
      <div className="sticky-header">
    <Header />
  </div>
    {userId ? (
      // If userId exists, render profile details
      <div className="profile-container">
      <div className="profile-details">
        <div className="profile-name">
          <h2 className="profile-name-text">{userData.firstName} {userData.lastName} { <span>({calculateRating(soldRatings)}★)</span>}</h2>
        </div>
 
        <div className="profile-detail-others">
          <p className="profile-detail-text"> {userData.campus}</p>
          <br></br>
          <p className="profile-detail-text"> {userData.email}</p>
        </div>
      </div>

      <div className="sold-items">
      <h3 className="small-header">Sold Items ({soldItems.length})</h3>
      {soldItems.length === 0 ? (
        <p className="no-items-message">No items to show.</p>
      ) : (
      <div className="sold-items-container">
        <ul className="sold-items-list">
          {soldItems.map(item => (
            <li key={item.id}>
              <div>
                {<img src={`./../../images/image1.jpg`} />}
              </div>
              <p>{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>

    <div className="bought-items">
    <h3 className="small-header">Bought Items ({boughtItems.length})</h3>
    {boughtItems.length === 0 ? (
      <p className="no-items-message">No items to show.</p>
    ) : (
      <div className="bought-items-container">
        <ul className="bought-items-list">
          {boughtItems.map(item => (
            <li key={item.id}>
              <div>
                {<img src={'./../../images/image1'} />}
                </div>
              <p>{item.title}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>

    <button className="sign-in-out-button"onClick={handleSignOut}>Sign Out</button>
    </div>
    ) : (
      // if userId is null or undefined
      <div className="not-signed-in-message">
        <h1>Not signed in. Please sign in to see profile info.</h1>
        <Link to="/login">
                <button className="sign-in-out-button">Go to Login</button>
            </Link>
      </div>
    )}
  </div>
  );
};

export default ProfilePage;