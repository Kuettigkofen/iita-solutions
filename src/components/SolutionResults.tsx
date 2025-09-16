'use client'

import { UserInput } from '@/types/database'

interface SolutionResultsProps {
  userInput: UserInput
  onBack: () => void
}

export default function SolutionResults({ userInput, onBack }: SolutionResultsProps) {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-orange-500 hover:text-orange-400"
        >
          ← Back to search
        </button>

        <h1 className="text-4xl text-white mb-4">Solution Results</h1>
        <p className="text-gray-300">
          Results for {userInput.role} working on {userInput.challenge} in {userInput.location}
        </p>

        {/* This component is now integrated into the main page */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <p className="text-gray-300">
            Solution results are now displayed directly on the main page.
            This component is kept for potential future use.
          </p>
        </div>
      </div>
    </div>
  )
}