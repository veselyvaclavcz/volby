// Netlify Function for parties API - embedded data
const partiesData = require('./data/parties-unified.json');

exports.handler = async (event, context) => {
  try {
    
    // Return the full data structure with both mainParties and coalitionParties
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        mainParties: partiesData.mainParties,
        coalitionParties: partiesData.coalitionParties
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