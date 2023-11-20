import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ItemDetails from '../components/ItemDetails';

const URL = 'http://localhost:8080';

export default function DetailsPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);

  async function getItemDetails() {
    try {
      const response = await axios.get(URL + '/items/' + itemId);
      setItem(response.data);
    } catch (e) {
      console.error('Error fetching item details:', e);
    }
  } 

  useEffect(() => {
    getItemDetails();
  }, []);

  if (!item) {
    return <p>Loading...</p>;
  }

  return (
    <div>
        <ItemDetails item={item}/>
    </div>
  );
};