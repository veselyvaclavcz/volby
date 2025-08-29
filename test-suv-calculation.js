// Test SUV calculation with user's actual answers
const questions = [
  {id: 23, text: "Česko by mělo přijmout euro", polarity: 1},
  {id: 24, text: "EU Green Deal je správná cesta", polarity: 1},
  {id: 25, text: "Státy by si měly zachovat kontrolu nad klíčovými rozhodnutími", polarity: -1},
  {id: 26, text: "EU migrační pakt je pro Česko přijatelný", polarity: 1},
  {id: 27, text: "Vystoupení z EU by bylo pro Česko přínosné", polarity: -1},
  {id: 28, text: "Uprchlické kvóty jsou solidární řešení", polarity: 1},
  {id: 29, text: "NATO je zárukou naší bezpečnosti", polarity: 1},
  {id: 30, text: "Sankce proti Rusku poškozují hlavně nás", polarity: -1},
  {id: 31, text: "Spojené státy evropské jsou správný cíl integrace", polarity: 1},
  {id: 32, text: "Visegrádská skupina je důležitější než EU", polarity: -1},
  {id: 33, text: "Podpora Ukrajiny by měla pokračovat", polarity: 1}
];

const userAnswers = {
  23: {value: 5, important: true},   // Euro - nesouhlasím
  24: {value: 5, important: true},   // Green Deal - nesouhlasím
  25: {value: 3, important: false},  // Státy kontrola - neutrální
  26: {value: 3, important: false},  // Migrační pakt - neutrální
  27: {value: 2, important: false},  // Vystoupení z EU - spíše nesouhlasím (!)
  28: {value: 4, important: false},  // Kvóty - spíše nesouhlasím
  29: {value: 5, important: false},  // NATO - nesouhlasím
  30: {value: 1, important: false},  // Sankce škodí - souhlasím
  31: {value: 5, important: false},  // USE - nesouhlasím
  32: {value: 3, important: false},  // V4 - neutrální
  33: {value: 3, important: false}   // Ukrajina - neutrální
};

let suvSum = 0;
let suvCount = 0;

console.log("=== SUV DIMENSION CALCULATION ===\n");

questions.forEach(q => {
  const answer = userAnswers[q.id];
  if (answer) {
    const score = ((answer.value - 3) / 2) * q.polarity;
    const weight = answer.important ? 2 : 1;
    const weightedScore = score * weight;
    
    console.log(`Q${q.id}: "${q.text.substring(0, 40)}..."`);
    console.log(`  Answer: ${answer.value}, Important: ${answer.important}`);
    console.log(`  Score: ((${answer.value} - 3) / 2) * ${q.polarity} = ${score}`);
    console.log(`  Weighted: ${score} * ${weight} = ${weightedScore}`);
    
    suvSum += weightedScore;
    suvCount += weight;
  }
});

const suvPosition = suvSum / suvCount;
console.log(`\nFinal SUV: ${suvSum} / ${suvCount} = ${suvPosition}`);
console.log("\nPROBLEM: User answered like euroskeptic but got pro-EU score!");
console.log("Q27 (Vystoupení z EU) - answered 2 (spíše nesouhlasím) - should be pro-EU");
console.log("But that's the ONLY pro-EU answer among strong euroskeptic answers!");
