// Recalculate party positions based on how they would answer the questions
// This ensures the same scale and logic for both users and parties

const questions = [
  // Economic dimension (EKO) - 11 questions
  {id: 1, text: "Daně by měly být co nejnižší", dimension: "EKO", polarity: 1},
  {id: 2, text: "Stát by měl aktivně podporovat domácí firmy", dimension: "EKO", polarity: -1},
  {id: 3, text: "Privatizace státních podniků prospívá ekonomice", dimension: "EKO", polarity: 1},
  {id: 4, text: "Minimální mzda by měla výrazně růst", dimension: "EKO", polarity: -1},
  {id: 5, text: "Plochá daň je lepší než progresivní", dimension: "EKO", polarity: 1},
  {id: 6, text: "Sociální dávky jsou často zneužívány", dimension: "EKO", polarity: 1},
  {id: 7, text: "Zrušení superhrubé mzdy bylo správné", dimension: "EKO", polarity: 1},
  {id: 8, text: "Podpora podnikání je důležitější než sociální výdaje", dimension: "EKO", polarity: 1},
  {id: 9, text: "Důchodový věk by neměl dále růst", dimension: "EKO", polarity: -1},
  {id: 10, text: "Zdravotnictví by mělo zůstat primárně veřejné", dimension: "EKO", polarity: -1},
  {id: 11, text: "Trh si vše vyřeší lépe než státní regulace", dimension: "EKO", polarity: 1},
  
  // Social dimension (SOC) - 11 questions  
  {id: 12, text: "Stejnopohlavní páry by měly mít právo na adopce", dimension: "SOC", polarity: 1},
  {id: 13, text: "Cannabis by měl být legalizován pro rekreační užívání", dimension: "SOC", polarity: 1},
  {id: 14, text: "Tradiční rodina je základem společnosti", dimension: "SOC", polarity: -1},
  {id: 15, text: "Právo na potrat by mělo zůstat liberální", dimension: "SOC", polarity: 1},
  {id: 16, text: "Multikulturalismus obohacuje společnost", dimension: "SOC", polarity: 1},
  {id: 17, text: "Národní identita je důležitější než evropská", dimension: "SOC", polarity: -1},
  {id: 18, text: "Registrované partnerství by mělo být nahrazeno manželstvím pro všechny", dimension: "SOC", polarity: 1},
  {id: 19, text: "Gender ideologie ohrožuje tradiční hodnoty", dimension: "SOC", polarity: -1},
  {id: 20, text: "Církve by neměly mít vliv na politiku", dimension: "SOC", polarity: 1},
  {id: 21, text: "Romská integrace selhává kvůli jejich neochotě", dimension: "SOC", polarity: -1},
  {id: 22, text: "Sexuální výchova by měla být povinná na školách", dimension: "SOC", polarity: 1},
  
  // Sovereignty dimension (SUV) - 11 questions
  {id: 23, text: "Česko by mělo přijmout euro", dimension: "SUV", polarity: 1},
  {id: 24, text: "EU Green Deal je správná cesta", dimension: "SUV", polarity: 1},
  {id: 25, text: "Národní suverenita je důležitější než evropská integrace", dimension: "SUV", polarity: -1},
  {id: 26, text: "EU migrační pakt je pro Česko přijatelný", dimension: "SUV", polarity: 1},
  {id: 27, text: "Měli bychom vystoupit z EU (Czexit)", dimension: "SUV", polarity: -1},
  {id: 28, text: "Uprchlické kvóty jsou solidární řešení", dimension: "SUV", polarity: 1},
  {id: 29, text: "NATO je zárukou naší bezpečnosti", dimension: "SUV", polarity: 1},
  {id: 30, text: "Sankce proti Rusku poškozují hlavně nás", dimension: "SUV", polarity: -1},
  {id: 31, text: "Evropská federace by byla prospěšná", dimension: "SUV", polarity: 1},
  {id: 32, text: "Visegrádská skupina je důležitější než EU", dimension: "SUV", polarity: -1},
  {id: 33, text: "Podpora Ukrajiny by měla pokračovat", dimension: "SUV", polarity: 1}
];

