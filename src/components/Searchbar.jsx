import React, { useState, useEffect } from "react";
//import { getUser } from "../api/apiCalls";
//import { useSelector } from "react-redux";

function Searchbar({ className }) {
    const [userId, setUserID] = useState('');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'))
    //const token = useSelector((state) => state.token) 

    useEffect(() => {
        const fetchUser = async () => {
            if (accessToken) {
                await getUser(accessToken, setUserID)
            }
        }
        if (accessToken) {fetchUser();}
    }, [accessToken])

    return (
        <div className={className}>
            <p >searchbar </p>
            {userId ? (<p>{userId}</p>) : (<p>nope</p>)}
        </div>
    );
}

export default Searchbar;
