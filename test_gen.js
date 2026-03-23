
const grade='8';
const chapterName='The Tsunami';
const subject='English';
const templates = [
  ["Which concept from '" + chapterName + "' is most fundamental to understanding " + subject + "?", ["The primary definition and its direct applications.", "An unrelated mathematical formula.", "A concept from a different subject.", "None - all are equally irrelevant."]]
];
const combined = templates.map(([text, options]) => ({ text, options, correct: options[0] }));
console.log('COMBINED:', JSON.stringify(combined, null, 2));

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const res = combined.map(item => {
  const shuffledOptions = shuffle(item.options);
  console.log('SHUFFLED OPTIONS:', shuffledOptions);
  return { 
    text: item.text, 
    options: shuffledOptions,
    correct: shuffledOptions.indexOf(item.correct)
  };
});
console.log('FINAL RESULT:', JSON.stringify(res, null, 2));
