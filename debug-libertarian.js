// Debug libertarian position calculation

const questions = [
  {id: 1, text: "Daně by měly být co nejnižší", dimension: "EKO", polarity: -1},
  {id: 2, text: "Stát by měl podporovat domácí firmy", dimension: "EKO", polarity: 1},
  {id: 3, text: "Soukromé firmy jsou efektivnější než státní podniky", dimension: "EKO", polarity: -1},
  {id: 4, text: "Minimální mzda je prospěšná pro zaměstnance", dimension: "EKO", polarity: 1},
  {id: 5, text: "Všichni by měli platit stejné procento daní", dimension: "EKO", polarity: -1},
  {id: 6, text: "Sociální podpora vytváří závislost", dimension: "EKO", polarity: -1},
  {id: 7, text: "Zrušení superhrubé mzdy bylo správné", dimension: "EKO", polarity: -1},
  {id: 8, text: "Podpora podnikání je důležitější než sociální výdaje", dimension: "EKO", polarity: -1},
  {id: 9, text: "Státní důchody jsou udržitelný systém", dimension: "EKO", polarity: 1},
  {id: 10, text: "Zdravotnictví by mělo zůstat primárně veřejné", dimension: "EKO", polarity: 1},
  {id: 11, text: "Ekonomika funguje nejlépe s minimálními zásahy státu", dimension: "EKO", polarity: -1}
];

// Simulate libertarian answers
const libertarianAnswers = {
  1: 1,  // Daně co nejnižší - Rozhodně souhlasím
  2: 5,  // Stát podporovat firmy - Rozhodně nesouhlasím
  3: 1,  // Soukromé firmy efektivnější - Rozhodně souhlasím
  4: 5,  // Minimální mzda prospěšná - Rozhodně nesouhlasím
  5: 1,  // Stejné procento daní - Rozhodně souhlasím
  6: 1,  // Sociální podpora vytváří závislost - Rozhodně souhlasím
  7: 1,  // Zrušení superhrubé mzdy správné - Rozhodně souhlasím
  8: 1,  // Podpora podnikání důležitější - Rozhodně souhlasím
  9: 5,  // Státní důchody udržitelné - Rozhodně nesouhlasím
  10: 5, // Zdravotnictví veřejné - Rozhodně nesouhlasím
  11: 1  // Ekonomika s minimem zásahů - Rozhodně souhlasím
};

console.log("=== LIBERTARIAN POSITION CALCULATION ===\n");

let ekoSum = 0;
let ekoCount = 0;

questions.forEach(q => {
  const answer = libertarianAnswers[q.id];
  if (answer) {
    const score = ((answer - 3) / 2) * q.polarity;
    console.log(`Q${q.id}: "${q.text.substring(0, 40)}..."`);
    console.log(`  Answer: ${answer} (${answer === 1 ? 'Rozhodně souhlasím' : answer === 5 ? 'Rozhodně nesouhlasím' : 'other'})`);
    console.log(`  Polarity: ${q.polarity}`);
    console.log(`  Score: ((${answer} - 3) / 2) * ${q.polarity} = ${score}`);
    ekoSum += score;
    ekoCount++;
  }
});

const ekoPosition = ekoSum / ekoCount;
console.log(`\nFinal EKO position: ${ekoSum} / ${ekoCount} = ${ekoPosition}`);
console.log(`Expected: ~0.8 to 1.0 (strong right-wing/libertarian)`);

if (ekoPosition < 0) {
  console.log("\n❌ ERROR: Libertarian answers give LEFT-WING position!");
  console.log("The polarities are still wrong!");
}

// Check what each answer type gives
console.log("\n=== ANSWER VALUE MAPPING ===");
console.log("For positive polarity (+1):");
console.log("  1 (Rozhodně souhlasím) → ((1-3)/2) * 1 = -1");
console.log("  5 (Rozhodně nesouhlasím) → ((5-3)/2) * 1 = +1");
console.log("\nFor negative polarity (-1):");
console.log("  1 (Rozhodně souhlasím) → ((1-3)/2) * -1 = +1");
console.log("  5 (Rozhodně nesouhlasím) → ((5-3)/2) * -1 = -1");