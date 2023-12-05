import './Header.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Searchbar from './search/Searchbar';
import post from '../assets/post.svg';

const Header = ({ userId: propUserId }) => {
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
    const URL = "http://localhost:8080"

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
     
    useEffect(() => {
       getUser(userId);
    }, []);

    return (
        <div className="container">
            <NavLink to="/" className = "nav-link web"> <img src="../../../src/assets/ucthrift.svg" alt="logo" /> </NavLink>
            <NavLink to="/" className = "nav-link mobile"> <img src="/uct.png" alt="logo" /> </NavLink>
            <NavLink to="/profile" className = "nav-link"> <img src = "https://via.placeholder.com/45x45" alt = "placeholder" /> </NavLink>
            {userId ? (
                <div className = "profile-post">
                    <NavLink to = "/post" className = "nav-link"> <img src = {post} alt = "post icon" width = "20" /></NavLink>
                    <NavLink to="/profile" className = "nav-link"> <img src = "https://via.placeholder.com/45x45" alt = "placeholder" /> </NavLink>
                </div>
            ) : (
                <div className = "buttons">
                    <NavLink to = "/login"> <button className = "login"> log in </button> </NavLink>
                    <NavLink to = "/register"> <button> register </button> </NavLink>
                </div>
            )}
        </div>
    )
}

export default Header;
