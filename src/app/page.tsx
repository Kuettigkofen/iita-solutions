'use client'

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchableDropdown } from "@/components/SearchableDropdown";
import { SolutionCard } from "@/components/SolutionCard";
import { SolutionDetail } from "@/components/SolutionDetail";
import { FAQ } from "@/components/FAQ";
import { AfricaMap } from "@/components/AfricaMap";
import { Button } from "@/components/ui/button";
import { SolutionService } from "@/lib/solutionService";
import { Solution, ROLE_TYPES, CHALLENGE_TYPES, LOCATION_TYPES, UserInput } from "@/types/database";
import jsPDF from "jspdf";

// Convert enum types to display-friendly strings - sorted alphabetically
const roleOptions = [
  "business owner",
  "development practitioner",
  "farmer",
  "funder",
  "government extension officer",
  "policymaker",
  "researcher",
  "student",
];

const challengeOptions = [
  "agroecology",
  "agroforestry",
  "aquaculture",
  "banana",
  "beans",
  "beekeeping",
  "biofortification",
  "cassava",
  "climate_information",
  "climate_resilience",
  "cocoa",
  "coffee",
  "cotton",
  "digital_services",
  "farmer_training",
  "greenhouse",
  "livestock",
  "maize",
  "mushroom",
  "nutrition",
  "pest_management",
  "plantain",
  "processing",
  "renewable_energy",
  "rice",
  "soil_fertility",
  "soybean",
  "storage",
  "sweet_potato",
  "value_chains",
  "water_management",
  "yam"
];

const locationOptions = LOCATION_TYPES.slice().sort();

// We'll now use real Supabase data instead of mock data

