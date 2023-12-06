import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemDetails.css';
import TimeAgo from './TimeAgo';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const URL = 'http://localhost:8080';

export default function ItemDetails({ item, userId: propUserId }) {
  const [seller, setSeller] = useState();
  const [buyerEmail, setBuyerEmail] = useState();
  const [buyerId, setBuyerId] = useState();
  const navigate = useNavigate()

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

    const getUser = async (userId) => {
        try 
        {
            if (userId === null) 
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

  const [userData, setUserData] = useState(userId); 

  const markAsSold = async (e) => {
    e.preventDefault();

    try {
      const itemId = item._id;
      try {
        const response = await axios.get(`${URL}/users/email/${buyerEmail}`);
        setBuyerId(response.data._id);
      } catch (e) {
        console.error('Error fetching buyer email:', e);
      }
      
      axios.post(`${URL}/items/sold/${itemId}`, {buyerId})
      .then(result => {
        console.log(result)
        if(result.data.message === "Item sold, users updated, emails sent")
        {
          console.log('Item marked as sold');
          navigate('/');
        }
        else
        {
          console.error('Error marking item as sold:', result.data.error);
        }
      })
    } catch (error) {
      console.error('Error marking item as sold:', error.message);
    }
  };  

  useEffect(() => {
    fetchSellerInfo();
    getUser(userId);
  }, []);

  return (
    <>
      <Header />
      <div className = "item-details">
        <img src = {item.image} alt={item.title} />
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
                    <p>{seller.firstName} {seller.lastName} ({seller.rating}★)</p>
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
          {userId === item.sellerId && (
            <form className = "sell-item" onSubmit = {markAsSold}>
              <input
                type="text"
                id="buyer-email"
                name="buyer-email"
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="Email of buyer"
                required
              />
              <button type = "submit"> Mark as sold </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
