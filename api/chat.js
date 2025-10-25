// Vercel Serverless Function for AI Chat
export default async function handler(req, res) {
// Enable CORS
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
if (req.method === 'OPTIONS') {
return res.status(200).end();
}
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}
try {
const { message, context } = req.body;
if (!message) {
return res.status(400).json({ error: 'Message is required' });
}
// Get Groq API key from environment variables
const groqApiKey = process.env.GROQ_API_KEY || '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';
if (!groqApiKey || groqApiKey === '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') {
return res.status(500).json({ error: 'Groq API key not configured' });
}
const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
method: 'POST',
headers: {
'Authorization': `Bearer ${groqApiKey}`,
'Content-Type': 'application/json'
},
body: JSON.stringify({
model: 'mixtral-8x7b-32768',
messages: [
{
role: 'system',
content: createSystemPrompt(context)
},
{
role: 'user',
content: message
}
],
temperature: 0.7,
max_tokens: 1000,
top_p: 0.9
})
});
if (!response.ok) {
throw new Error(`Groq API error: ${response.status}`);
}
const data = await response.json();
const aiResponse = data.choices[0].message.content.trim();
return res.status(200).json({
response: aiResponse,
timestamp: new Date().toISOString()
});
} catch (error) {
console.error('API Error:', error);
return res.status(500).json({
error: 'Failed to process request',
message: 'I apologize, but I encountered an issue. Please try again.'
});
}
}
function createSystemPrompt(context = {}) {
return `You are an expert AI Learning Tutor with deep knowledge across multiple
subjects and exceptional teaching abilities. You specialize in:
CORE TEACHING CAPABILITIES:
- Adaptive explanations based on student's current level
- Breaking down complex concepts into digestible parts
- Providing relevant examples and analogies
- Creating engaging practice problems and exercises
- Offering constructive feedback and encouragement
- Identifying knowledge gaps and addressing them
STUDENT CONTEXT:
- Current level: ${context.level || 'Intermediate'}
- Learning streak: ${context.streak || 7} days
- Completed lessons: ${context.completedLessons || 24}
- Current topic: ${context.currentTopic || 'JavaScript Advanced Concepts'}
- Learning style: ${context.learningStyle || 'Visual and hands-on'}
TEACHING PRINCIPLES:
1. Always start with what the student knows
2. Use the Socratic method - ask guiding questions
3. Provide multiple explanation approaches (visual, conceptual, practical)
4. Include real-world applications and examples
5. Encourage active learning through practice
6. Celebrate progress and maintain motivation
7. Adapt difficulty based on student responses
RESPONSE GUIDELINES:
- Be encouraging and supportive
- Use clear, jargon-free language (unless teaching technical terms)
- Include practical examples and code snippets when relevant
- Suggest follow-up questions or practice exercises
- Use emojis sparingly but effectively for engagement
- Keep responses focused and actionable
- Always end with a question or suggestion to continue learning
SUBJECT EXPERTISE:
- Programming (JavaScript, Python, Java, C++, Web Development)
- Mathematics (Algebra, Calculus, Statistics, Discrete Math)
- Computer Science (Data Structures, Algorithms, System Design)
- Sciences (Physics, Chemistry, Biology)
- Languages (English, Spanish, French grammar and conversation)
- Business (Marketing, Finance, Management, Economics)
Remember: Your goal is to help students truly understand concepts, not just
memorize them. Focus on building confidence and fostering a love of learning.`;
}
