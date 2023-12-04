import React from 'react';
import './profile.css';
import Header from '../components/Header';
// import Navbar from "../components/navigation/Navbar";
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProfilePage = ( { userId: propUserId } ) => {

let userId;
 const [boughtItems, setBoughtItems] = useState([]);
 const [soldItems, setSoldItems] = useState([]);
 const [soldRatings, setSoldRatings] = useState([]);

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

 //sample user - use temporarily for reviews section
//  const user = {
//    name: 'Joe Bruin',
//    email: 'joebruin@gmail.com',
//    phone: '(111) 111-1111',
//    city: 'Los Angeles',
//    state: 'CA',
//    rating: 4.5,
//    hasReview: true,
//    numOfSoldItems: 4,
//    numOfRatings: 3,
//    numOfBoughtItems: 4,
//    soldItems: [
//      { id: 1, name: 'Math 33a Textbook', image: 'image1.jpg' },
//      { id: 2, name: 'Arduino Kit', image: 'image2.jpg' },
//      { id: 3, name: 'Racing T-shirt', image: 'image3.jpg' },
//      { id: 4, name: 'Desk Lamp', image: 'image4.jpg'},
//      { id: 5, name: 'Math 33a Textbook', image: 'image1.jpg' },
//      { id: 6, name: 'Math 33a Textbook', image: 'image1.jpg' },
//      { id: 7, name: 'Math 33a Textbook', image: 'image1.jpg' },
//      { id: 8, name: 'Math 33a Textbook', image: 'image1.jpg' }


//    ],
//    boughtItems: [
//      { id: 1, name: 'Math 33a Textbook', image: 'image1.png' },
//      { id: 2, name: 'Arduino Kit', image: 'image2.jpg' },
//      { id: 3, name: 'Racing T-shirt', image: 'image3.jpg' },
//      { id: 4, name: 'Desk Lamp', image: 'image4.jpg'}
//    ],

//    reviewsList: [
//      { id: 1, name: 'Josie Bruin', comment: 'Very good!', rating: 3},
//      { id: 2, name: 'Bob Joe', comment: 'Eh, it was ok.', rating: 4},
//      { id: 3, name: 'Aunt Sally', comment: 'THE ABSOLUTE BEST!', rating: 5},
//    ]
//  }

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
          {/* <h2 className="profile-name-text">{userData.firstName} {userData.lastName} { <span>({calculateRating(soldRatings, boughtRatings)}★)</span>}</h2> */}
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

    {/* <div className="ratings-container">
       <h3 className="small-header">Ratings ({user.numOfRatings})</h3>
       {user.numOfRatings === 0 ? (
         <p className="no-items-message">No ratings to show.</p>
       ) : (    
         <ul className="reviews-list">
           {user.reviewsList.map(review => (
             <li key={review.id}>
               <div className="review-name-container">
                 <p className="reviewer-name">
                   <span className="review-name-align-left">{review.name} </span>
                   </p>
                 <span className="star-container">
                   {Array.from({ length: user.rating }).map((_, index) => (
                   <span key={index}>★</span>
                   ))}
                   </span>
               </div>
               <p className="bought-from-text">bought from {user.name}</p>
               <p className="review-comment">"{review.comment}"</p>
             </li>
           ))}
         </ul>      
       )}
     </div> */}
    </div>
    ) : (
      // if userId is null or undefined
      <div>
        <h1>Not signed in. Please sign in to see profile info.</h1>
        <Link to="/login">
                <button>Go to Login</button>
            </Link>
      </div>
    )}
  </div>
  );
};

export default ProfilePage;