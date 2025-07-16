import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const WeeklySpotlight = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const spotlights = [
    {
      id: 1,
      title: "Editor's Choice",
      product: "PixelFlow AI",
      description: "Revolutionary image generation tool with real-time collaboration",
      stats: "3,452 upvotes this week",
      image: "https://play-lh.googleusercontent.com/zFXwmIRLjEz0owVr7NeVr7MTGIMcR0IKLAlGaWCM_RR9ghvc-6ABSuq2z4QA7J8WisI=w1920"
    },
    {
      id: 2,
      title: "Rising Star",
      product: "CodePilot X",
      description: "AI pair programmer with contextual understanding",
      stats: "2,891 new users this week",
      image: "https://windowsreport.com/wp-content/uploads/2023/04/copilot-X.jpg"
    },
    {
      id: 3,
      title: "Community Favorite",
      product: "Nexus Dashboard",
      description: "Unified workspace for developer teams",
      stats: "1,247 teams onboarded",
      image: "https://storage.googleapis.com/blogs-images-new/ciscoblogs/1/2020/10/Nexus-Dashboard-Flow-3.jpg"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === spotlights.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? spotlights.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="my-20 px-4 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#766df4] to-[#958ef4]">
        ✨ Weekly Spotlight
      </h2>
      
      <div className="bg-gradient-to-br from-[#766df4]/5 to-[#958ef4]/10 p-6 rounded-3xl border border-[#766df4]/20 relative">
        <div className="relative h-96 rounded-2xl overflow-hidden">
          <img 
            src={spotlights[currentSlide].image} 
            alt={spotlights[currentSlide].product}
            className="w-full h-full object-cover transition-opacity duration-500"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <span className="inline-block px-3 py-1 bg-[#766df4] text-sm font-medium rounded-full mb-2">
              {spotlights[currentSlide].title}
            </span>
            <h3 className="text-2xl font-bold mb-1">{spotlights[currentSlide].product}</h3>
            <p className="mb-2">{spotlights[currentSlide].description}</p>
            <p className="text-[#958ef4] font-medium">{spotlights[currentSlide].stats}</p>
          </div>
        </div>
        
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 rounded-full shadow hover:bg-white transition"
        >
          <FaArrowLeft className="text-[#766df4]" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 rounded-full shadow hover:bg-white transition"
        >
          <FaArrowRight className="text-[#766df4]" />
        </button>
        
        <div className="flex justify-center mt-4 space-x-2">
          {spotlights.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${currentSlide === index ? 'bg-[#766df4]' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklySpotlight;