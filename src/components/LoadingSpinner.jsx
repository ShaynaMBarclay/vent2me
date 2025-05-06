import React from 'react';
import pencilImg from '../assets/pencil.png';

function LoadingSpinner() {
    return (
        <div className="spinner-container">
            <img
                src={pencilImg}
                alt="Spinning pencil"
                className="spinner-image"
            />
            <p className="loading-text">Loading advice...</p>
        </div>
    );
}

export default LoadingSpinner;