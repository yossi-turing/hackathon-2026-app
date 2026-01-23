// Main.jsx
import React from 'react';
// import './main.css'; // שומר על העיצוב והרקע

export default function Homepage() {
  return (
    
    <div>
      <p>זוהי קומפוננטה ריקה בנתיב /main</p>
      <div className="background-overlay"></div>

    
      <div className="main-content" style={{ marginTop: '100px' }}>
        <h1>Main Page</h1>
        <p>זוהי קומפוננטה ריקה בנתיב /main</p>
      </div>
    </div>
  );
};
