// Main.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css'; // שומר על העיצוב והרקע
import { getOrders, setOrder, joinOrder, leaveOrder, deleteOrder, getNotifications, clearNotifications, addOrderMessage, togglePayment } from '../server/example.js';

export default function Homepage() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date()); // סטייט לטיימר שמתעדכן
  const [filterLocation, setFilterLocation] = useState('All'); // סטייט לסינון לפי מיקום
  const [notifications, setNotifications] = useState([]); // סטייט להתראות
  const [showNotifications, setShowNotifications] = useState(false); // האם להציג את חלונית ההתראות
  const currentUser = localStorage.getItem('username'); // שליפת המשתמש המחובר
  const [viewOrderId, setViewOrderId] = useState(null); // ID של ההזמנה שפתוחה לצפייה/צ'אט
  const [chatMessage, setChatMessage] = useState(''); // הודעת צ'אט חדשה
  
  // State לניהול הטופס החדש
  const [newOrder, setNewOrder] = useState({
    category: 'אוכל איטלקי',
    details: '',
    aliveTimer: 30,
    location: 'תל אביב',
    price: ''
  });

  // פונקציה למשיכת נתונים (כדי שנוכל לקרוא לה גם אחרי הוספת הזמנה)
  const fetchOrders = async () => {
    const data = await getOrders();
    if (data) {
      console.log("Fetched orders:", data); // לוג לבדיקה
      setOrders(data);
    }
  };

  // משיכת הנתונים בעת טעינת הדף
  useEffect(() => {
    fetchOrders();
    // רענון אוטומטי כל 3 שניות כדי לראות עדכונים ממשתמשים אחרים בזמן אמת
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  // אפקט לעדכון הטיימר כל שנייה
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // אפקט למשיכת התראות כל 5 שניות
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchNotes = async () => {
        const notes = await getNotifications(currentUser);
        setNotifications(notes);
    };
    
    fetchNotes(); // משיכה ראשונית
    const interval = setInterval(fetchNotes, 5000); // בדיקה כל 5 שניות
    return () => clearInterval(interval);
  }, [currentUser]);

  // חישוב זמן נותר
  const getTimeLeft = (order) => {
    if (!order.createdAt) return "00:00";
    
    const created = new Date(order.createdAt).getTime();
    const duration = order.aliveTimer * 60 * 1000; // המרה למילישניות
    const expiresAt = created + duration;
    const now = currentTime.getTime();
    const diff = expiresAt - now;

    if (diff <= 0) return "פג תוקף";

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // טיפול בשינוי שדות בטופס
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  // שליחת הטופס
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.details) {
      alert("אנא מלא את פרטי ההזמנה");
      return;
    }
    
    await setOrder({ ...newOrder, creator: currentUser }); // שליחה לשרת עם שם היוצר
    setIsModalOpen(false); // סגירת המודאל
    setNewOrder({ category: 'אוכל איטלקי', details: '', aliveTimer: 30, location: 'תל אביב', price: '' }); // איפוס הטופס
    fetchOrders(); // רענון הרשימה
  };

  const handleJoin = async (orderId) => {
    if (!currentUser) return alert("עליך להתחבר כדי להצטרף");
    await joinOrder(orderId, currentUser);
    fetchOrders();
  };

  const handleLeave = async (orderId) => {
    if (!currentUser) return;
    await leaveOrder(orderId, currentUser);
    fetchOrders();
  };

  const handleDelete = async (orderId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את ההזמנה?")) {
        await deleteOrder(orderId);
        await fetchOrders(); // המתנה לרענון הרשימה
    }
  };

  const handleClearNotifications = async () => {
      await clearNotifications(currentUser);
      setNotifications([]);
      setShowNotifications(false);
  };

  // סינון ההזמנות לתצוגה: גם לפי מיקום וגם לפי זמן
  const displayedOrders = orders.filter(order => {
      const matchesLocation = filterLocation === 'All' || order.location === filterLocation;
      const isExpired = getTimeLeft(order) === "פג תוקף";
      return matchesLocation && !isExpired;
  });

  // שליחת הודעה בצ'אט
  const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!chatMessage.trim()) return;
      await addOrderMessage(viewOrderId, currentUser, chatMessage);
      setChatMessage('');
      fetchOrders(); // רענון כדי לראות את ההודעה החדשה
  };

  // סימון תשלום
  const handleTogglePay = async (username) => {
      await togglePayment(viewOrderId, username);
      fetchOrders();
  };

  // מציאת ההזמנה הפתוחה כרגע (אם יש כזו)
  const activeOrder = viewOrderId ? orders.find(o => o.id === viewOrderId) : null;


  return (
    <div>
      <div className="background-overlay"></div>

      <div className="top-bar">
          <div className="right-section">
            {/* כפתור התראות */}
            <div className="notification-wrapper">
                <button className="nav-btn notification-btn" onClick={() => setShowNotifications(!showNotifications)}>
                    🔔
                    {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}
                </button>
                
                {showNotifications && (
                    <div className="notification-dropdown">
                        {notifications.length === 0 ? (
                            <p className="no-notes">אין התראות חדשות</p>
                        ) : (
                            <>
                                <ul>
                                    {notifications.map(n => (
                                        <li key={n.id}>{n.message}</li>
                                    ))}
                                </ul>
                                <button className="clear-notes-btn" onClick={handleClearNotifications}>נקה הכל</button>
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="location-badge">📍 תל אביב</div>
            <button className="nav-btn" onClick={() => navigate('/profile')}>👤 פרופיל</button>
            <button className="nav-btn" onClick={() => navigate('/teams')}>👥 קבוצות</button>
            <button className="nav-btn logout" onClick={() => navigate('/')}>🚪 התנתק</button>
          </div>
          <button className="new-order-btn" onClick={() => setIsModalOpen(true)}>+ הזמנה חדשה</button>
      </div>

      <div className="main-content">
        <header>
            <h1>מה מזמינים היום?</h1>
            <div className="search-and-filter">
                <div className="search-box">
                    <input type="text" placeholder="חפש הזמנה..." />
                </div>
                <select 
                    className="location-filter" 
                    value={filterLocation} 
                    onChange={(e) => setFilterLocation(e.target.value)}
                >
                    <option value="All">🌍 כל האזורים</option>
                    <option value="תל אביב">📍 תל אביב</option>
                    <option value="רמת גן">📍 רמת גן</option>
                    <option value="הרצליה">📍 הרצליה</option>
                    <option value="ראשון לציון">📍 ראשון לציון</option>
                    <option value="חיפה">📍 חיפה</option>
                    <option value="ירושלים">📍 ירושלים</option>
                </select>
            </div>
        </header>

        <div className="orders-grid">
            {displayedOrders.length > 0 ? 
             displayedOrders.map((order) => (
                <div key={order.id || Math.random()} className="active-order-card">
                    <div className="food-icon">🍽️</div>
                    <div className="order-title">{order.category}</div>
                    <div className="location-tag">📍 {order.location || 'תל אביב'}</div>
                    {order.price > 0 && <div className="price-tag">💰 ₪{order.price}</div>}
                    <div className="order-details">{order.details}</div>
                    
                    <div className="participants-info">
                        <small>נוצר ע"י: {order.creator || 'אנונימי'}</small>
                        {order.participants && order.participants.length > 0 && (
                            <div className="participants-list">
                                <span>+ {order.participants.length} הצטרפו: </span>
                                {order.participants.join(', ')}
                            </div>
                        )}
                    </div>

                    <div className="timer">⏱ {getTimeLeft(order)}</div>

                    <button className="details-btn" onClick={() => setViewOrderId(order.id)}>💬 צ'אט ותשלום</button>
                    
                    {order.creator === currentUser || currentUser === 'admin' ? (
                        <button className="delete-btn" onClick={() => handleDelete(order.id)}>🗑 מחק הזמנה</button>
                    ) : (
                        (order.participants && order.participants.includes(currentUser)) ? (
                            <button className="leave-btn" onClick={() => handleLeave(order.id)}>❌ בטל הצטרפות</button>
                        ) : (
                            <button className="join-btn" onClick={() => handleJoin(order.id)} disabled={getTimeLeft(order) === "פג תוקף"}>הצטרף</button>
                        )
                    )}
                </div>
            )) : (
                <p style={{color: 'white', fontSize: '1.2rem', marginTop: '20px'}}>אין הזמנות פעילות באזור זה...</p>
            )}
        </div>
      </div>

      {/* מודאל להוספת הזמנה */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-content">
                <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
                <h2>פתיחת הזמנה חדשה</h2>
                
                <form onSubmit={handleSubmitOrder}>
                    <div className="input-group">
                        <label>קטגוריה</label>
                        <select name="category" value={newOrder.category} onChange={handleInputChange}>
                            <option>אוכל איטלקי</option>
                            <option>אוכל אסייתי</option>
                            <option>המבורגרים</option>
                            <option>קינוחים</option>
                            <option>אחר</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>מיקום (עיר/אזור)</label>
                        <select name="location" value={newOrder.location} onChange={handleInputChange}>
                            <option>תל אביב</option>
                            <option>רמת גן</option>
                            <option>הרצליה</option>
                            <option>ראשון לציון</option>
                            <option>חיפה</option>
                            <option>ירושלים</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>מחיר משוער (למשתתף)</label>
                        <input 
                            type="number" 
                            name="price" 
                            placeholder="למשל: 50" 
                            value={newOrder.price}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>פירוט ההזמנה (מאיפה ומתי)</label>
                        <textarea 
                            name="details" 
                            rows="3" 
                            placeholder="למשל: מזמינים מפיצה האט בעוד 20 דקות..."
                            value={newOrder.details}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-submit-order">פרסם הזמנה</button>
                </form>
            </div>
        </div>
      )}

      {/* מודאל פרטי הזמנה וצ'אט */}
      {activeOrder && (
          <div className="modal-overlay" style={{ display: 'flex' }}>
              <div className="modal-content chat-modal">
                  <span className="close-btn" onClick={() => setViewOrderId(null)}>&times;</span>
                  <h2>{activeOrder.category} - {activeOrder.location}</h2>
                  <p className="order-subtitle">{activeOrder.details}</p>

                  <div className="modal-columns">
                      {/* עמודת משתתפים ותשלום */}
                      <div className="participants-column">
                          <h3>משתתפים ({activeOrder.participants ? activeOrder.participants.length + 1 : 1})</h3>
                          <ul className="payment-list">
                              {/* היוצר */}
                              <li onClick={() => handleTogglePay(activeOrder.creator)} className={activeOrder.payments?.[activeOrder.creator] ? 'paid' : ''}>
                                  <span className="status-icon">{activeOrder.payments?.[activeOrder.creator] ? '✅' : '⭕'}</span>
                                  {activeOrder.creator} (מנהל)
                              </li>
                              {/* שאר המשתתפים */}
                              {activeOrder.participants && activeOrder.participants.map(p => (
                                  <li key={p} onClick={() => handleTogglePay(p)} className={activeOrder.payments?.[p] ? 'paid' : ''}>
                                      <span className="status-icon">{activeOrder.payments?.[p] ? '✅' : '⭕'}</span>
                                      {p}
                                  </li>
                              ))}
                          </ul>
                          <p className="tip-text">* לחץ על שם כדי לסמן ששילם</p>
                      </div>

                      {/* עמודת צ'אט */}
                      <div className="chat-column">
                          <h3>צ'אט קבוצתי</h3>
                          <div className="chat-messages">
                              {activeOrder.chat && activeOrder.chat.map((msg, idx) => (
                                  <div key={idx} className={`chat-bubble ${msg.username === currentUser ? 'mine' : 'theirs'}`}>
                                      <span className="chat-user">{msg.username}</span>
                                      <span className="chat-text">{msg.message}</span>
                                  </div>
                              ))}
                              {(!activeOrder.chat || activeOrder.chat.length === 0) && <p className="no-messages">אין הודעות עדיין...</p>}
                          </div>
                          <form className="chat-input-area" onSubmit={handleSendMessage}>
                              <input type="text" placeholder="כתוב הודעה..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} />
                              <button type="submit">➤</button>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
