'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SolutionService } from '@/lib/solutionService'
import { MultiSelect } from './MultiSelect'

// All 54 African countries
const AFRICAN_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon',
  'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of Congo', 'Republic of Congo',
  'Cote d\'Ivoire', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia',
  'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya',
  'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia',
  'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone',
  'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
  'Zambia', 'Zimbabwe'
].sort()

// Challenge options from main app
const CHALLENGE_OPTIONS = [
  'agroecology', 'agroforestry', 'aquaculture', 'banana', 'beans', 'beekeeping', 'biofortification',
  'cassava', 'climate_information', 'climate_resilience', 'cocoa', 'coffee', 'cotton',
  'digital_services', 'farmer_training', 'greenhouse', 'livestock', 'maize', 'mushroom',
  'nutrition', 'pest_management', 'plantain', 'processing', 'renewable_energy', 'rice',
  'soil_fertility', 'soybean', 'storage', 'sweet_potato', 'value_chains', 'water_management', 'yam'
].sort()

// Agro-ecological zones (16 main zones)
const AGROECO_ZONES = [
  'Arid - warm',
  'Arid - cool',
  'Semi-arid - warm',
  'Semi-arid - cool',
  'Subhumid - warm',
  'Subhumid - cool',
  'Humid - warm',
  'Humid - cool',
  'Tropic - warm arid',
  'Tropic - warm semi-arid',
  'Tropic - warm subhumid',
  'Tropic - warm humid',
  'Tropic - cool semi-arid',
  'Tropic - cool subhumid',
  'Tropic - cool humid',
  'Subtropical - cool subhumid'
].sort()

interface ImageData {
  image_type: 'title_image' | 'problem_image' | 'solution_image'
  image_url: string
  image_caption: string
  image_alt_text: string
  image_source: string
  image_credits: string
}

interface SolutionFormData {
  // Core fields
  solution_title: string
  applicable_countries: string[]
  applicable_challenges: string[]

  // Problem/Solution
  executive_summary_text: string
  problem_title: string
  problem_bulletpoint_1: string
  problem_bulletpoint_2: string
  problem_bulletpoint_3: string
  problem_bulletpoint_4: string
  solution_title_field: string
  solution_bulletpoint_1: string
  solution_bulletpoint_2: string
  solution_bulletpoint_3: string
  solution_bulletpoint_4: string

  // Resources
  resources_technicalguides: string
  resources_digitaltools: string
  resources_researchpublications: string
  resources_trainingmaterials: string

  // Impact & Climate
  impact_text: string
  climate_potential: number
  key_agroeco: string[]
  external_references: string[]

  // Role-specific summary sentences
  funder_summarysentence: string
  policymaker_summarysentence: string
  farmer_summarysentence: string
  student_summarysentence: string
  extensionofficer_summarysentence: string
  researcher_summarysentence: string
  devpractitioner_summarysentence: string
  businessowner_summarysentence: string

  // Role-specific detailed text
  funder_text: string
  policymaker_text: string
  farmer_text: string
  student_text: string
  extensionofficer_text: string
  researcher_text: string
  devpractitioner_text: string
  businessowner_text: string

  // Images
  images: ImageData[]
}

interface Props {
  onComplete: () => void
}

