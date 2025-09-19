'use client'

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { SolutionService } from '@/lib/solutionService';
import { Solution } from '@/types/database';
import Image from 'next/image';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// African country coordinates (capital cities or central points)
const countryCoordinates: { [key: string]: [number, number] } = {
  'Algeria': [28.0339, 1.6596],
  'Angola': [-11.2027, 17.8739],
  'Benin': [9.3077, 2.3158],
  'Botswana': [-22.3285, 24.6849],
  'Burkina Faso': [12.2383, -1.5616],
  'Burundi': [-3.3731, 29.9189],
  'Cameroon': [7.3697, 12.3547],
  'Central African Republic': [6.6111, 20.9394],
  'Chad': [15.4542, 18.7322],
  'Democratic Republic of Congo': [-4.0383, 21.7587],
  'Republic of Congo': [-0.228, 15.8277],
  'Djibouti': [11.8251, 42.5903],
  'Egypt': [26.8206, 30.8025],
  'Equatorial Guinea': [1.6508, 10.2679],
  'Eritrea': [15.1794, 39.7823],
  'Ethiopia': [9.1450, 40.4897],
  'Gabon': [-0.8037, 11.6094],
  'Gambia': [13.4432, -15.3101],
  'Ghana': [7.9465, -1.0232],
  'Guinea': [9.9456, -9.6966],
  'Guinea-Bissau': [11.8037, -15.1804],
  'Ivory Coast': [7.5400, -5.5471],
  'Kenya': [-0.0236, 37.9062],
  'Lesotho': [-29.6100, 28.2336],
  'Liberia': [6.4281, -9.4295],
  'Libya': [26.3351, 17.2283],
  'Madagascar': [-18.7669, 46.8691],
  'Malawi': [-13.2543, 34.3015],
  'Mali': [17.5707, -3.9962],
  'Mauritania': [21.0079, -10.9408],
  'Mauritius': [-20.3484, 57.5522],
  'Morocco': [31.7917, -7.0926],
  'Mozambique': [-18.6657, 35.5296],
  'Namibia': [-22.9576, 18.4904],
  'Niger': [17.6078, 8.0817],
  'Nigeria': [9.0820, 8.6753],
  'Rwanda': [-1.9403, 29.8739],
  'Senegal': [14.4974, -14.4524],
  'Sierra Leone': [8.4606, -11.7799],
  'Somalia': [5.1521, 46.1996],
  'South Africa': [-30.5595, 22.9375],
  'South Sudan': [6.8770, 31.3070],
  'Sudan': [12.8628, 30.2176],
  'Tanzania': [-6.3690, 34.8888],
  'Togo': [8.6195, 0.8248],
  'Tunisia': [33.8869, 9.5375],
  'Uganda': [1.3733, 32.2903],
  'Zambia': [-13.1339, 27.8493],
  'Zimbabwe': [-19.0154, 29.1549]
};

interface CountrySolutions {
  country: string;
  coordinates: [number, number];
  directSolutions: Solution[];
  neighborSolutions: Solution[];
  totalCount: number;
}

interface InteractiveAfricaMapProps {
  onSolutionClick?: (solution: Solution) => void;
}

export function InteractiveAfricaMap({ onSolutionClick }: InteractiveAfricaMapProps) {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountrySolutions | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Load Leaflet and create custom icon
    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        setL(leaflet.default);
        // Fix Leaflet's default icon issue with Next.js
        delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
        leaflet.default.Icon.Default.mergeOptions({
          iconRetinaUrl: '/leaflet/marker-icon-2x.png',
          iconUrl: '/leaflet/marker-icon.png',
          shadowUrl: '/leaflet/marker-shadow.png',
        });
        setMapReady(true);
      });
    }
  }, []);

  useEffect(() => {
    // Fetch all solutions from database
    const fetchSolutions = async () => {
      const allSolutions = await SolutionService.getAllSolutions();
      setSolutions(allSolutions);
    };
    fetchSolutions();
  }, []);

  // Process solutions by country
  const countrySolutionsMap = useMemo(() => {
    const map = new Map<string, CountrySolutions>();

    solutions.forEach(solution => {
      solution.applicable_countries?.forEach(country => {
        if (countryCoordinates[country]) {
          if (!map.has(country)) {
            map.set(country, {
              country,
              coordinates: countryCoordinates[country],
              directSolutions: [],
              neighborSolutions: [],
              totalCount: 0
            });
          }
          const countryData = map.get(country)!;
          countryData.directSolutions.push(solution);
          countryData.totalCount = countryData.directSolutions.length + countryData.neighborSolutions.length;
        }
      });
    });

    // Add neighbor solutions
    for (const [country, data] of map.entries()) {
      // This would need to fetch neighbor data from the database
      // For now, we'll just use direct solutions
    }

    return map;
  }, [solutions]);

  const createCustomIcon = () => {
    if (!L) return null;
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
               <span class="text-white text-xs font-bold"></span>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  if (!mapReady) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <h2 className="text-3xl text-[rgba(255,105,0,1)] text-center m-[0px] font-[Permanent_Marker] text-[48px]">IITA Solutions</h2>
      <h2 className="text-3xl text-white text-center mb-8 font-bold text-[36px]">Across Africa</h2>

      <div className="relative">
        {/* Leaflet Map */}
        <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-700">
          <MapContainer
            center={[0, 20]}
            zoom={3}
            style={{ height: '100%', width: '100%' }}
            className="bg-gray-900"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {Array.from(countrySolutionsMap.values()).map((countryData) => (
              <Marker
                key={countryData.country}
                position={countryData.coordinates}
                icon={createCustomIcon()}
                eventHandlers={{
                  click: () => setSelectedCountry(countryData),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{countryData.country}</h3>
                    <p className="text-sm text-gray-600">
                      {countryData.totalCount} solution{countryData.totalCount !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Solutions Panel */}
        <AnimatePresence>
          {selectedCountry && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-0 right-0 w-96 h-full bg-gray-900/95 backdrop-blur border-l border-orange-500/50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl text-orange-500 font-bold">{selectedCountry.country}</h3>
                    <p className="text-gray-400">
                      {selectedCountry.totalCount} solution{selectedCountry.totalCount !== 1 ? 's' : ''} available
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="text-gray-400 hover:text-white transition-colors text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Direct Solutions */}
                {selectedCountry.directSolutions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-3">
                      Direct Solutions
                    </h4>
                    <div className="space-y-3">
                      {selectedCountry.directSolutions.map((solution) => (
                        <motion.div
                          key={solution.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => onSolutionClick?.(solution)}
                        >
                          <h5 className="text-white font-semibold mb-2">
                            {solution.solution_title}
                          </h5>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {solution.executive_summary_text}
                          </p>
                          <div className="flex items-center mt-2 space-x-2">
                            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
                              Climate Score: {solution.climate_potential}/10
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Neighbor Solutions (if implemented) */}
                {selectedCountry.neighborSolutions.length > 0 && (
                  <div>
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-3">
                      From Neighboring Countries
                    </h4>
                    <div className="space-y-3">
                      {selectedCountry.neighborSolutions.map((solution) => (
                        <motion.div
                          key={solution.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
                          onClick={() => onSolutionClick?.(solution)}
                        >
                          <h5 className="text-white font-semibold mb-2">
                            {solution.solution_title}
                          </h5>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {solution.executive_summary_text}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Countries with Solutions</span>
        </div>
        <div className="text-gray-500">
          Click on markers to view available solutions
        </div>
      </div>
    </div>
  );
}