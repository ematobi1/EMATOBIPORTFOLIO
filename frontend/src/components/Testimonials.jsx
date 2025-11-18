import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Quote, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'CTO',
      company: 'TechCorp Inc.',
      image: '👩‍💼',
      rating: 5,
      text: 'Working with Emmanuel was an absolute pleasure. His technical expertise and attention to detail resulted in a product that exceeded our expectations. Highly recommended!',
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Product Manager',
      company: 'StartupHub',
      image: '👨‍💻',
      rating: 5,
      text: 'Emmanuel delivered our project on time and within budget. His problem-solving skills and communication throughout the development process were exceptional.',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'Founder',
      company: 'InnovateLab',
      image: '👩‍💼',
      rating: 5,
      text: 'An incredibly talented developer who understands both the technical and business aspects. The solution Emmanuel built has transformed our business operations.',
    },
    {
      id: 4,
      name: 'David Thompson',
      position: 'Engineering Lead',
      company: 'DataFlow Systems',
      image: '👨‍💼',
      rating: 5,
      text: 'Emmanuel\'s code quality and architectural decisions were top-notch. He\'s a valuable asset to any team and I look forward to working with him again.',
    },
  ]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Client Testimonials
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            What clients say about working with me
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                {/* Quote Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
                  <Quote className="h-8 w-8 text-white" />
                </div>

                {/* Rating */}
                <div className="flex space-x-1 mb-6">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 italic">
                  "{current.text}"
                </p>

                {/* Author Info */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center text-3xl mb-4 border-2 border-purple-500/30">
                    {current.image}
                  </div>
                  <h4 className="text-white font-semibold text-lg">{current.name}</h4>
                  <p className="text-purple-400 text-sm">{current.position}</p>
                  <p className="text-gray-400 text-sm">{current.company}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="pointer-events-auto bg-gray-800/90 border-gray-700 hover:bg-gray-700 text-white -ml-6 md:-ml-12"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="pointer-events-auto bg-gray-800/90 border-gray-700 hover:bg-gray-700 text-white -mr-6 md:-mr-12"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-gradient-to-r from-purple-500 to-blue-500'
                  : 'w-2 bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
          <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30 text-center">
            <CardContent className="p-6">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
              <p className="text-gray-300 text-sm">Client Satisfaction</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 text-center">
            <CardContent className="p-6">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">30+</div>
              <p className="text-gray-300 text-sm">Happy Clients</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 text-center">
            <CardContent className="p-6">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
              <p className="text-gray-300 text-sm">Projects Delivered</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-center">
            <CardContent className="p-6">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">5+</div>
              <p className="text-gray-300 text-sm">Years Experience</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
