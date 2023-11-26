

import React from 'react';
import './profile.css';

const ProfilePage = () => {

  //sample user
  const user = {
    name: 'Joe Bruin',
    email: 'joebruin@gmail.com',
    phone: '(111) 111-1111',
    city: 'Los Angeles',
    state: 'CA',
    rating: 4.5,
    hasReview: true,
    numOfSoldItems: 4,
    numOfRatings: 3,
    numOfBoughtItems: 4,
    soldItems: [
      { id: 1, name: 'Math 33a Textbook', image: 'image1.jpg' },
      { id: 2, name: 'Arduino Kit', image: 'image2.jpg' },
      { id: 3, name: 'Racing T-shirt', image: 'image3.jpg' },
      { id: 4, name: 'Desk Lamp', image: 'image4.jpg'},
      { id: 5, name: 'Math 33a Textbook', image: 'image1.jpg' },
      { id: 6, name: 'Math 33a Textbook', image: 'image1.jpg' },
      { id: 7, name: 'Math 33a Textbook', image: 'image1.jpg' },
      { id: 8, name: 'Math 33a Textbook', image: 'image1.jpg' }

    ],
    boughtItems: [
      { id: 1, name: 'Math 33a Textbook', image: 'image1.png' },
      { id: 2, name: 'Arduino Kit', image: 'image2.jpg' },
      { id: 3, name: 'Racing T-shirt', image: 'image3.jpg' },
      { id: 4, name: 'Desk Lamp', image: 'image4.jpg'}
    ],

    reviewsList: [
      { id: 1, name: 'Josie Bruin', comment: 'Very good!', rating: 3},
      { id: 2, name: 'Bob Joe', comment: 'Eh, it was ok.', rating: 4},
      { id: 3, name: 'Aunt Sally', comment: 'THE ABSOLUTE BEST!', rating: 5},
    ]
  }

  return (
    <div className="profile-container">

      <div className="profile-details">
        <div className="profile-name">
          <h2 className="profile-name-text">{user.name} {user.hasReview && <span>({user.rating}★)</span>}</h2>
        </div>

        <div className="profile-detail-others">
          <p> {user.email}</p>
          <p> {user.phone}</p>
          <p> {user.city}, {user.state}</p>
        </div>
      </div>


<div className="sold-items">
  <h3>Sold Items ({user.numOfSoldItems})</h3>
  {user.numOfSoldItems === 0 ? (
    <p className="no-items-message">No items to show.</p>
  ) : (
    <div className="sold-items-container">
      <ul className="sold-items-list">
        {user.soldItems.map(item => (
          <li key={item.id}>
            <div>
              {<img src={`./../../images/${item.image}`} />}
            </div>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

<div className="bought-items">
  <h3>Bought Items ({user.numOfBoughtItems})</h3>
  {user.numOfBoughtItems === 0 ? (
    <p className="no-items-message">No items to show.</p>
  ) : (
    <div className="bought-items-container">
      <ul className="bought-items-list">
        {user.boughtItems.map(item => (
          <li key={item.id}>
            <div>
              {<img src={`./../../images/${item.image}`} />}
            </div>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

<div className="ratings-container">
        <h3>Ratings ({user.numOfRatings})</h3>
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
      </div>




    </div>
  );
};

export default ProfilePage;

