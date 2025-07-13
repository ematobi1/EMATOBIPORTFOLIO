import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { portfolioAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    company: '',
    project_type: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await portfolioAPI.submitContact(formData);
      
      toast({
        title: "Message Sent! 🎉",
        description: "Thanks for reaching out! I'll get back to you soon.",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        company: '',
        project_type: '',
        budget: ''
      });
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📧',
      label: 'Email',
      value: 'emmanuel.tobi@example.com',
      href: 'mailto:emmanuel.tobi@example.com'
    },
    {
      icon: '📱',
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+1 (555) 123-4567'
    },
    {
      icon: '📍',
      label: 'Location',
      value: 'San Francisco, CA',
      href: '#'
    },
    {
      icon: '💼',
      label: 'LinkedIn',
      value: 'Connect with me',
      href: 'https://linkedin.com/in/emmanueltobi'
    }
  ];

  return (
    <section id="contact" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Let's Work Together
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can bring your ideas to life!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Send me a message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-gray-700/50 border-gray-600 text-white focus:border-purple-500"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-gray-700/50 border-gray-600 text-white focus:border-purple-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 bg-gray-700/50 border-gray-600 text-white focus:border-purple-500"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company" className="text-gray-300">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="mt-1 bg-gray-700/50 border-gray-600 text-white focus:border-purple-500"
                      placeholder="Your company"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-gray-300">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="mt-1 bg-gray-700/50 border-gray-600 text-white focus:border-purple-500"
                    placeholder="What's this about?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project_type" className="text-gray-300">Project Type</Label>
                    <select
                      id="project_type"
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleInputChange}
                      className="mt-1 w-full bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 rounded-md px-3 py-2"
                    >
                      <option value="">Select project type</option>
                      <option value="web-app">Web Application</option>
                      <option value="mobile-app">Mobile App</option>
                      <option value="website">Website</option>
                      <option value="api">API Development</option>
                      <option value="consultation">Consultation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="budget" className="text-gray-300">Budget Range</Label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="mt-1 w-full bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 rounded-md px-3 py-2"
                    >
                      <option value="">Select budget range</option>
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="mt-1 bg-gray-700/50 border-gray-600 text-white focus:border-purple-500 resize-none"
                    placeholder="Tell me about your project or just say hello!"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    'Send Message 🚀'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">Get in touch</h3>
              <p className="text-gray-300 leading-relaxed mb-8">
                I'm always open to discussing new opportunities, interesting projects, 
                or just having a chat about technology and development. Feel free to reach 
                out through any of the channels below!
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <Card 
                  key={index}
                  className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => info.href !== '#' && window.open(info.href, '_blank')}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{info.icon}</div>
                      <div>
                        <p className="text-sm text-gray-400">{info.label}</p>
                        <p className="text-white font-medium">{info.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow me online</h4>
              <div className="flex space-x-4">
                {[
                  { name: 'GitHub', icon: '💻', url: 'https://github.com/emmanueltobi' },
                  { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/in/emmanueltobi' },
                  { name: 'Website', icon: '🌐', url: 'https://emmanueltobi.dev' }
                ].map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
                    onClick={() => window.open(social.url, '_blank')}
                  >
                    <span className="mr-2">{social.icon}</span>
                    {social.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Subscribe to get notified about new projects and tech insights!
                </p>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-gray-700/50 border-gray-600 text-white focus:border-purple-500"
                  />
                  <Button
                    onClick={() => toast({ title: "Coming Soon!", description: "Newsletter signup will be available soon." })}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Availability Status */}
            <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-green-400 font-semibold">Available for new projects</p>
                    <p className="text-gray-300 text-sm">Let's build something amazing together!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to start your project?</h3>
              <p className="text-gray-300 mb-6">
                Whether you need a full-stack application, API development, or just want to 
                discuss your ideas, I'm here to help bring your vision to life.
              </p>
              <Button
                onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Start the Conversation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;