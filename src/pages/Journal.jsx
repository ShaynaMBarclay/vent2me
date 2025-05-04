import { useState, useEffect, useRef } from 'react';
import '../styles/Journal.css';


const moods = [ 'Happy', 'Sad', 'Anxious', 'Excited', 'Angry', 'Calm'];


function Journal() {
    const [selectedMood, setSelectedMood] = useState('');
    const [customMood, setCustomMood] = useState('');
    const [entry, setEntry] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
  
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

  
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setEntry((prev) => prev + ' ' + transcript);
        setIsListening(false);
      };
  
      recognition.onend = () => {
        if (isListening) {
            recognition.start(); // 🔄 Restart listening if still enabled
          }
        };
  
      recognitionRef.current = recognition;
    }, []);
  
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
        }
      };
  
    const handleSubmit = (e) => {
        e.preventDefault();
        const mood = customMood || selectedMood;
        console.log('Mood:', mood);
        console.log('Entry:', entry);
        // You can save to localStorage or backend later
        setSelectedMood('');
        setCustomMood('');
        setEntry('');
      };

    return (
        <div className="journal-container">
        <h2>How are you feeling today?</h2>
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
          placeholder="Write your thoughts here..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <div className="journal-actions">
          <button onClick={startListening} className="voice-button">
            🎙️ Speak
          </button>
          <button onClick={stopListening} className="voice-button">
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