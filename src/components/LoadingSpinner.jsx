import React from 'react';

function LoadingSpinner() {
    return (
        <div className="spinner-container">
            <div className="spinner"></div>
            <p className="loading-text">Loading advice...</p>
        </div>
    );
}

export default LoadingSpinner;