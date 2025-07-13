import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MatrixBackground from "./components/MatrixBackground";
import Hero from "./components/Hero";
import About from "./components/About";

const Portfolio = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      <MatrixBackground />
      <div className="relative z-10">
        <Hero />
        <About />
        {/* Other sections will be added in next iteration */}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;