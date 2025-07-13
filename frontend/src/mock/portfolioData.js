// Mock data for the portfolio
export const portfolioData = {
  personal: {
    name: "Alex Chen",
    title: "Full Stack Developer",
    tagline: "Building the future, one line of code at a time",
    bio: "Passionate full-stack developer with 5+ years of experience creating scalable web applications. I love turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies or contributing to open-source projects.",
    location: "San Francisco, CA",
    email: "alex.chen@example.com",
    phone: "+1 (555) 123-4567",
    linkedin: "https://linkedin.com/in/alexchen",
    github: "https://github.com/alexchen",
    website: "https://alexchen.dev"
  },
  
  skills: {
    frontend: [
      { name: "React", level: 95, icon: "⚛️" },
      { name: "JavaScript", level: 92, icon: "🟨" },
      { name: "TypeScript", level: 88, icon: "🔷" },
      { name: "Vue.js", level: 85, icon: "💚" },
      { name: "HTML/CSS", level: 95, icon: "🎨" },
      { name: "Tailwind CSS", level: 90, icon: "🎨" }
    ],
    backend: [
      { name: "Node.js", level: 90, icon: "🟢" },
      { name: "Python", level: 88, icon: "🐍" },
      { name: "FastAPI", level: 85, icon: "⚡" },
      { name: "Express.js", level: 92, icon: "🚀" },
      { name: "PostgreSQL", level: 87, icon: "🐘" },
      { name: "MongoDB", level: 85, icon: "🍃" }
    ],
    tools: [
      { name: "Git", level: 95, icon: "📦" },
      { name: "Docker", level: 88, icon: "🐳" },
      { name: "AWS", level: 82, icon: "☁️" },
      { name: "GraphQL", level: 80, icon: "📊" },
      { name: "Redis", level: 75, icon: "🔴" },
      { name: "Kubernetes", level: 70, icon: "⚙️" }
    ]
  },

  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.",
      tech: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      github: "https://github.com/alexchen/ecommerce-platform",
      demo: "https://demo-ecommerce.alexchen.dev",
      featured: true
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Collaborative task management application with real-time updates, team chat, and project analytics.",
      tech: ["Vue.js", "FastAPI", "MongoDB", "Socket.io", "Docker"],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      github: "https://github.com/alexchen/task-manager",
      demo: "https://tasks.alexchen.dev",
      featured: true
    },
    {
      id: 3,
      title: "AI Code Assistant",
      description: "VS Code extension that provides intelligent code suggestions and refactoring using machine learning.",
      tech: ["TypeScript", "Python", "TensorFlow", "VS Code API"],
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
      github: "https://github.com/alexchen/ai-code-assistant",
      demo: "https://marketplace.visualstudio.com/items?itemName=alexchen.ai-assistant",
      featured: true
    },
    {
      id: 4,
      title: "Weather Analytics Dashboard",
      description: "Real-time weather data visualization with predictive analytics and historical trends.",
      tech: ["React", "D3.js", "Python", "FastAPI", "TimescaleDB"],
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&h=400&fit=crop",
      github: "https://github.com/alexchen/weather-dashboard",
      demo: "https://weather.alexchen.dev",
      featured: false
    },
    {
      id: 5,
      title: "Blockchain Voting System",
      description: "Secure and transparent voting platform built on Ethereum with smart contracts.",
      tech: ["Solidity", "Web3.js", "React", "Ethereum", "IPFS"],
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop",
      github: "https://github.com/alexchen/blockchain-voting",
      demo: "https://voting.alexchen.dev",
      featured: false
    },
    {
      id: 6,
      title: "Social Media Analytics",
      description: "Comprehensive social media analytics platform with sentiment analysis and engagement metrics.",
      tech: ["Next.js", "Python", "TensorFlow", "PostgreSQL", "Chart.js"],
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
      github: "https://github.com/alexchen/social-analytics",
      demo: "https://analytics.alexchen.dev",
      featured: false
    }
  ],

  experience: [
    {
      id: 1,
      company: "TechFlow Inc.",
      position: "Senior Full Stack Developer",
      duration: "2022 - Present",
      description: "Lead development of scalable web applications serving 100K+ users. Architected microservices infrastructure and mentored junior developers.",
      achievements: [
        "Reduced application load time by 40% through optimization",
        "Led team of 5 developers on major product redesign",
        "Implemented CI/CD pipeline reducing deployment time by 60%"
      ],
      tech: ["React", "Node.js", "AWS", "Docker", "PostgreSQL"]
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Full Stack Developer",
      duration: "2020 - 2022",
      description: "Developed MVP from scratch and scaled it to handle rapid user growth. Built both frontend and backend systems.",
      achievements: [
        "Built entire platform from MVP to 50K users",
        "Implemented real-time features using WebSocket",
        "Designed and optimized database schema"
      ],
      tech: ["Vue.js", "Python", "MongoDB", "Redis", "GCP"]
    },
    {
      id: 3,
      company: "Digital Agency Pro",
      position: "Frontend Developer",
      duration: "2019 - 2020",
      description: "Created responsive websites and web applications for various clients. Collaborated with designers and backend developers.",
      achievements: [
        "Delivered 25+ client projects on time and budget",
        "Improved website performance scores by 35%",
        "Established frontend development best practices"
      ],
      tech: ["JavaScript", "React", "SASS", "WordPress", "jQuery"]
    }
  ],

  testimonials: [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Product Manager at TechFlow Inc.",
      content: "Alex is an exceptional developer who consistently delivers high-quality code. Their problem-solving skills and attention to detail are remarkable.",
      rating: 5
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      position: "CTO at StartupXYZ",
      content: "Working with Alex was a game-changer for our startup. They helped us scale from zero to thousands of users with their robust architecture.",
      rating: 5
    },
    {
      id: 3,
      name: "Lisa Wong",
      position: "Lead Designer at Digital Agency Pro",
      content: "Alex brings designs to life with pixel-perfect precision. Their collaboration and communication skills make them a joy to work with.",
      rating: 5
    }
  ]
};

// Contact form submission handler (mock)
export const submitContactForm = async (formData) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      resolve({ success: true, message: 'Message sent successfully!' });
    }, 1000);
  });
};