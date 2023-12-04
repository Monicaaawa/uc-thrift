import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import ItemPreview from "../components/ItemPreview";
import Searchbar from '../components/search/Searchbar';
import DropdownFilter from '../components/search/DropdownFilter';
import axios from 'axios';
import './home.css';

const URL = 'http://localhost:8080';

const ITEMS_PER_PAGE_DEFAULT = 6;
const storedItemsPerPage = localStorage.getItem('itemsPerPage');
const ITEMS_PER_PAGE = storedItemsPerPage ? parseInt(storedItemsPerPage, 10) : ITEMS_PER_PAGE_DEFAULT;

export default function Home() {
  const [items, setItems] = useState(null);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_DEFAULT);
  const [sorted, setSorted] = useState(false);
  const [filteredChoice, setFilteredChoice] = useState('');
  const[searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  useEffect(() => {
    fetchItems(searchTerm, filterTerm);
    fetchCount();
  }, [currentPage, itemsPerPage]);

  const fetchItems = useCallback((searchTerm, filterTerm) => {
    const fetchData = async () => {
      try {
        let response;
        if (filterTerm && searchTerm) { 
          response = await axios.get(`${URL}/items?page=${currentPage}&perPage=${ITEMS_PER_PAGE}&search=${searchTerm}&filter=${filterTerm}`);
          setSorted(true);
          setFilteredChoice(filterTerm);
        } else if (filterTerm) {
          response = await axios.get(`${URL}/items?page=${currentPage}&perPage=${ITEMS_PER_PAGE}&filter=${filterTerm}`);
          setSorted(true);
          setFilteredChoice(filterTerm);
        } else if (searchTerm) {
          response = await axios.get(`${URL}/items?page=${currentPage}&perPage=${ITEMS_PER_PAGE}&search=${searchTerm}`);
          setSorted(true);
        } else {
          response = await axios.get(`${URL}/items?page=${currentPage}&perPage=${ITEMS_PER_PAGE}`);
          setSorted(false);
        }
        setItems(response.data);
      } catch (e) {
        console.error('Error fetching items:', e);
      }
    };
    fetchData();
  }, [setSorted, setFilteredChoice, setItems, currentPage])

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
    if (sorted) {
      return items.map((item, index) => (
        <ItemPreview key={index} item={item} />
      ));
    }
   
    // Default is newer items on top
    const reversedItems = items.slice().reverse();
    return reversedItems.map((item, index) => (
      <ItemPreview key={index} item={item} />
    ));
  }

  const handleItemsPerPageChange = (value) => {
    localStorage.setItem('itemsPerPage', value);
    setItemsPerPage(value);
    setCurrentPage(1); 
    window.location.reload();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    // A little wonky can fix later
    document.documentElement.style.scrollBehavior = 'smooth';
    document.documentElement.scrollTop = 0;
  };

  const callAction = (input) => {
    if (input === 'name' || input === 'date' || input === 'price-low' || input === 'price-high') {
      setFilterTerm(input);    
    } else {
      setSearchTerm(input); 
    }
  }

  useEffect(() => {
    fetchItems(searchTerm, filterTerm);
  },[searchTerm, filterTerm, fetchItems]);

  return (
    <>
      <Header />
      <Searchbar onSearch={callAction}/>
      <div className = "home-container">
        <div className = "rest-container">
          <div className = "top">
            <span className = "item-info"> 
              Items per page:&nbsp;&nbsp;
              <select
                className="items-per-page"
                value={ITEMS_PER_PAGE}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="18">18</option>
                <option value="24">24</option>
              </select>

              <span className = "chip">{count} Items </span>
            </span>
            <div className="chip">
              <DropdownFilter onFilter={callAction} selectedFilter={filteredChoice}/>
            </div>
          </div>

          <div className='item-container'>
            {items && displayItems(items)}
          </div>
          <Pagination currentPage={currentPage} totalItems={count} onPageChange={handlePageChange} />
        </div>
      </div>
      
    </>
  );
} 

const Pagination = ({ currentPage, totalItems, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const maxDisplayedPages = 5;

  const calculateStartIndex = () => {
    if (currentPage <= Math.floor(maxDisplayedPages / 2) + 1) 
    {
      return 1;
    } 
    
    else if (currentPage >= totalPages - Math.floor(maxDisplayedPages / 2)) 
    {
      return totalPages - maxDisplayedPages + 1;
    } 
    
    else 
    {
      return currentPage - Math.floor(maxDisplayedPages / 2);
    }
  };

  const pagesArray = Array.from({ length: Math.min(maxDisplayedPages, totalPages) }, (_, index) => {
    return calculateStartIndex() + index;
  });

  return (
    <div className="pagination-container">
      <button
        className="pagination-button previous"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
      </button>
      {pagesArray.map((page) => (
        <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination-button next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
      </button>
    </div>
  );
};