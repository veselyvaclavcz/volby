// Test party matching for specific position
const userPosition = {EKO: -0.73, SOC: -0.09, SUV: 0.75};

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
  {code: "VOLUNTIA", name: "VOLUNTIA", compass_position: {EKO: 1.00, SOC: -0.73, SUV: -0.59}},
  {code: "BUDOUCNOST", name: "Budoucnost", compass_position: {EKO: -0.32, SOC: -0.50, SUV: -0.64}},
  {code: "JASAN", name: "JASAN", compass_position: {EKO: 0.55, SOC: 0.36, SUV: 0.23}},
  {code: "LEVY_BLOK", name: "Levý blok", compass_position: {EKO: -1.00, SOC: -0.91, SUV: 0.09}},
  {code: "NARODNI_DEMOKRACIE", name: "Národní demokracie", compass_position: {EKO: 0.27, SOC: 0.86, SUV: -0.77}},
  {code: "PRAVO_RESPEKT", name: "Právo Respekt", compass_position: {EKO: 0.00, SOC: 0.00, SUV: 0.00}},
  {code: "ALIANCE_STABILITA", name: "Aliance pro stabilitu", compass_position: {EKO: -0.18, SOC: 0.23, SUV: 0.09}},
  {code: "CESKA_SUVERENITA", name: "Česká suverenita", compass_position: {EKO: 0.27, SOC: 0.59, SUV: -0.73}},
  {code: "VOLT", name: "Volt", compass_position: {EKO: -0.05, SOC: -0.86, SUV: 1.00}}
];

console.log("User position:", userPosition);
console.log("\nCalculating distances:\n");

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
    distance: Math.round(distance * 100) / 100,
    compass: party.compass_position
  };
});

results.sort((a, b) => b.match - a.match);

console.log("Top 10 matches:");
results.slice(0, 10).forEach((r, i) => {
  console.log(`${i+1}. ${r.party}: ${r.match}% (distance: ${r.distance})`);
  console.log(`   Position: EKO: ${r.compass.EKO}, SOC: ${r.compass.SOC}, SUV: ${r.compass.SUV}`);
  console.log(`   Diff: EKO: ${Math.round((userPosition.EKO - r.compass.EKO)*100)/100}, SOC: ${Math.round((userPosition.SOC - r.compass.SOC)*100)/100}, SUV: ${Math.round((userPosition.SUV - r.compass.SUV)*100)/100}`);
});

console.log("\n=== EXPECTED TOP PARTIES ===");
console.log("For position EKO: -0.73 (left), SOC: -0.09 (neutral-liberal), SUV: 0.75 (pro-EU):");
console.log("Should be: Zelení, Piráti, Volt, SOCDEM");