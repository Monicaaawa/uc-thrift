import './Searchbar.css';
import search from '../../../src/assets/search.svg';
import { NavLink } from 'react-router-dom';

const Searchbar = ({ onSearch }) => {
    const handleChange = async (e) => {
        const target = e.target.value.toLowerCase(); 

        try {
            onSearch(target);
        } catch (error) {
            console.log("Error fetching items: ", error); 
        }
    };
    return (
        <>
            <div className="container">
                <NavLink to="/" className = "nav-link web"> <img src="../../../src/assets/ucthrift.svg" alt="logo" /> </NavLink>
                <NavLink to="/" className = "nav-link mobile"> <img src="/uct.png" alt="logo" /> </NavLink>
                <div className="search-container">
                    <input 
                        className="search"
                        type="text"
                        placeholder="Search items"
                        onChange={handleChange}
                    />
                    <img className="search-icon" src={search} alt="search icon" />
                </div>
                <NavLink to="/profile" className = "nav-link"> <img src = "https://via.placeholder.com/45x45" alt = "placeholder" /> </NavLink>
            </div>
        </>
    );
};

export default Searchbar;
