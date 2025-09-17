import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    country: 'Kenya',
    title: 'Smart Irrigation Systems',
    description: 'Water-efficient farming technologies for drought-resistant agriculture.',
    x: 75,
    y: 65
  },
  {
    id: '3',
    country: 'Ghana',
    title: 'Soil Health Monitoring',
    description: 'IoT-based soil monitoring systems for optimal crop nutrition.',
    x: 48,
    y: 48
  },
  {
    id: '4',
    country: 'Tanzania',
    title: 'Climate-Resilient Crops',
    description: 'Development of drought and heat-resistant crop varieties.',
    x: 72,
    y: 70
  },
  {
    id: '5',
    country: 'Uganda',
    title: 'Precision Agriculture',
    description: 'GPS-guided farming equipment for resource optimization.',
    x: 70,
    y: 60
  },
  {
    id: '6',
    country: 'Mali',
    title: 'Desert Farming Initiative',
    description: 'Innovative techniques for agriculture in arid regions.',
    x: 45,
    y: 35
  }
];

export function AfricaMap() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <h2 className="text-3xl text-[rgba(255,105,0,1)] text-center m-[0px] font-[Permanent_Marker] text-[48px]">IITA Solutions</h2>
      <h2 className="text-3xl text-white text-center mb-8 font-bold text-[36px]">Across Africa</h2>

      {/* Simplified Africa Map Container */}
      <div className="relative w-full h-96 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
        {/* Africa Continent Shape (Simplified SVG representation) */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
        >
          {/* Simplified Africa continent path */}
          <path
            d="M45 15 Q50 12 55 15 Q65 18 70 25 Q75 35 78 45 Q80 55 82 65 Q85 75 80 85 Q70 90 60 88 Q50 90 40 88 Q30 85 25 75 Q20 65 22 55 Q25 45 30 35 Q35 25 40 20 Q42 17 45 15 Z"
            fill="rgba(75, 85, 99, 0.8)"
            stroke="rgba(156, 163, 175, 0.5)"
            strokeWidth="0.5"
          />
        </svg>

        {/* Project Markers */}
        {projects.map((project) => (
          <div
            key={project.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${project.x}%`, top: `${project.y}%` }}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
            onClick={() => setSelectedProject(project)}
          >
            {/* Marker Dot */}
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-4 h-4 rounded-full border-2 border-white transition-all ${
                hoveredProject === project.id || selectedProject?.id === project.id
                  ? 'bg-orange-500 shadow-lg'
                  : 'bg-orange-400'
              }`}
              style={{
                boxShadow: hoveredProject === project.id ? '0 0 20px rgba(249, 115, 22, 0.6)' : undefined
              }}
            />

            {/* Country Label */}
            <div
              className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap transition-opacity ${
                hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {project.country}
            </div>
          </div>
        ))}

        {/* Pulsing Animation for Active Markers */}
        {projects.map((project) => (
          <div
            key={`pulse-${project.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${project.x}%`, top: `${project.y}%` }}
          >
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-8 h-8 rounded-full bg-orange-500/30"
            />
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-6 bg-gray-900 rounded-lg border border-orange-500/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl text-orange-500 font-bold">{selectedProject.title}</h3>
                <p className="text-gray-400">{selectedProject.country}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
                Learn More
              </button>
              <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 transition-colors">
                Contact Team
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Active Projects</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-600"></div>
          <span>Future Locations</span>
        </div>
      </div>
    </div>
  );
}