export default function App() {
  const [role, setRole] = useState("");
  const [challenge, setChallenge] = useState("");
  const [location, setLocation] = useState("");
  const [currentSection, setCurrentSection] = useState<
    "landing" | "solutions" | "detail" | "inspire"
  >("landing");
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(false);
  const [inspiringSolutions, setInspiringSolutions] = useState<Solution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSolutions, setFilteredSolutions] = useState<Solution[]>([]);

  const solutionsRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const inspireRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
  ) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleTransformClick = async () => {
    if (!role || !challenge || !location) return;

    setLoading(true);
    setCurrentSection("solutions");

    try {
      const userInput: UserInput = {
        role: role as any,
        challenge: challenge as any,
        location: location as any
      };

      const foundSolutions = await SolutionService.findSolutions(userInput);
      setSolutions(foundSolutions);
      setFilteredSolutions(foundSolutions);

      // Save user selection for analytics
      await SolutionService.saveUserSelection(userInput);

      setTimeout(() => scrollToSection(solutionsRef), 100);
    } catch (error) {
      console.error('Error finding solutions:', error);
      setSolutions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInspireClick = async () => {
    setCurrentSection("inspire");

    // Load inspiring solutions if not already loaded
    if (inspiringSolutions.length === 0) {
      try {
        // Load a sample of all solutions for inspiration
        const allSolutions = await SolutionService.findSolutions({
          role: "farmer",
          challenge: "climate_resilience",
          location: "Nigeria"
        } as UserInput);
        setInspiringSolutions(allSolutions.slice(0, 6)); // Show top 6 solutions
      } catch (error) {
        console.error('Error loading inspiring solutions:', error);
      }
    }

    setTimeout(() => scrollToSection(inspireRef), 100);
  };

  // Load inspiring solutions on mount
  useEffect(() => {
    const loadInspiringSolutions = async () => {
      try {
        // Load a diverse set of solutions for inspiration
        const allSolutions = await SolutionService.findSolutions({
          role: "development_practitioner",
          challenge: "climate_resilience",
          location: "Nigeria"
        } as UserInput);
        setInspiringSolutions(allSolutions.slice(0, 3)); // Show top 3 solutions
      } catch (error) {
        console.error('Error loading inspiring solutions:', error);
      }
    };

    loadInspiringSolutions();
  }, []);

  // Filter solutions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSolutions(solutions);
    } else {
      const filtered = solutions.filter(solution =>
        solution.solution_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.applicable_countries?.some(country =>
          country.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        solution.applicable_challenges?.some(challenge =>
          challenge.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredSolutions(filtered);
    }
  }, [searchTerm, solutions]);

  const handleSolutionClick = (solution: any) => {
    setSelectedSolution(solution);
    setCurrentSection("detail");
    setTimeout(() => scrollToSection(detailRef), 100);
  };

  const generatePDF = (solution: any) => {
    if (!solution) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = 30;

    // IITA Header
    doc.setFillColor(249, 115, 22); // Orange color #f97316
    doc.rect(0, 0, pageWidth, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('IITA - International Institute of Tropical Agriculture', margin, 15);

    doc.setTextColor(0, 0, 0);
    yPosition = 40;

    // Solution Title
    doc.setFontSize(20);
    doc.setTextColor(249, 115, 22);
    const titleLines = doc.splitTextToSize(solution.solution_title || solution.title, maxWidth);
    doc.text(titleLines, margin, yPosition);
    yPosition += titleLines.length * 8 + 10;

    // Climate Score
    if (solution.climate_potential) {
      doc.setFontSize(12);
      doc.setTextColor(249, 115, 22);
      doc.text(`Climate Score: ${solution.climate_potential}/10`, margin, yPosition);
      yPosition += 15;
    }

    // Summary Section
    doc.setFontSize(16);
    doc.setTextColor(249, 115, 22);
    doc.text('Summary', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const summaryText = solution.executive_summary_text || solution.summary;
    const summaryLines = doc.splitTextToSize(summaryText, maxWidth);
    doc.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 15;

    // Save the PDF
    const fileName = `IITA_${(solution.solution_title || solution.title).replace(/\s+/g, '_')}_Solution.pdf`;
    doc.save(fileName);
  };

  const handleShare = async (
    type: "pdf" | "email" | "contact" | "faq",
  ) => {
    switch (type) {
      case "pdf":
        generatePDF(selectedSolution);
        break;
      case "email":
        if (navigator.share && selectedSolution) {
          try {
            const shareData = {
              title: `${selectedSolution.solution_title || selectedSolution.title} - IITA Climate Solutions`,
              text: `🌱 Discover IITA's climate-smart agricultural solution: ${selectedSolution.solution_title || selectedSolution.title}

📍 Location: ${selectedSolution.applicable_countries ? selectedSolution.applicable_countries.join(', ') : selectedSolution.location}

💡 ${selectedSolution.executive_summary_text || selectedSolution.summary}

🤝 Partner with IITA to transform African agriculture and address climate challenges.

#ClimateSmartAgriculture #IITA #AfricanAgriculture #SustainableFarming`,
              url: window.location.href,
            };

            await navigator.share(shareData);
          } catch (error) {
            console.error('Error sharing:', error);
          }
        }
        break;
      case "contact":
        window.open("mailto:partnerships@iita.org?subject=Partnership Inquiry");
        break;
      case "faq":
        setShowFAQ(!showFAQ);
        break;
    }
  };

  const isFormComplete = role || challenge || location;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Landing Section */}
      <section className="min-h-screen flex flex-col">
        {/* Header with IITA Logo */}
        <header className="p-6">
          <div className="max-w-7xl mx-auto">
            <img
              src="/iita-logo.png"
              alt="IITA - Transforming African Agriculture"
              className="h-24 w-auto"
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="text-3xl md:text-5xl lg:text-6xl leading-relaxed">
                <span className="text-white">I am a </span>
                <SearchableDropdown
                  options={roleOptions}
                  placeholder="role"
                  value={role}
                  onChange={setRole}
                  className="inline-block mx-2"
                />
                <span className="text-white"> looking to </span>
                <span
                  className="text-orange-500 font-bold not-italic"
                  style={{ fontFamily: 'var(--font-permanent-marker)' }}
                >
                  address a climate challenge
                </span>
                <span className="text-white"> to </span>
                <SearchableDropdown
                  options={challengeOptions}
                  placeholder="crop/livestock"
                  value={challenge}
                  onChange={setChallenge}
                  className="inline-block mx-2"
                />
                <span className="text-white"> in </span>
                <SearchableDropdown
                  options={locationOptions}
                  placeholder="location"
                  value={location}
                  onChange={setLocation}
                  className="inline-block mx-2"
                />
                <span className="text-white">.</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <Button
                  onClick={handleTransformClick}
                  disabled={!isFormComplete}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Let's transform together African Agriculture
                </Button>
                <Button
                  onClick={handleInspireClick}
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg"
                >
                  Inspire me
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solutions Gallery Section */}
      <AnimatePresence>
        {currentSection === "solutions" && (
          <section
            ref={solutionsRef}
            className="min-h-screen py-20 px-6"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl text-center mb-4">
                  <span className="text-white">Our </span>
                  <span className="text-orange-500">IITA solutions</span>
                  <span className="text-white"> we've worked on for you
                  </span>
                </h2>
                <div className="w-24 h-1 bg-orange-500 mx-auto mb-12"></div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Finding the perfect solutions for you...</p>
                  </div>
                ) : solutions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutions.map((solution) => (
                      <SolutionCard
                        key={solution.id}
                        solution={solution}
                        onClick={() => handleSolutionClick(solution)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg mb-4">
                      No solutions found for your specific criteria.
                    </p>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search criteria or explore our inspiring solutions below.
                    </p>
                    <Button
                      onClick={handleInspireClick}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Explore All Solutions
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* Solution Detail Section */}
      <AnimatePresence>
        {currentSection === "detail" && selectedSolution && (
          <section
            ref={detailRef}
            className="min-h-screen py-20 px-6"
          >
            <SolutionDetail
              solution={selectedSolution}
              onShare={handleShare}
              userRole={role}
            />

            {/* FAQ Section */}
            <AnimatePresence>
              {showFAQ && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                  className="mt-16 pt-8 border-t border-gray-800"
                >
                  <FAQ
                    solutionId={selectedSolution?.id}
                    solutionTitle={selectedSolution?.solution_title || selectedSolution?.title}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}
      </AnimatePresence>

      {/* Inspire Me Section */}
      <AnimatePresence>
        {currentSection === "inspire" && (
          <section
            ref={inspireRef}
            className="min-h-screen py-20 px-6"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <AfricaMap onSolutionClick={handleSolutionClick} />
              </motion.div>
            </div>
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}