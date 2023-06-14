import { Routes, Route } from 'react-router-dom';
///import { Routing } from './components/Routing';
import { Home } from './pages/Home';
import { Client } from './pages/Client';
import { Streamer }  from './pages/Streamer';
import './App.css';

export const App = () => {
  return (
    <div className="App">
    {/* <Routing /> */}
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client" element={<Client />} />
        <Route path="/streamer" element={<Streamer />} />
      </Routes>
    </div>
  );
}
