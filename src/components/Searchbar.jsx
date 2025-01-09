import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function Searchbar({ className }) {
   
    const userId = useSelector((state) => state.userId);
    const errorMessage = useSelector((state) => state.authErrorMessage);
    const expirationTime = useSelector((state) => state.tokenExpirationTime) 

    const sessionExpiry = expirationTime
    ? new Date(parseInt(expirationTime)).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : 'Loading...';


    return (
        <div className={className}>
            <p>Welcome, {userId || 'Guest'}</p>
            <p>{errorMessage || sessionExpiry}</p>
        </div>
    );
}

export default Searchbar;
