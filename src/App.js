import React from 'react';
import './App.css';
import CountryRanking from './CountryRanking';
import CountryDetail from './CountryDetail';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <main className="App-main">
        <Router>
          <Routes>
            <Route path="/" element={<CountryRanking />} />
            <Route path="/country/:countryCode" element={<CountryDetail />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;
