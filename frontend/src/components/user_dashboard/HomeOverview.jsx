import React, { useEffect } from 'react';

const HomeOverview = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        console.log("🏠 HomeOverview loaded");
    }, []);

    return (
        <div>
            <h2>Welcome {user?.display_name || "User"}</h2>
            <p>This is your dashboard home.</p>
        </div>
    );
};

export default HomeOverview;
