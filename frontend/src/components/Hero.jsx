import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { portfolioData } from '../mock/portfolioData';

const Hero = () => {
  const [currentRole, setCurrentRole] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  const roles = [
    'Full Stack Developer',
    'React Specialist',
    'Node.js Expert',
    'Problem Solver',
    'Code Architect'
  ];
  
  useEffect(() => {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;
    
    const typeWriter = () => {
      const currentFullRole = roles[roleIndex];
      
      if (isDeleting) {
        setCurrentRole(currentFullRole.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setCurrentRole(currentFullRole.substring(0, charIndex + 1));
        charIndex++;
      }
      
      let typeSpeed = isDeleting ? 50 : 100;
      
      if (!isDeleting && charIndex === currentFullRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before next word
      }
      
      timeout = setTimeout(typeWriter, typeSpeed);
    };
    
    typeWriter();
    
    return () => clearTimeout(timeout);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Animated greeting */}
        <div className="mb-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.2s_forwards]">
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium backdrop-blur-sm">
            👋 Welcome to my digital space
          </span>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 opacity-0 animate-[fadeInUp_1s_ease-out_0.4s_forwards]">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {portfolioData.personal.name}
          </span>
        </h1>

        {/* Typing animation for role */}
        <div className="h-16 md:h-20 mb-8 opacity-0 animate-[fadeInUp_1s_ease-out_0.6s_forwards]">
          <p className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-300">
            <span className="text-white">I'm a </span>
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              {currentRole}
            </span>
            <span className={`inline-block w-1 h-8 md:h-12 bg-green-400 ml-1 ${isTyping ? 'animate-pulse' : ''}`}>|</span>
          </p>
        </div>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_1s_ease-out_0.8s_forwards]">
          {portfolioData.personal.tagline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center opacity-0 animate-[fadeInUp_1s_ease-out_1s_forwards]">
          <Button
            onClick={() => scrollToSection('projects')}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            View My Work
          </Button>
          <Button
            onClick={() => scrollToSection('contact')}
            variant="outline"
            className="px-8 py-3 border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Let's Connect
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-[fadeInUp_1s_ease-out_1.2s_forwards]">
          <div className="flex flex-col items-center text-gray-500">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-500 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;