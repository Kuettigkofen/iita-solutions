'use client'

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { SolutionService } from '@/lib/solutionService';
import { Solution, CountryNeighbor } from '@/types/database';
import { useRouter } from 'next/navigation';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[600px] bg-gray-900 rounded-lg"><span className="text-white">Loading map...</span></div> }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
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

// Harvard/IFPRI Agro-Ecological Zone Classifications (Sebastian, 2009)
// Based on WorldClim climate data and IIASA LGP data
const aezClassifications = {
  // Temperate zones
  '101': 'Temperate / arid',
  '102': 'Temperate / Semi-arid',
  '103': 'Temperate / sub-humid',
  '104': 'Temperate / humid',

  // Subtropical zones
  '211': 'Subtropic - warm / arid',
  '212': 'Subtropic - warm / semiarid',
  '213': 'Subtropic - warm / subhumid',
  '214': 'Subtropic - warm / humid',
  '221': 'Subtropic - cool / arid',
  '222': 'Subtropic - cool / semiarid',
  '223': 'Subtropic - cool / subhumid',
  '224': 'Subtropic - cool / humid',

  // Tropical zones
  '311': 'Tropic - warm / arid',
  '312': 'Tropic - warm / semiarid',
  '313': 'Tropic - warm / subhumid',
  '314': 'Tropic - warm / humid',
  '321': 'Tropic - cool / arid',
  '322': 'Tropic - cool / semiarid',
  '323': 'Tropic - cool / subhumid',
  '324': 'Tropic - cool / humid',

  // Boreal
  '400': 'Boreal'
};

// Mapping from database key_agroeco values to AEZ codes
// Database format uses spaces and specific capitalization (e.g., "Tropic - warm subhumid")
const agroEcoMapping: { [key: string]: string[] } = {
  'Subtropic - warm arid': ['211'],
  'Subtropic - warm semiarid': ['212'],
  'Subtropic - warm subhumid': ['213'],
  'Subtropic - warm humid': ['214'],
  'Subtropic - cool arid': ['221'],
  'Subtropic - cool semiarid': ['222'],
  'Subtropic - cool subhumid': ['223'],
  'Subtropic - cool humid': ['224'],
  'Tropic - warm arid': ['311'],
  'Tropic - warm semiarid': ['312'],
  'Tropic - warm subhumid': ['313'],
  'Tropic - warm humid': ['314'],
  'Tropic - cool arid': ['321'],
  'Tropic - cool semiarid': ['322'],
  'Tropic - cool subhumid': ['323'],
  'Tropic - cool humid': ['324']
};

