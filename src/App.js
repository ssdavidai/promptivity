import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AlienAssembly from './components/AlienAssembly';
import TeachMe from './components/TeachMe';
import TaskMaster from './components/TaskMaster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alien-assembly" element={<AlienAssembly />} />
        <Route path="/teach-me" element={<TeachMe />} />
        <Route path="/task-master" element={<TaskMaster />} />
      </Routes>
    </Router>
  );
}

export default App;
