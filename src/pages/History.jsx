import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/History.css';

function History() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setEntries(saved);
  }, []);

  useEffect(() => {
    entries.forEach(entry => console.log("Entry ID in History:", entry.id));
  }, [entries]);


  const handleExport = () => {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-journal-entries.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let importedEntries = JSON.parse(e.target.result);
  
        if (Array.isArray(importedEntries)) {
          // Regenerate IDs to avoid duplicates
          importedEntries = importedEntries.map(entry => ({
            ...entry,
            id: uuidv4(),
          }));
  
          const combined = [...entries, ...importedEntries];
     localStorage.setItem('journalEntries', JSON.stringify(combined));
     setEntries(combined);
          alert('Entries imported successfully!');
        } else {
          alert('Invalid file format.');
        }
      } catch (error) {
        alert('Error importing file.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    const confirmClear = window.confirm("Are you sure you want to delete all your journal entries?");
    if (confirmClear) {
      localStorage.removeItem('journalEntries');
      setEntries([]);
    }
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <button onClick={() => navigate('/')} className="journalhome-button">🏠</button>
        <button onClick={() => navigate('/journal')} className="journalhome-button">📝</button>
        <h2>Your Past Entries</h2>
      </div>

      
      <div className="history-actions">
        <button onClick={handleExport} className="export-button">📤 Export Entries</button>
        <label className="import-label">
          📥 Import Entries
          <input type="file" accept="application/json" onChange={handleImport} className="import-input" />
        </label>

        <button onClick={handleClearAll} className="clear-button">🗑️ Clear All Entries</button>
        </div>
      
      {entries.length === 0 ? (
        <p className="no-entries">No entries yet.</p>
      ) : (
        <div className="entries-grid">
       
       {entries.map((entry) => (
  <div key={entry.id} className="journal-entry-card">
    <div className="entry-mood">Mood: <strong>{entry.mood}</strong></div>
    <div className="entry-date">{new Date(entry.date).toLocaleString()}</div>
    <p className="entry-text">{entry.text}</p>

    {entry.aiResponse && (
      <div className="entry-ai-response">
        <strong>Your Advice:</strong>
        <p>{entry.aiResponse}</p>
      </div>
    )}
  </div>
))}
        </div>
      )}
    </div>
  );
}

export default History;
