'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitSupportRequest, SupportRequest, SupportResponse } from '@/app/api/support'; // Adjust path as needed

export default function SupportFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SupportRequest>({
    name: '',
    email: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<SupportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await submitSupportRequest(formData);

      if (result.success) {
        setResponse(result);
        
        // Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          description: ''
        });
      } else {
        throw new Error(result.analysis?.solution || 'Failed to submit support request');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToHome = () => {
    router.push('/support');
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-black">Submit a Support Request</h1>
      
      {response ? (
        <div className="w-full max-w-2xl bg-white border-2 border-black p-6">
          <h2 className="text-xl font-bold mb-4 text-black">Request Submitted</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-black mb-2">Ticket Details</h3>
              <div className="space-y-1">
                <p><strong>Ticket ID:</strong> {response.ticketId}</p>
                <p><strong>Category:</strong> {response.analysis?.category}</p>
                <p><strong>Priority:</strong> {response.analysis?.priority}</p>
                <p><strong>Department:</strong> {response.analysis?.department}</p>
                <p><strong>Solveable:</strong> {response.analysis?.solveable}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-black mb-2">Your Original Message</h3>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="text-sm text-gray-700">{formData.description}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-2">Our Solution</h3>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <p className="text-sm text-gray-700">{response.analysis?.solution}</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleBackToHome}
              className="px-6 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Back to Support Options
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border-2 border-black p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border-2 border-black text-black focus:outline-none"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border-2 border-black text-black focus:outline-none"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-black mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-2 border-2 border-black text-black focus:outline-none"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full p-2 border-2 border-black text-black focus:outline-none resize-none"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBackToHome}
              className="px-4 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}