import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SearchableDropdown } from "./components/SearchableDropdown";
import { SolutionCard } from "./components/SolutionCard";
import { SolutionDetail } from "./components/SolutionDetail";
import { AfricaMap } from "./components/AfricaMap";
import { FAQ } from "./components/FAQ";
import { Button } from "./components/ui/button";
import jsPDF from "jspdf";
import iitaLogo from "figma:asset/036c233b6044c85ed0e4f4963a8cc31ab8b70401.png";

// Mock data
const roleOptions = [
  "development practitioner",
  "researcher",
  "government extension officer",
  "policymaker",
  "funder",
  "business owner",
  "student",
  "farmer",
];

const challengeOptions = [
  "yam",
  "soybean",
  "cassava",
  "seed_systems",
  "pest_management",
  "digital_agriculture",
  "soil_fertility"
];

const locationOptions = [
  // African countries (alphabetically sorted - all 54 countries)
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Democratic Republic of Congo",
  "Republic of the Congo",
  "Côte d'Ivoire",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Rwanda",
  "São Tomé and Príncipe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe",
  // Climate zones
  "subtropic-warm arid regions",
  "subtropic-warm semiarid regions",
  "subtropic-warm subhumid regions",
  "subtropic-warm humid regions",
  "subtropic-cool arid regions",
  "subtropic-cool semiarid regions",
  "subtropic-cool subhumid regions",
  "subtropic-cool humid regions",
  "tropic-warm arid regions",
  "tropic-warm semiarid regions",
  "tropic-warm subhumid regions",
  "tropic-warm humid regions",
  "tropic-cool arid regions",
  "tropic-cool semiarid regions",
  "tropic-cool subhumid regions",
  "tropic-cool humid regions",
];

// Updated mock solutions with new database structure
const mockSolutions = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    solution_title: "Yam Leaf-bud Cuttings: Rapid Multiplication Method",
    applicable_countries: ["Nigeria", "Ghana", "Cameroon", "Benin", "Togo"],
    applicable_challenges: ["yam"],
    climate_potential: 9,
    key_agroeco: ["Tropic-warm subhumid", "Tropic-warm humid", "Subtropic-warm subhumid"],
    executive_summary_text: "Revolutionary yam seed multiplication achieves 1:300 multiplication rate in 16-20 weeks, reducing production time by 60% while dramatically improving climate resilience.",
    solution_images: [
      {
        image_type: "title_image",
        image_url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop&crop=center"
      }
    ],
    // Keep existing fields for compatibility with SolutionDetail
    title: "Yam Leaf-bud Cuttings: Rapid Multiplication Method",
    image: "https://e-catalogs.taat-africa.org/images/preview/yam-leafbud-main.png",
    location: "West Africa",
    summary: "Revolutionary yam seed multiplication achieves 1:300 multiplication rate in 16-20 weeks, reducing production time by 60% while dramatically improving climate resilience.",
    problem: "Traditional yam seed production is vulnerable to climate variability. Long growing cycles of 7-10 months make yam vulnerable to shortened rainy seasons. Limited 1:3 multiplication rate constrains rapid variety deployment after climate shocks.",
    solution: "Rapid yam seed multiplication through leaf-bud cuttings achieves 1:300 multiplication rate vs traditional 1:3. Complete cycle in 16-20 weeks reducing climate exposure 60%. Use small vine segments requiring minimal resources.",
    partnership: "We are seeking partnerships with development organizations, private sector actors, and government agencies to scale this solution across West Africa. Partners can support farmer training programs, provide access to improved seedlings, or invest in processing facilities.",
    problem_title: "Traditional Yam Seed Production Vulnerable to Climate Variability",
    solution_title_field: "Rapid Yam Seed Multiplication Through Leaf-bud Cuttings"
  },
  {
    id: "b2c3d4e5-f6a7-8b01-bcde-f23456789012",
    solution_title: "NoduMax: Rhizobium Inoculant for Enhanced Soybean Nitrogen Fixation",
    applicable_countries: ["Nigeria", "Ghana", "Mali", "Burkina Faso", "Kenya", "Tanzania", "Benin", "Mozambique", "Togo"],
    applicable_challenges: ["soybean", "soil_fertility"],
    climate_potential: 8,
    key_agroeco: ["Tropic-warm semiarid", "Tropic-warm subhumid", "Subtropic-warm arid"],
    executive_summary_text: "NoduMax rhizobium inoculant containing USDA 110 strain delivers exceptional ROI while enhancing biological nitrogen fixation and climate resilience.",
    solution_images: [
      {
        image_type: "title_image",
        image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop&crop=center"
      }
    ],
    // Keep existing fields for compatibility with SolutionDetail
    title: "NoduMax: Rhizobium Inoculant for Enhanced Soybean Nitrogen Fixation",
    image: "https://e-catalogs.taat-africa.org/images/preview/nodumax-main.png",
    location: "Multiple African Countries",
    summary: "NoduMax rhizobium inoculant containing USDA 110 strain delivers exceptional ROI while enhancing biological nitrogen fixation and climate resilience.",
    problem: "Soybean production is limited by poor nitrogen fixation and high input costs. Inadequate rhizobium populations limit biological nitrogen fixation. High fertilizer costs make production unviable for smallholders.",
    solution: "NoduMax enhances biological nitrogen fixation technology with USDA 110 strain containing 1 billion live cells per gram. Achieve $1 USD profit per packet for retailers. Establish 16 tons annual capacity worth $500,000+ with $150,000 investment.",
    partnership: "We welcome partnerships with agricultural input suppliers, development finance institutions, and agribusiness companies to scale this biological nitrogen fixation solution across Africa.",
    problem_title: "Soybean Production Limited by Poor Nitrogen Fixation and High Input Costs",
    solution_title_field: "NoduMax: Enhanced Biological Nitrogen Fixation Technology"
  },
  {
    id: "c3d4e5f6-a7b8-9c12-cdef-345678901234",
    solution_title: "BASICS Model: Blueprint for Sustainable Cassava Seed Systems",
    applicable_countries: ["Nigeria", "Tanzania", "DRC", "Kenya", "Rwanda", "Gabon", "Liberia", "Sierra Leone"],
    applicable_challenges: ["cassava", "seed_systems"],
    climate_potential: 8,
    key_agroeco: ["Tropic-warm humid", "Tropic-warm subhumid", "Tropic-cool humid"],
    executive_summary_text: "BASICS provides comprehensive blueprint for economically sustainable cassava seed systems delivering disease-free, climate-adapted planting materials.",
    solution_images: [
      {
        image_type: "title_image",
        image_url: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=600&h=400&fit=crop&crop=center"
      }
    ],
    // Keep existing fields for compatibility with SolutionDetail
    title: "BASICS Model: Blueprint for Sustainable Cassava Seed Systems",
    image: "https://e-catalogs.taat-africa.org/images/preview/basics-main.png",
    location: "Sub-Saharan Africa",
    summary: "BASICS provides comprehensive blueprint for economically sustainable cassava seed systems delivering disease-free, climate-adapted planting materials.",
    problem: "Cassava seed systems fail to deliver climate-adapted varieties. Unpredictable stem quality with yields below 10 tons/ha limit farmer productivity. Over 80% stems infected with diseases that worsen under climate stress.",
    solution: "BASICS systematic climate-adaptive cassava seed systems establish economically sustainable seed systems delivering disease-free materials. Build market-driven business models linking research and farmer demand.",
    partnership: "We seek partnerships with seed companies, development organizations, and government programs to scale sustainable cassava seed systems across Africa.",
    problem_title: "Cassava Seed Systems Fail to Deliver Climate-Adapted Varieties",
    solution_title_field: "BASICS: Systematic Climate-Adaptive Cassava Seed Systems"
  },
];

