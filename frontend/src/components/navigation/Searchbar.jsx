import {useState} from 'react'
import axios from 'axios';
import './Searchbar.css'

const Searchbar = () => {
    const [searchItems, setSearchItems] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    const handleChange = async (e) => {
        const target = e.target.value.toLowerCase();
        setSearchItems(target);

        try {
            const response = await axios.get(`http://localhost:8080/items?search=${target}`);
            const items = response.data;
            console.log("items: ", items)
            setFilteredItems(items)
        } catch (error) {
            console.log("Error fetching items: ", error); 
        }

        // const filtered = hardCodeItems.filter((item) => {
        //     return item.name.toLowerCase().includes(searchItems);
        // });
        // setFilteredItems(filtered);
    };

    return (
        <>
            <div className="search-container">
                <input 
                className="search"
                type="text"
                placeholder="Search here"
                onChange={handleChange}
                value={searchItems} 
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
