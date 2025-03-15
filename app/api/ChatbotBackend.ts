import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

// Define message types
interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
}

// Define our chatbot response handler
class ChatbotService {
  private readonly responses: Record<string, string[]> = {
    transfer: [
      "You can make transfers by clicking the Transfer button in the Quick Actions section. Would you like me to explain the process?",
      "Transfers can be made between your accounts or to external accounts. What type of transfer are you interested in?",
      "To set up a recurring transfer, go to the Transfer section and select 'Scheduled Transfers'."
    ],
    balance: [
      "Your current balance is visible on the dashboard. You can toggle visibility using the eye button if you prefer to keep it private.",
      "If you'd like to see balance history, you can check the 'Account History' section under your account details.",
      "We can send you balance notifications. Would you like to set those up?"
    ],
    bill: [
      "To pay bills, select the 'Pay Bills' option from the Quick Actions menu. You can set up recurring payments or pay one-time bills.",
      "You can schedule bill payments up to 30 days in advance through our system.",
      "We offer automatic bill payment reminders. Would you like me to help you set that up?"
    ],
    payment: [
      "For payments, you can use our secure payment gateway accessible from the dashboard.",
      "We support various payment methods including credit cards, direct debit, and wire transfers.",
      "Payment confirmations are sent via email and are also available in your transaction history."
    ],
    account: [
      "We offer several account types including checking, savings, and investment accounts. Would you like more information about a specific account type?",
      "To open a new account, select 'Open New Account' from the Accounts menu.",
      "All our accounts come with 24/7 online access and mobile banking features."
    ],
    help: [
      "For additional support, you can contact our customer service at 1-800-NEOBANK or use the 'Contact Us' form in the Support section.",
      "Our support team is available 24/7 to assist with any banking questions or concerns.",
      "Would you like me to connect you with a customer service representative?"
    ],
    support: [
      "Our support team is available via phone, email, or live chat. How would you prefer to connect?",
      "You can find answers to common questions in our FAQ section under Support.",
      "Is there a specific issue you need help with today?"
    ]
  };

  private readonly fallbackResponses: string[] = [
    "I'm NeoBank's virtual assistant. I'm still learning, but I'm happy to help with your questions about accounts, transfers, or other banking services.",
    "I don't have information about that yet. Would you like me to connect you with a customer service representative?",
    "I'm not sure I understand. Could you rephrase your question about our banking services?",
    "Thank you for your question. I can help with account information, transfers, bill payments, and general banking queries.",
    "I'm here to assist with your banking needs. Could you provide more details about what you're looking for?"
  ];

  public generateResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    // Check for keywords in the input
    for (const [keyword, responseOptions] of Object.entries(this.responses)) {
      if (input.includes(keyword)) {
        // Select a random response for the keyword
        return responseOptions[Math.floor(Math.random() * responseOptions.length)];
      }
    }
    
    // If no keywords match, use a fallback response
    return this.fallbackResponses[Math.floor(Math.random() * this.fallbackResponses.length)];
  }
}

const setupServer = () => {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Initialize the chatbot service
  const chatbotService = new ChatbotService();

  // Configure middleware
  app.use(cors());
  app.use(express.json());

  // Define the chat endpoint
  const router = express.Router();
  
  router.post('/chat', (req, res) => {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Generate a response
    const botResponse = chatbotService.generateResponse(message);
    
    // Simulate a delay to make it seem more natural
    setTimeout(() => {
      res.json({
        message: botResponse,
        timestamp: Date.now()
      });
    }, 1000);
  });

  // Use the router with a prefix
  app.use('/api', router);

  // Configure socket.io for real-time chat
  io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Send welcome message
    socket.emit('message', {
      text: "Hello! How can I help you with your banking needs today?",
      sender: 'bot',
      timestamp: Date.now()
    });
    
    // Listen for incoming messages
    socket.on('message', (data: { text: string }) => {
      const userMessage: ChatMessage = {
        text: data.text,
        sender: 'user',
        timestamp: Date.now()
      };
      
      // Log received message
      console.log('Received message:', userMessage);
      
      // Generate a response
      const botResponse: ChatMessage = {
        text: chatbotService.generateResponse(data.text),
        sender: 'bot',
        timestamp: Date.now()
      };
      
      // Send the response after a delay
      setTimeout(() => {
        socket.emit('message', botResponse);
      }, 1000);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return { app, httpServer };
};

// Start the server
const startServer = () => {
  const { app, httpServer } = setupServer();
  const PORT = process.env.PORT || 3001;
  
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  
  return { app, httpServer };
};

// Execute the server
const { app } = startServer();

export default app;