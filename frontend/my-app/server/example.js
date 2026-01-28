// import axios from "axios";

// export const sendData = async () => {
//     const response = await fetch('http://10.10.205.213:8080/check-connection', {
//         method: 'POST',
//         body: JSON.stringify({
//             title: 'foo',
//             body: 'bar',
//             userId: 1,
//         }),
//         headers: {
//             'Content-type': 'application/json'
//         },
//     });
//     const data = await response.json();
//     console.log('Success:', data);
// }

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const signIn = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/signIn`, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            headers: {
                'Content-type': 'application/json'
            },
        });
        const data = await response.json();
        console.log('Success:', data);
        return response.status;
    } catch (error) {
        console.error("SignIn Error:", error);
        return 0; // 0 מסמל שגיאת תקשורת
    }
}


export const signUp = async (username, password, phoneNum) => {
    try {
        const response = await fetch(`${BASE_URL}/signUp`, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
                phoneNum: phoneNum,
            }),
            headers: {
                'Content-type': 'application/json'
            },
        });
        const data = await response.json();
        console.log('Success:', data);
        return response.status;
    } catch (error) {
        console.error("SignUp Error:", error);
        return 0; // 0 מסמל שגיאת תקשורת
    }
}

export const getOrders = async () => {
    try {
        const response = await fetch(`${BASE_URL}/getOrders?_t=${Date.now()}`, {
            method: 'GET',
            cache: 'no-store', // מונע מהדפדפן לשמור גרסה ישנה של הרשימה
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
            },
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data =  await response.json();
        console.log('Orders:', data);

        return data;

    } catch (error) {
        console.error('Failed to get orders:', error);
        return []; // מחזירים מערך ריק במקרה של שגיאה כדי שהאתר לא יקרוס
    }
}

export const setOrder = async (orderData) => {
    const response = await fetch(`${BASE_URL}/setOrder`, {
        method: 'POST',
        body: JSON.stringify({
            category: orderData.category,
            details: orderData.details,
            aliveTimer: orderData.aliveTimer || 60,
            phoneNum: orderData.phoneNum || '0000000000',
            location: orderData.location || 'תל אביב',
            creator: orderData.creator,
            price: orderData.price
        }),
        headers: {
            'Content-type': 'application/json'
        },
    });
    const data = await response.json();
    console.log('Success:', data);
}

export const joinOrder = async (orderId, username) => {
    await fetch(`${BASE_URL}/joinOrder`, {
        method: 'POST',
        body: JSON.stringify({ orderId, username }),
        headers: { 'Content-type': 'application/json' },
    });
}

export const leaveOrder = async (orderId, username) => {
    await fetch(`${BASE_URL}/leaveOrder`, {
        method: 'POST',
        body: JSON.stringify({ orderId, username }),
        headers: { 'Content-type': 'application/json' },
    });
}

export const deleteOrder = async (orderId) => {
    await fetch(`${BASE_URL}/deleteOrder`, {
        method: 'POST',
        body: JSON.stringify({ orderId }),
        headers: { 'Content-type': 'application/json' },
    });
}

export const getNotifications = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/getNotifications?username=${username}`);
        return await response.json();
    } catch (e) { return []; }
}

export const clearNotifications = async (username) => {
    await fetch(`${BASE_URL}/clearNotifications`, {
        method: 'POST',
        body: JSON.stringify({ username }),
        headers: { 'Content-type': 'application/json' }
    });
}

export const addOrderMessage = async (orderId, username, message) => {
    await fetch(`${BASE_URL}/addOrderMessage`, {
        method: 'POST',
        body: JSON.stringify({ orderId, username, message }),
        headers: { 'Content-type': 'application/json' },
    });
}

export const togglePayment = async (orderId, username) => {
    await fetch(`${BASE_URL}/togglePayment`, {
        method: 'POST',
        body: JSON.stringify({ orderId, username }),
        headers: { 'Content-type': 'application/json' },
    });
}

export const getUser = async (username) => {
    try {
        const response = await fetch(`${BASE_URL}/getUser?username=${username}&_t=${Date.now()}`);
        return await response.json();
    } catch (e) { return null; }
}

export const updateUser = async (username, phoneNum) => {
    await fetch(`${BASE_URL}/updateUser`, {
        method: 'POST',
        body: JSON.stringify({ username, phoneNum }),
        headers: { 'Content-type': 'application/json' },
    });
}