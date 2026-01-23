import React, { useState } from 'react';
// import './SignIn.css';

export default function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            return;
        }

        if (formData.password.length < 6) {
            setError('הסיסמה חייבת להיות לפחות 6 תווים');
            return;
        }

        const jsonData = JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
        });

        console.log("Sending this JSON:", jsonData);
    };

    const toggleLink = document.getElementById('toggle-link');
    const phoneGroup = document.getElementById('phone-group');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submit-btn');
    const formTitle = document.getElementById('form-title');
    const toggleText = document.getElementById('toggle-text');

    let isRegisterMode = false;

    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isRegisterMode = !isRegisterMode;

        if (isRegisterMode) {
            phoneGroup.classList.remove('hidden');
            phoneInput.setAttribute('required', 'required');
            formTitle.innerText = "יצירת חשבון";
            submitBtn.innerText = "הרשם";
            toggleText.innerHTML = 'כבר יש לך חשבון? <a href="#" id="toggle-link">להתחברות לחץ כאן</a>';
        } else {
            phoneGroup.classList.add('hidden');
            phoneInput.removeAttribute('required');
            formTitle.innerText = "ברוכים הבאים";
            submitBtn.innerText = "התחבר";
            toggleText.innerHTML = 'אין לך חשבון? <a href="#" id="toggle-link">להרשמה לחץ כאן</a>';
        }

        // חיבור מחדש של האירוע לקישור החדש שנוצר ב-innerHTML
        document.getElementById('toggle-link').addEventListener('click', arguments.callee);
    });


    return (
        <>
            <div class="background-overlay">
                <div class="login-container">
                    <h2 id="form-title">ברוכים הבאים</h2>
                    <p id="form-subtitle">אנא הזינו פרטים כדי להמשיך</p>

                    <form id="auth-form">
                        <div class="input-group">
                            <label for="username">שם משתמש</label>
                            <input type="text" id="username" placeholder="הכנס שם משתמש" required></input>
                        </div>

                        <div class="input-group">
                            <label for="password">סיסמה</label>
                            <input type="password" id="password" placeholder="הכנס סיסמה" required></input>
                        </div>


                        <div id="phone-group" class="input-group hidden">
                            <label for="phone">מספר טלפון</label>
                            <input type="tel" id="phone" placeholder="05X-XXXXXXX"></input>
                        </div>


                        <button type="submit" id="submit-btn" class="btn-submit">התחבר</button>
                    </form>

                    <div class="toggle-container">
                        <p id="toggle-text">אין לך חשבון? <a href="#" id="toggle-link">להרשמה לחץ כאן</a></p>
                    </div>
                </div>
            </div>
        </>
    )
    
}
