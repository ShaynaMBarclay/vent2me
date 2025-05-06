import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import History from './pages/History';
import Journal from './pages/Journal';
import Response from './pages/Response';
import "./styles/App.css";



const App = () => {
  return (
    <Routes>
    <Route path="/" element={<Home />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/response" element={<Response />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App
