import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser, getOrders } from '../server/example';
import './Profile.css';

export default function Profile() {
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('username');
    const [user, setUser] = useState(null);
    const [myOrders, setMyOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [phone, setPhone] = useState('');
    const [monthlySpent, setMonthlySpent] = useState(0);

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
            return;
        }
        
        async function loadData() {
            // טעינת פרטי משתמש
            const userData = await getUser(currentUser);
            if (userData) {
                setUser(userData);
                setPhone(userData.phoneNum || '');
            }

            // טעינת היסטוריית הזמנות
            const allOrders = await getOrders();
            if (allOrders && Array.isArray(allOrders)) {
                // סינון הזמנות שקשורות למשתמש
                const relevantOrders = allOrders.filter(o => 
                    o.creator === currentUser || (o.participants && o.participants.includes(currentUser))
                );
                // מיון לפי החדש ביותר
                relevantOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setMyOrders(relevantOrders);

                // חישוב הוצאות החודש
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                
                const total = relevantOrders.reduce((sum, order) => {
                    const orderDate = new Date(order.createdAt);
                    // בודקים אם ההזמנה מהחודש הנוכחי וגם אם המשתמש שילם עליה
                    if (
                        orderDate.getMonth() === currentMonth && 
                        orderDate.getFullYear() === currentYear &&
                        order.payments && 
                        order.payments[currentUser]
                    ) {
                        return sum + (Number(order.price) || 0);
                    }
                    return sum;
                }, 0);
                setMonthlySpent(total);
            }
        }
        loadData();
    }, [currentUser, navigate]);

    const handleSave = async () => {
        await updateUser(currentUser, phone);
        setIsEditing(false);
        const updatedUser = await getUser(currentUser);
        setUser(updatedUser);
    };

    if (!user) return <div className="loading-screen">טוען פרופיל...</div>;

    return (
        <div className="profile-page">
            <div className="background-overlay"></div>
            
            <div className="profile-container">
                <button className="back-btn-profile" onClick={() => navigate('/main')}>⬅ חזרה לדף הבית</button>
                
                <div className="profile-header">
                    <div className="avatar-circle">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h1>{user.username}</h1>
                    
                    {/* כרטיסיית סטטיסטיקה */}
                    <div className="stats-card">
                        <h3>הוצאות החודש</h3>
                        <div className="stat-value">₪{monthlySpent}</div>
                        <p className="stat-subtitle">* מחושב לפי הזמנות שסומנו כ"שולם"</p>
                    </div>

                    <div className="user-details">
                        {isEditing ? (
                            <div className="edit-mode">
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="מספר טלפון" />
                                <button className="save-btn" onClick={handleSave}>שמור</button>
                                <button className="cancel-btn" onClick={() => setIsEditing(false)}>ביטול</button>
                            </div>
                        ) : (
                            <div className="view-mode">
                                <p>📞 {user.phoneNum || 'לא הוזן מספר'}</p>
                                <button className="edit-icon-btn" onClick={() => setIsEditing(true)}>✏️ ערוך</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="orders-history">
                    <h2>ההזמנות שלי ({myOrders.length})</h2>
                    <div className="history-list">
                        {myOrders.length > 0 ? myOrders.map(order => (
                            <div key={order.id} className="history-card">
                                <div className="history-header">
                                    <span className="history-category">{order.category}</span>
                                    <span className="history-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="history-details">{order.details}</p>
                                <div className="history-footer">
                                    <span className="history-role">{order.creator === currentUser ? '👑 יצרת' : '👤 הצטרפת'}</span>
                                    <span className="history-price">{order.price ? `₪${order.price}` : ''}</span>
                                    <span className="history-status">{order.payments && order.payments[currentUser] ? '✅ שולם' : '⭕ לא שולם'}</span>
                                </div>
                            </div>
                        )) : <p className="no-history">עדיין לא ביצעת הזמנות...</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}