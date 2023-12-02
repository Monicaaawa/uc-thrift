import './Header.css';
import { NavLink } from 'react-router-dom';
import search from '../assets/search.svg';

function Header() {
    return (
        <div className="container">
            <NavLink to="/" className = "nav-link web"> <img src="../../../src/assets/ucthrift.svg" alt="logo" /> </NavLink>
            <NavLink to="/" className = "nav-link mobile"> <img src="/uct.png" alt="logo" /> </NavLink>

            <div className="search-container">
                <input 
                className="search"
                type="text"
                placeholder="Search items"
                // onChange={handleChange}
                // value={searchItems} 
                />
                <img className="search-icon" src={search} alt="search icon" />
            </div>
            <NavLink to="/profile" className = "nav-link"> <img src = "https://via.placeholder.com/45x45" alt = "placeholder" /> </NavLink>
        </div>
    )
}

export default Header