// African country agro-ecological zones mapping based on Harvard/IFPRI AEZ dataset
// Updated with more precise zone assignments based on dominant AEZ patterns
const countryAgroEcologicalZones: { [key: string]: string[] } = {
  'Algeria': ['211', '212', '221', '222'], // Subtropic warm/cool arid-semiarid
  'Angola': ['313', '314', '323'], // Tropic warm subhumid-humid, cool subhumid
  'Benin': ['312', '313', '314'], // Tropic warm semiarid-humid
  'Botswana': ['311', '312', '313'], // Tropic warm arid-subhumid
  'Burkina Faso': ['312', '313'], // Tropic warm semiarid-subhumid
  'Burundi': ['323', '324'], // Tropic cool subhumid-humid
  'Cameroon': ['313', '314', '323'], // Tropic warm-cool subhumid-humid
  'Central African Republic': ['313', '314'], // Tropic warm subhumid-humid
  'Chad': ['311', '312', '313'], // Tropic warm arid-subhumid
  'Democratic Republic of Congo': ['314', '323', '324'], // Tropic warm-cool humid
  'Republic of Congo': ['314'], // Tropic warm humid
  'Djibouti': ['311'], // Tropic warm arid
  'Egypt': ['211'], // Subtropic warm arid
  'Equatorial Guinea': ['314'], // Tropic warm humid
  'Eritrea': ['311', '312', '322'], // Tropic warm arid-semiarid, cool semiarid
  'Ethiopia': ['321', '322', '323'], // Tropic cool arid-subhumid
  'Gabon': ['314'], // Tropic warm humid
  'Gambia': ['312', '313'], // Tropic warm semiarid-subhumid
  'Ghana': ['312', '313', '314'], // Tropic warm semiarid-humid
  'Guinea': ['313', '314'], // Tropic warm subhumid-humid
  'Guinea-Bissau': ['313'], // Tropic warm subhumid
  'Ivory Coast': ['313', '314'], // Tropic warm subhumid-humid
  'Kenya': ['311', '321', '322', '323'], // Tropic warm arid, cool arid-subhumid
  'Lesotho': ['223'], // Subtropic cool subhumid
  'Liberia': ['314'], // Tropic warm humid
  'Libya': ['211'], // Subtropic warm arid
  'Madagascar': ['313', '322', '323'], // Tropic warm subhumid, cool semiarid-subhumid
  'Malawi': ['322', '323'], // Tropic cool semiarid-subhumid
  'Mali': ['311', '312'], // Tropic warm arid-semiarid
  'Mauritania': ['211', '311', '312'], // Subtropic-tropic warm arid-semiarid
  'Mauritius': ['314'], // Tropic warm humid
  'Morocco': ['212', '213', '222', '223'], // Subtropic warm-cool semiarid-subhumid
  'Mozambique': ['313', '314', '322'], // Tropic warm subhumid-humid, cool semiarid
  'Namibia': ['211', '311', '312'], // Subtropic-tropic warm arid-semiarid
  'Niger': ['311', '312'], // Tropic warm arid-semiarid
  'Nigeria': ['312', '313', '314'], // Tropic warm semiarid-humid
  'Rwanda': ['323', '324'], // Tropic cool subhumid-humid
  'Senegal': ['312', '313'], // Tropic warm semiarid-subhumid
  'Sierra Leone': ['314'], // Tropic warm humid
  'Somalia': ['311', '312'], // Tropic warm arid-semiarid
  'South Africa': ['212', '213', '222', '223', '313'], // Subtropic warm-cool, tropic warm
  'South Sudan': ['312', '313'], // Tropic warm semiarid-subhumid
  'Sudan': ['311', '312'], // Tropic warm arid-semiarid
  'Tanzania': ['313', '321', '322', '323'], // Tropic warm subhumid, cool arid-subhumid
  'Togo': ['313', '314'], // Tropic warm subhumid-humid
  'Tunisia': ['212', '213'], // Subtropic warm semiarid-subhumid
  'Uganda': ['314', '323', '324'], // Tropic warm humid, cool subhumid-humid
  'Zambia': ['322', '323'], // Tropic cool semiarid-subhumid
  'Zimbabwe': ['313', '322', '323'] // Tropic warm subhumid, cool semiarid-subhumid
};

interface CountrySolutions {
  country: string;
  coordinates: [number, number];
  directSolutions: Solution[];
  neighborSolutions: Solution[];
  agroEcoSolutions: Solution[];
  totalCount: number;
}

