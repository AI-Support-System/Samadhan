// pages/api/support.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Groq } from 'groq-sdk';

type SupportRequest = {
  name: string;
  email: string;
  subject: string;
  description: string;
};

type SupportAnalysis = {
  category: string;
  solveable: 'Yes' | 'No';
  priority: 'Low' | 'Medium' | 'High';
  department: string;
  language: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract data from the request body
    const { name, email, subject, description }: SupportRequest = req.body;

    // Validate required fields
    if (!name || !email || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Groq client with API key from environment variables
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY as string,
    });

    // Analyze the support request using Groq AI
    const analysis = await analyzeRequest(groq, description);

    // Generate a unique customer ID
    const customerId = `C${Date.now().toString().slice(-6)}`;

    // Prepare data for the spreadsheet
    const params = new URLSearchParams({
      customerId,
      name,
      channel: 'Web Form',
      subject: subject || 'Support Request',
      description,
      category: analysis.category,
      solveable: analysis.solveable,
      priority: analysis.priority,
      department: analysis.department,
      language: analysis.language,
      email,
    });

    // URL for the Google Apps Script web app
    const url = `https://script.google.com/macros/s/AKfycbwyk4eS7LE-6dxDnC08ssPrGb1SEeDQC7K7TUDMuKV-7QVFuDqm04lyS4o-HnRxs0KO/exec?${params.toString()}`;

    // Send data to Google Sheets
    const sheetResponse = await fetch(url);
    
    if (!sheetResponse.ok) {
      throw new Error('Failed to save data to spreadsheet');
    }

    const sheetData = await sheetResponse.json();

    // Return success response with analysis and spreadsheet data
    return res.status(200).json({
      success: true,
      ticketId: customerId,
      analysis,
      spreadsheetResponse: sheetData,
    });
  } catch (error) {
    console.error('Support API error:', error);
    return res.status(500).json({
      error: 'Failed to process support request',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Analyzes a support request description using Groq AI
 */
async function analyzeRequest(
  groqClient: Groq,
  description: string
): Promise<SupportAnalysis> {
  const prompt = `
    Analyze the following customer support request and respond ONLY with a JSON object containing these fields:
    - category: The support category (Account, Billing, Technical, Product, Other)
    - solveable: Either "Yes" or "No" based on if this seems like a common issue with quick resolution
    - priority: "Low", "Medium", or "High" based on urgency
    - department: Which department should handle this (Support, Engineering, Sales, Billing, Product)
    - language: The detected language of the request

    Customer support request: "${description}"

    Response (JSON format only):
  `;

  const completion = await groqClient.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "mixtral-8x7b-32768",
    temperature: 0.1,
    max_tokens: 500,
  });

  // Extract JSON from response
  const responseContent = completion.choices[0]?.message?.content || '';
  
  try {
    // Parse JSON from the response
    const jsonMatch = responseContent.match(/(\{[\s\S]*\})/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as SupportAnalysis;
    }
    
    throw new Error('Could not parse JSON from AI response');
  } catch (error) {
    console.error('Failed to parse AI analysis:', error);
    // Return default values if parsing fails
    return {
      category: 'Other',
      solveable: 'No',
      priority: 'Medium',
      department: 'Support',
      language: 'English',
    };
  }
}