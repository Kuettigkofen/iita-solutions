'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SolutionService } from '@/lib/solutionService'
import { UserInput, ROLE_TYPES, CHALLENGE_TYPES, LOCATION_TYPES, Solution } from '@/types/database'
import DynamicDropdown from '@/components/DynamicDropdown'

// Sample project data for the map
const projects = [
  { id: 1, x: 45, y: 35, country: "Nigeria", title: "Cocoa Climate Resilience", description: "Climate-smart cocoa farming techniques" },
  { id: 2, x: 40, y: 32, country: "Ghana", title: "Sustainable Cocoa Systems", description: "Agroforestry integration for cocoa" },
  { id: 3, x: 65, y: 45, country: "Kenya", title: "Maize Productivity Enhancement", description: "Drought-resistant maize varieties" },
  { id: 4, x: 60, y: 50, country: "Tanzania", title: "Cotton Resilience Program", description: "Climate-adapted cotton farming" },
  { id: 5, x: 55, y: 55, country: "Zambia", title: "Integrated Crop Systems", description: "Multi-crop climate solutions" },
  { id: 6, x: 70, y: 60, country: "Zimbabwe", title: "Livestock Climate Adaptation", description: "Resilient livestock management" }
]

export default function Home() {
  const [userInput, setUserInput] = useState<UserInput>({
    role: '',
    challenge: '',
    location: ''
  })
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [currentSection, setCurrentSection] = useState('input') // 'input', 'results', 'map'
  const [solutionFilter, setSolutionFilter] = useState('')

  const resultsRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (field: keyof UserInput, value: string, isCustom: boolean) => {
    setUserInput(prev => ({
      ...prev,
      [field]: value,
      [`isCustom${field.charAt(0).toUpperCase() + field.slice(1)}`]: isCustom
    }))
  }

  const handleSubmit = async () => {
    if (userInput.role && userInput.challenge && userInput.location) {
      const foundSolutions = await SolutionService.findSolutions(userInput)
      setSolutions(foundSolutions)
      setCurrentSection('results')

      // Scroll to results section
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  const handleInspireMe = () => {
    setCurrentSection('map')

    // Scroll to map section
    setTimeout(() => {
      mapRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const formatRoleDisplay = (role: string) => {
    return role.replace(/_/g, ' ')
  }

  const formatChallengeDisplay = (challenge: string) => {
    return challenge.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getFilteredSolutions = () => {
    return solutions.filter(solution =>
      !solutionFilter ||
      solution.solution_title.toLowerCase().includes(solutionFilter.toLowerCase()) ||
      solution.applicable_challenges.some(challenge =>
        challenge.toLowerCase().includes(solutionFilter.toLowerCase())
      ) ||
      solution.applicable_countries.some(country =>
        country.toLowerCase().includes(solutionFilter.toLowerCase())
      )
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with IITA & CGIAR Logos */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          {/* IITA Logo */}
          <div className="flex flex-col items-start">
            <div className="text-orange-500 text-4xl font-bold tracking-wider">IITA</div>
            <div className="text-orange-500 text-sm italic font-light">Transforming African Agriculture</div>
          </div>
        </div>
        {/* CGIAR Logo */}
        <div className="text-green-600 text-2xl font-bold">CGIAR</div>
      </header>

      {/* Section 1: Input Form */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Dynamic Text Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-8">
              <span className="text-white">I am a </span>
              <span className="relative">
                <span className="text-orange-500 font-normal">
                  {userInput.role ? formatRoleDisplay(userInput.role) : 'development practitioner'}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
                <div className="absolute -bottom-1 -right-2 w-4 h-2 border-b-2 border-r-2 border-orange-500 rotate-45"></div>
              </span>
            </h1>

            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-8">
              <span className="text-white">looking to </span>
              <span className="relative">
                <span className="text-orange-500 font-normal uppercase tracking-wider">
                  address a climate
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
              </span>
            </h1>

            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-8">
              <span className="relative">
                <span className="text-orange-500 font-normal uppercase tracking-wider">
                  challenge
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
              </span>
              <span className="text-white"> to</span>
            </h1>

            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-8">
              <span className="relative">
                <span className="text-orange-500 font-normal">
                  {userInput.challenge ? formatChallengeDisplay(userInput.challenge) : 'Climate Solutions'}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
                <div className="absolute -bottom-1 -right-2 w-4 h-2 border-b-2 border-r-2 border-orange-500 rotate-45"></div>
              </span>
              <span className="text-white"> in</span>
            </h1>

            <h1 className="text-4xl md:text-6xl font-light leading-tight mb-12">
              <span className="relative">
                <span className="text-orange-500 font-normal">
                  {userInput.location || 'Nigeria'}
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
                <div className="absolute -bottom-1 -right-2 w-4 h-2 border-b-2 border-r-2 border-orange-500 rotate-45"></div>
              </span>
              <span className="text-white">.</span>
            </h1>
          </div>

          {/* Input Form */}
          <div className="max-w-2xl mx-auto space-y-6 mb-12">
            <DynamicDropdown
              label="Role"
              options={ROLE_TYPES}
              value={userInput.role}
              onChange={(value, isCustom) => handleInputChange('role', value, isCustom)}
              placeholder="I am a development practitioner"
            />

            <DynamicDropdown
              label="Challenge"
              options={CHALLENGE_TYPES}
              value={userInput.challenge}
              onChange={(value, isCustom) => handleInputChange('challenge', value, isCustom)}
              placeholder="Select challenge type..."
            />

            <DynamicDropdown
              label="Location"
              options={LOCATION_TYPES}
              value={userInput.location}
              onChange={(value, isCustom) => handleInputChange('location', value, isCustom)}
              placeholder="Select location..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSubmit}
              disabled={!userInput.role || !userInput.challenge || !userInput.location}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Let's transform together African Agriculture
            </button>

            <button
              onClick={handleInspireMe}
              className="border-2 border-gray-600 hover:border-white text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Inspire me
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Solution Results */}
      {currentSection === 'results' && solutions.length > 0 && (
        <section ref={resultsRef} className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl text-white mb-4">
                Our <span className="text-orange-500">IITA solutions</span> we've worked on for you
              </h2>
              <p className="text-gray-400 mb-4">
                Found {getFilteredSolutions().length} solution{getFilteredSolutions().length !== 1 ? 's' : ''} {solutionFilter && `matching "${solutionFilter}"`}
              </p>
              <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
            </div>

            {/* Search Filter */}
            {solutions.length > 5 && (
              <div className="max-w-md mx-auto mb-8">
                <input
                  type="text"
                  placeholder="Search solutions..."
                  value={solutionFilter}
                  onChange={(e) => setSolutionFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            {/* Solution Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {getFilteredSolutions().map((solution, index) => (
                <motion.div
                  key={solution.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => {
                    // Scroll to detailed view
                    setTimeout(() => {
                      document.getElementById(`solution-${solution.id}`)?.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  }}
                >
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-r from-green-600 to-green-400"></div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{solution.solution_title}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {solution.applicable_countries.slice(0, 3).map((country) => (
                        <span key={country} className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                          {country}
                        </span>
                      ))}
                      {solution.applicable_countries.length > 3 && (
                        <span className="text-orange-400 text-xs">+{solution.applicable_countries.length - 3} more</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {solution.applicable_challenges.slice(0, 2).map((challenge) => (
                        <span key={challenge} className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                          {formatChallengeDisplay(challenge)}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-300 text-sm">
                      {solution.executive_summary_text?.substring(0, 120)}...
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detailed Solution Views */}
            {getFilteredSolutions().map((solution) => (
              <div key={`detail-${solution.id}`} id={`solution-${solution.id}`} className="mb-16">
                {/* Solution Title */}
                <div className="text-center mb-8">
                  <h2 className="text-4xl md:text-5xl text-white mb-4">{solution.solution_title}</h2>
                  <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
                </div>

                {/* Hero Image */}
                <div className="mb-8">
                  <div className="h-96 bg-gradient-to-r from-green-600 to-green-400 rounded-lg"></div>
                </div>

                {/* Executive Summary */}
                <div className="bg-gray-800 rounded-lg p-8 mb-8">
                  <h3 className="text-3xl text-white mb-6">Executive Summary</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {solution.executive_summary_text}
                  </p>
                </div>

                {/* Problem Section */}
                <div className="bg-gray-800 rounded-lg p-8 mb-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-3xl text-white mb-2">The Problem:</h3>
                      <h4 className="text-2xl text-orange-500 mb-6">{solution.problem_title}</h4>

                      <div className="space-y-4">
                        {solution.problem_bulletpoint_1 && (
                          <div className="flex items-start space-x-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300">{solution.problem_bulletpoint_1}</p>
                          </div>
                        )}
                        {solution.problem_bulletpoint_2 && (
                          <div className="flex items-start space-x-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300">{solution.problem_bulletpoint_2}</p>
                          </div>
                        )}
                        {solution.problem_bulletpoint_3 && (
                          <div className="flex items-start space-x-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300">{solution.problem_bulletpoint_3}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Problem Image */}
                    <div className="h-64 bg-gradient-to-r from-red-600 to-orange-400 rounded-lg"></div>
                  </div>
                </div>

                {/* Solution Section */}
                <div className="bg-gray-800 rounded-lg p-8 mb-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Solution Image */}
                    <div className="h-64 bg-gradient-to-r from-blue-600 to-green-400 rounded-lg"></div>

                    <div>
                      <h3 className="text-3xl text-white mb-2">The Solution:</h3>
                      <h4 className="text-2xl text-orange-500 mb-6">{solution.solution_title_field}</h4>

                      {/* Solution Points with Numbers */}
                      <div className="space-y-6">
                        {solution.solution_bulletpoint_1 && (
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                            <div>
                              <h5 className="text-white font-semibold mb-2">Advanced Seed Technologies</h5>
                              <p className="text-gray-300 text-sm">{solution.solution_bulletpoint_1}</p>
                            </div>
                          </div>
                        )}
                        {solution.solution_bulletpoint_2 && (
                          <div className="flex items-start space-x-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                            <div>
                              <h5 className="text-white font-semibold mb-2">Agronomic Innovations</h5>
                              <p className="text-gray-300 text-sm">{solution.solution_bulletpoint_2}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role-Specific Content */}
                {userInput.role && SolutionService.getRoleSpecificContent(solution, userInput.role) && (
                  <div className="bg-gray-700 rounded-lg p-8 mb-8">
                    <h3 className="text-2xl text-orange-500 mb-4">
                      For {formatRoleDisplay(userInput.role)}s:
                    </h3>
                    <p className="text-gray-300 text-lg">
                      {SolutionService.getRoleSpecificContent(solution, userInput.role)}
                    </p>
                  </div>
                )}

                {/* Resources Section */}
                <div className="bg-gray-800 rounded-lg p-8 mb-8">
                  <h3 className="text-3xl text-white mb-6">Our Knowledge Bank</h3>
                  <p className="text-gray-300 mb-8">
                    Access IITA's extensive research library and technical resources developed over 50+ years of agricultural innovation in Africa.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl text-orange-500 mb-4">Technical Guides:</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Cocoa Agroforestry Implementation Manual</li>
                        <li>• Climate-Smart Agriculture Handbook</li>
                        <li>• Integrated Pest Management Guidelines</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl text-orange-500 mb-4">Digital Tools:</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• CanDataLator App (Canopy Cover Calculator)</li>
                        <li>• CREAM Model (Cocoa Rehabilitation)</li>
                        <li>• Weather Information Systems</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Share Section */}
                <div className="text-center">
                  <h3 className="text-3xl text-white mb-8">Share This Solution</h3>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg">
                      Generate PDF
                    </button>
                    <button className="border border-gray-600 hover:border-white text-white px-6 py-3 rounded-lg">
                      Share
                    </button>
                    <button className="border border-gray-600 hover:border-white text-white px-6 py-3 rounded-lg">
                      Contact IITA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Africa Map */}
      {currentSection === 'map' && (
        <section ref={mapRef} className="container mx-auto px-6 py-12">
          <div className="relative w-full max-w-4xl mx-auto">
            <h2 className="text-[48px] text-orange-500 text-center m-0 font-[Permanent_Marker]">IITA Solutions</h2>
            <h2 className="text-[36px] text-white text-center mb-8 font-bold">Across Africa</h2>

            {/* Africa SVG Map */}
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
                        setSelectedProject(null)
                        setCurrentSection('results')
                        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        </section>
      )}
    </div>
  )
}