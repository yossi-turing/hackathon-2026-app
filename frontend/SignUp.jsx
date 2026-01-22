import React, { useState } from 'react';
// import './SignUp.css'; // אם יש קובץ עיצוב, תוריד את ההערה

export default function SignUp() {
    // יצירת משתנים לשמירת המידע (State)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    // פונקציה שמתעדכנת בכל פעם שמקלידים אות
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError(''); // מנקה הודעות שגיאה
    };

    // פונקציה שמופעלת כשלוחצים על "הרשם"
    const handleSubmit = (e) => {
        e.preventDefault(); // מונע מהדף להתרענן

        // בדיקה שהסיסמאות תואמות
        if (formData.password !== formData.confirmPassword) {
            setError('הסיסמאות אינן תואמות');
            return;
        }

        // בדיקה שהסיסמה לא קצרה מדי
        if (formData.password.length < 6) {
            setError('הסיסמה חייבת להיות לפחות 6 תווים');
            return;
        }

        // המרת המידע ל-JSON
        const jsonData = JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
        });
        
        console.log("Sending this JSON:", jsonData); 
        
        // כאן תשלח לשרת (fetch/axios)
    };

    return (
        <div className="signup-container">
            <h1>הרשמה</h1>
            
            <form onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label>שם משתמש:</label>
                    <input 
                        type="text" 
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>אימייל:</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>סיסמה:</label>
                    <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>אישור סיסמה:</label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input-box"
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-btn">
                    הרשם
                </button>
            </form>
        </div>
    );
}
