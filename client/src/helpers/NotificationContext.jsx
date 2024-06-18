import React, { createContext, useContext, useState } from 'react';
import Notification from '../pages/Notification.jsx';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ status: '', message: '', show: false });

    const showNotification = (status, message) => {
        setNotification({ status, message, show: true });
        setTimeout(() => {
            setNotification({ status: '', message: '', show: false });
        }, 3000); // Hide after 3 seconds
    };

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            {notification.show && <Notification status={notification.status} message={notification.message} />}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
