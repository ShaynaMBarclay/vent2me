import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/History.css';

function History() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
  const dismissedPermanently = localStorage.getItem('dismissExportReminder');
  const lastShown = localStorage.getItem('lastExportReminderDate');

  if (!dismissedPermanently) {
    const now = new Date().getTime();
    const lastShownTime = lastShown ? parseInt(lastShown, 10) : 0;

    // Show again if it's been more than 3 days or never shown
    if (now - lastShownTime > 3 * 24 * 60 * 60 * 1000)  {
      setShowReminder(true);
    }
  }
}, []);


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

   // Handle deleting a specific entry
  const handleDelete = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries)); // Update localStorage
  };

  return (
    <div className="history-container">
       
      <div className="history-header">
        
        <button onClick={() => navigate('/')} className="journalhome-button">🏠</button>
        <button onClick={() => navigate('/journal')} className="journalhome-button">📝</button>
        <h2>Your Past Entries</h2>
      </div>

        {/* Explanation Box */}
      <div className="info-box">
        <p><strong>FYI:</strong></p>
        <p>Your journal entries are safely stored only on this device. This means that if you switch to a different device, clear your browser’s cache, or possibly switch browsers, your entries will no longer be available. To keep them safe and transfer them to another device, you can export your entries and import them wherever you need them. If you ever need to, you can also delete any duplicate entries. Just remember to export your entries before clearing your cache or switching browsers, or switching devices, as doing so may erase your entries permanently.</p>
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
     {/* delete button */}
   <button onClick={() => handleDelete(entry.id)} className="delete-entry-button">Delete</button>
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
      {showReminder && (
  <div className="reminder-overlay">
    <div className="reminder-popup">
      <p>
        💡 Have you exported your previous entries recently? You dont want to lose them!
      </p>
      <div className="reminder-buttons">
        <button
          onClick={() => {
            localStorage.setItem('dismissExportReminder', 'true');
            setShowReminder(false);
          }}
        >
          Close Forever
        </button>
        <button
          onClick={() => {
            localStorage.setItem('lastExportReminderDate', new Date().getTime().toString());
            setShowReminder(false);
          }}
        >
          Remind Me in 3 Days
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default History;
