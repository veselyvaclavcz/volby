// Netlify Function for parties API
exports.handler = async (event, context) => {
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
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(parties)
  };
};