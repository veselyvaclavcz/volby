const parties = [
    {code: "ANO", name: "ANO", compass_position: {EKO: -0.36, SOC: 0.23, SUV: 0.41}},
    {code: "SPOLU", name: "SPOLU", compass_position: {EKO: 0.64, SOC: -0.05, SUV: -0.64}},
    {code: "SPD", name: "SPD", compass_position: {EKO: -0.41, SOC: 0.86, SUV: 0.82}},
    {code: "PIRATI", name: "Piráti", compass_position: {EKO: -0.32, SOC: -0.95, SUV: -0.68}},
    {code: "STAN", name: "STAN", compass_position: {EKO: 0.14, SOC: -0.18, SUV: -0.73}},
    {code: "KSČM", name: "KSČM", compass_position: {EKO: -0.95, SOC: 0.23, SUV: 0.73}},
    {code: "TRIKOLORA", name: "Trikolóra", compass_position: {EKO: 0.77, SOC: 0.82, SUV: 0.68}},
    {code: "PRISAHA", name: "Přísaha", compass_position: {EKO: 0.23, SOC: 0.27, SUV: 0.09}},
    {code: "SOCDEM", name: "SOCDEM", compass_position: {EKO: -0.68, SOC: -0.55, SUV: -0.36}},
    {code: "ZELENI", name: "Zelení", compass_position: {EKO: -0.50, SOC: -1.00, SUV: -1.00}},
    {code: "SVOBODNI", name: "Svobodní", compass_position: {EKO: 0.95, SOC: -0.45, SUV: 0.36}},
    {code: "MOTORISTE", name: "Motoristé", compass_position: {EKO: 0.55, SOC: 0.32, SUV: 0.50}},
    {code: "PRO", name: "PRO", compass_position: {EKO: 0.32, SOC: 0.41, SUV: 0.64}},
    {code: "REPUBLIKA", name: "REPUBLIKA", compass_position: {EKO: 0.27, SOC: 0.82, SUV: 0.68}},
    {code: "STACILO", name: "Stačilo!", compass_position: {EKO: -0.95, SOC: -0.45, SUV: 0.41}},
    {code: "VYZVA2025", name: "Výzva2025", compass_position: {EKO: 0.00, SOC: 0.14, SUV: 0.14}},
    {code: "KRUH", name: "KRUH", compass_position: {EKO: 0.00, SOC: -0.45, SUV: -0.18}},
    {code: "VOLUNTIA", name: "VOLUNTIA", compass_position: {EKO: 1.00, SOC: -0.73, SUV: -0.09}},
    {code: "BUDOUCNOST", name: "Budoucnost", compass_position: {EKO: -0.32, SOC: -0.50, SUV: -0.64}},
    {code: "JASAN", name: "JASAN", compass_position: {EKO: 0.55, SOC: 0.36, SUV: 0.23}},
    {code: "LEVY_BLOK", name: "Levý blok", compass_position: {EKO: -1.00, SOC: -0.91, SUV: 0.09}},
    {code: "NARODNI_DEMOKRACIE", name: "Národní demokracie", compass_position: {EKO: 0.27, SOC: 0.86, SUV: 0.77}},
    {code: "PRAVO_RESPEKT", name: "Právo Respekt", compass_position: {EKO: 0.00, SOC: 0.00, SUV: 0.00}},
    {code: "ALIANCE_STABILITA", name: "Aliance pro stabilitu", compass_position: {EKO: -0.18, SOC: 0.23, SUV: 0.09}},
    {code: "CESKA_SUVERENITA", name: "Česká suverenita", compass_position: {EKO: 0.27, SOC: 0.59, SUV: 0.73}},
    {code: "VOLT", name: "Volt", compass_position: {EKO: -0.05, SOC: -0.86, SUV: -1.00}}
];

// Analyzovat rozsah hodnot
const ranges = {
  EKO: { min: Infinity, max: -Infinity, values: [] },
  SOC: { min: Infinity, max: -Infinity, values: [] },
  SUV: { min: Infinity, max: -Infinity, values: [] }
};

parties.forEach(party => {
  if (party.compass_position) {
    ['EKO', 'SOC', 'SUV'].forEach(dim => {
      const value = party.compass_position[dim];
      ranges[dim].min = Math.min(ranges[dim].min, value);
      ranges[dim].max = Math.max(ranges[dim].max, value);
      ranges[dim].values.push(value);
    });
  }
});

console.log('=== ANALÝZA ROZSAHU HODNOT STRAN ===\n');

['EKO', 'SOC', 'SUV'].forEach(dim => {
  const r = ranges[dim];
  const spread = r.max - r.min;
  const avgValue = r.values.reduce((a, b) => a + b, 0) / r.values.length;
  
  console.log(`${dim}:`);
  console.log(`  Min: ${r.min.toFixed(2)}, Max: ${r.max.toFixed(2)}`);
  console.log(`  Rozsah: ${spread.toFixed(2)}`);
  console.log(`  Průměr: ${avgValue.toFixed(2)}`);
  console.log(`  Využití spektra: ${(spread * 100 / 2).toFixed(1)}%`); // ze škály -1 až +1
  console.log();
});

// Analýza pokrytí kvadrantů
console.log('=== POKRYTÍ KVADRANTŮ (EKO x SOC) ===\n');
const quadrants = {
  'Levice-Progres': 0,
  'Pravice-Progres': 0,
  'Levice-Tradice': 0,
  'Pravice-Tradice': 0
};

parties.forEach(party => {
  const eko = party.compass_position.EKO;
  const soc = party.compass_position.SOC;
  
  if (eko < 0 && soc < 0) quadrants['Levice-Progres']++;
  else if (eko > 0 && soc < 0) quadrants['Pravice-Progres']++;
  else if (eko < 0 && soc > 0) quadrants['Levice-Tradice']++;
  else if (eko > 0 && soc > 0) quadrants['Pravice-Tradice']++;
});

Object.entries(quadrants).forEach(([quad, count]) => {
  console.log(`${quad}: ${count} stran (${(count * 100 / parties.length).toFixed(1)}%)`);
});