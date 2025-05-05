import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Journal.css';

const moods = ['Happy', 'Sad', 'Anxious', 'Excited', 'Angry', 'Calm'];

function Journal() {
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [entry, setEntry] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const [aiResponse, setAiResponse] = useState('');
  const navigate = useNavigate();

  // Setup speech recognition once on mount
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Sorry, your browser does not support voice-to-text.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setEntry(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      if (isListeningRef.current) {
        console.log('Restarting recognition...');
        recognition.start();
      } else {
        console.log('Stopped completely.');
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      isListeningRef.current = true;
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      isListeningRef.current = false;
      recognitionRef.current.stop();
      setEntry((prev) => prev.trim());
    }
  };

  // NEW: Just get AI feedback without saving
  const handleAIPreview = async () => {
    const mood = selectedMood || customMood.trim();
    if (!mood || !entry.trim()) return;

    try {
      const res = await fetch('/.netlify/functions/ai-response', {
        method: 'POST',
        body: JSON.stringify({ entryText: entry.trim() }),
      });

      const data = await res.json();
      setAiResponse(data.message);
    } catch (error) {
      console.error('AI preview failed:', error);
      setAiResponse("Oops! Couldn't get a preview from the AI.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mood = selectedMood || customMood.trim();
    if (!mood || !entry.trim()) return;

    const newEntry = {
      id: Date.now(),
      mood,
      text: entry.trim(),
      date: new Date().toISOString(),
    };

    const existingEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    localStorage.setItem('journalEntries', JSON.stringify([newEntry, ...existingEntries]));

    try {
      const res = await fetch('/.netlify/functions/ai-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryText: newEntry.text }),
      });

      const data = await res.json();
      setAiResponse(data.message);
    } catch (error) {
      console.error('AI fetch failed:', error);
      setAiResponse("Oops! Couldn't get a response from the AI.");
    }

    setSelectedMood('');
    setCustomMood('');
    setEntry('');
  };

  return (
    <div className="journal-container">
      {/* Header with Home Button */}
      <div className="journal-header">
        <button onClick={() => navigate('/')} className="journalhome-button">🏠</button>
        <button onClick={() => navigate('/history')} className="history-button">📖</button>
        <h2>How are you feeling today?</h2>
      </div>

      {/* Mood Buttons */}
      <div className="mood-buttons">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`mood-button ${selectedMood && selectedMood !== mood ? 'dimmed' : ''}`}
            onClick={() => setSelectedMood(mood)}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Custom Mood Input */}
      <input
        className="custom-mood"
        type="text"
        placeholder="Or type your mood..."
        value={customMood}
        onChange={(e) => setCustomMood(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && customMood.trim() !== '') {
            setSelectedMood(customMood.trim());
            setCustomMood('');
          }
        }}
      />

      {/* Highlighted Mood */}
      {selectedMood && (
        <div className="highlighted-mood">
          <p>Your mood:</p>
          <h3>{selectedMood}</h3>
        </div>
      )}

      {/* Journal Entry */}
      <textarea
        className="journal-entry"
        placeholder="Write your thoughts here...Or speak them!"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      {/* Action Buttons */}
      <div className="journal-actions">
        <button onClick={startListening} className="voice-button" disabled={isListening}>
          🎙️ Speak
        </button>
        <button onClick={stopListening} className="voice-button" disabled={!isListening}>
          🛑 Stop
        </button>
        <button onClick={handleAIPreview} className="enter-button">
          ⏎ Enter (AI Feedback)
        </button>
        <button onClick={handleSubmit} className="submit-button">
          Save Entry
        </button>
      </div>

      {/* AI Response */}
      {aiResponse && (
        <div className="ai-response">
          <h4>AI says:</h4>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default Journal;
