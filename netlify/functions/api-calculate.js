// Netlify Function for calculate API - loads from JSON data
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    console.log('DEBUG: Received request body:', JSON.stringify(requestBody));
    
    // Frontend sends { answers: {...} } but we need just the answers object
    const answers = requestBody.answers || requestBody;
    console.log('DEBUG: Extracted answers:', JSON.stringify(answers));
    
    // Load data from unified JSON file (single source of truth)
    const partiesPath = path.join(__dirname, 'data', 'parties-unified.json');
    const partiesData = fs.readFileSync(partiesPath, 'utf8');
    const parties = JSON.parse(partiesData);
    
    // Load questions data
    const questionsPath = path.join(__dirname, 'data', 'questions-28.json');
    const questionsData = fs.readFileSync(questionsPath, 'utf8');
    const questions = JSON.parse(questionsData);
    console.log('DEBUG: Loaded', questions.length, 'questions');
    
    // Combine all parties with type flag
    const allParties = [
      ...parties.mainParties.map(p => ({...p, type: 'main'})),
      ...parties.coalitionParties.map(p => ({...p, type: 'coalition'}))
    ];
    
    // Calculate user position
    let userPosition = {EKO: 0, SOC: 0, STA: 0, SUV: 0};
    let dimensionCounts = {EKO: 0, SOC: 0, STA: 0, SUV: 0};
    
    for (const [questionId, answer] of Object.entries(answers)) {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question && answer.value !== null) {
        // Fix polarity for EKO, STA, SOC dimensions (they are inverted in data)
        // SUV has correct polarity, don't invert it!
        let correctedPolarity = question.polarity;
        if (question.dimension === 'EKO' || question.dimension === 'STA' || question.dimension === 'SOC') {
          correctedPolarity = -question.polarity;
        }
        const score = ((answer.value - 3) / 2) * correctedPolarity;
        const weight = answer.important ? 2 : 1;
        userPosition[question.dimension] += score * weight;
        dimensionCounts[question.dimension] += weight;
        
        console.log(`DEBUG Q${questionId}: dim=${question.dimension}, pol=${question.polarity}→${correctedPolarity}, val=${answer.value}, score=${score}`);
      } else if (!question) {
        console.log(`DEBUG: Question ${questionId} not found!`);
      }
    }
    
    // Normalize
    console.log('DEBUG: Before normalization:', JSON.stringify(userPosition));
    console.log('DEBUG: Dimension counts:', JSON.stringify(dimensionCounts));
    
    for (const dim of ['EKO', 'SOC', 'STA', 'SUV']) {
      if (dimensionCounts[dim] > 0) {
        const beforeNorm = userPosition[dim];
        userPosition[dim] = userPosition[dim] / dimensionCounts[dim];
        userPosition[dim] = Math.max(-1, Math.min(1, userPosition[dim]));
        console.log(`DEBUG ${dim}: ${beforeNorm}/${dimensionCounts[dim]} = ${userPosition[dim]}`);
      }
    }
    
    console.log('DEBUG: Final user position:', JSON.stringify(userPosition));
    
    // Calculate matches
    const results = allParties.map(party => {
      const distance = Math.sqrt(
        Math.pow(userPosition.EKO - party.compass_position.EKO, 2) +
        Math.pow(userPosition.SOC - party.compass_position.SOC, 2) +
        Math.pow(userPosition.STA - (party.compass_position.STA || 0), 2) +
        Math.pow(userPosition.SUV - party.compass_position.SUV, 2)
      );
      const maxDistance = Math.sqrt(16); // 4 dimensions now
      const match = Math.max(0, (1 - distance / maxDistance)) * 100;
      
      return {
        party: party.name,
        match: Math.round(match * 10) / 10,
        compass_position: party.compass_position,
        type: party.type || 'main' // Include type from party data
      };
    });
    
    // Sort results - put satirical parties at the end
    results.sort((a, b) => {
      // Find if parties are satirical
      const aParty = allParties.find(p => p.name === a.party);
      const bParty = allParties.find(p => p.name === b.party);
      const aSatirical = aParty?.satirical || false;
      const bSatirical = bParty?.satirical || false;
      
      // If one is satirical and other isn't, put satirical at the end
      if (aSatirical && !bSatirical) return 1;
      if (!aSatirical && bSatirical) return -1;
      
      // Otherwise sort by match percentage
      return b.match - a.match;
    });
    
    // Calculate freedom score from user position dimensions
    // Freedom is represented by negative values (libertarian direction)
    // Each dimension ranges from -1 (max freedom) to +1 (max state control)
    // We calculate average and convert to 0-100 scale
    const avgPosition = (userPosition.EKO + userPosition.SOC + userPosition.STA + userPosition.SUV) / 4;
    // Convert from [-1, +1] to [0, 100]
    // -1 (max freedom) -> 100
    // 0 (neutral) -> 50
    // +1 (max control) -> 0
    const normalizedFreedom = Math.round(((1 - avgPosition) / 2) * 100);
    
    console.log('DEBUG: Freedom calculation:');
    console.log('  EKO:', userPosition.EKO, 'SOC:', userPosition.SOC, 'STA:', userPosition.STA, 'SUV:', userPosition.SUV);
    console.log('  Average position:', avgPosition);
    console.log('  Svobodometr:', normalizedFreedom, '%');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        results: results,
        user_compass: userPosition,
        svobodometr: normalizedFreedom,
        userPosition: userPosition,
        dimensions: userPosition
      })
    };
  } catch (error) {
    console.error('Error in calculation:', error);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Invalid request' })
    };
  }
};