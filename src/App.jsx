import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import History from './pages/History';
import Journal from './pages/Journal';
import Settings from './pages/Settings';
import "./styles/App.css";



const App = () => {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App
