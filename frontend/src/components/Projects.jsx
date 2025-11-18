import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import portfolioAPI, { analyticsHelper } from '../services/api';

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [hoveredProject, setHoveredProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await portfolioAPI.getProjects();
        setAllProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const featuredProjects = allProjects.filter(project => project.featured);
  const displayProjects = filter === 'featured' ? featuredProjects : allProjects;

  const handleViewProject = async (project) => {
    try {
      const projectId = project._id || project.id;
      // Track demo click
      await analyticsHelper.trackProjectInteraction(projectId.toString(), 'demo_click');

      // Open demo link in new tab
      if (project.demo_link || project.demo) {
        window.open(project.demo_link || project.demo, '_blank', 'noopener,noreferrer');
      } else {
        alert(`No demo link available for ${project.title}`);
      }
    } catch (error) {
      console.error('Error tracking project view:', error);
      if (project.demo_link || project.demo) {
        window.open(project.demo_link || project.demo, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleViewCode = async (project) => {
    try {
      const projectId = project._id || project.id;
      // Track GitHub click
      await analyticsHelper.trackProjectInteraction(projectId.toString(), 'github_click');

      // Open GitHub link in new tab
      if (project.github_link || project.github) {
        window.open(project.github_link || project.github, '_blank', 'noopener,noreferrer');
      } else {
        alert(`No GitHub repository available for ${project.title}`);
      }
    } catch (error) {
      console.error('Error tracking GitHub click:', error);
      if (project.github_link || project.github) {
        window.open(project.github_link || project.github, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleProjectHover = async (project) => {
    const projectId = project._id || project.id;
    setHoveredProject(projectId);

    try {
      // Track project view
      await analyticsHelper.trackProjectInteraction(projectId.toString(), 'view');
    } catch (error) {
      console.error('Error tracking project hover:', error);
    }
  };

  if (loading) {
    return (
      <section id="projects" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A showcase of my recent work, from full-stack applications to innovative solutions
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4 p-1 bg-gray-800/50 rounded-lg border border-gray-700">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'ghost'}
              className={filter === 'all' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
              }
            >
              All Projects ({allProjects.length})
            </Button>
            <Button
              onClick={() => setFilter('featured')}
              variant={filter === 'featured' ? 'default' : 'ghost'}
              className={filter === 'featured' 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
              }
            >
              Featured ({featuredProjects.length})
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.length > 0 ? (
            displayProjects.map((project, index) => {
              const projectId = project._id || project.id;
              const technologies = project.technologies || project.tech || [];
              const imageUrl = project.image_url || project.image || '/placeholder-project.jpg';

              return (
                <Card
                  key={projectId}
                  className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden group hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
                  onMouseEnter={() => handleProjectHover(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Project Image */}
                  <div className="relative overflow-hidden h-48 bg-gradient-to-br from-gray-700 to-gray-800">
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/1f2937/ffffff?text=' + encodeURIComponent(project.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                          ⭐ Featured
                        </Badge>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-black/80 flex items-center justify-center space-x-4 transition-opacity duration-300 ${
                        hoveredProject === projectId ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProject(project);
                        }}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Live Demo
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCode(project);
                        }}
                        variant="outline"
                        className="border-gray-400 text-gray-200 hover:bg-gray-700"
                      >
                        View Code
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {technologies.slice(0, 4).map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="bg-gray-700 text-gray-300 text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {technologies.length > 4 && (
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                          +{technologies.length - 4} more
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleViewProject(project)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm"
                      >
                        Live Demo
                      </Button>
                      <Button
                        onClick={() => handleViewCode(project)}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 text-sm"
                      >
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No projects to display</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>

        {/* View More Projects */}
        {filter === 'featured' && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setFilter('all')}
              variant="outline"
              className="px-8 py-3 border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400"
            >
              View All Projects
            </Button>
          </div>
        )}

        {/* Project Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{allProjects.length}</div>
              <p className="text-gray-300">Total Projects</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{featuredProjects.length}</div>
              <p className="text-gray-300">Featured Works</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <p className="text-gray-300">Technologies Used</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">100K+</div>
              <p className="text-gray-300">Lines of Code</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Projects;