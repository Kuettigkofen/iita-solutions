'use client'

import React, { useState } from 'react'
import { SolutionAdminForm } from '@/components/SolutionAdminForm'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (password === 'iitaGWU2025$') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600">
              Enter password to access admin panel
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black bg-white"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <Button
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            IITA Solutions Admin
          </h1>
          <p className="text-gray-600">
            Add new climate-smart agricultural solutions with images to the database
          </p>
        </div>

        {/* Markdown Links Guide */}
        <Card className="mb-6 p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">📝 How to Add Links in Text Fields</h2>
          <div className="space-y-3 text-sm">
            <p className="text-blue-800">
              <strong>Use markdown format to create clickable links:</strong> <code className="bg-blue-100 px-2 py-1 rounded">[Link Text](URL)</code>
            </p>
            <div className="bg-gray-100 p-4 rounded border border-blue-200">
              <p className="text-gray-900 font-medium mb-2">Example:</p>
              <div className="bg-white p-3 rounded font-mono text-sm mb-2 text-black">
                See the [IITA Banana Manual](https://cgspace.cgiar.org/handle/10568/12345) and [Climate Guidelines](https://www.iita.org/guides) for more details.
              </div>
              <p className="text-gray-700 text-xs">↳ This will create orange clickable links that open in new tabs</p>
            </div>
            <p className="text-blue-700">
              💡 <strong>Tip:</strong> You can add multiple links in any text field - bullet points, descriptions, role-specific content, etc.
            </p>
            <div className="bg-gray-100 p-4 rounded border border-blue-200 mt-3">
              <p className="text-gray-900 font-medium mb-2">📌 Solution Bullet Points Format:</p>
              <div className="space-y-2 text-xs">
                <div className="bg-yellow-50 p-2 rounded">
                  <p className="text-black"><strong>Solution bullets:</strong> First sentence becomes <strong>bold title</strong>, remaining sentences appear underneath</p>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="text-black"><strong>Problem bullets:</strong> All text appears as regular bullet points (no bold headers)</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded border border-blue-200 mt-3">
              <p className="text-gray-700 font-medium mb-2">💾 Draft Management System:</p>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="bg-green-50 p-2 rounded">
                  <p><strong>Save Drafts:</strong> Click "Save Draft" → Enter draft name and your name → Saved to database for cross-computer access</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <p><strong>Load Drafts:</strong> Available drafts appear in yellow box above form → Click "Load" to continue working</p>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <p><strong>Multi-User:</strong> You and colleagues can save separate drafts → Each person can work on different solutions simultaneously</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p><strong>Cross-Computer:</strong> Access your drafts from any computer → No more lost work when switching devices</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {!showForm ? (
            <Card className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">Add New Solution</h2>
                <p className="text-gray-600 mb-6">
                  Create a comprehensive entry with solution data and images (title, problem, solution images)
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Start Adding Solution
                </Button>
              </div>
            </Card>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">New Solution Entry</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
              <SolutionAdminForm onComplete={() => setShowForm(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}