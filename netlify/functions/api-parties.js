// Netlify Function for parties API - loads from JSON data
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Load parties data from unified JSON file (single source of truth)
    const dataPath = path.join(__dirname, 'data', 'parties-unified.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Return the full data structure with both mainParties and coalitionParties
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        mainParties: data.mainParties,
        coalitionParties: data.coalitionParties
      })
    };
  } catch (error) {
    console.error('Error loading parties:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to load parties data' })
    };
  }
};