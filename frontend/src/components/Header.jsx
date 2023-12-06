import './Header.css';
import { useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import profile from '../assets/profile.svg';

const URL = 'http://localhost:8080';

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
     
    useEffect(() => {
       getUser(userId);
    }, []);

    return (
        <div className="container">
            <NavLink to="/" className = "nav-link web"> <img src="../../../src/assets/ucthrift.svg" alt="logo" /> </NavLink>
            <NavLink to="/" className = "nav-link mobile"> <img src="/uct.png" alt="logo" /> </NavLink>
            {userId ? (
                <div className = "profile-post">
                    <NavLink to = "/post" className = "nav-link"> <button> Post item </button></NavLink>
                    <NavLink to="/profile" className = "nav-link"> <img src = {profile} width = "35" alt = "profile icon" /> </NavLink>
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
