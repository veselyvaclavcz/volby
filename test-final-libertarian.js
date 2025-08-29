// Final test with all corrected polarities
const parties = [
  {code: "SVOBODNI", name: "Svobodní", compass_position: {EKO: 0.95, SOC: -0.45, SUV: -0.77}},
  {code: "VOLUNTIA", name: "VOLUNTIA", compass_position: {EKO: 1.00, SOC: -0.73, SUV: -0.59}},
  {code: "SPOLU", name: "SPOLU", compass_position: {EKO: 0.64, SOC: -0.05, SUV: 0.64}},
  {code: "STAN", name: "STAN", compass_position: {EKO: 0.14, SOC: -0.18, SUV: 0.73}},
  {code: "TRIKOLORA", name: "Trikolóra", compass_position: {EKO: 0.77, SOC: 0.82, SUV: -0.68}}
];

// User's actual position from console
const userPosition = {EKO: 0.78, SOC: -0.23, SUV: 0.62};

console.log("User's actual position (from console):");
console.log("EKO: 0.78 (libertarian right)");
console.log("SOC: -0.23 (mildly liberal)");
console.log("SUV: 0.62 (pro-EU) <- THIS IS THE PROBLEM!\n");

console.log("With SUV inverted to -0.62 (euroskeptic), matches would be:\n");

// Test with corrected SUV
const correctedPosition = {EKO: 0.78, SOC: -0.23, SUV: -0.62};

const results = parties.map(party => {
  const distance = Math.sqrt(
    Math.pow(correctedPosition.EKO - party.compass_position.EKO, 2) +
    Math.pow(correctedPosition.SOC - party.compass_position.SOC, 2) +
    Math.pow(correctedPosition.SUV - party.compass_position.SUV, 2)
  );
  const maxDistance = Math.sqrt(12);
  const match = Math.max(0, (1 - distance / maxDistance)) * 100;
  
  return {
    party: party.name,
    match: Math.round(match * 10) / 10
  };
});

results.sort((a, b) => b.match - a.match);

results.forEach(r => {
  console.log(`${r.party}: ${r.match}%`);
});

console.log("\nExpected: Svobodní and VOLUNTIA should be top matches");
