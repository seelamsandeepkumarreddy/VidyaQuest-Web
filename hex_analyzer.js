
const fs = require('fs');
const content = fs.readFileSync('src/utils/quizProvider.js', 'utf8');
const start = content.indexOf('const templates = [');
const end = content.indexOf('];', start) + 2;
const block = content.substring(start, end);

console.log('Hex block (first 1000 chars):');
for (let i = 0; i < Math.min(block.length, 1000); i++) {
  const code = block.charCodeAt(i);
  if (code < 32 || code > 126) {
    process.stdout.write(`[${code.toString(16)}]`);
  } else {
    process.stdout.write(block[i]);
  }
}
console.log('\n--- End ---');
