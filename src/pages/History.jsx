import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import '../styles/History.css';

function History() {
  const [entries, setEntries] = useState([]);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const navigate = useNavigate();
  const [showReminder, setShowReminder] = useState(false);
  const [expandedAdviceId, setExpandedAdviceId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [flipDirection, setFlipDirection] = useState(null);

  useEffect(() => {
    const dismissedPermanently = localStorage.getItem('dismissExportReminder');
    const lastShown = localStorage.getItem('lastExportReminderDate');
    if (!dismissedPermanently) {
      const now = new Date().getTime();
      const lastShownTime = lastShown ? parseInt(lastShown, 10) : 0;
      if (now - lastShownTime > 3 * 24 * 60 * 60 * 1000) {
        setShowReminder(true);
      }
    }
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setEntries(saved);
  }, []);

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
          importedEntries = importedEntries.map(entry => ({ ...entry, id: uuidv4() }));
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
      setCurrentPage(0);
    }
  };

  const handleDelete = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    if (currentPage >= updatedEntries.length) {
      setCurrentPage(Math.max(0, updatedEntries.length - 1));
    }
  };

  const nextPage = () => {
    if (currentPage < entries.length - 1) {
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setFlipDirection(null);
      }, 300); // match animation duration
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setFlipDirection(null);
      }, 300);
    }
  };

  const currentEntry = entries[currentPage];

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

  <div className="page-container">
 <div
  key={currentEntry.id}
  className={`journal-entry-card ${flipDirection === 'next' ? 'flip-next' : ''} ${flipDirection === 'prev' ? 'flip-prev' : ''}`}
>
    <button onClick={() => handleDelete(currentEntry.id)} className="delete-entry-button">Delete</button>
    <div className="entry-mood">Mood: <strong>{currentEntry.mood}</strong></div>
    <div className="entry-date">{new Date(currentEntry.date).toLocaleString()}</div>
    <p className="entry-text">{currentEntry.text}</p>
    {currentEntry.aiResponse && (
      <div className="entry-ai-response">
        <strong
          className="toggle-advice"
          onClick={() =>
            setExpandedAdviceId(expandedAdviceId === currentEntry.id ? null : currentEntry.id)
          }
        >
          {expandedAdviceId === currentEntry.id ? 'Hide Advice' : 'Show Advice'}
        </strong>
        {expandedAdviceId === currentEntry.id && <p>{currentEntry.aiResponse}</p>}
      </div>
    )}
  </div>

  <div className="page-controls">
    <button onClick={prevPage} disabled={currentPage === 0} className="arrow-button left-arrow">←</button>
    <button onClick={nextPage} disabled={currentPage === entries.length - 1} className="arrow-button right-arrow">→</button>
  </div>
</div>


)}

      {showReminder && (
        <div className="reminder-overlay">
          <div className="reminder-popup">
            <p>💡 Have you exported your previous entries recently? You don’t want to lose them!</p>
            <div className="reminder-buttons">
              <button onClick={() => {
                localStorage.setItem('dismissExportReminder', 'true');
                setShowReminder(false);
              }}>Close Forever</button>
              <button onClick={() => {
                localStorage.setItem('lastExportReminderDate', new Date().getTime().toString());
                setShowReminder(false);
              }}>Remind Me in 3 Days</button>
            </div>
          </div>
        </div>
      )}

       <div className="info-toggle-section">
        {isInfoOpen ? (
          <div className="info-box">
            <button onClick={() => setIsInfoOpen(false)} className="toggle-info-button inside">
              Hide Info
            </button>
            <p><strong>FYI:</strong></p>
            <p>Your journal entries are safely stored only on this device. This means that if you switch to a different device, clear your browser’s cache, or possibly switch browsers, your entries will no longer be available. To keep them safe and transfer them to another device, you can export your entries and import them wherever you need them. If you ever need to, you can also delete any duplicate entries. Just remember to export your entries before clearing your cache or switching browsers, or switching devices, as doing so may erase your entries permanently.</p>
          </div>
        ) : (
          <button onClick={() => setIsInfoOpen(true)} className="toggle-info-button">Show Info</button>
        )}
      </div>
 <div className="tip-container">
        <div className="tip-bubble">
          <span className="tip-text">A <br />Tip❤️</span>
          <div className="tip-info">
            <p>To sync across devices or browsers, export your entries after each new one, email them to yourself, then go to your other device, click 'Clear All Entries,' and re-import the updated entries. Or keep seperate entries on seperate devices. I dont judge😈</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default History;
