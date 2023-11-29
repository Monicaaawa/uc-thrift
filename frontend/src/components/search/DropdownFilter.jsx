import { useState, useEffect } from 'react';
import axios from 'axios';
import './DropdownFilter.css';

const DropdownFilter = () => {
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
          response = await axios.get('http://localhost:8080/items');
          const items = response.data;
          let sortedItems;

          if (filter === 'name') {
            sortedItems = items.sort((a, b) => a.title.localeCompare(b.title));
          } else if (filter === 'date') {
            sortedItems = items.sort((a, b) => b.timestamp - a.timestamp);
          } else if (filter === 'price-low') {
            sortedItems = items.sort((a, b) => a.price - b.price);
          } else if (filter === 'price-high') {
            sortedItems = items.sort((a, b) => b.price - a.price);
          }

          setFilteredItems(sortedItems);
        } else if (filter === 'rating') {
            response = await axios.get('http://localhost:8080/users');
            const sellers = response.data;
            const sortedSellers = sellers.sort((a, b) => b.rating - a.rating);
  
            const uniqueItemIds = new Set();
            
            const itemsPromises = sortedSellers.map(async (seller) => {
              // Fetch items associated with the sorted sellers
              const itemsResponse = await axios.get(`http://localhost:8080/items?sellerId=${seller.id}`);
              const items = itemsResponse.data;
  
              // Filter out items already added to the set
              const newItems = items.filter((item) => !uniqueItemIds.has(item.id));
  
              // Add new item IDs to the set
              newItems.forEach((item) => uniqueItemIds.add(item.id));
  
              // Return an array of items with the seller rating
              return newItems.map((item) => ({ ...item, sellerRating: seller.rating }));
            });
  
            // Wait for all item fetch promises to resolve and flatten the array
            const itemsArrays = await Promise.all(itemsPromises);
            const itemsWithSellerRating = itemsArrays.flat();
  
            // Sort items by seller rating in descending order
            const sortedItemsWithRating = itemsWithSellerRating.sort((a, b) => b.sellerRating - a.sellerRating);
            setFilteredItems(sortedItemsWithRating);
        }
      } catch (error) {
        console.log('Error fetching and sorting items: ', error);
      }
    };

    fetchData();
  }, [filter]);

  return (
    <div>
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

      {filteredItems.map((item) => (
        <div className="filterBox" key={item.id}>
          <p>
            {`Title: ${item.title} | Price: $${item.price} | Seller Rating: ${item.sellerRating}`}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DropdownFilter;
