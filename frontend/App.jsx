import React, { useState } from 'react';
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import TeamList from './TeamList.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('signin'); // 'signin', 'signup', 'teamlist'

  return (
    <div className="app">
      <nav className="nav-buttons">
        <button onClick={() => setCurrentPage('signOn')}>התחברות</button>
        <button onClick={() => setCurrentPage('signup')}>הרשמה</button>
        <button onClick={() => setCurrentPage('teamlist')}>צפה בקבוצות</button>
      </nav>

      {currentPage === 'signin' && <SignIn />}
      {currentPage === 'signup' && <SignUp />}
      {currentPage === 'teamlist' && <TeamList />}
    </div>
  );
}
