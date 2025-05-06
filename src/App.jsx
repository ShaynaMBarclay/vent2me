import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import History from './pages/History';
import Journal from './pages/Journal';
import Settings from './pages/Settings';
import ScrollToTop from './components/ScrollToTop';
import "./styles/App.css";



const App = () => {
  return (

  <div> 
    <ScrollToTop />
    <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
    </div> 
  );
}

export default App
