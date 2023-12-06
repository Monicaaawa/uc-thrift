import React, { useState } from 'react';
import upload from '../assets/upload.svg';
import './ImageUpload.css';
import axios from 'axios';

const URL = 'http://localhost:8080';

const ImageUpload = ({ onImageUpload }) => {
    const [imageSrc, setImageSrc] = useState('');
    
    const handleImageChange = async (event) => {
        const file = event.target.files[0];

        if (file) 
        {
            const formData = new FormData();
            formData.append('image', file);
            
            try 
            {
                const response = await axios.post('http://localhost:8080/upload-image', formData);
                const { imagePath } = response.data;
                setImageSrc(`${URL}${imagePath}`);
                onImageUpload(`${URL}${imagePath}`); // Communicate the URL back to the parent component
            }
            catch (error) 
            {
                console.error('Error uploading image:', error);
            }
        }
    };

  return (
    <div className="image-placeholder">
        {!imageSrc && (
            <>
                <img src={upload} width="25" alt="upload icon" />
                <p>Upload Image</p>
            </>
        )}
        {imageSrc && (
            <div className = "square-image">
                {imageSrc && <img src={imageSrc} alt="uploaded image" />}
            </div>
        )}
        <input type="file" accept="image/*" id="image-upload" onChange={handleImageChange} multiple required />
    </div>

  );
};

export default ImageUpload;