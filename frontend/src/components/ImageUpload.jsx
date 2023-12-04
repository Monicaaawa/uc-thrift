import React, { useState } from 'react';
import upload from '../assets/upload.svg';
import './ImageUpload.css';

const ImageUpload = () => {
    const [imageSrc, setImageSrc] = useState('');
    
    // One Image
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
        const reader = new FileReader();

        reader.onload = () => {
            setImageSrc(reader.result);
        };

        reader.readAsDataURL(file);
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