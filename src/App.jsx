import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Measurer from './pages/MeasurerPage'
import Ranking from './pages/RankingPage'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/measurer" element={<Measurer/>} />
        <Route path="/ranking" element={<Ranking/>} />
        <Route path="/contact" element={<h1>Contact</h1>} />
      </Routes>
    </Router>
  )
}

export default App
