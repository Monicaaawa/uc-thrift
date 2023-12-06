import { useState, useEffect } from 'react';
import './DropdownFilter.css';

const DropdownFilter = ({ onFilter, selectedFilter }) => {
  const [filter, setFilter] = useState('');

  const handleChangeFilter = async (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    onFilter(filter);  
  }, [filter]);

  return (
    <>
      <div>
        <label htmlFor="filter">Sort By:&nbsp;&nbsp;</label>
        <select name="filter" value={filter} onChange={handleChangeFilter}>
          <option value="">--Please select--</option>
          <option value="date">Most recent</option>
          <option value="name">Name</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </div>
    </>
  );
};

export default DropdownFilter;
