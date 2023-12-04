import './Header.css';
import { NavLink } from 'react-router-dom';
import Searchbar from './search/Searchbar';

function Header() {
    return (
        <div className="container">
            <NavLink to="/" className = "nav-link web"> <img src="../../../src/assets/ucthrift.svg" alt="logo" /> </NavLink>
            <NavLink to="/" className = "nav-link mobile"> <img src="/uct.png" alt="logo" /> </NavLink>
            <Searchbar />
            <NavLink to="/profile" className = "nav-link"> <img src = "https://via.placeholder.com/45x45" alt = "placeholder" /> </NavLink>
        </div>
    )
}

export default Header

