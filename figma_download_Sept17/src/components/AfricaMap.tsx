import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: string;
  country: string;
  title: string;
  description: string;
  x: number;
  y: number;
}

// Sample projects positioned on a simplified Africa map
const projects: Project[] = [
  {
    id: '1',
    country: 'Nigeria',
    title: 'Cocoa Climate Smart Package',
    description: 'Sustainable cocoa farming practices reducing climate impact while increasing yields.',
    x: 52,
    y: 45
  },
  {
    id: '2',
    country: 'Ghana',
    title: 'Cotton Resilience Program',
    description: 'Drought-resistant cotton varieties for improved farmer livelihoods.',
    x: 48,
    y: 42
  },
  {
    id: '3',
    country: 'Kenya',
    title: 'Maize Productivity Initiative',
    description: 'Enhanced maize varieties adapted to changing climate conditions.',
    x: 62,
    y: 50
  },
  {
    id: '4',
    country: 'Cameroon',
    title: 'Integrated Pest Management',
    description: 'Sustainable pest control methods for multiple crop systems.',
    x: 55,
    y: 48
  },
  {
    id: '5',
    country: 'Tanzania',
    title: 'Soil Health Program',
    description: 'Restoring soil fertility through sustainable practices.',
    x: 63,
    y: 55
  },
  {
    id: '6',
    country: 'Mali',
    title: 'Livestock Integration',
    description: 'Combining livestock and crop production for resilient farming systems.',
    x: 45,
    y: 38
  }
];

export function AfricaMap() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <h2 className="text-3xl text-[rgba(255,105,0,1)] text-center m-[0px] font-[Permanent_Marker] text-[48px]">IITA Solutions</h2>
      <h2 className="text-3xl text-white text-center mb-8 font-bold text-[36px]">Across Africa</h2>
      
      {/* Simplified Africa SVG Map */}
      <div className="relative bg-gray-900 rounded-lg p-8">
        <svg 
          viewBox="0 0 100 80" 
          className="w-full h-96 border border-gray-700 rounded-lg bg-gray-800"
        >
          {/* Simplified Africa continent shape */}
          <path
            d="M30 15 Q35 10 45 12 Q55 8 65 15 Q75 20 78 35 Q80 50 75 60 Q70 68 60 70 Q45 75 35 70 Q25 65 22 50 Q20 35 25 25 Q28 20 30 15Z"
            fill="#374151"
            stroke="#6B7280"
            strokeWidth="0.5"
          />
          
          {/* Project markers */}
          {projects.map((project) => (
            <g key={project.id}>
              <motion.circle
                cx={project.x}
                cy={project.y}
                r="2"
                fill="#f97316"
                className="cursor-pointer"
                whileHover={{ scale: 1.5 }}
                onClick={() => setSelectedProject(project)}
              />
              <motion.circle
                cx={project.x}
                cy={project.y}
                r="4"
                fill="#f97316"
                opacity="0.3"
                className="cursor-pointer animate-pulse"
                onClick={() => setSelectedProject(project)}
              />
            </g>
          ))}
        </svg>

        {/* Project popup */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 left-4 right-4 bg-black/90 rounded-lg p-6 border border-orange-500 z-10"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl text-orange-500">{selectedProject.country}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <h4 className="text-white mb-2">{selectedProject.title}</h4>
              <p className="text-gray-300 mb-4">{selectedProject.description}</p>
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  // This would scroll to a detailed view in a full implementation
                  alert(`View more details about ${selectedProject.title}`);
                }}
              >
                Learn More
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-center text-gray-400 mt-4 italic text-[14px]">
        Click on any orange marker to learn about IITA's projects in that region
      </p>
    </div>
  );
}