import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Send, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

interface FAQProps {
  solutionId?: string;
  solutionTitle?: string;
}

export function FAQ({ solutionId, solutionTitle }: FAQProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load FAQs on component mount
  useEffect(() => {
    loadFAQs();
  }, [solutionId]);

  const loadFAQs = async () => {
    try {
      const faqKey = solutionId ? `faqs_${solutionId}` : 'faqs_general';
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a42f59f3/faqs/${faqKey}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
    }
  };

  const submitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a42f59f3/questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            question: question.trim(),
            name: name.trim(),
            email: email.trim(),
            solutionId: solutionId || 'general',
            solutionTitle: solutionTitle || 'General',
          }),
        }
      );

      if (response.ok) {
        setSubmitStatus('success');
        setQuestion('');
        setName('');
        setEmail('');
        setShowSubmissionForm(false);
        
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        throw new Error('Failed to submit question');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* FAQ Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-orange-500" />
          <h3 className="text-2xl text-white">
            Frequently Asked Questions
            {solutionTitle && (
              <span className="text-gray-400 text-lg ml-2">
                - {solutionTitle}
              </span>
            )}
          </h3>
        </div>
        <Button
          onClick={() => setShowSubmissionForm(!showSubmissionForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask a Question
        </Button>
      </div>

      {/* Submit Status Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400"
          >
            Thank you! Your question has been submitted and will be reviewed by our team.
          </motion.div>
        )}
        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400"
          >
            Sorry, there was an error submitting your question. Please try again.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Submission Form */}
      <AnimatePresence>
        {showSubmissionForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="bg-gray-900 border-gray-700 p-6">
              <form onSubmit={submitQuestion} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Your Name (Optional)
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Email (Optional)
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Your Question *
                  </label>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="What would you like to know about this IITA solution?"
                    className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !question.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Question'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowSubmissionForm(false)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ List */}
      {faqs.length > 0 ? (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="bg-gray-900 border-gray-700">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
              >
                <h4 className="text-white text-lg pr-4">{faq.question}</h4>
                {expandedFaq === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-orange-500 flex-shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedFaq === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="border-t border-gray-700 pt-4">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-900 border-gray-700 p-8 text-center">
          <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No FAQs available yet</p>
          <p className="text-gray-500">
            Be the first to ask a question about this solution!
          </p>
        </Card>
      )}
    </div>
  );
}