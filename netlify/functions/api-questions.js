// Netlify Function for questions API - loads from JSON data
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Load questions data from JSON file
    const dataPath = path.join(__dirname, 'data', 'questions-28.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const questions = JSON.parse(rawData);
    
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