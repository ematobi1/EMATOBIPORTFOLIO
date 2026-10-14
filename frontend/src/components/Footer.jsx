import React from 'react';
import { Button } from './ui/button';
import { portfolioData } from '../mock/portfolioData';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: '💻', url: portfolioData.personal.github },
    { name: 'LinkedIn', icon: '💼', url: portfolioData.personal.linkedin },
    { name: 'Email', icon: '📧', url: `mailto:${portfolioData.personal.email}` },
    { name: 'Website', icon: '🌐', url: portfolioData.personal.website }
  ];

  const scrollToSection = (sectionId) => {
    const targetId = sectionId.replace('#', '');
    if (targetId === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-900/50 border-t border-gray-800 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {portfolioData.personal.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">{portfolioData.personal.name}</h3>
                <p className="text-gray-400 text-sm">{portfolioData.personal.title}</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {portfolioData.personal.tagline}
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  onClick={() => console.log(`Opening ${social.name}: ${social.url}`)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors duration-200 text-sm group"
                >
                  <span>{social.icon}</span>
                  <span className="group-hover:underline">{social.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} {portfolioData.personal.name}. All rights reserved.
            </div>

            {/* Back to Top */}
            <Button
              onClick={scrollToTop}
              variant="outline"
              className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-600 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <span className="mr-2">↑</span>
              Back to Top
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            Built with React, Tailwind CSS, and lots of ☕
          </p>
        </div>
      </div>

      {/* Floating gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
};

export default Footer;