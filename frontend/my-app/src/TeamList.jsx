import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeamList.css';

export default function TeamList() {
    const navigate = useNavigate();
    const [teams] = useState([
        {
            id: 1,
            name: 'צוות א\'',
            members: ['יוסי', 'דוד', 'יעל'],
            color: '#FF6B6B'
        },
        {
            id: 2,
            name: 'צוות ב\'',
            members: ['שלומי', 'רחל', 'מיכאל'],
            color: '#4CAF50'
        },
        {
            id: 3,
            name: 'צוות ג\'',
            members: ['נורית', 'אהרן', 'ליאור'],
            color: '#2196F3'
        }
    ]);

    return (
        <div className="team-list-container">
            <button className="back-btn" onClick={() => navigate('/main')}>⬅ חזרה לדף הבית</button>
            <h1>קבוצות העבודה</h1>
            <div className="teams-grid">
                {teams.map((team) => (
                    <div 
                        key={team.id} 
                        className="team-card"
                        style={{ borderTopColor: team.color }}
                    >
                        <h2 style={{ color: team.color }}>{team.name}</h2>
                        <div className="team-members">
                            <h3>חברים בצוות:</h3>
                            <ul>
                                {team.members.map((member, idx) => (
                                    <li key={idx}>{member}</li>
                                ))}
                            </ul>
                        </div>
                        <button 
                            className="join-btn"
                            style={{ backgroundColor: team.color }}
                        >
                            הצטרף לקבוצה
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
