import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import portfolioAPI from '../services/api';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [skills, setSkills] = useState({ frontend: [], backend: [], tools: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await portfolioAPI.getSkills();
        // Group skills by category
        const grouped = {
          frontend: data.filter(s => s.category?.toLowerCase() === 'frontend'),
          backend: data.filter(s => s.category?.toLowerCase() === 'backend'),
          tools: data.filter(s => ['tools', 'devops', 'tool'].includes(s.category?.toLowerCase()))
        };
        setSkills(grouped);
      } catch (error) {
        console.error('Error fetching skills:', error);
        // Keep empty arrays on error
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const SkillCard = ({ skill, index, category }) => {
    const proficiency = skill.proficiency || skill.level || 0;
    const icon = skill.icon || '⚡';

    return (
      <Card
        className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
        onMouseEnter={() => setHoveredSkill(`${category}-${index}`)}
        onMouseLeave={() => setHoveredSkill(null)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{icon}</span>
              <span className="font-semibold text-white">{skill.name}</span>
            </div>
            <span className="text-sm text-gray-400">{proficiency}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out ${
                hoveredSkill === `${category}-${index}` ? 'animate-pulse' : ''
              }`}
              style={{
                width: hoveredSkill === `${category}-${index}` ? `${proficiency}%` : '0%',
                transition: 'width 1s ease-out'
              }}
            ></div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <section id="skills" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading skills...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Skills & Technologies
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            My technical arsenal built through years of hands-on experience and continuous learning
          </p>
        </div>

        <Tabs defaultValue="frontend" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-gray-800/50 border border-gray-700">
            <TabsTrigger 
              value="frontend" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
            >
              Frontend
            </TabsTrigger>
            <TabsTrigger 
              value="backend"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              Backend
            </TabsTrigger>
            <TabsTrigger 
              value="tools"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white"
            >
              Tools & DevOps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="frontend" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Frontend Development</h3>
              <p className="text-gray-400">Creating beautiful, responsive, and interactive user experiences</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.frontend.length > 0 ? (
                skills.frontend.map((skill, index) => (
                  <SkillCard key={skill._id || index} skill={skill} index={index} category="frontend" />
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-400">No frontend skills added yet</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="backend" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Backend Development</h3>
              <p className="text-gray-400">Building robust, scalable server-side applications and APIs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.backend.length > 0 ? (
                skills.backend.map((skill, index) => (
                  <SkillCard key={skill._id || index} skill={skill} index={index} category="backend" />
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-400">No backend skills added yet</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-2">Tools & DevOps</h3>
              <p className="text-gray-400">Modern development tools and cloud infrastructure management</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.tools.length > 0 ? (
                skills.tools.map((skill, index) => (
                  <SkillCard key={skill._id || index} skill={skill} index={index} category="tools" />
                ))
              ) : (
                <p className="col-span-3 text-center text-gray-400">No tools skills added yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Skills Summary */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h4 className="text-xl font-semibold text-white mb-2">Frontend Focus</h4>
              <p className="text-gray-300">Crafting pixel-perfect interfaces with modern frameworks and responsive design principles.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h4 className="text-xl font-semibold text-white mb-2">Backend Expertise</h4>
              <p className="text-gray-300">Building scalable APIs, databases, and server architectures that power modern applications.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-semibold text-white mb-2">DevOps & Tools</h4>
              <p className="text-gray-300">Streamlining development workflows with modern CI/CD, containers, and cloud platforms.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;