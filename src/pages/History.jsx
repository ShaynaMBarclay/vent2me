import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/History.css';

function History() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setEntries(saved);
  }, []);

  return (
    <div className="history-container">
      <div className="history-header">
        <button onClick={() => navigate('/')} className="journalhome-button">🏠</button>
        <button onClick={() => navigate('/journal')} className="journalhome-button">📝</button>
        <h2>Your Past Entries</h2>
      </div>

      {entries.length === 0 ? (
        <p className="no-entries">No entries yet.</p>
      ) : (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li key={entry.id} className="entry-item">
              <div className="entry-mood">Mood: <strong>{entry.mood}</strong></div>
              <div className="entry-date">{new Date(entry.date).toLocaleString()}</div>
              <p className="entry-text">{entry.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;
