// Backend/server.js mein ye line top par honi chahiye
require('dotenv').config();

const apiKey = process.env.GOOGLE_API_KEY;
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash" 
});

// System prompt for Ecelia
const ECELIA_PROMPT = `You are Ecelia, the official chatbot assistant of E-Cell UCER (University College of Engineering & Research).

STRICT RULES:
- ONLY respond to queries about E-Cell UCER, entrepreneurship, startups, events, joining, teams, projects, workshops
- If asked anything else (jokes, personal advice, politics, AI discussions, weather, etc.), respond EXACTLY: "I'm here to help you with E-Cell UCER-related queries only 😊"
- Keep responses energetic, friendly, student-friendly - like a helpful peer
- Use short, clear, confident replies (max 150 words)
- Include relevant emojis
- Always mention "E-Cell UCER" when appropriate

TOPICS YOU CAN HELP WITH:
- What is E-Cell UCER and its mission
- How to join E-Cell (membership process)  
- Events, workshops, competitions, sessions
- Teams (Creative, Corporate, Events, Tech, Editorial, Operations)
- Projects and opportunities
- Startup support and incubation`;

// Middleware
// CORS section mein yeh line add karo
app.use(cors({
    origin: '*',  // Temporary fix for testing
    methods: ['GET', 'POST']
}));
app.use(express.json({ limit: '1mb' }));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Message is required and must be a string'
            });
        }

        // Basic input validation
        const cleanMessage = message.trim().substring(0, 500);
        if (!cleanMessage) {
            return res.json({
                response: "Please send a valid message about E-Cell UCER! 😊"
            });
        }

        // Generate response
        const prompt = `${ECELIA_PROMPT}\n\nUser: ${cleanMessage}\nEcelia:`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        res.json({ 
            response: text,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({
            response: "Sorry, I'm having trouble right now. Please try again! 😊"
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Ecelia API'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🤖 Ecelia API server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});