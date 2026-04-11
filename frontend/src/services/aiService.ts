import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;

const SYSTEM_PROMPT = `
You are TechSphere's virtual assistant. You are helpful, professional, and knowledgeable about IT and SaaS-related queries.
Your goals:
1. Answer common support queries (account help, service setup, billing).
2. Suggest troubleshooting steps for SaaS issues.
3. Guide users through ticket submission if their problem persists.
4. Explain TechSphere's pricing and features (Dashboard, Clients, Services, Subscriptions, Tickets, Analytics).

Important Constraints:
- Keep responses concise and structured.
- Use bullet points for steps.
- If the user needs to create a ticket, say: "It sounds like you need technical support. Would you like me to open a support ticket for you?"
- Do not make up information you don't know about TechSphere.
- Act as a virtual assistant, not just a generic LLM.
`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const getGroqResponse = async (userMessage: string, history: ChatMessage[] = []) => {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API key is not configured. Please add it to your .env.local file.');
  }

  try {
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(1), // Remove initial bot message if it doesn't fit assistant role perfectly or just keep it
      { role: 'user', content: userMessage }
    ];

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.choices && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Invalid response format from Groq API');
    }
  } catch (error: any) {
    console.error('Groq API Error details:', error.response?.data || error.message);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded on Groq. Please try again in a few seconds.');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid Groq API Key. Please check your .env.local file.');
      }
    }
    
    throw new Error(`Groq Connection Error: ${error.response?.data?.error?.message || error.message}`);
  }
};

// Keep compatibility with previous name if needed, but updated to use Groq
export const getGeminiResponse = getGroqResponse; 
