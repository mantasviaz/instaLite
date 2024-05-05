const openai = require('openai');
const { sequelize } = require('../config/dbConfig');
const { User, Post, Comment } = require('../models');

const openaiApi = new openai.OpenAI(process.env.OPENAI_API_KEY); 

// Controller function for handling the search request
exports.search = async (req, res) => {
  const { query } = req.body; // request body contains the natural language query

  try {
    // Use OpenAI to search the database based on the natural language query
    const searchResults = await openaiApi.search({
      engine: 'davinci',
      documents: [User, Post, Comment], // Add more models to search them
      query
    });

    // TODO: Process and format

    res.status(200).json({ results: searchResults });
  } catch (error) {
    console.error('Error performing natural language search:', error);
    res.status(500).json({ error: 'Failed to perform natural language search' });
  }
};
