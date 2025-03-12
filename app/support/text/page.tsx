'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitSupportRequest, SupportRequest, SupportResponse } from '@/app/api/text-support';

export default function SupportFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SupportRequest>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<SupportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSubmittedData, setLastSubmittedData] = useState<SupportRequest | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Store a copy of the current form data before submission
    const currentSubmission = { ...formData };
    setLastSubmittedData(currentSubmission);
    
    try {
      const result = await submitSupportRequest(formData);

      if (result.success) {
        setResponse(result);
        
        // Clear form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          description: ''
        });
      } else {
        throw new Error(result.error || result.analysis?.solution || 'Failed to submit support request');
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

  // Use this function to safely get request data (either from response or lastSubmittedData)
  const getRequestData = () => {
    if (response?.requestData) {
      return response.requestData;
    }
    return lastSubmittedData || formData;
  };

  // Get the request data safely
  const requestData = getRequestData();

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-black">Submit a Support Request</h1>
      
      {response ? (
        <div className="w-full max-w-2xl bg-white border-2 border-black p-6">
          <h2 className="text-xl font-bold mb-4 text-black">Request Submitted Successfully</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-2">Ticket Information</h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded mb-4">
              <p className="text-black"><strong>Ticket ID:</strong> {response.ticketId}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-2">Your Request Details</h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded mb-4">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <p className="text-black"><strong>Name:</strong> {requestData.name}</p>
                <p className="text-black"><strong>Email:</strong> {requestData.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <p className="text-black"><strong>Phone:</strong> {requestData.phone || 'Not provided'}</p>
                <p className="text-black"><strong>Subject:</strong> {requestData.subject || 'Not provided'}</p>
              </div>
              <p className="text-black"><strong>Description:</strong></p>
              <p className="text-black mt-2 p-2 bg-white border border-gray-200 rounded">{requestData.description}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-2">Our Response</h3>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <p className="text-black">{response.analysis?.solution || "Thank you for contacting us. We've received your request and will respond shortly."}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-2">Next Steps</h3>
            <div className="p-4 bg-green-50 border-l-4 border-green-500">
              <p className="text-black">
                We have scheduled a call with one of our support specialists to discuss your request in detail.
                {requestData.phone ? ` Our team will call you at ${requestData.phone} shortly.` : ' Please expect a call from our team soon.'}
              </p>
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
            <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 9881679994"
              className="w-full p-2 border-2 border-black text-black focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              If provided, our support team will call you to discuss your issue.
            </p>
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