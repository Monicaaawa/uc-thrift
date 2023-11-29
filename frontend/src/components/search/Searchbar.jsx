import {useState} from 'react'
import axios from 'axios';
import './Searchbar.css'

const Searchbar = () => {
    const [filteredItems, setFilteredItems] = useState([]);

    const handleChange = async (e) => {
        const target = e.target.value.toLowerCase();

        try {
            const response = await axios.get(`http://localhost:8080/items?search=${target}`);
            const items = response.data;
            setFilteredItems(items);
        } catch (error) {
            console.log("Error fetching items: ", error); 
        }
    };

    return (
        <>
            <div className="search-container">
                <input 
                className="search"
                type="text"
                placeholder="Search here"
                onChange={handleChange}
                />
                <img className="search-icon" src="../../../src/assets/searchbarIcon.svg" alt="search icon" />
            </div>

            {filteredItems.map((item) => (
                <div className="box" key={item.id}>
                    <p>{item.title}</p>
                    <p>{item.price}</p>
                </div>
            ))}  
        </>
    )
}

export default Searchbar
