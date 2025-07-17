import React from 'react';
import { FiAward, FiShield, FiDollarSign, FiLayers, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

const About = () => {
  const features = [
    {
      icon: <FiAward className="text-2xl" />,
      title: "Elite Talent Network",
      description: "Top 5% of professionals vetted through our screening"
    },
    {
      icon: <FiShield className="text-2xl" />,
      title: "Bank-Grade Security",
      description: "End-to-end encrypted communications and payments"
    },
    {
      icon: <FiDollarSign className="text-2xl" />,
      title: "Dynamic Pricing",
      description: "Smart algorithms ensure fair market value"
    },
    {
      icon: <FiLayers className="text-2xl" />,
      title: "100+ Specialties",
      description: "From blockchain to botanical illustration"
    },
    {
      icon: <FiUsers className="text-2xl" />,
      title: "Collaborative Workspace",
      description: "Built-in tools for seamless teamwork"
    },
    {
      icon: <FiTrendingUp className="text-2xl" />,
      title: "Growth Analytics",
      description: "Real-time insights into your freelance business"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section with Abstract Background */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#766df4] mb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#ff8a66] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#61dafb] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-[#766df4] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center py-20 px-6"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white backdrop-blur-sm mb-4 border border-white/20">
            <span className="w-2 h-2 mr-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Now serving 50,000+ professionals
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d1cdf9]">Reimagining</span><br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ffd86b] to-[#ff8a66]">Freelance Work</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            AppOrbit combines human expertise with AI-powered matchmaking to create perfect professional partnerships.
          </p>
        </motion.div>
      </div>

      {/* Floating Stats */}
      <div className="relative -mt-10 mb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-4xl font-bold text-[#766df4] mb-2">10K+</div>
            <div className="text-gray-600">Premium Freelancers</div>
            <div className="mt-3 h-1 w-full bg-gradient-to-r from-[#766df4] to-[#a18dfa] rounded-full"></div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-4xl font-bold text-[#ff8a66] mb-2">$5M+</div>
            <div className="text-gray-600">Paid to Talent</div>
            <div className="mt-3 h-1 w-full bg-gradient-to-r from-[#ff8a66] to-[#ffb8a1] rounded-full"></div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <div className="text-4xl font-bold text-[#61dafb] mb-2">4.92★</div>
            <div className="text-gray-600">Average Rating</div>
            <div className="mt-3 h-1 w-full bg-gradient-to-r from-[#61dafb] to-[#a6e8fb] rounded-full"></div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-28">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-[#766df4]/10 text-[#766df4] mb-3">
            Why Choose AppOrbit
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
            Professional <span className="text-[#766df4]">Networking</span> Meets<br />
            <span className="text-[#ff8a66]">Cutting-Edge</span> Technology
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="relative group overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#766df4]/5 to-[#766df4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8">
                <div className="w-14 h-14 rounded-xl bg-[#766df4]/10 text-[#766df4] flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative rounded-[2rem] overflow-hidden mb-28">
        <div className="absolute inset-0 bg-[#766df4] opacity-5"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
        
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="p-12 lg:p-16 bg-white">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#766df4]/10 text-[#766df4] mb-4">
                Our Philosophy
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Building <span className="text-[#766df4]">Meaningful</span> Professional Connections
              </h2>
              <p className="text-gray-600 mb-8">
                In a world of transactional gig work, we foster lasting partnerships. Our platform is designed to understand your unique professional DNA and connect you with collaborators who complement your strengths.
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-[#766df4]/10 text-[#766df4] flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Deep Compatibility Matching</h4>
                    <p className="text-gray-600 mt-1">Our algorithm analyzes 20+ dimensions beyond skills</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-[#766df4]/10 text-[#766df4] flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Growth-Oriented Ecosystem</h4>
                    <p className="text-gray-600 mt-1">Tools and resources to scale your freelance business</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-12 lg:p-16 bg-gradient-to-br from-[#766df4] to-[#a18dfa] text-white">
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm mb-4">
                The Future of Work
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Where <span className="text-[#ffd86b]">Talent</span> Meets <span className="text-[#ffd86b]">Opportunity</span>
              </h2>
              <p className="text-white/90 mb-8">
                We're pioneering the next evolution of professional services - combining the flexibility of freelancing with the stability and community of traditional employment.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="text-xs font-bold">01</span>
                  </div>
                  <span>Smart project scoping tools</span>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="text-xs font-bold">02</span>
                  </div>
                  <span>Automated contract generation</span>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-4">
                    <span className="text-xs font-bold">03</span>
                  </div>
                  <span>AI-assisted negotiation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block bg-gradient-to-r from-[#766df4] to-[#a18dfa] rounded-2xl p-0.5 mb-8"
        >
          <div className="bg-white rounded-xl px-8 py-2 text-sm font-medium">
            Ready to Transform Your Work?
          </div>
        </motion.div>
        
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Join the <span className="text-[#766df4]">Future</span> of Freelancing
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Whether you're a business seeking top talent or a professional looking for meaningful projects, AppOrbit is your launchpad.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 bg-[#766df4] hover:bg-[#6359e8] text-white font-medium rounded-xl shadow-lg shadow-[#766df4]/30 transition-all"
          >
            Find Talent
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 bg-white text-[#766df4] font-medium rounded-xl border-2 border-[#766df4] shadow-sm hover:shadow-md transition-all"
          >
            Start Freelancing
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default About;