export function AfricaMap() {
  const router = useRouter();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [countries, setCountries] = useState<CountryNeighbor[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountrySolutions | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Set map as ready once component mounts
    setMapReady(true);
  }, []);

  useEffect(() => {
    // Fetch all solutions and countries from database
    const fetchData = async () => {
      const [allSolutions, allCountries] = await Promise.all([
        SolutionService.getAllSolutions(),
        SolutionService.getAllCountries()
      ]);
      setSolutions(allSolutions);
      setCountries(allCountries);
    };
    fetchData();
  }, []);

  // Process solutions by country including neighbor relationships and agro-ecological zones
  const countrySolutionsMap = useMemo(() => {
    const map = new Map<string, CountrySolutions>();

    // Initialize all countries with coordinates
    Object.keys(countryCoordinates).forEach(country => {
      map.set(country, {
        country,
        coordinates: countryCoordinates[country],
        directSolutions: [],
        neighborSolutions: [],
        agroEcoSolutions: [],
        totalCount: 0
      });
    });

    // First pass: Add direct solutions
    solutions.forEach(solution => {
      solution.applicable_countries?.forEach(country => {
        if (map.has(country)) {
          const countryData = map.get(country)!;
          if (!countryData.directSolutions.find(s => s.id === solution.id)) {
            countryData.directSolutions.push(solution);
          }
        }
      });
    });

    // Second pass: Add neighbor solutions
    countries.forEach(countryData => {
      const country = countryData.country_name;
      if (!map.has(country)) return;

      const countryEntry = map.get(country)!;

      // Find solutions from neighboring countries
      countryData.neighbor_countries?.forEach(neighbor => {
        solutions.forEach(solution => {
          if (solution.applicable_countries?.includes(neighbor) &&
              !solution.applicable_countries?.includes(country) &&
              !countryEntry.neighborSolutions.find(s => s.id === solution.id) &&
              !countryEntry.directSolutions.find(s => s.id === solution.id)) {
            countryEntry.neighborSolutions.push(solution);
          }
        });
      });
    });

    // Third pass: Add agro-ecological zone solutions using Harvard/IFPRI AEZ system
    map.forEach((countryEntry, country) => {
      const countryAezCodes = countryAgroEcologicalZones[country] || [];

      solutions.forEach(solution => {
        // Check if solution's agro-ecological zones match this country's AEZ codes
        const solutionZones = solution.key_agroeco || [];


        // Convert solution zones to AEZ codes if they're in text format
        const solutionAezCodes: string[] = [];
        solutionZones.forEach(zone => {
          if (agroEcoMapping[zone]) {
            solutionAezCodes.push(...agroEcoMapping[zone]);
          } else {
            // If already in AEZ code format, use directly
            solutionAezCodes.push(zone);
          }
        });

        // Check for overlap between country AEZ codes and solution AEZ codes
        const hasZoneMatch = solutionAezCodes.some(code => countryAezCodes.includes(code));

        if (hasZoneMatch &&
            !countryEntry.directSolutions.find(s => s.id === solution.id) &&
            !countryEntry.neighborSolutions.find(s => s.id === solution.id) &&
            !countryEntry.agroEcoSolutions.find(s => s.id === solution.id)) {
          countryEntry.agroEcoSolutions.push(solution);
        }
      });

      countryEntry.totalCount = countryEntry.directSolutions.length +
                                countryEntry.neighborSolutions.length +
                                countryEntry.agroEcoSolutions.length;
    });

    return map;
  }, [solutions, countries]);

  const handleSolutionClick = (solution: Solution) => {
    // Navigate to solution detail or trigger solution display
    setSelectedCountry(null);
    // You can implement navigation or state management here
    console.log('Solution clicked:', solution);
  };

  const getMarkerColor = (countryData: CountrySolutions) => {
    const { directSolutions, neighborSolutions, agroEcoSolutions } = countryData;

    // Priority: Direct solutions (orange), then neighbors (orange-lighter), then agro-eco zones (green)
    if (directSolutions.length > 0) {
      if (directSolutions.length <= 2) return '#f97316'; // orange-500
      return '#ea580c'; // orange-600
    }

    if (neighborSolutions.length > 0) {
      return '#fb923c'; // orange-400
    }

    if (agroEcoSolutions.length > 0) {
      return '#22c55e'; // green-500
    }

    return '#6b7280'; // gray-500
  };

  const getMarkerSize = (count: number) => {
    if (count === 0) return 6;
    if (count <= 2) return 8;
    if (count <= 5) return 10;
    return 12;
  };

  if (!mapReady) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-900 rounded-lg">
        <span className="text-white">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <h2 className="text-3xl text-orange-500 text-center m-[0px] font-permanent-marker text-[48px]">IITA Solutions</h2>
      <h2 className="text-3xl text-white text-center mb-8 font-bold text-[36px]">Across Africa</h2>

      <div className="relative">
        {/* Leaflet Map */}
        <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-700">
          {typeof window !== 'undefined' && (
            <MapContainer
              center={[0, 20]}
              zoom={3.5}
              style={{ height: '100%', width: '100%' }}
              className="bg-gray-900"
              scrollWheelZoom={true}
              doubleClickZoom={true}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />

              {Array.from(countrySolutionsMap.values()).map((countryData) => (
                <CircleMarker
                  key={countryData.country}
                  center={countryData.coordinates}
                  radius={getMarkerSize(countryData.totalCount)}
                  pathOptions={{
                    fillColor: getMarkerColor(countryData),
                    color: '#ffffff',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8
                  }}
                  eventHandlers={{
                    click: () => {
                      if (countryData.totalCount > 0) {
                        setSelectedCountry(countryData);
                      }
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                    <div className="text-center">
                      <strong>{countryData.country}</strong><br />
                      {countryData.totalCount > 0 ? (
                        <>
                          {countryData.directSolutions.length > 0 && (
                            <>{countryData.directSolutions.length} direct solution{countryData.directSolutions.length !== 1 ? 's' : ''}<br /></>
                          )}
                          {countryData.neighborSolutions.length > 0 && (
                            <>{countryData.neighborSolutions.length} from neighbors<br /></>
                          )}
                          {countryData.agroEcoSolutions.length > 0 && (
                            <>{countryData.agroEcoSolutions.length} agro-eco match{countryData.agroEcoSolutions.length !== 1 ? 'es' : ''}</>
                          )}
                        </>
                      ) : (
                        'No solutions available'
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Solutions Panel */}
        <AnimatePresence>
          {selectedCountry && selectedCountry.totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-0 right-0 w-96 h-full bg-gray-900/95 backdrop-blur border-l border-orange-500/50 overflow-y-auto z-[1000]"
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
                          onClick={() => handleSolutionClick(solution)}
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

                {/* Neighbor Solutions */}
                {selectedCountry.neighborSolutions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-3">
                      From Neighboring Countries
                    </h4>
                    <div className="space-y-3">
                      {selectedCountry.neighborSolutions.map((solution) => (
                        <motion.div
                          key={solution.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700"
                          onClick={() => handleSolutionClick(solution)}
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
                            <span className="text-xs text-gray-500">
                              From: {solution.applicable_countries?.join(', ')}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agro-Ecological Zone Solutions */}
                {selectedCountry.agroEcoSolutions.length > 0 && (
                  <div>
                    <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-3">
                      Agro-Ecological Zone Matches
                    </h4>
                    <div className="space-y-3">
                      {selectedCountry.agroEcoSolutions.map((solution) => (
                        <motion.div
                          key={solution.id}
                          whileHover={{ scale: 1.02 }}
                          className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors border border-green-500/50"
                          onClick={() => handleSolutionClick(solution)}
                        >
                          <h5 className="text-white font-semibold mb-2">
                            {solution.solution_title}
                          </h5>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {solution.executive_summary_text}
                          </p>
                          <div className="flex items-center mt-2 space-x-2 flex-wrap gap-1">
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                              Climate Score: {solution.climate_potential}/10
                            </span>
                            <span className="text-xs text-gray-500">
                              AEZ: {solution.key_agroeco?.map(zone => {
                                // Convert to AEZ codes for display
                                const codes = agroEcoMapping[zone] || [zone];
                                return codes.map(code => `${code} (${aezClassifications[code] || zone})`).join(', ');
                              }).join(', ')}
                            </span>
                          </div>
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
      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-400 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Direct Solutions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span>Neighbor Solutions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Agro-Ecological Zone Matches</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>No Solutions Available</span>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500">
          Agro-ecological zones based on Harvard/IFPRI dataset (Sebastian, 2009)
        </div>
      </div>
    </div>
  );
}