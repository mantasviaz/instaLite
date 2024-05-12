// Import required libraries
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

module.exports = {
  openaiApiKey: process.env.OPENAI_API_KEY || 'sk-proj-2C7dZL7K7YMD6LAPZWaTT3BlbkFJHWvWpCkVIAQgHykmLlBs',
  chromaDbHost: process.env.CHROMADB_HOST || 'localhost',
  chromaDbPort: process.env.CHROMADB_PORT || 8000
};
