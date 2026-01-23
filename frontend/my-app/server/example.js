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

export const signIn = async () => {
    const response = await fetch('http://localhost:8080/signIn', {
        method: 'POST',
        body: JSON.stringify({
            username: 'poopie',
            password: 'poopie123',
        }),
        headers: {
            'Content-type': 'application/json'
        },
    });
    const data = await response.json();
    console.log('Success:', data);
}

export const signUp = async () => {
    const response = await fetch('http://localhost:8080/signUp', {
        method: 'POST',
        body: JSON.stringify({
            username: 'poopie',
            password: 'poopie123',
            phoneNum: '0541234567',
        }),
        headers: {
            'Content-type': 'application/json'
        },
    });
    const data = await response.json();
    console.log('Success:', data);
}