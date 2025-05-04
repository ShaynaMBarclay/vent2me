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
  const isListeningRef = useRef(false); // 🔧 New ref to track up-to-date listening state
  const navigate = useNavigate();

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
      if (isListeningRef.current) {
        recognition.start(); // 🔁 Restart only if listening should continue
      }
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      isListeningRef.current = true; // ✅ Sync ref
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      isListeningRef.current = false; // ✅ Sync ref
      recognitionRef.current.stop();
      setEntry((prev) => prev.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mood = customMood || selectedMood;
    console.log('Mood:', mood);
    console.log('Entry:', entry);
    // Save entry later to backend/localStorage
    setSelectedMood('');
    setCustomMood('');
    setEntry('');
  };

  return (
    <div className="journal-container">
      {/* Header */}
      <div className="journal-header">
        <button onClick={() => navigate('/')} className="journalhome-button">
          🏠
        </button>
        <h2>How are you feeling today?</h2>
      </div>

      {/* Mood Selection */}
      <div className="mood-buttons">
        {moods.map((mood) => (
          <button
            key={mood}
            className={selectedMood === mood ? 'mood-button selected' : 'mood-button'}
            onClick={() => setSelectedMood(mood)}
          >
            {mood}
          </button>
        ))}
      </div>

      <input
        className="custom-mood"
        type="text"
        placeholder="Or type your mood..."
        value={customMood}
        onChange={(e) => setCustomMood(e.target.value)}
      />

      <textarea
        className="journal-entry"
        placeholder="Write your thoughts here...Or speak them!"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      {/* Voice Controls & Save */}
      <div className="journal-actions">
        <button onClick={startListening} className="voice-button" disabled={isListening}>
          🎙️ Speak
        </button>
        <button onClick={stopListening} className="voice-button" disabled={!isListening}>
          🛑 Stop
        </button>
        <button onClick={handleSubmit} className="submit-button">
          Save Entry
        </button>
      </div>
    </div>
  );
}

export default Journal;