export default function App() {
  const [role, setRole] = useState("");
  const [challenge, setChallenge] = useState("");
  const [location, setLocation] = useState("");
  const [currentSection, setCurrentSection] = useState<
    "landing" | "solutions" | "detail" | "inspire"
  >("landing");
  const [selectedSolution, setSelectedSolution] =
    useState<any>(null);
  const [showFAQ, setShowFAQ] = useState(false);

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

  const handleTransformClick = () => {
    setCurrentSection("solutions");
    setTimeout(() => scrollToSection(solutionsRef), 100);
  };

  const handleInspireClick = () => {
    setCurrentSection("inspire");
    setTimeout(() => scrollToSection(inspireRef), 100);
  };

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

    // Location
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const locationText = solution.applicable_countries ?
      `Countries: ${solution.applicable_countries.join(', ')}` :
      `Location: ${solution.location}`;
    doc.text(locationText, margin, yPosition);
    yPosition += 20;

    // Climate Score (if available)
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

    // The Problem Section
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setTextColor(249, 115, 22);
    doc.text('The Problem', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const problemLines = doc.splitTextToSize(solution.problem, maxWidth);
    doc.text(problemLines, margin, yPosition);
    yPosition += problemLines.length * 5 + 15;

    // Our Potential Solution Section
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setTextColor(249, 115, 22);
    doc.text('Our Potential Solution', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const solutionLines = doc.splitTextToSize(solution.solution, maxWidth);
    doc.text(solutionLines, margin, yPosition);
    yPosition += solutionLines.length * 5 + 15;

    // Our Knowledge Bank Section
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setTextColor(249, 115, 22);
    doc.text('Our Knowledge Bank', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const knowledgeBankIntro = "Access IITA's extensive research library and technical resources developed over 50+ years of agricultural innovation in Africa. Our knowledge bank provides evidence-based solutions and practical guidance for climate-smart agriculture.";
    const knowledgeIntroLines = doc.splitTextToSize(knowledgeBankIntro, maxWidth);
    doc.text(knowledgeIntroLines, margin, yPosition);
    yPosition += knowledgeIntroLines.length * 5 + 10;

    // Knowledge Bank Resources
    doc.setFontSize(12);
    doc.setTextColor(249, 115, 22);
    doc.text('Available Resources & Publications:', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Technical Guides
    doc.setTextColor(249, 115, 22);
    doc.text('• Technical Guides:', margin, yPosition);
    yPosition += 6;
    doc.setTextColor(0, 0, 0);
    const guides = [
      '  - Climate-Smart Agriculture Implementation Manual',
      '  - Integrated Pest Management Guidelines',
      '  - Soil Health Assessment Protocols',
      '  - Seed System Development Guides'
    ];
    guides.forEach(guide => {
      doc.text(guide, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 3;

    // Digital Tools
    doc.setTextColor(249, 115, 22);
    doc.text('• Digital Tools:', margin, yPosition);
    yPosition += 6;
    doc.setTextColor(0, 0, 0);
    const tools = [
      '  - Climate Monitoring Systems',
      '  - Yield Prediction Models',
      '  - Weather Information Platforms',
      '  - Market Price Tracking Tools'
    ];
    tools.forEach(tool => {
      doc.text(tool, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 3;

    // Research Publications
    doc.setTextColor(249, 115, 22);
    doc.text('• Research Publications:', margin, yPosition);
    yPosition += 6;
    doc.setTextColor(0, 0, 0);
    const publications = [
      '  - 500+ Peer-reviewed Journal Articles',
      '  - Annual Research Reports (1967-2024)',
      '  - Crop Variety Development Papers',
      '  - Climate Adaptation Case Studies'
    ];
    publications.forEach(pub => {
      doc.text(pub, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 3;

    // Training Materials
    doc.setTextColor(249, 115, 22);
    doc.text('• Training Materials:', margin, yPosition);
    yPosition += 6;
    doc.setTextColor(0, 0, 0);
    const training = [
      '  - Farmer Field School Curricula',
      '  - Extension Agent Training Modules',
      '  - Video Learning Resources',
      '  - Multi-language Extension Materials'
    ];
    training.forEach(material => {
      doc.text(material, margin, yPosition);
      yPosition += 5;
    });
    yPosition += 8;

    // Access Information
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Access: Most resources available through IITA Library', margin, yPosition);
    yPosition += 4;
    doc.text('Contact: library@iita.org • Digital Repository: publications.iita.org', margin, yPosition);
    yPosition += 15;

    // Let's Get Together Section
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(16);
    doc.setTextColor(249, 115, 22);
    doc.text("Let's Get Together", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const partnershipLines = doc.splitTextToSize(solution.partnership, maxWidth);
    doc.text(partnershipLines, margin, yPosition);
    yPosition += partnershipLines.length * 5 + 20;

    // Contact Information
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 30;
    }

    doc.setFontSize(14);
    doc.setTextColor(249, 115, 22);
    doc.text('Contact IITA', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Email: j.choptiany@cgiar.org', margin, yPosition);
    yPosition += 6;
    doc.text('Website: www.iita.org', margin, yPosition);
    yPosition += 6;
    doc.text('Address: PMB 5320, Oyo Road, Ibadan 200001, Oyo State, Nigeria', margin, yPosition);

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated by IITA Climate Solutions Platform - Page ${i} of ${totalPages}`, margin, doc.internal.pageSize.height - 10);
    }

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
            // Create comprehensive sharing content
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
            // Handle user cancellation or other errors
            if (error.name !== 'AbortError') {
              console.error('Error sharing:', error);
              // Fallback to clipboard
              handleFallbackShare();
            }
          }
        } else {
          // Fallback for browsers without Web Share API
          handleFallbackShare();
        }
        break;
      case "contact":
        window.location.href = "mailto:j.choptiany@cgiar.org";
        break;
      case "faq":
        setShowFAQ(!showFAQ);
        break;
    }
  };

  const handleFallbackShare = async () => {
    if (selectedSolution) {
      const shareText = `🌱 ${selectedSolution.solution_title || selectedSolution.title} - IITA Climate Solutions

📍 Location: ${selectedSolution.applicable_countries ? selectedSolution.applicable_countries.join(', ') : selectedSolution.location}

💡 ${selectedSolution.executive_summary_text || selectedSolution.summary}

🤝 Partner with IITA: ${window.location.href}

#ClimateSmartAgriculture #IITA #AfricanAgriculture`;

      try {
        // Try to copy to clipboard
        await navigator.clipboard.writeText(shareText);
        alert("Content copied to clipboard! You can now paste it anywhere to share.");
      } catch (error) {
        // Final fallback - open email client
        const subject = encodeURIComponent(`${selectedSolution.solution_title || selectedSolution.title} - IITA Climate Solutions`);
        const body = encodeURIComponent(shareText);
        window.open(`mailto:?subject=${subject}&body=${body}`);
      }
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
              src={iitaLogo}
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
                <span className="text-orange-500 font-bold font-[Permanent_Marker] not-italic">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mockSolutions.map((solution) => (
                    <SolutionCard
                      key={solution.id}
                      solution={solution}
                      onClick={() =>
                        handleSolutionClick(solution)
                      }
                    />
                  ))}
                </div>
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
                <AfricaMap />
              </motion.div>
            </div>
          </section>
        )}
      </AnimatePresence>
    </div>
  );
}