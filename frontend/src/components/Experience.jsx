import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { portfolioData } from '../mock/portfolioData';

const Experience = () => {
  const [selectedExperience, setSelectedExperience] = useState(0);

  const experience = portfolioData.experience;

  return (
    <section id="experience" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Work Experience
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            My professional journey building innovative solutions and leading development teams
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Timeline Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <Card 
                  key={exp.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    selectedExperience === index 
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50' 
                      : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setSelectedExperience(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedExperience === index 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                          : 'bg-gray-600'
                      }`}></div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm">{exp.company}</h3>
                        <p className="text-gray-400 text-xs">{exp.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Experience Details */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-8">
                {experience[selectedExperience] && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {experience[selectedExperience].position}
                      </h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-lg text-purple-400 font-semibold">
                          {experience[selectedExperience].company}
                        </span>
                        <span className="text-gray-400">
                          {experience[selectedExperience].duration}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 leading-relaxed">
                      {experience[selectedExperience].description}
                    </p>

                    {/* Key Achievements */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Key Achievements</h4>
                      <ul className="space-y-3">
                        {experience[selectedExperience].achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience[selectedExperience].tech.map((tech, index) => (
                          <Badge 
                            key={index}
                            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline Visual */}
        <div className="mt-16 relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
          
          <div className="space-y-12">
            {experience.map((exp, index) => (
              <div key={exp.id} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <Card className={`w-full max-w-md ${index % 2 === 0 ? 'mr-8' : 'ml-8'} bg-gray-800/50 border-gray-700`}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {exp.company.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{exp.position}</h4>
                        <p className="text-sm text-gray-400">{exp.company}</p>
                      </div>
                    </div>
                    <p className="text-xs text-purple-400 mb-2">{exp.duration}</p>
                    <p className="text-sm text-gray-300">{exp.description.substring(0, 100)}...</p>
                  </CardContent>
                </Card>
                
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-4 border-black"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;