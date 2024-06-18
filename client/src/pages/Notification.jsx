import React from 'react';
import './CSS/Notification.css'; // Assuming you have corresponding CSS for styling

const Notification = ({ status, message }) => {
    return (
        <div className={`notification ${status}`}>
            {message}
        </div>
    );
};

export default Notification;
