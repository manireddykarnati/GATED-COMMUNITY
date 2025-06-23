import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const { user_id, plot_id, org_id } = user;

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`/api/user/notifications/${plot_id}/${org_id}/${user_id}`);
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch notifications", "error");
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/user/notifications/${id}/read`);
            fetchNotifications(); // refresh list
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (plot_id && org_id && user_id) fetchNotifications();
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <ul>
                    {notifications.map((note) => (
                        <li
                            key={note.notification_id}
                            style={{
                                marginBottom: "12px",
                                backgroundColor: note.status === 'unread' ? "#f2f2f2" : "#e0ffe0",
                                padding: "10px",
                                borderLeft: `5px solid ${note.priority === 'urgent' ? 'red' : note.priority === 'high' ? 'orange' : 'green'}`
                            }}
                            onClick={() => markAsRead(note.notification_id)}
                        >
                            <strong>{note.title}</strong>
                            <p>{note.message}</p>
                            <small>Status: {note.status}</small> | <small>Priority: {note.priority}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