export function SolutionAdminForm({ onComplete }: Props) {
  const [formData, setFormData] = useState<SolutionFormData>({
    solution_title: '',
    applicable_countries: [],
    applicable_challenges: [],
    executive_summary_text: '',
    problem_title: '',
    problem_bulletpoint_1: '',
    problem_bulletpoint_2: '',
    problem_bulletpoint_3: '',
    problem_bulletpoint_4: '',
    solution_title_field: '',
    solution_bulletpoint_1: '',
    solution_bulletpoint_2: '',
    solution_bulletpoint_3: '',
    solution_bulletpoint_4: '',
    resources_technicalguides: '',
    resources_digitaltools: '',
    resources_researchpublications: '',
    resources_trainingmaterials: '',
    impact_text: '',
    climate_potential: 5,
    key_agroeco: [],
    external_references: [],
    funder_summarysentence: '',
    policymaker_summarysentence: '',
    farmer_summarysentence: '',
    student_summarysentence: '',
    extensionofficer_summarysentence: '',
    researcher_summarysentence: '',
    devpractitioner_summarysentence: '',
    businessowner_summarysentence: '',
    funder_text: '',
    policymaker_text: '',
    farmer_text: '',
    student_text: '',
    extensionofficer_text: '',
    researcher_text: '',
    devpractitioner_text: '',
    businessowner_text: '',
    images: [
      { image_type: 'title_image', image_url: '', image_caption: '', image_alt_text: '', image_source: '', image_credits: '' },
      { image_type: 'problem_image', image_url: '', image_caption: '', image_alt_text: '', image_source: '', image_credits: '' },
      { image_type: 'solution_image', image_url: '', image_caption: '', image_alt_text: '', image_source: '', image_credits: '' }
    ]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | null>(null)
  const [drafts, setDrafts] = useState<any[]>([])
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null)
  const [showDraftDialog, setShowDraftDialog] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [authorName, setAuthorName] = useState('')

  // Load available drafts on component mount
  React.useEffect(() => {
    loadDrafts()
    // Also check for local draft as fallback
    const savedDraft = localStorage.getItem('solution_draft')
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft)
        setFormData(draftData)
        setSaveStatus('saved')
      } catch (error) {
        console.error('Error loading local draft:', error)
        localStorage.removeItem('solution_draft')
      }
    }
  }, [])

  const loadDrafts = async () => {
    try {
      const draftList = await SolutionService.getDrafts()
      setDrafts(draftList)
    } catch (error) {
      console.error('Error loading drafts:', error)
    }
  }

  const handleInputChange = (field: keyof SolutionFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear saved status when user makes changes
    if (saveStatus === 'saved') {
      setSaveStatus(null)
    }
  }

  const handleSaveDraft = async () => {
    if (!draftName.trim() || !authorName.trim()) {
      setShowDraftDialog(true)
      return
    }

    setSaveStatus('saving')
    try {
      if (currentDraftId) {
        // Update existing draft
        await SolutionService.updateDraft(currentDraftId, formData)
      } else {
        // Create new draft
        const draftId = await SolutionService.saveDraft(draftName, authorName, formData)
        setCurrentDraftId(draftId)
      }

      setSaveStatus('saved')
      await loadDrafts() // Refresh draft list
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Error saving draft:', error)
      setSaveStatus(null)
    }
  }

  const handleSaveDraftWithDetails = async () => {
    if (!draftName.trim() || !authorName.trim()) {
      alert('Please provide both draft name and author name')
      return
    }

    setSaveStatus('saving')
    try {
      const draftId = await SolutionService.saveDraft(draftName, authorName, formData)
      setCurrentDraftId(draftId)
      setSaveStatus('saved')
      setShowDraftDialog(false)
      await loadDrafts()
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Error saving draft:', error)
      setSaveStatus(null)
    }
  }

  const handleLoadDraft = async (draftId: string) => {
    try {
      const draftData = await SolutionService.loadDraft(draftId)
      if (draftData) {
        setFormData(draftData)
        setCurrentDraftId(draftId)
        setSaveStatus('saved')
        // Clear local storage since we're using database draft
        localStorage.removeItem('solution_draft')
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
  }

  const handleDeleteDraft = async (draftId: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      try {
        await SolutionService.deleteDraft(draftId)
        await loadDrafts()
        if (currentDraftId === draftId) {
          setCurrentDraftId(null)
        }
      } catch (error) {
        console.error('Error deleting draft:', error)
      }
    }
  }

  const handleClearDraft = () => {
    if (confirm('Are you sure you want to clear the saved draft? This cannot be undone.')) {
      localStorage.removeItem('solution_draft')
      setSaveStatus(null)
      // Reset form to initial state
      setFormData({
        solution_title: '',
        applicable_countries: [],
        applicable_challenges: [],
        executive_summary_text: '',
        problem_title: '',
        problem_bulletpoint_1: '',
        problem_bulletpoint_2: '',
        problem_bulletpoint_3: '',
        problem_bulletpoint_4: '',
        solution_title_field: '',
        solution_bulletpoint_1: '',
        solution_bulletpoint_2: '',
        solution_bulletpoint_3: '',
        solution_bulletpoint_4: '',
        resources_technicalguides: '',
        resources_digitaltools: '',
        resources_researchpublications: '',
        resources_trainingmaterials: '',
        impact_text: '',
        climate_potential: 5,
        key_agroeco: [],
        external_references: [],
        funder_summarysentence: '',
        policymaker_summarysentence: '',
        farmer_summarysentence: '',
        student_summarysentence: '',
        extensionofficer_summarysentence: '',
        researcher_summarysentence: '',
        devpractitioner_summarysentence: '',
        businessowner_summarysentence: '',
        funder_text: '',
        policymaker_text: '',
        farmer_text: '',
        student_text: '',
        extensionofficer_text: '',
        researcher_text: '',
        devpractitioner_text: '',
        businessowner_text: '',
        images: [
          { image_type: 'title_image', image_url: '', image_caption: '', image_alt_text: '', image_source: '', image_credits: '' },
          { image_type: 'problem_image', image_url: '', image_caption: '', image_alt_text: '', image_source: '', image_credits: '' },
          { image_type: 'solution_image', image_url: '', image_caption: '', image_alt_text: '', image_source: '', image_credits: '' }
        ]
      })
    }
  }

  const handleArrayInput = (field: keyof SolutionFormData, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item.length > 0)
    handleInputChange(field, arrayValue)
  }

  const handleImageChange = (index: number, field: keyof ImageData, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await SolutionService.insertSolution(formData)
      setSubmitStatus('success')
      // Clear the draft since solution was successfully created
      localStorage.removeItem('solution_draft')
      setSaveStatus(null)
      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (error) {
      console.error('Error submitting solution:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="text-gray-900">
      {/* Draft loaded notification */}
      {saveStatus === 'saved' && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong>Draft loaded:</strong> You have a previously saved draft that has been loaded into the form.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Information */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Core Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Solution Title *</label>
              <Input
                value={formData.solution_title}
                onChange={(e) => handleInputChange('solution_title', e.target.value)}
                placeholder="e.g., KABANA 6H Banana Variety"
                className="text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Applicable Countries *</label>
              <MultiSelect
                options={AFRICAN_COUNTRIES}
                selected={formData.applicable_countries}
                onChange={(selected) => handleInputChange('applicable_countries', selected)}
                placeholder="Select countries..."
                className="text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Applicable Challenges *</label>
              <MultiSelect
                options={CHALLENGE_OPTIONS}
                selected={formData.applicable_challenges}
                onChange={(selected) => handleInputChange('applicable_challenges', selected)}
                placeholder="Select challenges..."
                className="text-gray-900"
                allowCustom={true}
                customLabel="Add custom challenge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Climate Potential (0-10) *</label>
              <Input
                type="number"
                min="0"
                max="10"
                value={formData.climate_potential}
                onChange={(e) => handleInputChange('climate_potential', parseInt(e.target.value))}
                className="text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Key Agro-ecological Zones</label>
              <MultiSelect
                options={AGROECO_ZONES}
                selected={formData.key_agroeco}
                onChange={(selected) => handleInputChange('key_agroeco', selected)}
                placeholder="Select agro-ecological zones..."
                className="text-gray-900"
              />
            </div>
          </div>
        </Card>

        {/* Problem Definition */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Problem Definition</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Executive Summary (2 sentences) *</label>
              <Textarea
                value={formData.executive_summary_text}
                onChange={(e) => handleInputChange('executive_summary_text', e.target.value)}
                placeholder="Brief summary of what this solution accomplishes..."
                className="text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Problem Title *</label>
              <Input
                value={formData.problem_title}
                onChange={(e) => handleInputChange('problem_title', e.target.value)}
                placeholder="Main challenge this solution addresses"
                className="text-gray-900"
                required
              />
            </div>

            {[1, 2, 3, 4].map(num => (
              <div key={num}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Problem Bullet Point {num}</label>
                <Textarea
                  value={formData[`problem_bulletpoint_${num}` as keyof SolutionFormData] as string}
                  onChange={(e) => handleInputChange(`problem_bulletpoint_${num}` as keyof SolutionFormData, e.target.value)}
                  placeholder={`Key aspect of the problem ${num}...`}
                  className="text-gray-900"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Solution Description */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Solution Description</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Solution Title</label>
              <Input
                value={formData.solution_title_field}
                onChange={(e) => handleInputChange('solution_title_field', e.target.value)}
                placeholder="Core intervention or approach name"
                className="text-gray-900"
              />
            </div>

            {[1, 2, 3, 4].map(num => (
              <div key={num}>
                <label className="block text-sm font-medium mb-2 text-gray-700">Solution Bullet Point {num}</label>
                <Textarea
                  value={formData[`solution_bulletpoint_${num}` as keyof SolutionFormData] as string}
                  onChange={(e) => handleInputChange(`solution_bulletpoint_${num}` as keyof SolutionFormData, e.target.value)}
                  placeholder={`Key component or implementation step ${num}...`}
                  className="text-gray-900"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Resources & Evidence */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Resources & Evidence</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Technical Guides</label>
              <Textarea
                value={formData.resources_technicalguides}
                onChange={(e) => handleInputChange('resources_technicalguides', e.target.value)}
                placeholder="Manuals, guides, technical documentation with hyperlinks..."
                className="text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Digital Tools</label>
              <Textarea
                value={formData.resources_digitaltools}
                onChange={(e) => handleInputChange('resources_digitaltools', e.target.value)}
                placeholder="Apps, software, digital platforms..."
                className="text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Research Publications</label>
              <Textarea
                value={formData.resources_researchpublications}
                onChange={(e) => handleInputChange('resources_researchpublications', e.target.value)}
                placeholder="Studies, papers, research outputs with citations..."
                className="text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Training Materials</label>
              <Textarea
                value={formData.resources_trainingmaterials}
                onChange={(e) => handleInputChange('resources_trainingmaterials', e.target.value)}
                placeholder="Educational/capacity-building materials..."
                className="text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Impact Text</label>
              <Textarea
                value={formData.impact_text}
                onChange={(e) => handleInputChange('impact_text', e.target.value)}
                placeholder="Quantified results, outcomes, success metrics..."
                className="text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">External References (comma-separated)</label>
              <Input
                value={formData.external_references.join(', ')}
                onChange={(e) => handleArrayInput('external_references', e.target.value)}
                placeholder="Relevant external sources, citations..."
                className="text-gray-900"
              />
            </div>
          </div>
        </Card>

        {/* Role-Specific Summary Sentences */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Role-Specific Summary Sentences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'funder', 'policymaker', 'farmer', 'student',
              'extensionofficer', 'researcher', 'devpractitioner', 'businessowner'
            ].map(role => (
              <div key={role}>
                <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">{role.replace('_', ' ')}</label>
                <Textarea
                  value={formData[`${role}_summarysentence` as keyof SolutionFormData] as string}
                  onChange={(e) => handleInputChange(`${role}_summarysentence` as keyof SolutionFormData, e.target.value)}
                  placeholder={`One concise sentence for ${role}...`}
                  className="h-20 text-gray-900"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Role-Specific Detailed Text */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Role-Specific Detailed Text</h3>
          <div className="space-y-4">
            {[
              'funder', 'policymaker', 'farmer', 'student',
              'extensionofficer', 'researcher', 'devpractitioner', 'businessowner'
            ].map(role => (
              <div key={role}>
                <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">{role.replace('_', ' ')} (2-4 sentences)</label>
                <Textarea
                  value={formData[`${role}_text` as keyof SolutionFormData] as string}
                  onChange={(e) => handleInputChange(`${role}_text` as keyof SolutionFormData, e.target.value)}
                  placeholder={`Detailed text for ${role} with strategic hyperlinks...`}
                  className="h-24 text-gray-900"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Images Section */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Solution Images</h3>
          <p className="text-sm text-gray-600 mb-4">Each solution requires 3 images: title, problem, and solution images</p>

          {formData.images.map((image, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <h4 className="font-medium mb-3 capitalize text-gray-900">{image.image_type.replace('_', ' ')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Image URL *</label>
                  <Input
                    value={image.image_url}
                    onChange={(e) => handleImageChange(index, 'image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Caption</label>
                  <Input
                    value={image.image_caption}
                    onChange={(e) => handleImageChange(index, 'image_caption', e.target.value)}
                    placeholder="Brief image description"
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Alt Text</label>
                  <Input
                    value={image.image_alt_text}
                    onChange={(e) => handleImageChange(index, 'image_alt_text', e.target.value)}
                    placeholder="Alt text for accessibility"
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Source</label>
                  <Input
                    value={image.image_source}
                    onChange={(e) => handleImageChange(index, 'image_source', e.target.value)}
                    placeholder="Image source/origin"
                    className="text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Credits</label>
                  <Input
                    value={image.image_credits}
                    onChange={(e) => handleImageChange(index, 'image_credits', e.target.value)}
                    placeholder="Photo credits/attribution"
                    className="text-gray-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Draft Management */}
        {drafts.length > 0 && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <h4 className="font-medium mb-3 text-yellow-900">📂 Available Drafts</h4>
            <div className="space-y-2">
              {drafts.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between bg-white p-2 rounded border">
                  <div className="flex-1">
                    <span className="font-medium">{draft.draft_name}</span>
                    <span className="text-sm text-gray-500 ml-2">by {draft.author_name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(draft.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleLoadDraft(draft.id)}
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saveStatus === 'saving'}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              {saveStatus === 'saving' ? 'Saving...' : currentDraftId ? 'Update Draft' : 'Save Draft'}
            </Button>
            {currentDraftId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentDraftId(null)
                  setDraftName('')
                  setAuthorName('')
                }}
                className="border-gray-500 text-gray-600 hover:bg-gray-50"
              >
                New Draft
              </Button>
            )}
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={onComplete}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Creating Solution...' : 'Create Solution'}
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {saveStatus === 'saved' && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            Draft saved to database! You can access it from any computer.
          </div>
        )}

        {submitStatus === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Solution created successfully! Redirecting...
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error creating solution. Please check the console and try again.
          </div>
        )}
      </form>

      {/* Draft Name Dialog */}
      {showDraftDialog && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <Card className="p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save Draft</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Draft Name</label>
                <Input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g., Banana Technology Draft"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g., John Smith"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDraftDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveDraftWithDetails}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Draft
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}