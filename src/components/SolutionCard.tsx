import React from 'react';
import { motion } from 'framer-motion';

interface SolutionCardProps {
  solution: {
    id: string;
    solution_title: string;
    applicable_countries: string[];
    climate_potential: number;
    key_agroeco: string[];
    solution_images?: Array<{
      image_type: string;
      image_url: string;
    }>;
  };
  onClick: () => void;
}

export function SolutionCard({ solution, onClick }: SolutionCardProps) {
  // Get title image from solution_images
  const getTitleImage = () => {
    const titleImage = solution.solution_images?.find(img => img.image_type === 'title_image');
    return titleImage?.image_url || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center'; // Agricultural fallback
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&crop=center';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer border border-gray-800 hover:border-orange-500 transition-colors"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={getTitleImage()}
          alt={solution.solution_title}
          onError={handleImageError}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-white mb-2">{solution.solution_title}</h3>
        <p className="text-orange-500 text-sm mb-1">
          {solution.key_agroeco?.slice(0, 3).join(', ') || 'Multiple agro-ecological zones'}
          {solution.key_agroeco?.length > 3 && ` +${solution.key_agroeco.length - 3} more`}
        </p>
        <p className="text-gray-400 text-sm">Climate Score: {solution.climate_potential}/10</p>
      </div>
    </motion.div>
  );
}