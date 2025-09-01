// Netlify Function for party answers API - loads from JSON data
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Load party answers data from JSON file
    const dataPath = path.join(__dirname, '..', '..', 'party-answers-raw.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Convert to a simpler format: party name -> answers mapping
    const partyAnswers = {};
    
    data.parties.forEach(party => {
      partyAnswers[party.name] = party.answers;
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(partyAnswers)
    };
  } catch (error) {
    console.error('Error loading party answers:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Failed to load party answers data' })
    };
  }
};