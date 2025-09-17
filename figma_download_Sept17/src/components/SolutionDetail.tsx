import React from 'react';
import { motion } from 'motion/react';
import { Share, FileText, Mail, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

interface SolutionImage {
  id: string;
  solution_id: string;
  image_type: string;
  image_url: string;
}

interface Solution {
  id: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  partnership: string;
  image: string;
  problem_title: string;
  problem_bulletpoint_1: string;
  problem_bulletpoint_2: string;
  problem_bulletpoint_3: string;
  problem_bulletpoint_4?: string;
  solution_images?: SolutionImage[];
  solution_title_field: string;
  solutions_bulletpoint_1: string;
  solutions_bulletpoint_2: string;
  solutions_bulletpoint_3: string;
  solutions_bulletpoint_4?: string;
  resources_technicalguides: string;
  resources_researchpublications: string;
  resources_digitaltools: string;
  resources_trainingmaterials: string;
  funder_text: string;
  policymaker_text: string;
  farmer_text: string;
  student_text: string;
  extensionofficer_text: string;
  researcher_text: string;
  devpractitioner_text: string;
  businessowner_text: string;
  impact_text: string;
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
      'funder': 'funder_summarysentence',
      'policymaker': 'policymaker_summarysentence', 
      'farmer': 'farmer_summarysentence',
      'student': 'student_summarysentence',
      'government extension officer': 'extensionofficer_summarysentence',
      'researcher': 'researcher_summarysentence',
      'development practitioner': 'devpractitioner_summarysentence',
      'business owner': 'businessowner_summarysentence'
    };
    
    const fieldName = roleMap[role?.toLowerCase()];
    return fieldName ? solution[fieldName as keyof Solution] : '';
  };

  // Get problem image from solution_images
  const getProblemImage = () => {
    // For now, keeping sample image for navigation. In production, this will use:
    // const problemImage = solution.solution_images?.find(img => img.image_type === 'problem_image');
    // return problemImage?.image_url || 'https://images.unsplash.com/photo-1714102367897-4a19259feb75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwY29jb2ElMjBwb2RzJTIwZmFybWluZyUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc1Nzk2OTU1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    
    // Sample image for navigation
    return 'https://images.unsplash.com/photo-1714102367897-4a19259feb75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwY29jb2ElMjBwb2RzJTIwZmFybWluZyUyMGFncmljdWx0dXJlfGVufDF8fHx8MTc1Nzk2OTU1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  };

  // Get solution image from solution_images
  const getSolutionImage = () => {
    // For now, keeping sample image for navigation. In production, this will use:
    // const solutionImage = solution.solution_images?.find(img => img.image_type === 'solution_image');
    // return solutionImage?.image_url || 'https://images.unsplash.com/photo-1744726010540-bf318d4a691f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYWdyaWN1bHR1cmUlMjB0ZWNobm9sb2d5JTIwZmFybWluZyUyMHNtYXJ0JTIwc29sdXRpb25zfGVufDF8fHx8MTc1Nzk2OTc0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
    
    // Sample image for navigation
    return 'https://images.unsplash.com/photo-1744726010540-bf318d4a691f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYWdyaWN1bHR1cmUlMjB0ZWNobm9sb2d5JTIwZmFybWluZyUyMHNtYXJ0JTIwc29sdXRpb25zfGVufDF8fHx8MTc1Nzk2OTc0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';
  };

  // Get solution bulletpoints from Supabase
  const getSolutionBulletpoints = () => {
    // For now, keeping sample content for navigation. In production, this will use:
    // return [
    //   solution.solutions_bulletpoint_1,
    //   solution.solutions_bulletpoint_2,
    //   solution.solutions_bulletpoint_3,
    //   solution.solutions_bulletpoint_4
    // ].filter(Boolean);
    
    // Sample data for navigation
    return [
      {
        title: "Advanced Seed Technologies",
        items: [
          "Advanced seed brokerage systems developed by IITA ensures that quality seeds are being delivered to farmers",
          "For example, IITA has contributed significantly in research to improve the cocoa seed delivery system in Ghana"
        ]
      },
      {
        title: "Agronomic Innovations", 
        items: [
          "Evidence-based Agroforestry and Intercropping Technologies",
          "A technical guide developed by IITA cocoa scientists on agroforestry and intercropping implementation",
          "Intercropping technologies with ground crops like cassava to increase soil health"
        ]
      },
      {
        title: "Digital Tools for Implementation and Management",
        items: [
          "Stepwise CanDataLator App: The Canopy Cover Calculator for Cocoa",
          "Cocoa Rehabilitation and Establishment Advisory Model (CREAM)"
        ]
      },
      {
        title: "A Team of Experts",
        items: [
          "Dr. Richard Asare has been researching cocoa agroforestry systems for 25 years and provides technical support for technologies for implementation",
          "Dr. Leonard Rusinamhodzi is leading the CocoaSoils project advancing sustainable intensification across West Africa"
        ]
      }
    ];
  };

  // Get resource items from Supabase fields
  const getResourceItems = (resourceType: string) => {
    // For now, keeping sample content for navigation. In production, this will parse:
    // solution[`resources_${resourceType}`] or return sample content
    
    // Sample data for navigation
    const sampleResources = {
      technicalguides: [
        "Cocoa Agroforestry Implementation Manual",
        "Climate-Smart Agriculture Handbook",
        "Integrated Pest Management Guidelines",
        "Soil Health Assessment Protocols"
      ],
      researchpublications: [
        "500+ Peer-reviewed Journal Articles",
        "Annual Research Reports (1967-2024)",
        "Crop Variety Development Papers",
        "Climate Adaptation Case Studies"
      ],
      digitaltools: [
        "CanDataLator App (Canopy Cover Calculator)",
        "CREAM Model (Cocoa Rehabilitation)",
        "Weather Information Systems",
        "Market Price Platforms"
      ],
      trainingmaterials: [
        "Farmer Field School Curricula",
        "Extension Agent Training Modules",
        "Video Learning Resources",
        "Multi-language Extension Materials"
      ]
    };
    
    return sampleResources[resourceType] || [];
  };

  // Get role-specific text from Supabase
  const getRoleSpecificText = (role: string) => {
    // For now, keeping sample content for navigation. In production, this will use:
    // const roleMap = {
    //   'funder': solution.funder_text,
    //   'policymaker': solution.policymaker_text,
    //   'farmer': solution.farmer_text,
    //   'student': solution.student_text,
    //   'government extension officer': solution.extensionofficer_text,
    //   'researcher': solution.researcher_text,
    //   'development practitioner': solution.devpractitioner_text,
    //   'business owner': solution.businessowner_text
    // };
    // return roleMap[role?.toLowerCase()] || '';
    
    // Sample text for navigation
    return "This breakthrough offers [1:300 multiplication rate](https://e-catalogs.taat-africa.org/com/technologies/leaf-bud-cuttings-rapid-yam-multiplication-method) making it exceptionally attractive for climate adaptation investments. With [9/9 idea maturity](https://e-catalogs.taat-africa.org/com/technologies/leaf-bud-cuttings-rapid-yam-multiplication-method), this represents mature technology ready for large-scale investment. [IITA leadership](https://cgspace.cgiar.org/collections/e6b5719e-7637-40d5-affc-99ce76cca0bc) provides strong institutional backing.";
  };

  // Get impact highlights text from Supabase
  const getImpactText = () => {
    // For now, keeping sample content for navigation. In production, this will use:
    // return solution.impact_text || '';
    
    // Sample text for navigation
    return "[Market-driven seed system development](https://e-catalogs.taat-africa.org/com/technologies/smart-marketing-strategies-for-climate-resilient-seed-systems) across 6 countries. [Scaling readiness 8/9, 8/9](https://e-catalogs.taat-africa.org/com/technologies/smart-marketing-strategies-for-climate-resilient-seed-systems). Enhanced climate variety adoption through effective marketing.";
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      {/* Title Section */}
      <div className="text-center">
        <h1 className="text-4xl text-[rgba(255,255,255,1)] mb-4 text-[48px] font-bold">{solution.title}</h1>
        <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
      </div>

      {/* Hero Image */}
      <div className="rounded-lg overflow-hidden">
        <img 
          src={solution.image} 
          alt={solution.title}
          className="w-full h-64 md:h-80 object-cover"
        />
      </div>

      {/* Summary Section */}
      <section className="bg-gray-900 rounded-lg p-8">
        <h2 className="text-2xl text-[rgba(255,255,255,1)] mb-4 text-[48px] font-bold">Summary</h2>
        <p className="text-gray-300 leading-relaxed">
          {/* For now, keeping sample text for navigation. In production, this will show: */}
          {/* {[solution.executive_summary_text, getRoleSpecificSummary(userRole || '')].filter(Boolean).join(' ')} */}
          {solution.summary}
        </p>
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
              {(() => {
                // For now, keeping sample text for navigation. In production, this will use:
                // const bulletpoints = [
                //   solution.problem_bulletpoint_1,
                //   solution.problem_bulletpoint_2, 
                //   solution.problem_bulletpoint_3,
                //   solution.problem_bulletpoint_4
                // ].filter(Boolean);
                
                // Sample data for navigation
                const bulletpoints = solution.problem.split('.').filter(sentence => sentence.trim());
                
                return bulletpoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform"></div>
                    <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                      {point.trim()}.
                    </p>
                  </div>
                ));
              })()}
            </div>
          </div>
          
          <div className="lg:w-80 xl:w-96">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={getProblemImage()}
                alt="African agricultural challenges"
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

      {/* Knowledge Bank Section */}
      

      {/* Solution Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          <div className="lg:w-80 xl:w-96">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={getSolutionImage()}
                alt="IITA Climate Smart Solutions"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getSolutionBulletpoints().map((bulletpoint, index) => (
                <div key={index} className="group hover:bg-white/5 p-4 rounded-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform flex-shrink-0">
                      {index + 1}
                    </div>
                    <h4 className="text-white font-bold text-lg group-hover:text-orange-500 transition-colors">
                      {bulletpoint.title}
                    </h4>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    {bulletpoint.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full -translate-y-16 -translate-x-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full translate-y-12 translate-x-12"></div>
      </section>

      {/* Role-Specific Quote Section */}
      {userRole && getRoleSpecificText(userRole) && (
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 relative overflow-hidden">
          <div className="relative">
            {/* Quote Icon */}
            <div className="absolute -top-4 -left-2 text-6xl text-orange-500/20 font-serif">"</div>
            
            {/* Quote Content */}
            <div className="pl-8">
              <blockquote className="text-lg md:text-xl text-gray-200 leading-relaxed italic mb-6">
                {getRoleSpecificText(userRole).split(/(\[.*?\]\(.*?\))/).map((part, index) => {
                  // Check if this part is a markdown link
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
                })}
              </blockquote>
              
              {/* Attribution */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-0.5 bg-orange-500"></div>
                <cite className="text-orange-500 not-italic">
                  Key insights for {userRole.charAt(0).toUpperCase() + userRole.slice(1)}s
                </cite>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/5 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500/10 rounded-full translate-y-8 -translate-x-8"></div>
          </div>
        </section>
      )}

      {/* Knowledge Bank Section */}
      <section className="bg-gray-900 rounded-lg p-8">
        <h2 className="text-2xl text-[rgba(255,255,255,1)] mb-4 text-[40px] font-bold">Our Knowledge Bank</h2>
        <p className="text-gray-300 leading-relaxed mb-6">
          Access IITA's extensive research library and technical resources developed over 50+ years of agricultural innovation in Africa. Our knowledge bank provides evidence-based solutions and practical guidance for climate-smart agriculture.
        </p>
        
        {/* Knowledge Resources */}
        <div className="bg-black/30 rounded-lg p-6">
          <h3 className="text-orange-500 mb-4 text-[24px] font-bold">Available Resources & Publications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-gray-300">
                <p className="mb-2"><span className="text-orange-500 font-bold">Technical Guides:</span></p>
                <ul className="space-y-1 text-sm pl-4">
                  {getResourceItems('technicalguides').map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="text-gray-300">
                <p className="mb-2"><span className="text-orange-500 font-bold">Digital Tools:</span></p>
                <ul className="space-y-1 text-sm pl-4">
                  {getResourceItems('digitaltools').map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-gray-300">
                <p className="mb-2"><span className="text-orange-500 font-bold">Research Publications:</span></p>
                <ul className="space-y-1 text-sm pl-4">
                  {getResourceItems('researchpublications').map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="text-gray-300">
                <p className="mb-2"><span className="text-orange-500 font-bold">Training Materials:</span></p>
                <ul className="space-y-1 text-sm pl-4">
                  {getResourceItems('trainingmaterials').map((item, index) => (
                    <li key={index}>• {item}</li>
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

      {/* Partnership Section */}
      <section className="bg-gray-900 rounded-lg p-8">
        <h2 className="text-2xl text-[rgba(255,255,255,1)] mb-4 text-[40px] font-bold">Let's Get Together</h2>
        {/* Impact Highlights Quote */}
        {getImpactText() && (
          <div className="mb-6 pl-6 border-l-4 border-orange-500 bg-gray-800/30 rounded-r-lg py-4 pr-6">
            <blockquote className="text-gray-200 mb-3 leading-relaxed">
              {getImpactText().split(/(\[.*?\]\(.*?\))/).map((part, index) => {
                // Check if this part is a markdown link
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
              })}
            </blockquote>
            <cite className="text-orange-500 not-italic text-sm">
              — Impact highlights
            </cite>
          </div>
        )}
        
        <p className="text-gray-300 leading-relaxed mb-6">{solution.partnership}</p>
        
        {/* Contact Information */}
        <div className="bg-black/30 rounded-lg p-6">
          <h3 className="text-orange-500 mb-4 text-[24px] font-bold">Ready to Partner with IITA?</h3>
          <div className="space-y-2 text-gray-300">
            <p><span className="text-orange-500">Email:</span> partnerships@iita.org</p>
            <p><span className="text-orange-500">Phone:</span> +234 2 7517472</p>
            <p><span className="text-orange-500">Address:</span> PMB 5320, Oyo Road, Ibadan, Nigeria</p>
          </div>
        </div>
      </section>

      {/* Sharing Options */}
      <section className="text-center">
        <h3 className="text-2xl text-white mb-6 text-[36px] font-bold">Share This Solution</h3>
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
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={() => onShare('contact')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact IITA
          </Button>
          <Button
            onClick={() => onShare('faq')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Ask Questions
          </Button>
        </div>
      </section>
    </motion.div>
  );
}