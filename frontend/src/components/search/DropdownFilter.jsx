import { useState, useEffect } from 'react';
import axios from 'axios';
import './DropdownFilter.css';

const DropdownFilter = ({ onFilter }) => {
  const [filter, setFilter] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleChangeFilter = async (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;

        if (filter === 'name' || filter === 'date' || filter === 'price-low' || filter === 'price-high') {
          response = await axios.get(`http://localhost:8080/items/filter?filter=${filter}`);
          setFilteredItems(response.data);
        }
      } catch (error) {
        console.log('Error fetching and sorting items: ', error);
      }
    };
    fetchData();
  }, [filter]);

  useEffect(() => {
    if (filteredItems.length === 0) {
      return;
    }
    onFilter(filteredItems);
  }, [onFilter, filteredItems]);

  return (
    <>
      <div className='filter-box'>
        <label htmlFor="filter">Sort By: </label>
        <select name="filter" value={filter} onChange={handleChangeFilter}>
          <option value="">-- Please Select --</option>
          <option value="name">Name</option>
          <option value="date">Most recent</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="rating">Rating</option>
          <option value="location">Location</option>
        </select>
      </div>
    </>
  );
};

export default DropdownFilter;
