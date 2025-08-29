// Netlify Function for calculate API
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    const answers = JSON.parse(event.body);
    
    // Questions data
    const questions = [
      {id: 1, dimension: "EKO", polarity: 1},
      {id: 2, dimension: "EKO", polarity: -1},
      {id: 3, dimension: "EKO", polarity: 1},
      {id: 4, dimension: "EKO", polarity: -1},
      {id: 5, dimension: "EKO", polarity: 1},
      {id: 6, dimension: "EKO", polarity: 1},
      {id: 7, dimension: "EKO", polarity: 1},
      {id: 8, dimension: "EKO", polarity: 1},
      {id: 9, dimension: "EKO", polarity: -1},
      {id: 10, dimension: "EKO", polarity: -1},
      {id: 11, dimension: "EKO", polarity: 1},
      {id: 12, dimension: "SOC", polarity: 1},
      {id: 13, dimension: "SOC", polarity: 1},
      {id: 14, dimension: "SOC", polarity: -1},
      {id: 15, dimension: "SOC", polarity: 1},
      {id: 16, dimension: "SOC", polarity: 1},
      {id: 17, dimension: "SOC", polarity: -1},
      {id: 18, dimension: "SOC", polarity: 1},
      {id: 19, dimension: "SOC", polarity: -1},
      {id: 20, dimension: "SOC", polarity: 1},
      {id: 21, dimension: "SOC", polarity: -1},
      {id: 22, dimension: "SOC", polarity: 1},
      {id: 23, dimension: "SUV", polarity: 1},
      {id: 24, dimension: "SUV", polarity: 1},
      {id: 25, dimension: "SUV", polarity: -1},
      {id: 26, dimension: "SUV", polarity: 1},
      {id: 27, dimension: "SUV", polarity: -1},
      {id: 28, dimension: "SUV", polarity: 1},
      {id: 29, dimension: "SUV", polarity: 1},
      {id: 30, dimension: "SUV", polarity: -1},
      {id: 31, dimension: "SUV", polarity: 1},
      {id: 32, dimension: "SUV", polarity: -1},
      {id: 33, dimension: "SUV", polarity: 1}
    ];

    // Parties data  
    const parties = [
      {code: "ANO", name: "ANO", compass_position: {EKO: -0.36, SOC: 0.23, SUV: -0.41}},
      {code: "SPOLU", name: "SPOLU", compass_position: {EKO: 0.64, SOC: -0.05, SUV: 0.64}},
      {code: "SPD", name: "SPD", compass_position: {EKO: -0.41, SOC: 0.86, SUV: -0.82}},
      {code: "PIRATI", name: "Piráti", compass_position: {EKO: -0.32, SOC: -0.95, SUV: 0.68}},
      {code: "STAN", name: "STAN", compass_position: {EKO: 0.14, SOC: -0.18, SUV: 0.73}},
      {code: "KSČM", name: "KSČM", compass_position: {EKO: -0.95, SOC: 0.23, SUV: -0.73}},
      {code: "TRIKOLORA", name: "Trikolóra", compass_position: {EKO: 0.77, SOC: 0.82, SUV: -0.68}},
      {code: "PRISAHA", name: "Přísaha", compass_position: {EKO: 0.23, SOC: 0.27, SUV: 0.09}},
      {code: "SOCDEM", name: "SOCDEM", compass_position: {EKO: -0.68, SOC: -0.55, SUV: 0.36}},
      {code: "ZELENI", name: "Zelení", compass_position: {EKO: -0.50, SOC: -1.00, SUV: 1.00}},
      {code: "SVOBODNI", name: "Svobodní", compass_position: {EKO: 0.95, SOC: -0.45, SUV: -0.77}},
      {code: "MOTORISTE", name: "Motoristé", compass_position: {EKO: 0.55, SOC: 0.32, SUV: -0.50}},
      {code: "PRO", name: "PRO", compass_position: {EKO: 0.32, SOC: 0.41, SUV: -0.64}},
      {code: "REPUBLIKA", name: "REPUBLIKA", compass_position: {EKO: 0.27, SOC: 0.82, SUV: -0.68}},
      {code: "STACILO", name: "Stačilo!", compass_position: {EKO: -0.95, SOC: -0.45, SUV: -0.41}},
      {code: "VYZVA2025", name: "Výzva2025", compass_position: {EKO: 0.00, SOC: 0.14, SUV: 0.14}},
      {code: "KRUH", name: "KRUH", compass_position: {EKO: 0.00, SOC: -0.45, SUV: -0.18}},
      {code: "VOLUNTIA", name: "VOLUNTIA", compass_position: {EKO: 1.00, SOC: -0.73, SUV: -0.09}},
      {code: "BUDOUCNOST", name: "Budoucnost", compass_position: {EKO: -0.32, SOC: -0.50, SUV: -0.64}},
      {code: "JASAN", name: "JASAN", compass_position: {EKO: 0.55, SOC: 0.36, SUV: 0.23}},
      {code: "LEVY_BLOK", name: "Levý blok", compass_position: {EKO: -1.00, SOC: -0.91, SUV: 0.09}},
      {code: "NARODNI_DEMOKRACIE", name: "Národní demokracie", compass_position: {EKO: 0.27, SOC: 0.86, SUV: -0.77}},
      {code: "PRAVO_RESPEKT", name: "Právo Respekt", compass_position: {EKO: 0.00, SOC: 0.00, SUV: 0.00}},
      {code: "ALIANCE_STABILITA", name: "Aliance pro stabilitu", compass_position: {EKO: -0.18, SOC: 0.23, SUV: 0.09}},
      {code: "CESKA_SUVERENITA", name: "Česká suverenita", compass_position: {EKO: 0.27, SOC: 0.59, SUV: -0.73}},
      {code: "VOLT", name: "Volt", compass_position: {EKO: -0.05, SOC: -0.86, SUV: 1.00}}
    ];

    // Calculate user position
    let userPosition = {EKO: 0, SOC: 0, SUV: 0};
    let dimensionCounts = {EKO: 0, SOC: 0, SUV: 0};
    
    // Calculate freedom score
    let freedomScore = 0;
    let freedomCount = 0;
    
    for (const [questionId, answer] of Object.entries(answers)) {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question && answer.value !== null) {
        const score = ((answer.value - 3) / 2) * question.polarity;
        const weight = answer.important ? 2 : 1;
        userPosition[question.dimension] += score * weight;
        dimensionCounts[question.dimension] += weight;
        
        // Freedom score calculation
        // Pro-freedom questions (less state control)
        const proFreedom = [1, 3, 5, 11, 12, 13, 15, 20, 25, 27, 32];
        // Pro-state questions (more state control)
        const proState = [2, 4, 9, 10, 14, 17, 19, 21, 23, 24, 26, 28, 31];
        
        const qId = parseInt(questionId);
        if (proFreedom.includes(qId)) {
          // For pro-freedom questions: Agree (1) = +2, Disagree (5) = -2
          freedomScore += (3 - answer.value) * weight;
          freedomCount += weight;
        } else if (proState.includes(qId)) {
          // For pro-state questions: Agree (1) = -2, Disagree (5) = +2
          freedomScore += (answer.value - 3) * weight;
          freedomCount += weight;
        }
      }
    }
    
    // Normalize
    for (const dim of ['EKO', 'SOC', 'SUV']) {
      if (dimensionCounts[dim] > 0) {
        userPosition[dim] = userPosition[dim] / dimensionCounts[dim];
        userPosition[dim] = Math.max(-1, Math.min(1, userPosition[dim]));
        // Invert EKO axis to match party positions
        if (dim === 'EKO') {
          userPosition[dim] = -userPosition[dim];
        }
      }
    }
    
    // Calculate matches
    const results = parties.map(party => {
      const distance = Math.sqrt(
        Math.pow(userPosition.EKO - party.compass_position.EKO, 2) +
        Math.pow(userPosition.SOC - party.compass_position.SOC, 2) +
        Math.pow(userPosition.SUV - party.compass_position.SUV, 2)
      );
      const maxDistance = Math.sqrt(12);
      const match = Math.max(0, (1 - distance / maxDistance)) * 100;
      
      return {
        party: party.name,
        match: Math.round(match * 10) / 10,
        compass_position: party.compass_position
      };
    });
    
    results.sort((a, b) => b.match - a.match);
    
    // Normalize freedom score to 0-100
    // Using actual weights for proper normalization
    // Max possible score is freedomCount * 2 (all extreme answers)
    // Score range is -2*freedomCount to +2*freedomCount
    // Normalize to 0-100 where 50 is neutral
    const normalizedFreedom = freedomCount > 0 
      ? Math.max(0, Math.min(100, 50 + (freedomScore / (freedomCount * 2)) * 50))
      : 50;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        results: results,
        user_compass: userPosition,
        freedom_score: Math.round(normalizedFreedom)
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' })
    };
  }
};