import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/journal');
    };

    return (
        <div className="home-container">
        <h1 className="home-title">Welcome to Your Escape</h1>
        <p className="home-subtitle">Your safe space to reflect, release, and heal 💖</p>
        <button className="home-button" onClick={handleStart}>
        Start Journaling
      </button>
      </div>
    );
}

export default Home;
