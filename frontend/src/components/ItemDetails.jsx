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
  const [hasItemInWishlist, setHasItemInWishlist] = useState();
  const [wantInWishlist, setWantInWishlist] = useState(false);
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

      await axios.get(URL + '/users/' + userId);
    }
    
    catch (error) 
    {
      console.error('Error fetching user data:', error);
    }
  };

  const markAsSold = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${URL}/users/email/${buyerEmail}`);
      setBuyerId(response.data._id);
    } catch (e) {
      console.error('Error fetching buyer email:', e);
    }
  };  

  const addToWishlist = async (e) => {
    e.preventDefault();
    setWantInWishlist(true);
  };

  useEffect(() => {
    if (buyerId !== undefined) {
      axios.put(`${URL}/items/sell/${item._id}`, { buyerId })
        .then(() => {
          console.log('Item marked as sold');
          navigate('/');
        })
        .catch((error) => {
          console.error('Error marking item as sold:', error);
        });
    }
  }, [buyerId, item._id]);

  useEffect(() => {
    if (wantInWishlist === true) {
      const itemId = item._id;
      axios.put(`${URL}/users/add-to-wishlist/${userId}`, {itemId})
        .then(() => {
          setHasItemInWishlist(true);
          console.log('Item added to wishlist');
        })
        .catch((error) => {
          console.error('Error adding item to wishlist:', error);
        });
    }
  }, [wantInWishlist]);

  useEffect(() => {
    fetchSellerInfo();
    getUser(userId);
  }, []);

  return (
    <>
      <Header />
      <div className = "item-details">
        <div className = "image-holder">
          <div className = "square-image">
            <img src = {item.image} alt={item.title} />
          </div>
        </div>
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
          {userId === item.sellerId && item.available === true && (
            <form className="sell-item" onSubmit={markAsSold}>
              <input
                type="text"
                id="buyer-email"
                name="buyer-email"
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="Email of buyer"
                required
              />
              <button type="submit"> Mark as sold </button>
            </form>
          )}
          {userId !== item.sellerId && item.available === true && !hasItemInWishlist && (
            <button onClick = {addToWishlist}> Add to wishlist </button>
          )}
          {item.available === false && (
            <h2> This item has been sold. </h2>
          )}
        </div>
      </div>
    </>
  );
}
