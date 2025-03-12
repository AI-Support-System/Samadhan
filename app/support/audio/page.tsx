'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitAudioSupportRequest, AudioSupportRequest, SupportResponse } from '@/app/api/audio-support';
import { Mic, MicOff, Square, RotateCcw, Send } from 'lucide-react';

export default function AudioSupportPage() {
  const router = useRouter();
  
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState('Anonymous Customer');
  const [email, setEmail] = useState('support@example.com');
  const [phone, setPhone] = useState('9881679994'); // Default phone for demo
  
  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<SupportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up audio URL when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [audioUrl]);
  
  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start recording function
  const startRecording = async () => {
    try {
      setError(null);
      
      // Reset previous recording if exists
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setAudioBlob(null);
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      setError('Microphone access denied or not available. Please ensure your browser has permission to use the microphone.');
      console.error('Error starting recording:', err);
    }
  };
  
  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  // Reset recording function
  const resetRecording = () => {
    if (isRecording) {
      stopRecording();
    }
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingDuration(0);
    setError(null);
  };
  
  // Submit recording function
  const submitRecording = async () => {
    if (!audioBlob) {
      setError('Please record your message before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const request: AudioSupportRequest = {
        name,
        email,
        phone,
        audioFile: audioBlob
      };
      
      const result = await submitAudioSupportRequest(request);
      
      if (result.success) {
        setResponse(result);
      } else {
        throw new Error(result.error || 'Failed to submit audio request');
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
      <h1 className="text-3xl font-bold mb-8 text-black">Voice Support Request</h1>
      
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
            <h3 className="font-semibold text-black mb-2">We Understood Your Request As</h3>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded mb-4">
              <p className="text-black"><strong>Subject:</strong> {response.requestData.subject || 'Not detected'}</p>
              <p className="text-black mt-2"><strong>Description:</strong></p>
              <p className="text-black mt-2 p-2 bg-white border border-gray-200 rounded">
                {response.requestData.description || 'We could not transcribe your audio clearly. A support agent will listen to your recording.'}
              </p>
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
                Our team will call you shortly.
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
        <div className="w-full max-w-md bg-white border-2 border-black p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-500 text-red-700">
              {error}
            </div>
          )}
          
          <div className="mb-6 text-center">
            <p className="text-black mb-4">
              Record your support request and our team will get back to you quickly.
            </p>
            
            <div className="flex flex-col items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center mb-4 border-4 border-black relative">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-pulse"></div>
                )}
                {isRecording ? (
                  <div className="flex flex-col items-center">
                    <div className="text-red-500 text-2xl font-bold animate-pulse mb-2">
                      {formatTime(recordingDuration)}
                    </div>
                    <MicOff size={40} className="text-red-500" />
                  </div>
                ) : audioUrl ? (
                  <div className="flex flex-col items-center">
                    <p className="text-black mb-2">Recording saved</p>
                    <p className="text-gray-500 text-sm mb-2">
                      {formatTime(recordingDuration)}
                    </p>
                  </div>
                ) : (
                  <Mic size={40} className="text-black" />
                )}
              </div>
              
              <div className="flex gap-4 mt-2">
                {!isRecording && !audioUrl && (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="px-4 py-2 bg-black text-white font-medium rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    <Mic size={18} />
                    Start Recording
                  </button>
                )}
                
                {isRecording && (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-full flex items-center gap-2 hover:bg-red-600 transition-colors"
                  >
                    <Square size={18} />
                    Stop Recording
                  </button>
                )}
                
                {audioUrl && (
                  <>
                    <button
                      type="button"
                      onClick={resetRecording}
                      className="px-4 py-2 border-2 border-black text-black rounded-full flex items-center gap-2 hover:bg-gray-100 transition-colors"
                    >
                      <RotateCcw size={18} />
                      Reset
                    </button>
                    
                    <button
                      type="button"
                      onClick={submitRecording}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-black text-white font-medium rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    >
                      <Send size={18} />
                      {isSubmitting ? 'Sending...' : 'Send'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {audioUrl && (
            <div className="mb-6">
              <h3 className="font-semibold text-black mb-2">Your Recording</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-200">
                <audio 
                  src={audioUrl} 
                  controls 
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-300">
            <p className="text-sm text-gray-500 mb-4">
              By submitting a voice request, you agree to our terms of service and privacy policy.
              We'll call you back as soon as possible to help with your issue.
            </p>
            
            <button
              type="button"
              onClick={handleBackToHome}
              className="w-full px-4 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors text-center"
            >
              Back to Support Options
            </button>
          </div>
        </div>
      )}
    </div>
  );
}