import React, { useState } from 'react';
import './SignIn.css';
import { signIn, signUp, getOrders, setOrder } from '../server/example.js'; 
import { useNavigate } from 'react-router-dom';


export default function SignIn() {
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleToggleMode = (e) => {
        e.preventDefault();
        setIsRegisterMode((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // מונע רענון

        // בדיקת תקינות בסיסית
        if (!username || !password) {
            alert("שגיאה: חובה למלא שם משתמש וסיסמה!");
            return;
        }

        if (password.length < 6) {
            alert("שגיאה: הסיסמה חייבת להכיל לפחות 6 תווים");
            return;
        }

        // בדיקה ספציפית להרשמה (בדיקת טלפון)
        if (isRegisterMode) {
            if (!phone) {
                alert("שגיאה: בהרשמה חובה להזין מספר טלפון");
                return;
            }
            const response = await signUp(username, password, phone);
            if (response == 200){
                localStorage.setItem('username', username); // שמירת המשתמש
                navigate('/main');
            } else if (response === 0) {
                alert("שגיאת תקשורת: נראה שהשרת לא דולק. נסה להריץ 'npm start' בטרמינל.");
            }else{
                alert("שגיאה בהרשמה");
            }


        } else {
            const response1 = await signIn(username, password);
            if (response1 == 200){
                localStorage.setItem('username', username); // שמירת המשתמש
                navigate('/main');
            } else if (response1 === 0) {
                alert("שגיאת תקשורת: נראה שהשרת לא דולק. נסה להריץ 'npm start' בטרמינל.");
            }else{
                alert("הנתונים שהכנסת שגויים");
            }
        }



        // כאן אתה יכול להוסיף את הלוגיקה של השליחה לשרת
        console.log("Form Submitted");
    };

    return (
        <>
            <div className="background-overlay"></div>
            <div className="login-wrapper">
                <div className="login-container">
                    <h2 id="form-title">{isRegisterMode ? "יצירת חשבון" : "ברוכים הבאים"}</h2>
                    <p id="form-subtitle">אנא הזינו פרטים כדי להמשיך</p>

                    <form id="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">שם משתמש</label>
                            <input 
                                type="text" 
                                id="username" 
                                placeholder="הכנס שם משתמש" 
                                required 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">סיסמה</label>
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="הכנס סיסמה" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div id="phone-group" className={`input-group ${isRegisterMode ? '' : 'hidden'}`}>
                            <label htmlFor="phone">מספר טלפון</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                placeholder="05X-XXXXXXX" 
                                required={isRegisterMode}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <button type="submit" id="submit-btn" className="btn-submit">
                            {isRegisterMode ? "הרשם" : "התחבר"}
                        </button>
                    </form>

                    <div className="toggle-container">
                        <p id="toggle-text">
                            {isRegisterMode ? "כבר יש לך חשבון? " : "אין לך חשבון? "}
                            <a href="#" onClick={handleToggleMode} className="toggle-link">
                                {isRegisterMode ? "להתחברות לחץ כאן" : "להרשמה לחץ כאן"}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}