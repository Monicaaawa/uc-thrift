import {useState} from 'react'
import './Searchbar.css'

const Searchbar = () => {
    const [searchItems, setSearchItems] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);

    const hardCodeItems = [
        {
            id: 1,
            name: 'Math 33A Textbook', 
            type: 'School'
        },
        {
            id: 2,
            name: 'Chair',
            type: 'Utility',
          },
          {
            id: 3,
            name: 'Table',
            type: 'Utility',
          },
          {
            id: 4,
            name: 'Arduino kit',
            type: 'School',
          },
          {
            id: 5,
            name: 'Skateboard',
            type: 'Utility',
          },
          {
            id: 6,
            name: 'T-shirt',
            type: 'Clothes',
          },
    ];

    const handleChange = (e) => {
        const target = e.target.value.toLowerCase();
        setSearchItems(target);

        const filtered = hardCodeItems.filter((item) => {
            return item.name.toLowerCase().includes(searchItems);
        });
        setFilteredItems(filtered);
    };

    return (
        <>
            <input 
            type="text"
            placeholder="Search here"
            onChange={handleChange}
            value={searchItems} 
            />

            {filteredItems.map((item) => (
                <div className="box" key={item.id}>
                    <p>{item.name}</p>
                    <p>{item.type}</p>
                </div>
            ))}  
        </>
    )
}

export default Searchbar
