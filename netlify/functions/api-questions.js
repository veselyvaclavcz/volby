// Netlify Function for questions API - embedded data
const questions = require('./data/questions-28.json');

exports.handler = async (event, context) => {
  try {
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(questions)
    };
  } catch (error) {
    console.error('Error loading questions:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to load questions data' })
    };
  }
};