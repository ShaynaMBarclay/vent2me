import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Journal.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


const moods = ['Happy', 'Sad', 'Anxious', 'Excited', 'Angry', 'Calm'];

function Journal() {
  const [selectedMood, setSelectedMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const [error, setError] = useState('');
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

  const handleGeminiResponse = async () => {
    const mood = selectedMood || customMood.trim();
    if (!mood || !entry.trim()) return;
  
    try {
      const response = await axios.post(`https://vent2meserver.onrender.com/gemini`, {
        journalEntry: entry,
      });

      console.log('API Response:', response);
  
      if (response.status === 429) {
        setError("You've exceeded your advice usage for now, please check back later");
        return;
      }
  
      setAiResponse(response.data.reply);
      setError(''); // clear any previous error
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError("You've exceeded your advice usage for now, please check back later");
      } else {
        setError('Something went wrong. Please try again later.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mood = selectedMood || customMood.trim();
    if (!mood || !entry.trim()) return;

    const newEntry = {
      id: uuidv4(),
      mood: selectedMood || customMood.trim(),
      text: entry.trim(),
      aiResponse: aiResponse.trim() || '',
      date: new Date().toISOString(),
    };

    // Store entry in localStorage (optional)
    const existingEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    existingEntries.unshift(newEntry);
    localStorage.setItem('journalEntries', JSON.stringify(existingEntries));

    // Reset states
    setSelectedMood('');
    setCustomMood('');
    setEntry('');
    setAiResponse('');
  };

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    savedEntries.forEach(entry => {
      console.log('Journal Entry:', entry.text);  // Log the journal text
      console.log('AI Response:', entry.aiResponse);  // Log the AI response
    });

    setEntries(savedEntries);  // Set entries in state
  }, []);
  return (
    <div className="journal-container">
      <div className="journal-header">
        <button onClick={() => navigate('/')} className="journalhome-button">🏠</button>
        <button onClick={() => navigate('/history')} className="history-button">📖</button>
        <h2>How are you feeling today?</h2>
      </div>

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

      {selectedMood && (
        <div className="highlighted-mood">
          <p>Your mood:</p>
          <h3>{selectedMood}</h3>
        </div>
      )}

      <textarea
        className="journal-entry"
        placeholder="Write your thoughts here... Or speak them! Hit the 'Get Advice' button for some guidance. Gont need it? Dont worry! Skip it and save your entry!"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      
      <div className="journal-actions">
        <button onClick={startListening} className="voice-button" disabled={isListening}>
          🎙️ Speak
        </button>
        <button onClick={stopListening} className="voice-button" disabled={!isListening}>
          🛑 Stop
        </button>
        <button onClick={handleGeminiResponse} className="enter-button">
          💬 Get Advice
        </button>
        <button onClick={handleSubmit} className="submit-button">
          Save Entry
        </button>
      </div>

      {aiResponse && (
        <div className="ai-response">
          <h3>Here's some advice:</h3>
          <p>{aiResponse}</p>
        </div>
      )}

  <ErrorMessage message={error} />

    </div>
  );
}

export default Journal;
