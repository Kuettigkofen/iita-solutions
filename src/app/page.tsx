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
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);

    // Exact homepage color matching
    const colors = {
      darkBg: [17, 24, 39],      // gray-900 exact
      cardBg: [31, 41, 55],      // gray-800 exact
      darkerBg: [15, 23, 42],    // slate-900 exact
      orange: [249, 115, 22],    // orange-500 exact
      orangeLight: [251, 146, 60], // orange-400 exact
      white: [255, 255, 255],    // white exact
      gray300: [209, 213, 219],  // gray-300 exact (body text)
      gray400: [156, 163, 175],  // gray-400 exact
      gray500: [107, 114, 128],  // gray-500 exact
      black: [0, 0, 0]
    };

    // Typography scale matching Tailwind classes
    const fonts = {
      // Homepage: text-4xl lg:text-5xl (36px/48px)
      heroTitle: 32,
      // Homepage: text-3xl lg:text-4xl (30px/36px)
      sectionTitle: 28,
      // Homepage: text-2xl (24px)
      cardTitle: 20,
      // Homepage: text-lg (18px)
      bulletTitle: 16,
      // Homepage: text-base (16px)
      body: 12,
      // Homepage: text-sm (14px)
      small: 10,
      // Homepage: text-xs (12px)
      tiny: 9
    };

    // Helper function for proper URL handling (like homepage)
    const renderTextWithLinks = (text: string, x: number, y: number, maxWidth: number, fontSize: number) => {
      if (!text) return y;

      doc.setFontSize(fontSize);

      // Handle markdown links [text](url) and HTML links
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)|<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(text)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push({ text: text.slice(lastIndex, match.index), isLink: false });
        }

        // Add the link
        const linkText = match[1] || match[4]; // markdown or html link text
        const linkUrl = match[2] || match[3];   // markdown or html link url
        parts.push({ text: linkText, isLink: true, url: linkUrl });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), isLink: false });
      }

      if (parts.length === 0) {
        parts.push({ text: text, isLink: false });
      }

      // Render each part
      let currentX = x;
      let currentY = y;

      parts.forEach(part => {
        const lines = doc.splitTextToSize(part.text, maxWidth - (currentX - x));

        lines.forEach((line: string, lineIndex: number) => {
          if (part.isLink) {
            doc.setTextColor(...colors.orange);
            doc.text(line, currentX, currentY);
            // Add underline for links
            const textWidth = doc.getTextWidth(line);
            doc.setDrawColor(...colors.orange);
            doc.setLineWidth(0.5);
            doc.line(currentX, currentY + 1, currentX + textWidth, currentY + 1);
          } else {
            doc.setTextColor(...colors.gray300);
            doc.text(line, currentX, currentY);
          }

          if (lineIndex < lines.length - 1) {
            currentY += fontSize * 0.4; // Line height
            currentX = x; // Reset to left margin for new lines
          } else {
            currentX += doc.getTextWidth(line);
          }
        });
      });

      return currentY + fontSize * 0.4;
    };

    // ==================== PAGE 1: COVER PAGE ====================
    // Dark background (exact homepage gray-900)
    doc.setFillColor(...colors.darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // IITA Header matching homepage
    doc.setTextColor(...colors.orange);
    doc.setFontSize(fonts.sectionTitle);
    doc.text('IITA', margin, 30);

    doc.setTextColor(...colors.gray300);
    doc.setFontSize(fonts.small);
    doc.text('International Institute of Tropical Agriculture', margin, 45);
    doc.text('Transforming African Agriculture', margin, 55);

    // Main title card (matching homepage card style)
    const titleCardY = 80;
    doc.setFillColor(...colors.cardBg);
    doc.roundedRect(margin, titleCardY, maxWidth, 120, 8, 8, 'F');

    // Solution title (matching homepage text-4xl font-bold)
    doc.setTextColor(...colors.white);
    doc.setFontSize(fonts.heroTitle);
    const solutionTitle = solution.solution_title || "Climate Smart Solution";
    const titleLines = doc.splitTextToSize(solutionTitle, maxWidth - 30);
    let yPos = titleCardY + 25;

    titleLines.forEach((line: string) => {
      doc.text(line, margin + 15, yPos);
      yPos += fonts.heroTitle + 5;
    });

    // Challenge tags (matching homepage styling)
    yPos += 10;
    doc.setTextColor(...colors.gray300);
    doc.setFontSize(fonts.body);
    const challenges = solution.applicable_challenges?.slice(0, 3).join(' • ') || 'Climate-Smart Agriculture';
    doc.text(challenges, margin + 15, yPos);

    // Geographic info with emoji
    yPos += 15;
    doc.setTextColor(...colors.orangeLight);
    doc.setFontSize(fonts.small);
    const countries = solution.applicable_countries?.join(', ') || 'Sub-Saharan Africa';
    doc.text(`Applicable regions: ${countries}`, margin + 15, yPos);

    // Bottom cards matching homepage layout
    const cardY = 220;
    const cardHeight = 35;

    // Climate score card
    if (solution.climate_potential) {
      doc.setFillColor(...colors.cardBg);
      doc.roundedRect(margin, cardY, 80, cardHeight, 6, 6, 'F');

      doc.setTextColor(...colors.gray400);
      doc.setFontSize(fonts.tiny);
      doc.text('Climate Score', margin + 8, cardY + 12);

      doc.setTextColor(...colors.orange);
      doc.setFontSize(fonts.cardTitle);
      doc.text(`${solution.climate_potential}/10`, margin + 8, cardY + 26);
    }

    // Agro-ecology card
    if (solution.key_agroeco?.length > 0) {
      const ecoCardX = margin + 90;
      doc.setFillColor(...colors.cardBg);
      doc.roundedRect(ecoCardX, cardY, maxWidth - 90, cardHeight, 6, 6, 'F');

      doc.setTextColor(...colors.gray400);
      doc.setFontSize(fonts.tiny);
      doc.text('Agro-ecological Zones', ecoCardX + 8, cardY + 12);

      doc.setTextColor(...colors.gray300);
      doc.setFontSize(fonts.tiny);
      const zones = solution.key_agroeco.slice(0, 2).join(', ');
      const zonesText = zones + (solution.key_agroeco.length > 2 ? ` +${solution.key_agroeco.length - 2}` : '');
      const zoneLines = doc.splitTextToSize(zonesText, maxWidth - 105);
      zoneLines.forEach((line: string, idx: number) => {
        doc.text(line, ecoCardX + 8, cardY + 20 + (idx * 6));
      });
    }

    // Footer
    doc.setTextColor(...colors.gray500);
    doc.setFontSize(fonts.tiny);
    doc.text(`Generated: ${new Date().toLocaleDateString()} • IITA Climate Solutions Platform`, margin, pageHeight - 15);

    // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
    doc.addPage();

    // Dark background
    doc.setFillColor(...colors.darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Page header
    doc.setTextColor(...colors.white);
    doc.setFontSize(fonts.sectionTitle);
    doc.text('Executive Summary', margin, 35);

    yPos = 60;

    // Executive summary card
    doc.setFillColor(...colors.cardBg);
    doc.roundedRect(margin, yPos, maxWidth, 120, 8, 8, 'F');

    const summaryText = solution.executive_summary_text || "This climate-smart agricultural solution addresses key challenges facing farmers across Sub-Saharan Africa.";

    // Use proper link rendering for summary
    yPos = renderTextWithLinks(summaryText, margin + 15, yPos + 15, maxWidth - 30, fonts.body);

    // Key metrics section with actual content (no page limits)
    yPos = 190; // Tighter spacing

    doc.setTextColor(...colors.orange);
    doc.setFontSize(fonts.cardTitle);
    doc.text('Key Impact Metrics', margin, yPos);

    yPos += 15; // Reduced gap

    // Climate Score Card (single wide card)
    if (solution.climate_potential) {
      doc.setFillColor(...colors.cardBg);
      doc.roundedRect(margin, yPos, maxWidth, 25, 6, 6, 'F');

      doc.setTextColor(...colors.gray400);
      doc.setFontSize(fonts.tiny);
      doc.text('Climate Adaptation Score', margin + 8, yPos + 10);

      doc.setTextColor(...colors.orange);
      doc.setFontSize(fonts.bulletTitle);
      doc.text(`${solution.climate_potential}/10`, margin + 8, yPos + 20);

      yPos += 35;
    }

    // Countries Card (show actual countries)
    if (solution.applicable_countries?.length > 0) {
      const countryHeight = Math.max(25, Math.min(40, solution.applicable_countries.length * 8 + 15));

      doc.setFillColor(...colors.cardBg);
      doc.roundedRect(margin, yPos, maxWidth, countryHeight, 6, 6, 'F');

      doc.setTextColor(...colors.orange);
      doc.setFontSize(fonts.small);
      doc.text('Applicable Countries', margin + 8, yPos + 12);

      doc.setTextColor(...colors.gray300);
      doc.setFontSize(fonts.tiny);
      const countriesText = solution.applicable_countries.join(', ');
      const countryLines = doc.splitTextToSize(countriesText, maxWidth - 16);

      let countryY = yPos + 20;
      countryLines.slice(0, 3).forEach((line: string) => { // Max 3 lines
        doc.text(line, margin + 8, countryY);
        countryY += 6;
      });

      yPos += countryHeight + 8;
    }

    // Challenges Card (show actual challenges)
    if (solution.applicable_challenges?.length > 0) {
      const challengeHeight = Math.max(25, Math.min(40, solution.applicable_challenges.length * 8 + 15));

      doc.setFillColor(...colors.cardBg);
      doc.roundedRect(margin, yPos, maxWidth, challengeHeight, 6, 6, 'F');

      doc.setTextColor(...colors.orange);
      doc.setFontSize(fonts.small);
      doc.text('Challenges Addressed', margin + 8, yPos + 12);

      doc.setTextColor(...colors.gray300);
      doc.setFontSize(fonts.tiny);
      const challengesText = solution.applicable_challenges.join(', ');
      const challengeLines = doc.splitTextToSize(challengesText, maxWidth - 16);

      let challengeY = yPos + 20;
      challengeLines.slice(0, 3).forEach((line: string) => {
        doc.text(line, margin + 8, challengeY);
        challengeY += 6;
      });

      yPos += challengeHeight + 8;
    }

    // Agro-ecological Zones Card
    if (solution.key_agroeco?.length > 0) {
      const zoneHeight = Math.max(25, Math.min(40, solution.key_agroeco.length * 8 + 15));

      doc.setFillColor(...colors.cardBg);
      doc.roundedRect(margin, yPos, maxWidth, zoneHeight, 6, 6, 'F');

      doc.setTextColor(...colors.orange);
      doc.setFontSize(fonts.small);
      doc.text('Agro-ecological Zones', margin + 8, yPos + 12);

      doc.setTextColor(...colors.gray300);
      doc.setFontSize(fonts.tiny);
      const zonesText = solution.key_agroeco.join(', ');
      const zoneLines = doc.splitTextToSize(zonesText, maxWidth - 16);

      let zoneY = yPos + 20;
      zoneLines.slice(0, 3).forEach((line: string) => {
        doc.text(line, margin + 8, zoneY);
        zoneY += 6;
      });

      yPos += zoneHeight + 8;
    }

    // ==================== PAGE 3: THE SOLUTION (HOMEPAGE STYLE) ====================
    doc.addPage();

    // Dark background
    doc.setFillColor(...colors.darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Main header matching homepage
    doc.setTextColor(...colors.white);
    doc.setFontSize(fonts.heroTitle);
    doc.text('The Solution:', margin, 35);

    doc.setTextColor(...colors.orange);
    doc.setFontSize(fonts.sectionTitle);
    const solutionHeaderText = solution.solution_title_field || "IITA's Climate Smart Package";
    doc.text(solutionHeaderText, margin, 55);

    yPos = 80;

    // Get solution bulletpoints exactly like homepage
    const solutionBullets = [
      solution.solution_bulletpoint_1,
      solution.solution_bulletpoint_2,
      solution.solution_bulletpoint_3,
      solution.solution_bulletpoint_4
    ].filter(Boolean);

    // Create numbered solution cards with dynamic sizing and better spacing
    solutionBullets.forEach((bullet: string, index: number) => {
      if (bullet) {
        // Split bullet into title and description (matching homepage logic)
        const sentences = bullet.split(/\.(?=\s)/);
        const title = sentences[0] + '.';
        const description = sentences.length > 1 ? sentences.slice(1).join('.') : '';

        // Calculate dynamic card height based on content
        const titleLines = doc.splitTextToSize(title, maxWidth - 50);
        const descLines = description.trim() ? doc.splitTextToSize(description, maxWidth - 50) : [];
        const cardHeight = Math.max(35, titleLines.length * 8 + descLines.length * 6 + 20);

        // Check for page overflow and add new page if needed
        if (yPos + cardHeight > pageHeight - 40) {
          doc.addPage();
          doc.setFillColor(...colors.darkBg);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          yPos = 30;
        }

        // Card background (matching homepage)
        doc.setFillColor(...colors.cardBg);
        doc.roundedRect(margin, yPos, maxWidth, cardHeight, 6, 6, 'F');

        // Numbered orange circle (exactly like homepage)
        doc.setFillColor(...colors.orange);
        doc.circle(margin + 16, yPos + 18, 7, 'F');

        // Circle number (white text)
        doc.setTextColor(...colors.white);
        doc.setFontSize(fonts.small);
        const numberX = margin + 16 - doc.getTextWidth((index + 1).toString()) / 2;
        doc.text((index + 1).toString(), numberX, yPos + 21);

        // Card title (matching homepage font-bold text-lg)
        doc.setTextColor(...colors.white);
        doc.setFontSize(fonts.bulletTitle);

        // Render title with links - tighter spacing
        let titleY = renderTextWithLinks(title, margin + 32, yPos + 12, maxWidth - 42, fonts.bulletTitle);

        // Card description if exists - closer to title
        if (description.trim()) {
          doc.setTextColor(...colors.gray300);
          doc.setFontSize(fonts.small);
          renderTextWithLinks(description, margin + 32, titleY + 3, maxWidth - 42, fonts.small);
        }

        yPos += cardHeight + 6; // Reduced space between cards
      }
    });

    // ==================== PAGE 4: RESOURCES & CONTACT ====================
    doc.addPage();

    // Dark background
    doc.setFillColor(...colors.darkBg);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Page header
    doc.setTextColor(...colors.white);
    doc.setFontSize(fonts.sectionTitle);
    doc.text('Resources & Contact', margin, 35);

    yPos = 60;

    // Resources sections matching homepage card style
    const resourceSections = [
      { title: 'Technical Guides', content: solution.resources_technicalguides },
      { title: 'Research Publications', content: solution.resources_researchpublications },
      { title: 'Digital Tools', content: solution.resources_digitaltools },
      { title: 'Training Materials', content: solution.resources_trainingmaterials }
    ];

    resourceSections.forEach((section, index) => {
      if (section.content) {
        // Calculate dynamic height based on content
        const contentLines = doc.splitTextToSize(section.content, maxWidth - 25);
        const cardHeight = Math.max(30, contentLines.length * 6 + 20);

        // Check for page overflow
        if (yPos + cardHeight > pageHeight - 100) {
          doc.addPage();
          doc.setFillColor(...colors.darkBg);
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          yPos = 30;
        }

        // Resource card with orange accent
        doc.setFillColor(...colors.cardBg);
        doc.roundedRect(margin, yPos, maxWidth, cardHeight, 4, 4, 'F');

        // Orange accent line
        doc.setFillColor(...colors.orange);
        doc.rect(margin, yPos, 3, cardHeight, 'F');

        // Section title
        doc.setTextColor(...colors.orange);
        doc.setFontSize(fonts.small);
        doc.text(section.title, margin + 12, yPos + 12);

        // Section content with proper link rendering
        doc.setTextColor(...colors.gray300);
        renderTextWithLinks(section.content, margin + 12, yPos + 20, maxWidth - 20, fonts.tiny);

        yPos += cardHeight + 5; // Tighter spacing
      }
    });

    // Our Impact section with dynamic sizing
    if (solution.impact_text) {
      const impactLines = doc.splitTextToSize(solution.impact_text, maxWidth - 20);
      const impactHeight = Math.max(35, impactLines.length * 6 + 15);

      // Check for page overflow
      if (yPos + impactHeight + 25 > pageHeight - 90) {
        doc.addPage();
        doc.setFillColor(...colors.darkBg);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        yPos = 30;
      }

      doc.setTextColor(...colors.orange);
      doc.setFontSize(fonts.small);
      doc.text('Our Impact', margin, yPos);

      yPos += 12;
      doc.setFillColor(...colors.cardBg);
      doc.roundedRect(margin, yPos, maxWidth, impactHeight, 4, 4, 'F');

      doc.setTextColor(...colors.gray300);
      renderTextWithLinks(solution.impact_text, margin + 8, yPos + 12, maxWidth - 16, fonts.tiny);

      yPos += impactHeight + 8;
    }

    // Contact information (matching homepage footer style)
    const contactY = pageHeight - 90;
    doc.setFillColor(...colors.cardBg);
    doc.roundedRect(margin, contactY, maxWidth, 75, 8, 8, 'F');

    // Orange accent
    doc.setFillColor(...colors.orange);
    doc.rect(margin, contactY, 4, 75, 'F');

    doc.setTextColor(...colors.orange);
    doc.setFontSize(fonts.cardTitle);
    doc.text('Contact IITA', margin + 15, contactY + 20);

    doc.setTextColor(...colors.gray300);
    doc.setFontSize(fonts.small);
    const contactInfo = [
      'International Institute of Tropical Agriculture',
      'Email: iita@cgiar.org • Website: www.iita.org',
      'Transforming African Agriculture since 1967',
      'Multiple research stations across Sub-Saharan Africa'
    ];

    let contactTextY = contactY + 35;
    contactInfo.forEach(info => {
      doc.text(info, margin + 15, contactTextY);
      contactTextY += 8;
    });

    // Save the PDF
    const fileName = `IITA_Climate_Smart_${(solution.solution_title || 'Solution').replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  // Web-to-PDF approach using browser's print functionality
  const generateWebPDF = async (solution: any) => {
    if (!solution) return;

    // Create a new window/tab with print-optimized content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for PDF generation');
      return;
    }

    // Generate print-friendly HTML with all the styling
    const printHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${solution.solution_title || 'IITA Climate Solution'}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0f0f0f;
            color: white;
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-size: 16px;
        }

        @media print {
            body { -webkit-print-color-adjust: exact; }
            .page-break { page-break-before: always; }
            .orange-header { margin: 0 -20px 40px -20px; }
            @page {
                margin: 0.75in;
                size: letter;
            }
        }

        .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 60px; }
        .hero-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 20px;
            position: relative;
        }
        .hero-title .brand {
            font-family: 'Permanent Marker', cursive;
            color: #f97316;
        }
        .hero-subtitle { font-size: 1.5rem; color: #f97316; margin-bottom: 10px; }

        /* Orange header bar like Figma */
        .orange-header {
            background: #f97316;
            color: white;
            padding: 15px 40px;
            margin: -40px -20px 40px -20px;
            font-size: 1.1rem;
            font-weight: 600;
        }
        .summary-card { background: #1f1f1f; padding: 30px; border-radius: 12px; margin: 40px 0; border: 1px solid #333; }
        .summary-text { font-size: 1.1rem; color: #d1d5db; }

        .metrics-section { margin: 40px 0; }
        .section-title { color: #f97316; font-size: 1.5rem; font-weight: bold; margin-bottom: 20px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }
        .metric-card { background: #1f1f1f; padding: 20px; border-radius: 8px; border: 1px solid #333; }
        .metric-title { color: #f97316; font-weight: 600; margin-bottom: 8px; }
        .metric-value { color: #d1d5db; font-size: 0.9rem; }

        .solution-section { margin: 60px 0; }
        .solution-cards { display: flex; flex-direction: column; gap: 12px; }
        .solution-card { background: #1f1f1f; padding: 20px; border-radius: 8px; display: flex; align-items: flex-start; gap: 20px; border: 1px solid #333; }
        .solution-number { background: #f97316; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
        .solution-content { flex: 1; }
        .solution-title { font-weight: bold; font-size: 1.1rem; margin-bottom: 5px; }
        .solution-description { color: #d1d5db; font-size: 0.95rem; }

        .resources-section { margin: 60px 0; }
        .resource-card { background: #1f1f1f; padding: 20px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #f97316; border: 1px solid #333; }
        .resource-title { color: #f97316; font-weight: 600; margin-bottom: 10px; }
        .resource-content { color: #d1d5db; font-size: 0.9rem; }

        .contact-section { background: #1f1f1f; padding: 30px; border-radius: 12px; margin-top: 60px; text-align: center; border: 1px solid #333; }
        .contact-title { color: #f97316; font-size: 1.5rem; font-weight: bold; margin-bottom: 15px; }
        .contact-text { color: #d1d5db; font-size: 1rem; }

        a { color: #f97316; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="orange-header">
            IITA - International Institute of Tropical Agriculture
        </div>

        <div class="header">
            <h1 class="hero-title">
                <span class="brand">IITA</span> Climate Solutions
            </h1>
            <h2 class="hero-subtitle">${solution.solution_title || 'Climate-Smart Agricultural Solution'}</h2>
            <p style="color: #9ca3af;">Transforming African Agriculture Through Innovation</p>
        </div>

        <div class="summary-card">
            <p class="summary-text">${solution.executive_summary_text || 'This climate-smart agricultural solution addresses key challenges facing farmers across Sub-Saharan Africa.'}</p>
        </div>

        <div class="metrics-section">
            <h3 class="section-title">Key Impact Metrics</h3>
            <div class="metrics-grid">
                ${solution.climate_potential ? `
                <div class="metric-card">
                    <div class="metric-title">Climate Adaptation Score</div>
                    <div class="metric-value">${solution.climate_potential}/10</div>
                </div>` : ''}

                ${solution.applicable_countries?.length ? `
                <div class="metric-card">
                    <div class="metric-title">Applicable Countries</div>
                    <div class="metric-value">${solution.applicable_countries.join(', ')}</div>
                </div>` : ''}

                ${solution.applicable_challenges?.length ? `
                <div class="metric-card">
                    <div class="metric-title">Challenges Addressed</div>
                    <div class="metric-value">${solution.applicable_challenges.join(', ')}</div>
                </div>` : ''}

                ${solution.key_agroeco?.length ? `
                <div class="metric-card">
                    <div class="metric-title">Agro-ecological Zones</div>
                    <div class="metric-value">${solution.key_agroeco.join(', ')}</div>
                </div>` : ''}
            </div>
        </div>

        <div class="page-break"></div>

        <div class="solution-section">
            <h3 class="section-title">The Solution: ${solution.solution_title_field || "IITA's Climate Smart Package"}</h3>
            <div class="solution-cards">
                ${[
                  solution.solution_bulletpoint_1,
                  solution.solution_bulletpoint_2,
                  solution.solution_bulletpoint_3,
                  solution.solution_bulletpoint_4
                ].filter(Boolean).map((bullet, index) => {
                  const sentences = bullet.split(/\.(?=\s)/);
                  const title = sentences[0] + '.';
                  const description = sentences.length > 1 ? sentences.slice(1).join('.') : '';
                  return `
                    <div class="solution-card">
                        <div class="solution-number">${index + 1}</div>
                        <div class="solution-content">
                            <div class="solution-title">${title}</div>
                            ${description ? `<div class="solution-description">${description}</div>` : ''}
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>

        <div class="resources-section">
            <h3 class="section-title">Resources & Evidence</h3>
            ${solution.resources_technicalguides ? `
            <div class="resource-card">
                <div class="resource-title">Technical Guides</div>
                <div class="resource-content">${solution.resources_technicalguides}</div>
            </div>` : ''}

            ${solution.resources_researchpublications ? `
            <div class="resource-card">
                <div class="resource-title">Research Publications</div>
                <div class="resource-content">${solution.resources_researchpublications}</div>
            </div>` : ''}

            ${solution.resources_digitaltools ? `
            <div class="resource-card">
                <div class="resource-title">Digital Tools</div>
                <div class="resource-content">${solution.resources_digitaltools}</div>
            </div>` : ''}

            ${solution.resources_trainingmaterials ? `
            <div class="resource-card">
                <div class="resource-title">Training Materials</div>
                <div class="resource-content">${solution.resources_trainingmaterials}</div>
            </div>` : ''}

            ${solution.impact_text ? `
            <div class="resource-card">
                <div class="resource-title">Our Impact</div>
                <div class="resource-content">${solution.impact_text}</div>
            </div>` : ''}
        </div>

        <div class="page-break"></div>

        <div class="resources-section">
            <h3 class="section-title">Our Knowledge Bank</h3>
            <div class="resource-card">
                <div class="resource-content">
                    Access IITA's extensive research library and technical resources developed over 50+ years of agricultural innovation in Africa. Our knowledge bank provides evidence-based solutions and practical guidance for climate-smart agriculture.
                </div>
            </div>

            <div class="resource-card">
                <div class="resource-title">Available Resources & Publications</div>
                <div class="resource-content">
                    <strong style="color: #f97316;">• Technical Guides:</strong><br>
                    &nbsp;&nbsp;- Climate-Smart Agriculture Implementation Manual<br>
                    &nbsp;&nbsp;- Integrated Pest Management Guidelines<br>
                    &nbsp;&nbsp;- Soil Health Assessment Protocols<br>
                    &nbsp;&nbsp;- Seed System Development Guides<br><br>

                    <strong style="color: #f97316;">• Digital Tools:</strong><br>
                    &nbsp;&nbsp;- Climate Monitoring Systems<br>
                    &nbsp;&nbsp;- Yield Prediction Models<br>
                    &nbsp;&nbsp;- Weather Information Platforms<br>
                    &nbsp;&nbsp;- Market Price Tracking Tools<br><br>

                    <strong style="color: #f97316;">• Research Publications:</strong><br>
                    &nbsp;&nbsp;- 500+ Peer-reviewed Journal Articles<br>
                    &nbsp;&nbsp;- Annual Research Reports (1967-2024)<br>
                    &nbsp;&nbsp;- Crop Variety Development Papers<br>
                    &nbsp;&nbsp;- Climate Adaptation Case Studies<br><br>

                    <strong style="color: #f97316;">• Training Materials:</strong><br>
                    &nbsp;&nbsp;- Farmer Field School Curricula<br>
                    &nbsp;&nbsp;- Extension Agent Training Modules<br>
                    &nbsp;&nbsp;- Video Learning Resources<br>
                    &nbsp;&nbsp;- Multi-language Extension Materials<br><br>

                    <small style="color: #9ca3af;">
                        Access: Most resources available through IITA Library<br>
                        Contact: library@iita.org • Digital Repository: publications.iita.org
                    </small>
                </div>
            </div>
        </div>

        <div class="contact-section">
            <div class="contact-title">Contact IITA</div>
            <div class="contact-text">
                Email: <a href="mailto:j.choptiany@cgiar.org">j.choptiany@cgiar.org</a><br>
                Website: <a href="https://www.iita.org">www.iita.org</a><br>
                Address: PMB 5320, Oyo Road, Ibadan 200001, Oyo State, Nigeria<br><br>
                <small style="color: #9ca3af; font-size: 0.8rem;">
                    Generated by IITA Climate Solutions Platform
                </small>
            </div>
        </div>
    </div>
</body>
</html>`;

    // Write the HTML to the new window
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        // Close the window after printing or if user cancels
        setTimeout(() => printWindow.close(), 1000);
      }, 500);
    };
  };

  const handleShare = async (
    type: "pdf" | "webpdf" | "email" | "contact" | "faq",
  ) => {
    switch (type) {
      case "pdf":
        generatePDF(selectedSolution);
        break;
      case "webpdf":
        await generateWebPDF(selectedSolution);
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