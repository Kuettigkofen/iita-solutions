import React from 'react';
import { motion } from 'framer-motion';
import { Share, FileText, Mail, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SolutionImage {
  id?: string;
  solution_id?: string;
  image_type: string;
  image_url: string;
}

interface Solution {
  id: string;
  solution_title: string;
  applicable_countries: string[];
  applicable_challenges: string[];
  climate_potential: number;
  key_agroeco: string[];
  executive_summary_text: string;
  problem_title: string;
  problem_bulletpoint_1: string;
  problem_bulletpoint_2: string;
  problem_bulletpoint_3: string;
  problem_bulletpoint_4?: string;
  solution_title_field: string;
  solution_bulletpoint_1: string;
  solution_bulletpoint_2: string;
  solution_bulletpoint_3: string;
  solution_bulletpoint_4?: string;
  resources_technicalguides: string;
  resources_researchpublications: string;
  resources_digitaltools: string;
  resources_trainingmaterials: string;
  impact_text: string;
  funder_text: string;
  policymaker_text: string;
  farmer_text: string;
  student_text: string;
  extensionofficer_text: string;
  researcher_text: string;
  devpractitioner_text: string;
  businessowner_text: string;
  funder_summarysentence?: string;
  policymaker_summarysentence?: string;
  farmer_summarysentence?: string;
  student_summarysentence?: string;
  extensionofficer_summarysentence?: string;
  researcher_summarysentence?: string;
  devpractitioner_summarysentence?: string;
  businessowner_summarysentence?: string;
  solution_images?: SolutionImage[];
  // Backward compatibility fields
  title?: string;
  summary?: string;
  problem?: string;
  solution?: string;
  partnership?: string;
  image?: string;
}

interface SolutionDetailProps {
  solution: Solution;
  onShare: (type: 'pdf' | 'email' | 'contact' | 'faq') => void;
  userRole?: string;
}

export function SolutionDetail({ solution, onShare, userRole }: SolutionDetailProps) {
  // Map user roles to the corresponding summary field names
  const getRoleSpecificSummary = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'funder': solution.funder_summarysentence || '',
      'policymaker': solution.policymaker_summarysentence || '',
      'farmer': solution.farmer_summarysentence || '',
      'student': solution.student_summarysentence || '',
      'government extension officer': solution.extensionofficer_summarysentence || '',
      'researcher': solution.researcher_summarysentence || '',
      'development practitioner': solution.devpractitioner_summarysentence || '',
      'business owner': solution.businessowner_summarysentence || ''
    };

    return roleMap[role?.toLowerCase()] || '';
  };

  // Get title image from solution_images
  const getTitleImage = () => {
    const titleImage = solution.solution_images?.find(img => img.image_type === 'title_image');
    return titleImage?.image_url || solution.image || 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&h=400&fit=crop&crop=center';
  };

  // Get problem image from solution_images
  const getProblemImage = () => {
    const problemImage = solution.solution_images?.find(img => img.image_type === 'problem_image');
    return problemImage?.image_url || 'https://images.unsplash.com/photo-1714102367897-4a19259feb75?w=600&h=400&fit=crop&crop=center';
  };

  // Get solution image from solution_images
  const getSolutionImage = () => {
    const solutionImage = solution.solution_images?.find(img => img.image_type === 'solution_image');
    return solutionImage?.image_url || 'https://images.unsplash.com/photo-1744726010540-bf318d4a691f?w=600&h=400&fit=crop&crop=center';
  };

  // Get solution bulletpoints from database
  const getSolutionBulletpoints = () => {
    const bulletpoints = [
      solution.solution_bulletpoint_1,
      solution.solution_bulletpoint_2,
      solution.solution_bulletpoint_3,
      solution.solution_bulletpoint_4
    ].filter(Boolean);

    return bulletpoints.map((point, index) => {
      // Split by first sentence ending (. followed by space and capital letter)
      const sentences = point.split(/\.(?=\s[A-Z])/);
      const title = sentences[0] + (sentences.length > 1 ? '' : ''); // First sentence as title
      const description = sentences.length > 1 ? sentences.slice(1).join('.') : ''; // Rest as description

      return {
        title: title,
        description: description
      };
    });
  };

  // Parse resources from database fields
  const parseResources = (resourceString: string): string[] => {
    if (!resourceString) return [];
    // Handle both comma-separated strings and markdown links
    return resourceString.split(',').map(item => item.trim()).filter(Boolean);
  };

  // Get resource items from database fields
  const getResourceItems = (resourceType: string) => {
    const resourceMap: { [key: string]: string } = {
      'technicalguides': solution.resources_technicalguides || '',
      'researchpublications': solution.resources_researchpublications || '',
      'digitaltools': solution.resources_digitaltools || '',
      'trainingmaterials': solution.resources_trainingmaterials || ''
    };

    return parseResources(resourceMap[resourceType]);
  };

  // Get role-specific text from database
  const getRoleSpecificText = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'funder': solution.funder_text || '',
      'policymaker': solution.policymaker_text || '',
      'farmer': solution.farmer_text || '',
      'student': solution.student_text || '',
      'government extension officer': solution.extensionofficer_text || '',
      'researcher': solution.researcher_text || '',
      'development practitioner': solution.devpractitioner_text || '',
      'business owner': solution.businessowner_text || ''
    };

    return roleMap[role?.toLowerCase()] || '';
  };

  // Get impact highlights text from database
  const getImpactText = () => {
    return solution.impact_text || '';
  };

  // Get executive summary with role-specific content embedded and highlighted
  const getExecutiveSummaryWithRole = () => {
    const baseSummary = solution.executive_summary_text || solution.summary || '';
    const roleSpecificSummary = userRole ? getRoleSpecificSummary(userRole) : '';

    if (roleSpecificSummary && baseSummary.includes('[Role-specific relevance placeholder.]')) {
      const highlightedSummary = `<span class="bg-orange-500/20 text-orange-100 px-2 py-0.5 rounded">${roleSpecificSummary}</span>`;
      return baseSummary.replace('[Role-specific relevance placeholder.]', highlightedSummary);
    }

    // If no placeholder found but we have role-specific content, append it with highlighting
    if (roleSpecificSummary && baseSummary) {
      const highlightedSummary = `<span class="bg-orange-500/20 text-orange-100 px-2 py-0.5 rounded">${roleSpecificSummary}</span>`;
      return `${baseSummary} ${highlightedSummary}`;
    }

    return baseSummary;
  };

  // Get problem bulletpoints from database
  const getProblemBulletpoints = () => {
    return [
      solution.problem_bulletpoint_1,
      solution.problem_bulletpoint_2,
      solution.problem_bulletpoint_3,
      solution.problem_bulletpoint_4
    ].filter(Boolean);
  };

  // Parse markdown links
  const parseMarkdownLinks = (text: string) => {
    if (!text) return [];

    return text.split(/(\[.*?\]\(.*?\))/).map((part, index) => {
      const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-400 underline transition-colors"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop&crop=center';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl mx-auto space-y-8"
    >
      {/* Hero Section */}
      <section className="relative">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {solution.applicable_countries.slice(0, 3).map((country) => (
                <span key={country} className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm">
                  {country}
                </span>
              ))}
              {solution.applicable_countries.length > 3 && (
                <span className="text-orange-400 text-sm">+{solution.applicable_countries.length - 3} more</span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl text-white font-bold mb-4 leading-tight">
              {solution.solution_title || solution.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-sm">Climate Score: </span>
                <span className="text-orange-500 font-bold">{solution.climate_potential}/10</span>
              </div>

              <div className="bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-gray-400 text-sm">Agro-ecology: </span>
                <span className="text-gray-300 text-sm">
                  {solution.key_agroeco?.slice(0, 2).join(', ') || 'Multiple zones'}
                  {solution.key_agroeco?.length > 2 && ` +${solution.key_agroeco.length - 2}`}
                </span>
              </div>
            </div>

            <p
              className="text-gray-300 text-lg leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: getExecutiveSummaryWithRole() }}
            ></p>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
              <img
                src={getTitleImage()}
                alt={solution.solution_title || solution.title}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="flex-1">
            <h2 className="text-4xl lg:text-5xl text-white font-bold mb-8 leading-tight">
              The Problem: <br />
              <span className="text-orange-500">{solution.problem_title || 'Climate Challenges & Low Productivity'}</span>
            </h2>

            <div className="space-y-6">
              {getProblemBulletpoints().map((point, index) => (
                <div key={index} className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform"></div>
                  <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                    {parseMarkdownLinks(point)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-80 xl:w-96">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src={getProblemImage()}
                alt="Agricultural challenges"
                onError={handleImageError}
                className="w-full h-64 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full translate-y-12 -translate-x-12"></div>
      </section>

      {/* Solution Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="lg:w-80 xl:w-96">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src={getSolutionImage()}
                alt="IITA Climate Smart Solutions"
                onError={handleImageError}
                className="w-full h-64 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-4xl lg:text-5xl text-white font-bold mb-2 leading-tight">
              The Solution:
            </h2>
            <h3 className="text-3xl lg:text-4xl text-orange-500 font-bold mb-8 leading-tight">
              {solution.solution_title_field || "IITA's Climate Smart Package"}
            </h3>

            <div className="space-y-6">
              {getSolutionBulletpoints().map((bulletpoint, index) => (
                <div key={index} className="group hover:bg-white/5 p-4 rounded-lg transition-all duration-300">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg group-hover:text-orange-500 transition-colors mb-2">
                        {parseMarkdownLinks(bulletpoint.title)}
                      </h4>
                      {bulletpoint.description && (
                        <p className="text-gray-300 leading-relaxed">
                          {parseMarkdownLinks(bulletpoint.description)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 -translate-x-16"></div>
      </section>

      {/* Role-Specific Content */}
      {userRole && getRoleSpecificText(userRole) && (
        <section className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl text-orange-500 mb-4 font-bold">
            Insights for {userRole}
          </h2>
          <div className="bg-black/30 rounded-lg p-6">
            <div className="space-y-4">
              {getRoleSpecificText(userRole).split(/\.(?=\s[A-Z]|$)/).filter(sentence => sentence.trim()).map((sentence, index) => (
                <div key={index} className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform"></div>
                  <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                    {parseMarkdownLinks(sentence.trim() + (sentence.trim().endsWith('.') ? '' : '.'))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Knowledge Bank Section */}
      <section className="bg-gray-900 rounded-lg p-8">
        <h2 className="text-2xl text-white mb-4 font-bold">Our Knowledge Bank</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Access IITA's extensive research library and technical resources developed over 50+ years of agricultural innovation in Africa. Our knowledge bank provides evidence-based solutions and practical guidance for climate-smart agriculture.
        </p>

        {/* Knowledge Resources */}
        <div className="bg-black/30 rounded-lg p-6">
          <h3 className="text-orange-500 mb-4 text-xl font-bold">Available Resources & Publications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-gray-300">
                <p className="mb-2"><span className="text-orange-500 font-bold">Technical Guides:</span></p>
                <ul className="space-y-1 text-sm pl-4">
                  {getResourceItems('technicalguides').map((item, index) => (
                    <li key={index}>• {parseMarkdownLinks(item)}</li>
                  ))}
                </ul>
              </div>

              <div className="text-gray-300">
                <p className="mb-2"><span className="text-orange-500 font-bold">Digital Tools:</span></p>
                <ul className="space-y-1 text-sm pl-4">
                  {getResourceItems('digitaltools').map((item, index) => (
                    <li key={index}>• {parseMarkdownLinks(item)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-gray-300">
                <p className="mb-2"><span className="text-orange-500 font-bold">Research Publications:</span></p>
                <ul className="space-y-1 text-sm pl-4">
                  {getResourceItems('researchpublications').map((item, index) => (
                    <li key={index}>• {parseMarkdownLinks(item)}</li>
                  ))}
                </ul>
              </div>

              <div className="text-gray-300">
                <p className="mb-2"><span className="text-orange-500 font-bold">Training Materials:</span></p>
                <ul className="space-y-1 text-sm pl-4">
                  {getResourceItems('trainingmaterials').map((item, index) => (
                    <li key={index}>• {parseMarkdownLinks(item)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-600">
            <p className="text-gray-400 text-sm">
              <span className="text-orange-500">Access:</span> Most resources available through IITA Library • Contact: library@iita.org • Digital Repository: publications.iita.org
            </p>
          </div>
        </div>
      </section>

      {/* Our Impact Section */}
      {getImpactText() && (
        <section className="bg-gray-900 rounded-lg p-8">
          <h2 className="text-3xl mb-6 font-bold">
            <span className="text-white">Our </span><span className="text-orange-500" style={{ fontFamily: 'var(--font-permanent-marker)' }}>Impact</span>
          </h2>
          <div className="bg-black/30 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getImpactText().split(/\.\s+/).filter(sentence => sentence.trim()).map((sentence, index) => (
                <div key={index} className="flex items-start gap-3 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform"></div>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                    {parseMarkdownLinks(sentence.trim() + (sentence.trim().endsWith('.') ? '' : '.'))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partnership Section */}
      <section className="bg-gray-900 rounded-lg p-8">
        <h2 className="text-2xl text-white mb-4 font-bold">Let's Collaborate</h2>

        <p className="text-gray-300 leading-relaxed mb-6">
          {solution.partnership || "We are seeking partnerships with development organizations, private sector actors, and government agencies to scale this solution. Partners can support farmer training programs, provide access to improved technologies, or invest in scaling infrastructure."}
        </p>

        {/* Contact Information */}
        <div className="bg-black/30 rounded-lg p-6">
          <h3 className="text-orange-500 mb-4 text-xl font-bold">Ready to Partner with IITA?</h3>
          <div className="space-y-2 text-gray-300">
            <p><span className="text-orange-500">Email:</span> partnerships@iita.org</p>
            <p><span className="text-orange-500">Phone:</span> +234 2 7517472</p>
            <p><span className="text-orange-500">Address:</span> PMB 5320, Oyo Road, Ibadan, Nigeria</p>
          </div>
        </div>
      </section>

      {/* Sharing Options */}
      <section className="text-center">
        <h3 className="text-2xl text-white mb-6 font-bold">Share This Solution</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => onShare('pdf')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate PDF
          </Button>

          <Button
            onClick={() => onShare('email')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Button
            onClick={() => onShare('contact')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact IITA
          </Button>

          <Button
            onClick={() => onShare('faq')}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            FAQ
          </Button>
        </div>
      </section>
    </motion.div>
  );
}