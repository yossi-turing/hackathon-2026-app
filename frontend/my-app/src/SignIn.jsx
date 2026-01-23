import React, { useState } from 'react';
import './SignIn.css';
import { signIn, signUp, getOrders, setOrder } from '../server/example.js'; 
import { Navigate } from 'react-router-dom';


export default function SignIn() {
    const [isRegisterMode, setIsRegisterMode] = useState(false);

    // --- הפונקציה שלך (לא נגעתי) ---
    const handleToggleMode = (e) => {
        e.preventDefault();
        setIsRegisterMode(!isRegisterMode);

        const phoneGroup = document.getElementById('phone-group');
        const phoneInput = document.getElementById('phone');
        const submitBtn = document.getElementById('submit-btn');
        const formTitle = document.getElementById('form-title');

        if (!isRegisterMode) { // שים לב: כאן זה הפוך כי הסטייט מתעדכן אסינכרונית, אבל השארתי את הלוגיקה שלך
            phoneGroup.classList.remove('hidden');
            phoneInput.setAttribute('required', 'required');
            formTitle.innerText = "יצירת חשבון";
            submitBtn.innerText = "הרשם";
        } else {
            phoneGroup.classList.add('hidden');
            phoneInput.removeAttribute('required');
            formTitle.innerText = "ברוכים הבאים";
            submitBtn.innerText = "התחבר";
        }
    };

    // --- השינוי היחיד: הוספת הפונקציה שמטפלת בלחיצה על הכפתור ---
    const handleSubmit = (e) => {
        alert("נכנס לפונקציית השליחה");
        e.preventDefault(); // מונע רענון

        // משיכת הערכים מהשדות (כי הם לא ב-State)
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

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
            const phone = document.getElementById('phone').value;
            if (!phone) {
                alert("שגיאה: בהרשמה חובה להזין מספר טלפון");
                return;
            }
            const response = signUp(username, password, phone);
            if (response == 200){
                navigate('/main');
            }else{
                alert("שגיאה בהרשמה");
            }


        } else {
            const response1 = signIn(username, password);
            if (response1 == 200){
                navigate('/main');
            }else{
                alert("הנתונים שהכנסת שגויים");
            }
        }



        // כאן אתה יכול להוסיף את הלוגיקה של השליחה לשרת
        console.log("Form Submitted");
    };

    return (
        <>
            <div className="background-overlay">
                <div className="login-container">
                    <h2 id="form-title">ברוכים הבאים</h2>
                    <p id="form-subtitle">אנא הזינו פרטים כדי להמשיך</p>

                    {/* שינוי קטן: הוספתי את onSubmit */}
                    <form id="auth-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">שם משתמש</label>
                            <input type="text" id="username" placeholder="הכנס שם משתמש" required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">סיסמה</label>
                            <input type="password" id="password" placeholder="הכנס סיסמה" required />
                        </div>

                        <div id="phone-group" className="input-group hidden">
                            <label htmlFor="phone">מספר טלפון</label>
                            <input type="tel" id="phone" placeholder="05X-XXXXXXX" />
                        </div>

                        {/* הכפתור נשאר כמו שהוא, הוא מפעיל את ה-Form למעלה */}
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