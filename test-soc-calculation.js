// Test SOC calculation - liberal answers should give negative SOC
const questions = [
  {id: 12, text: "Stejnopohlavní páry by měly mít právo na adopce", polarity: 1},
  {id: 13, text: "Dospělí by měli mít právo rozhodovat o užívání konopí", polarity: 1},
  {id: 14, text: "Společnost funguje nejlépe s tradičním rodinným modelem", polarity: -1},
  {id: 15, text: "Ženy by měly mít právo rozhodovat o svém těle", polarity: 1},
  {id: 16, text: "Multikulturalismus obohacuje společnost", polarity: 1},
  {id: 17, text: "Národní identita je důležitější než evropská", polarity: -1},
  {id: 18, text: "Registrované partnerství by mělo být nahrazeno manželstvím pro všechny", polarity: 1},
  {id: 19, text: "Nové pojetí pohlaví narušuje osvědčené společenské normy", polarity: -1},
  {id: 20, text: "Náboženství a politika by měly zůstat oddělené", polarity: 1},
  {id: 21, text: "Integrace menšin závisí především na jejich vlastním úsilí", polarity: -1},
  {id: 22, text: "Sexuální výchova by měla být povinná na školách", polarity: 1}
];

// Liberal answers
const liberalAnswers = {
  12: 1,  // LGBT adopce - souhlasím
  13: 1,  // Konopí - souhlasím
  14: 5,  // Tradiční rodina - nesouhlasím
  15: 1,  // Právo žen - souhlasím
  16: 1,  // Multikulturalismus - souhlasím
  17: 5,  // Národní identita - nesouhlasím
  18: 1,  // Manželství pro všechny - souhlasím
  19: 5,  // Gender normy - nesouhlasím
  20: 1,  // Oddělení církve - souhlasím
  21: 5,  // Integrace menšin - nesouhlasím
  22: 1   // Sexuální výchova - souhlasím
};

let socSum = 0;
let socCount = 0;

console.log("=== SOC DIMENSION TEST (LIBERAL) ===\n");

questions.forEach(q => {
  const answer = liberalAnswers[q.id];
  if (answer) {
    const score = ((answer - 3) / 2) * q.polarity;
    console.log(`Q${q.id}: Answer ${answer}, Polarity ${q.polarity} → Score: ${score}`);
    socSum += score;
    socCount++;
  }
});

const socPosition = socSum / socCount;
console.log(`\nFinal SOC: ${socSum} / ${socCount} = ${socPosition}`);
console.log("Expected: around -0.8 to -1.0 (liberal)");

if (socPosition > 0) {
  console.log("\n❌ ERROR: Liberal answers give conservative position!");
  console.log("SOC polarities need to be inverted too!");
}
