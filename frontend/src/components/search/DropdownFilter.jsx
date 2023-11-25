import { useState } from 'react';

const DropdownFilter = () => {
  const [filter, setFilter] = useState("");

  const handleChangeFilter = event => {
    setFilter(event.target.value);
  }

  return (
    <div>
      <label htmlFor="filter">Sort By: </label>
      <select
        name="filter"
        value={filter}
        onChange={handleChangeFilter}
      >
        <option value="">-- Please Select --</option>
        <option value="name">Name</option>
        <option value="date">Most recent</option>
        <option value="price-low">Price: low to high</option>
        <option value="price-high">Price: high to low</option>
        <option value="rating">Rating</option>
        <option value="location">Location</option>
      </select>
    </div>
  )
};

export default DropdownFilter;