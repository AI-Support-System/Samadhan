import { io, Socket } from 'socket.io-client';
import axios from 'axios';

// Define message types
export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: number;
}

export class ChatbotConnector {
  private socket: Socket | null = null;
  private serverUrl: string;
  private messageCallback: ((message: ChatMessage) => void) | null = null;

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
  }

  // Connect to the socket server
  public connect(onMessageReceived: (message: ChatMessage) => void): void {
    this.socket = io(this.serverUrl);
    this.messageCallback = onMessageReceived;

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    this.socket.on('message', (message: ChatMessage) => {
      if (this.messageCallback) {
        this.messageCallback(message);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.fallbackToREST();
    });
  }

  // Send a message through the socket connection
  public sendMessage(message: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', { text: message });
    } else {
      this.sendMessageREST(message);
    }
  }

  // Fallback to REST API if socket connection fails
  private fallbackToREST(): void {
    console.log('Falling back to REST API');
  }

  // Send message through REST API
  private async sendMessageREST(message: string): Promise<void> {
    try {
      const response = await axios.post(`${this.serverUrl}/api/chat`, { message });
      
      if (this.messageCallback) {
        this.messageCallback({
          text: response.data.message,
          sender: 'bot',
          timestamp: response.data.timestamp
        });
      }
    } catch (error) {
      console.error('Error sending message via REST:', error);
    }
  }

  // Disconnect from the socket server
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default ChatbotConnector;