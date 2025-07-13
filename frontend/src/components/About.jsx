import React from 'react';
import { Card, CardContent } from './ui/card';
import { portfolioData } from '../mock/portfolioData';

const About = () => {
  const stats = [
    { label: 'Years Experience', value: '5+', icon: '💼' },
    { label: 'Projects Completed', value: '50+', icon: '🚀' },
    { label: 'Happy Clients', value: '30+', icon: '😊' },
    { label: 'Code Commits', value: '2K+', icon: '💻' }
  ];

  return (
    <section id="about" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              About Me
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-6">
            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                Passionate Developer & Problem Solver
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {portfolioData.personal.bio}
              </p>
            </div>

            {/* Skills highlight */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-white mb-4">What I Bring to the Table:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Full-Stack Development',
                  'Scalable Architecture',
                  'Team Leadership',
                  'Performance Optimization',
                  'Modern Technologies',
                  'Agile Methodologies'
                ].map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal touch */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <p className="text-gray-300 italic">
                  "I believe great software is not just about clean code—it's about understanding the problem, 
                  empathizing with users, and crafting solutions that make a real difference in people's lives."
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Side */}
          <div className="space-y-6">
            {/* Profile Image Placeholder */}
            <div className="relative mx-auto lg:mx-0 w-80 h-80 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 overflow-hidden">
              <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="text-6xl">👨‍💻</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <h4 className="text-white font-semibold text-lg">{portfolioData.personal.name}</h4>
                <p className="text-gray-300">{portfolioData.personal.location}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Technologies I Love */}
        <div className="mt-16 text-center">
          <h4 className="text-xl font-semibold text-white mb-8">Technologies I Love Working With</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'React', color: 'from-blue-400 to-cyan-400' },
              { name: 'Node.js', color: 'from-green-400 to-emerald-400' },
              { name: 'Python', color: 'from-yellow-400 to-orange-400' },
              { name: 'TypeScript', color: 'from-blue-500 to-indigo-500' },
              { name: 'PostgreSQL', color: 'from-blue-600 to-purple-600' },
              { name: 'Docker', color: 'from-cyan-500 to-blue-500' },
              { name: 'AWS', color: 'from-orange-400 to-red-400' },
              { name: 'GraphQL', color: 'from-pink-400 to-purple-400' }
            ].map((tech, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${tech.color} text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-default`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;