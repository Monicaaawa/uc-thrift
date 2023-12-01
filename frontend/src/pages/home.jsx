import React, { useState, useEffect } from 'react';
import Navbar from "../components/navigation/Navbar";
import Searchbar from "../components/navigation/Searchbar";
import ItemPreview from "../components/ItemPreview";
import axios from 'axios';
import './home.css';

const URL = 'http://localhost:8080';

const ITEMS_PER_PAGE = 6;

export default function Home() {
  const [items, setItems] = useState(null);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchItems();
    fetchCount();
  }, [currentPage]);

  async function fetchItems() {
    try {
      const response = await axios.get(`${URL}/items?page=${currentPage}&perPage=${ITEMS_PER_PAGE}`);
      setItems(response.data);
    } catch (e) {
      console.error('Error fetching items:', e);
    }
  }

  async function fetchCount() {
    try {
        const response = await axios.get(`${URL}/items/count`);
        setCount(response.data);
      } catch (e) {
        console.error('Error fetching item count:', e);
      }    
  }

  function displayItems(items) {
    if (!items) {
      return <p>Loading...</p>;
    }

    return items.map((item, index) => (
      <ItemPreview key={index} item={item} />
    ));
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <Navbar />
      <Searchbar />
      <p>{count}</p>
      <div className='item-container'>
        {items && displayItems(items)}
      </div>
      <Pagination currentPage={currentPage} totalItems={count} onPageChange={handlePageChange} />
    </>
  );
} 

const Pagination = ({ currentPage, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="pagination-container">
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <p className="pagination-text">Page {currentPage} of {totalPages}</p>
      <button
        className="pagination-button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};