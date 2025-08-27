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
      {code: "ANO", name: "ANO", compass_position: {EKO: -0.2, SOC: 0.0, SUV: -0.3}},
      {code: "SPOLU", name: "SPOLU", compass_position: {EKO: 0.5, SOC: -0.3, SUV: 0.6}},
      {code: "SPD", name: "SPD", compass_position: {EKO: -0.3, SOC: -0.8, SUV: -0.9}},
      {code: "PIRATI", name: "Piráti", compass_position: {EKO: -0.1, SOC: 0.7, SUV: 0.5}},
      {code: "STAN", name: "STAN", compass_position: {EKO: 0.3, SOC: 0.2, SUV: 0.7}},
      {code: "KSČM", name: "KSČM", compass_position: {EKO: -0.8, SOC: -0.4, SUV: -0.6}},
      {code: "TRIKOLORA", name: "Trikolóra", compass_position: {EKO: 0.4, SOC: -0.7, SUV: -0.8}},
      {code: "PRISAHA", name: "Přísaha", compass_position: {EKO: 0.2, SOC: -0.2, SUV: -0.4}},
      {code: "SOCDEM", name: "SOCDEM", compass_position: {EKO: -0.5, SOC: 0.3, SUV: 0.3}},
      {code: "ZELENI", name: "Zelení", compass_position: {EKO: -0.3, SOC: 0.8, SUV: 0.8}},
      {code: "SVOBODNI", name: "Svobodní", compass_position: {EKO: 0.9, SOC: 0.3, SUV: -0.5}},
      {code: "MOTORISTE", name: "Motoristé", compass_position: {EKO: 0.5, SOC: -0.3, SUV: -0.6}},
      {code: "PRO", name: "PRO", compass_position: {EKO: 0.2, SOC: -0.4, SUV: -0.7}},
      {code: "VYZVA2025", name: "Výzva2025", compass_position: {EKO: 0.1, SOC: -0.2, SUV: -0.3}},
      {code: "KRUH", name: "KRUH", compass_position: {EKO: 0.0, SOC: 0.4, SUV: 0.2}},
      {code: "VOLUNTIA", name: "VOLUNTIA", compass_position: {EKO: 0.8, SOC: 0.6, SUV: -0.2}},
      {code: "REPUBLIKA", name: "REPUBLIKA", compass_position: {EKO: 0.3, SOC: -0.6, SUV: -0.7}},
      {code: "BUDOUCNOST", name: "Budoucnost", compass_position: {EKO: -0.2, SOC: 0.5, SUV: 0.6}},
      {code: "VOLT", name: "Volt", compass_position: {EKO: 0.0, SOC: 0.6, SUV: 0.9}},
      {code: "STACILO", name: "Stačilo!", compass_position: {EKO: -0.7, SOC: 0.4, SUV: -0.3}},
      {code: "JASAN", name: "JASAN", compass_position: {EKO: 0.6, SOC: -0.5, SUV: -0.4}},
      {code: "LEVY_BLOK", name: "Levý blok", compass_position: {EKO: -0.9, SOC: 0.7, SUV: -0.1}},
      {code: "NARODNI_DEMOKRACIE", name: "Národní demokracie", compass_position: {EKO: 0.2, SOC: -0.8, SUV: -0.9}},
      {code: "PRAVO_RESPEKT", name: "Právo Respekt", compass_position: {EKO: 0.1, SOC: 0.1, SUV: 0.0}},
      {code: "ALIANCE_STABILITA", name: "Aliance pro stabilitu", compass_position: {EKO: -0.1, SOC: -0.3, SUV: -0.2}},
      {code: "CESKA_SUVERENITA", name: "Česká suverenita", compass_position: {EKO: 0.3, SOC: -0.6, SUV: -0.8}}
    ];

    // Calculate user position
    let userPosition = {EKO: 0, SOC: 0, SUV: 0};
    let dimensionCounts = {EKO: 0, SOC: 0, SUV: 0};
    
    for (const [questionId, answer] of Object.entries(answers)) {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (question && answer.value !== null) {
        const score = ((answer.value - 3) / 2) * question.polarity;
        const weight = answer.important ? 2 : 1;
        userPosition[question.dimension] += score * weight;
        dimensionCounts[question.dimension] += weight;
      }
    }
    
    // Normalize
    for (const dim of ['EKO', 'SOC', 'SUV']) {
      if (dimensionCounts[dim] > 0) {
        userPosition[dim] = userPosition[dim] / dimensionCounts[dim];
        userPosition[dim] = Math.max(-1, Math.min(1, userPosition[dim]));
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
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        results: results,
        user_compass: userPosition
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request' })
    };
  }
};