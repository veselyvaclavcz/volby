// Netlify Function for positions API - loads from JSON data
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Load parties data from JSON file
    const dataPath = path.join(__dirname, 'data', 'parties.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Convert to positions format (name -> position mapping)
    const positions = {};
    
    // Add main parties
    data.mainParties.forEach(party => {
      positions[party.name] = party.compass_position;
    });
    
    // Add coalition parties
    data.coalitionParties.forEach(party => {
      positions[party.name] = party.compass_position;
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(positions)
    };
  } catch (error) {
    console.error('Error loading positions:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to load positions data' })
    };
  }
};