// Party answers to questions (1-5 scale: 1=strongly agree, 5=strongly disagree)
// Based on actual party programs and public stances
const partyAnswers = {
  "ANO": {
    // Economic: center-left, social spending but also business-friendly
    1: 3, 2: 2, 3: 3, 4: 2, 5: 4, 6: 3, 7: 3, 8: 4, 9: 2, 10: 1, 11: 4,
    // Social: centrist, slightly conservative
    12: 4, 13: 4, 14: 2, 15: 3, 16: 3, 17: 2, 18: 4, 19: 3, 20: 3, 21: 3, 22: 3,
    // Sovereignty: euroskeptic but not extreme
    23: 5, 24: 4, 25: 2, 26: 4, 27: 4, 28: 5, 29: 2, 30: 2, 31: 5, 32: 2, 33: 3
  },
  "SPOLU": {
    // Economic: right-wing, free market
    1: 1, 2: 4, 3: 1, 4: 4, 5: 2, 6: 2, 7: 1, 8: 1, 9: 4, 10: 3, 11: 2,
    // Social: conservative-liberal mix
    12: 3, 13: 4, 14: 2, 15: 2, 16: 3, 17: 3, 18: 3, 19: 3, 20: 2, 21: 3, 22: 2,
    // Sovereignty: pro-EU
    23: 2, 24: 2, 25: 4, 26: 2, 27: 5, 28: 3, 29: 1, 30: 5, 31: 2, 32: 4, 33: 1
  },
  "SPD": {
    // Economic: left on welfare, right on some issues
    1: 3, 2: 1, 3: 4, 4: 2, 5: 3, 6: 2, 7: 3, 8: 4, 9: 1, 10: 1, 11: 4,
    // Social: very conservative
    12: 5, 13: 5, 14: 1, 15: 4, 16: 5, 17: 1, 18: 5, 19: 1, 20: 4, 21: 1, 22: 4,
    // Sovereignty: strongly anti-EU
    23: 5, 24: 5, 25: 1, 26: 5, 27: 2, 28: 5, 29: 3, 30: 1, 31: 5, 32: 1, 33: 4
  },
  "PIRATI": {
    // Economic: center-left, digital economy focus
    1: 3, 2: 3, 3: 3, 4: 2, 5: 4, 6: 4, 7: 3, 8: 3, 9: 2, 10: 1, 11: 4,
    // Social: very progressive
    12: 1, 13: 1, 14: 5, 15: 1, 16: 1, 17: 4, 18: 1, 19: 5, 20: 1, 21: 5, 22: 1,
    // Sovereignty: pro-EU
    23: 2, 24: 1, 25: 4, 26: 2, 27: 5, 28: 2, 29: 1, 30: 4, 31: 2, 32: 4, 33: 1
  },
  "STAN": {
    // Economic: center-right
    1: 2, 2: 3, 3: 2, 4: 3, 5: 3, 6: 3, 7: 2, 8: 2, 9: 3, 10: 2, 11: 3,
    // Social: moderate liberal
    12: 3, 13: 3, 14: 3, 15: 2, 16: 2, 17: 3, 18: 3, 19: 3, 20: 2, 21: 3, 22: 2,
    // Sovereignty: strongly pro-EU
    23: 2, 24: 1, 25: 4, 26: 2, 27: 5, 28: 2, 29: 1, 30: 5, 31: 2, 32: 4, 33: 1
  },
  "KSČM": {
    // Economic: far left
    1: 5, 2: 1, 3: 5, 4: 1, 5: 5, 6: 5, 7: 4, 8: 5, 9: 1, 10: 1, 11: 5,
    // Social: conservative left
    12: 4, 13: 3, 14: 2, 15: 2, 16: 3, 17: 2, 18: 4, 19: 2, 20: 3, 21: 2, 22: 3,
    // Sovereignty: anti-EU, pro-Russia
    23: 5, 24: 4, 25: 1, 26: 5, 27: 3, 28: 5, 29: 4, 30: 1, 31: 5, 32: 2, 33: 4
  },
  "TRIKOLORA": {
    // Economic: right-wing
    1: 1, 2: 3, 3: 1, 4: 5, 5: 1, 6: 1, 7: 1, 8: 1, 9: 4, 10: 3, 11: 1,
    // Social: very conservative
    12: 5, 13: 5, 14: 1, 15: 4, 16: 5, 17: 1, 18: 5, 19: 1, 20: 3, 21: 1, 22: 4,
    // Sovereignty: anti-EU
    23: 5, 24: 5, 25: 1, 26: 5, 27: 2, 28: 5, 29: 2, 30: 2, 31: 5, 32: 1, 33: 3
  },
  "PRISAHA": {
    // Economic: center-right
    1: 2, 2: 3, 3: 2, 4: 3, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 2, 11: 3,
    // Social: moderate conservative
    12: 4, 13: 4, 14: 2, 15: 3, 16: 3, 17: 2, 18: 4, 19: 2, 20: 2, 21: 2, 22: 3,
    // Sovereignty: moderate euroskeptic
    23: 4, 24: 3, 25: 2, 26: 4, 27: 4, 28: 4, 29: 2, 30: 3, 31: 4, 32: 3, 33: 2
  },
  "SOCDEM": {
    // Economic: left
    1: 4, 2: 1, 3: 4, 4: 1, 5: 5, 6: 4, 7: 3, 8: 4, 9: 1, 10: 1, 11: 4,
    // Social: progressive
    12: 2, 13: 2, 14: 3, 15: 1, 16: 2, 17: 4, 18: 2, 19: 4, 20: 2, 21: 4, 22: 1,
    // Sovereignty: moderate pro-EU
    23: 3, 24: 2, 25: 3, 26: 3, 27: 5, 28: 2, 29: 2, 30: 4, 31: 3, 32: 4, 33: 2
  },
  "ZELENI": {
    // Economic: left, green economy
    1: 4, 2: 2, 3: 4, 4: 2, 5: 4, 6: 4, 7: 3, 8: 4, 9: 2, 10: 1, 11: 4,
    // Social: very progressive
    12: 1, 13: 1, 14: 5, 15: 1, 16: 1, 17: 5, 18: 1, 19: 5, 20: 1, 21: 5, 22: 1,
    // Sovereignty: strongly pro-EU
    23: 1, 24: 1, 25: 5, 26: 1, 27: 5, 28: 1, 29: 1, 30: 5, 31: 1, 32: 5, 33: 1
  },
  "SVOBODNI": {
    // Economic: libertarian right
    1: 1, 2: 5, 3: 1, 4: 5, 5: 1, 6: 1, 7: 1, 8: 1, 9: 5, 10: 4, 11: 1,
    // Social: liberal
    12: 2, 13: 1, 14: 3, 15: 1, 16: 2, 17: 3, 18: 2, 19: 4, 20: 1, 21: 3, 22: 3,
    // Sovereignty: euroskeptic
    23: 5, 24: 4, 25: 2, 26: 4, 27: 3, 28: 5, 29: 2, 30: 2, 31: 5, 32: 3, 33: 2
  },
  "MOTORISTE": {
    // Economic: right
    1: 1, 2: 3, 3: 2, 4: 4, 5: 2, 6: 2, 7: 1, 8: 1, 9: 4, 10: 3, 11: 2,
    // Social: conservative
    12: 4, 13: 3, 14: 2, 15: 3, 16: 4, 17: 2, 18: 4, 19: 2, 20: 3, 21: 2, 22: 3,
    // Sovereignty: anti-green deal
    23: 5, 24: 5, 25: 2, 26: 4, 27: 3, 28: 5, 29: 2, 30: 2, 31: 5, 32: 2, 33: 3
  },
  "PRO": {
    // Economic: center-right
    1: 2, 2: 3, 3: 2, 4: 3, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 2,
    // Social: conservative
    12: 4, 13: 4, 14: 2, 15: 3, 16: 4, 17: 1, 18: 4, 19: 2, 20: 3, 21: 2, 22: 3,
    // Sovereignty: anti-EU  
    23: 5, 24: 5, 25: 1, 26: 5, 27: 2, 28: 5, 29: 2, 30: 2, 31: 5, 32: 2, 33: 3
  },
  "REPUBLIKA": {
    // Economic: center-right
    1: 2, 2: 2, 3: 2, 4: 3, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 2,
    // Social: very conservative
    12: 5, 13: 5, 14: 1, 15: 4, 16: 5, 17: 1, 18: 5, 19: 1, 20: 3, 21: 1, 22: 4,
    // Sovereignty: anti-EU
    23: 5, 24: 5, 25: 1, 26: 5, 27: 2, 28: 5, 29: 2, 30: 2, 31: 5, 32: 1, 33: 3
  },
  "STACILO": {
    // Economic: far left
    1: 5, 2: 1, 3: 5, 4: 1, 5: 5, 6: 5, 7: 4, 8: 5, 9: 1, 10: 1, 11: 5,
    // Social: progressive left
    12: 2, 13: 2, 14: 3, 15: 1, 16: 2, 17: 3, 18: 2, 19: 4, 20: 2, 21: 4, 22: 2,
    // Sovereignty: anti-NATO
    23: 4, 24: 3, 25: 2, 26: 4, 27: 3, 28: 4, 29: 4, 30: 2, 31: 4, 32: 2, 33: 4
  },
  "LEVY_BLOK": {
    // Economic: far left
    1: 5, 2: 1, 3: 5, 4: 1, 5: 5, 6: 5, 7: 5, 8: 5, 9: 1, 10: 1, 11: 5,
    // Social: progressive
    12: 1, 13: 1, 14: 4, 15: 1, 16: 1, 17: 4, 18: 1, 19: 5, 20: 1, 21: 5, 22: 1,
    // Sovereignty: anti-NATO but not necessarily pro-EU
    23: 3, 24: 3, 25: 2, 26: 3, 27: 3, 28: 2, 29: 4, 30: 2, 31: 3, 32: 3, 33: 3
  },
  "VYZVA2025": {
    // Economic: center
    1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3,
    // Social: moderate conservative
    12: 3, 13: 3, 14: 2, 15: 3, 16: 3, 17: 2, 18: 3, 19: 2, 20: 3, 21: 3, 22: 3,
    // Sovereignty: moderate euroskeptic
    23: 4, 24: 3, 25: 2, 26: 3, 27: 3, 28: 4, 29: 2, 30: 3, 31: 4, 32: 3, 33: 3
  },
  "KRUH": {
    // Economic: center
    1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3,
    // Social: progressive
    12: 2, 13: 2, 14: 3, 15: 2, 16: 2, 17: 4, 18: 2, 19: 4, 20: 2, 21: 4, 22: 2,
    // Sovereignty: moderate pro-EU
    23: 3, 24: 2, 25: 3, 26: 3, 27: 4, 28: 3, 29: 2, 30: 3, 31: 3, 32: 3, 33: 2
  },
  "VOLUNTIA": {
    // Economic: libertarian right
    1: 1, 2: 5, 3: 1, 4: 5, 5: 1, 6: 1, 7: 1, 8: 1, 9: 5, 10: 5, 11: 1,
    // Social: liberal
    12: 2, 13: 1, 14: 4, 15: 1, 16: 2, 17: 4, 18: 1, 19: 5, 20: 1, 21: 4, 22: 2,
    // Sovereignty: moderate
    23: 3, 24: 3, 25: 2, 26: 3, 27: 4, 28: 3, 29: 2, 30: 3, 31: 3, 32: 3, 33: 2
  },
  "BUDOUCNOST": {
    // Economic: center-left
    1: 3, 2: 2, 3: 3, 4: 2, 5: 4, 6: 4, 7: 3, 8: 3, 9: 2, 10: 2, 11: 4,
    // Social: progressive
    12: 2, 13: 2, 14: 4, 15: 2, 16: 2, 17: 4, 18: 2, 19: 4, 20: 2, 21: 4, 22: 2,
    // Sovereignty: pro-EU
    23: 2, 24: 2, 25: 4, 26: 2, 27: 5, 28: 2, 29: 1, 30: 4, 31: 2, 32: 4, 33: 1
  },
  "JASAN": {
    // Economic: right
    1: 1, 2: 4, 3: 2, 4: 4, 5: 2, 6: 2, 7: 1, 8: 2, 9: 4, 10: 3, 11: 2,
    // Social: conservative
    12: 4, 13: 4, 14: 2, 15: 3, 16: 4, 17: 2, 18: 4, 19: 2, 20: 3, 21: 2, 22: 3,
    // Sovereignty: moderate euroskeptic
    23: 4, 24: 4, 25: 2, 26: 4, 27: 3, 28: 4, 29: 2, 30: 3, 31: 4, 32: 3, 33: 3
  },
  "NARODNI_DEMOKRACIE": {
    // Economic: center-right
    1: 2, 2: 2, 3: 2, 4: 3, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 2,
    // Social: very conservative
    12: 5, 13: 5, 14: 1, 15: 4, 16: 5, 17: 1, 18: 5, 19: 1, 20: 3, 21: 1, 22: 5,
    // Sovereignty: strongly anti-EU
    23: 5, 24: 5, 25: 1, 26: 5, 27: 1, 28: 5, 29: 2, 30: 1, 31: 5, 32: 1, 33: 3
  },
  "PRAVO_RESPEKT": {
    // Economic: center
    1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3,
    // Social: center
    12: 3, 13: 3, 14: 3, 15: 3, 16: 3, 17: 3, 18: 3, 19: 3, 20: 3, 21: 3, 22: 3,
    // Sovereignty: center
    23: 3, 24: 3, 25: 3, 26: 3, 27: 3, 28: 3, 29: 3, 30: 3, 31: 3, 32: 3, 33: 3
  },
  "ALIANCE_STABILITA": {
    // Economic: center-left
    1: 3, 2: 2, 3: 3, 4: 2, 5: 3, 6: 3, 7: 3, 8: 3, 9: 2, 10: 2, 11: 3,
    // Social: moderate conservative
    12: 3, 13: 4, 14: 2, 15: 3, 16: 3, 17: 2, 18: 3, 19: 2, 20: 3, 21: 2, 22: 3,
    // Sovereignty: moderate euroskeptic
    23: 3, 24: 3, 25: 2, 26: 3, 27: 3, 28: 3, 29: 2, 30: 2, 31: 3, 32: 2, 33: 3
  },
  "CESKA_SUVERENITA": {
    // Economic: center-right
    1: 2, 2: 2, 3: 2, 4: 3, 5: 2, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 2,
    // Social: conservative
    12: 5, 13: 4, 14: 1, 15: 3, 16: 4, 17: 1, 18: 4, 19: 1, 20: 3, 21: 2, 22: 4,
    // Sovereignty: strongly anti-EU
    23: 5, 24: 5, 25: 1, 26: 5, 27: 2, 28: 5, 29: 2, 30: 1, 31: 5, 32: 1, 33: 3
  },
  "VOLT": {
    // Economic: center
    1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 2, 11: 3,
    // Social: progressive
    12: 1, 13: 2, 14: 4, 15: 1, 16: 1, 17: 5, 18: 1, 19: 5, 20: 1, 21: 4, 22: 1,
    // Sovereignty: federalist
    23: 1, 24: 1, 25: 5, 26: 1, 27: 5, 28: 1, 29: 1, 30: 5, 31: 1, 32: 5, 33: 1
  }
};

// Calculate positions using the same logic as user calculation
function calculatePartyPosition(answers) {
  let position = {EKO: 0, SOC: 0, SUV: 0};
  let counts = {EKO: 0, SOC: 0, SUV: 0};
  
  questions.forEach(q => {
    if (answers[q.id]) {
      const score = ((answers[q.id] - 3) / 2) * q.polarity;
      position[q.dimension] += score;
      counts[q.dimension] += 1;
    }
  });
  
  // Normalize
  for (const dim of ['EKO', 'SOC', 'SUV']) {
    if (counts[dim] > 0) {
      position[dim] = position[dim] / counts[dim];
      position[dim] = Math.max(-1, Math.min(1, position[dim]));
    }
  }
  
  return position;
}

// Calculate all party positions
const parties = Object.entries(partyAnswers).map(([code, answers]) => {
  const position = calculatePartyPosition(answers);
  return {
    code,
    position
  };
});

// Output the results
parties.forEach(party => {
  console.log(`{code: "${party.code}", compass_position: {EKO: ${party.position.EKO.toFixed(2)}, SOC: ${party.position.SOC.toFixed(2)}, SUV: ${party.position.SUV.toFixed(2)}}},`);
});