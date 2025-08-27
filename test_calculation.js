// Test calculation
const answers = {
  '1': {value: 1, important: false}, // Strongly agree with low taxes (should be right)
  '2': {value: 5, important: false}, // Strongly disagree with state support (should be right)
  '3': {value: 1, important: false}, // Strongly agree with privatization (should be right)
};

const questions = [
  {id: 1, dimension: 'EKO', polarity: 1},
  {id: 2, dimension: 'EKO', polarity: -1},
  {id: 3, dimension: 'EKO', polarity: 1},
];

let userPosition = {EKO: 0, SOC: 0, SUV: 0};
let dimensionCounts = {EKO: 0, SOC: 0, SUV: 0};

console.log('Testing calculation with extreme right-wing answers:');
for (const [questionId, answer] of Object.entries(answers)) {
  const question = questions.find(q => q.id === parseInt(questionId));
  if (question && answer.value !== null) {
    const score = ((answer.value - 3) / 2) * question.polarity;
    const weight = answer.important ? 2 : 1;
    console.log(`Q${question.id}: value=${answer.value}, polarity=${question.polarity}, score=${score}, weight=${weight}`);
    userPosition[question.dimension] += score * weight;
    dimensionCounts[question.dimension] += weight;
  }
}

console.log('Before normalize:', userPosition, 'counts:', dimensionCounts);

// Normalize
for (const dim of ['EKO', 'SOC', 'SUV']) {
  if (dimensionCounts[dim] > 0) {
    userPosition[dim] = userPosition[dim] / dimensionCounts[dim];
    userPosition[dim] = Math.max(-1, Math.min(1, userPosition[dim]));
  }
}

console.log('Final position:', userPosition);
console.log('Expected: strongly negative EKO (right-wing/free market)');