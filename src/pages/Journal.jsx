import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Journal.css';

const moods = ['Happy', 'Sad', 'Anxious', 'Excited', 'Angry', 'Calm'];

function Journal() {
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [highlightedMood, setHighlightedMood] = useState('');
  const [entry, setEntry] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Voice recognition setup
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
      if (isListening) {
        recognition.start(); // auto-restart if needed
      }
    };

    recognitionRef.current = recognition;
  }, [isListening]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
      setEntry((prev) => prev.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mood = selectedMood;
    console.log('Mood:', mood);
    console.log('Entry:', entry);
    setSelectedMood('');
    setCustomMood('');
    setEntry('');
  };

  return (
    <div className="journal-container">
      {/* Header with Home Button */}
      <div className="journal-header">
        <button onClick={() => navigate('/')} className="home-button">
          🏠 Home
        </button>
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
        placeholder="Write your thoughts here..."
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
        <button onClick={handleSubmit} className="submit-button">
          Save Entry
        </button>
      </div>
    </div>
  );
}

export default Journal;
