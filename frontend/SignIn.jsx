import React, { useState } from 'react';
// import './SignIn.css'; // אם יש קובץ עיצוב, תוריד את ההערה

export default function SignIn() {
    // 1. יצירת משתנים לשמירת המידע (State)
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // 2. פונקציה שמתעדכנת בכל פעם שמקלידים אות
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // 3. פונקציה שמופעלת כשלוחצים על "התחבר"
    const handleSubmit = async (e) => {
        e.preventDefault(); // מונע מהדף להתרענן (חובה!)

        // המרת המידע ל-JSON
        const jsonData = JSON.stringify(formData);
        
        console.log("Sending this JSON:", jsonData); 
        
        // שליחה לשרת
        try {
            const response = await fetch('http://localhost:5000/api/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: jsonData
            });
            
            const data = await response.json();
            console.log("Response from server:", data);
            
            // כאן אתה יכול להציג הודעה או לעבור לעמוד אחר
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="signin-container">
            <h1>התחברות</h1>
            
            {/* הטופס מתחיל כאן */}
            <form onSubmit={handleSubmit}>
                
                {/* --- כאן מדביקים את ה-HTML של ה-Input (עם שינויים קטנים) --- */}
                
                <div className="form-group">
                    <label>שם משתמש:</label>
                    <input 
                        type="text" 
                        name="username"        // חייב להיות זהה לשם ב-State למעלה
                        value={formData.username} // קושר את השדה למשתנה
                        onChange={handleChange}   // מפעיל את העדכון
                        className="input-box"     // class הופך ל-className
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

                {/* --- סוף ה-Inputs --- */}

                <button type="submit" className="submit-btn">
                    התחבר
                </button>
            </form>
        </div>
    );
}