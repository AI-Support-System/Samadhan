import { Groq } from 'groq-sdk';

export type SupportRequest = {
  name: string;
  email: string;
  subject?: string;
  description: string;
};

export type SupportAnalysis = {
  category: string;
  solveable: 'Yes' | 'No';
  priority: 'Low' | 'Medium' | 'High';
  department: string;
  language: string;
  solution: string;
};

export type SupportResponse = {
  success: boolean;
  ticketId?: string;
  analysis?: SupportAnalysis;
};

export async function submitSupportRequest(
  request: SupportRequest, 
  groqApiKey?: string,
  appsheetWebhookUrl?: string
): Promise<SupportResponse> {
  // Validate required fields
  if (!request.name || !request.email || !request.description) {
    return { 
      success: false, 
      analysis: {
        category: 'Validation',
        solveable: 'No',
        priority: 'Low',
        department: 'Support',
        language: 'English',
        solution: 'Missing required fields. Please provide name, email, and description.'
      }
    };
  }

  // Use provided API key or environment variable
  const apiKey = groqApiKey || process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { 
      success: false, 
      analysis: {
        category: 'Configuration',
        solveable: 'No',
        priority: 'High',
        department: 'IT',
        language: 'English',
        solution: 'Server configuration error. Please contact system administrator.'
      }
    };
  }

  try {
    // Initialize Groq client
    const groq = new Groq({ apiKey });

    // Analyze the support request
    const analysis = await analyzeRequestWithGroq(groq, request.description);

    // Generate unique ticket ID
    const ticketId = `C${Date.now().toString().slice(-6)}`;

    // Prepare payload for external system
    const appsheetPayload = {
      customerId: ticketId,
      ...request,
      channel: 'Web Form',
      subject: request.subject || 'Support Request',
      ...analysis
    };

    // Optional: Send to external tracking system if webhook URL is provided
    if (appsheetWebhookUrl || process.env.APPSHEET_WEBHOOK_URL) {
      await sendToAppSheet(
        appsheetPayload, 
        appsheetWebhookUrl || process.env.APPSHEET_WEBHOOK_URL
      );
    }

    return {
      success: true,
      ticketId,
      analysis
    };

  } catch (error) {
    console.error('Support Request Error:', error);
    
    return {
      success: false,
      analysis: {
        category: 'Other',
        solveable: 'No',
        priority: 'Medium',
        department: 'Support',
        language: 'English',
        solution: 'We are currently experiencing technical difficulties. Our support team will review your request and contact you shortly.'
      }
    };
  }
}

async function analyzeRequestWithGroq(
  groqClient: Groq, 
  description: string
): Promise<SupportAnalysis> {
  const systemPrompt = `
    You are an advanced AI support resolution system. Your goal is to provide clear, actionable solutions to user problems.

    Analyze the support request and provide:
    1. Precise issue categorization
    2. Solvability assessment
    3. Priority level
    4. Appropriate department
    5. Comprehensive solution

    Respond in strict JSON format:
    {
      "category": "Specific issue category",
      "solveable": "Yes or No",
      "priority": "Low, Medium, or High",
      "department": "Responsible support department",
      "language": "Detected description language",
      "solution": "Detailed, step-by-step resolution instructions"
    }
  `;

  try {
    const completion = await groqClient.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: description }
      ],
      model: "mixtral-8x7b-32768",
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 1000
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) throw new Error('No response from Groq API');

    const analysis = JSON.parse(responseContent) as SupportAnalysis;
    
    // Validate required fields
    const requiredFields: (keyof SupportAnalysis)[] = [
      'category', 'solveable', 'priority', 'department', 
      'language', 'solution'
    ];
    
    for (const field of requiredFields) {
      if (!analysis[field]) {
        throw new Error(`Missing required field in analysis: ${field}`);
      }
    }

    return analysis;

  } catch (error) {
    console.error('Analysis error:', error);
    return {
      category: 'Other',
      solveable: 'No',
      priority: 'Medium',
      department: 'Support',
      language: 'English',
      solution: 'We are unable to automatically resolve this issue. Our support team will review your ticket and contact you shortly.'
    };
  }
}

async function sendToAppSheet(
  payload: Record<string, any>, 
  scriptUrl: string | undefined
) {
  if (!scriptUrl) return;

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`AppSheet returned ${response.status}: ${await response.text()}`);
    }

    return await response.json();

  } catch (error) {
    console.error('AppSheet integration error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}