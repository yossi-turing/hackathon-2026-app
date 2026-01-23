import axios from "axios";

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

export const signIn = async (username, password) => {
    const response = await fetch('http://localhost:8080/signIn', {
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
}


export const signUp = async (username, password, phoneNum) => {
    const response = await fetch('http://localhost:8080/signUp', {
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
}

export const getOrders = async () => {
    try {
        const response = await fetch('http://localhost:8080/getOrders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
            },
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Orders:', data);

        return data;

    } catch (error) {
        console.error('Failed to get orders:', error);
        return []; // מחזירים מערך ריק במקרה של שגיאה כדי שהאתר לא יקרוס
    }
}

export const setOrder = async () => {
    const response = await fetch('http://localhost:8080/setOrder', {
        method: 'POST',
        body: JSON.stringify({
            category: 'pizza',
            details: 'poopie123',
            // phoneNum: '0541234567',
            aliveTimer: 30,
        }),
        headers: {
            'Content-type': 'application/json'
        },
    });
    const data = await response.json();
    console.log('Success:', data);
}