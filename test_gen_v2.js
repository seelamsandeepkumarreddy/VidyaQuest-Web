
const fs = require('fs');
const content = fs.readFileSync('src/utils/quizProvider.js', 'utf8');
const lines = content.split('\n');
const targetLine = lines.find(l => l.includes("Which concept from '"));
console.log('Target line:', targetLine.trim());

const match = targetLine.match(/\["(.*)", \[(.*)\]\]/);
if (match) {
    console.log('Question:', match[1]);
    const optionsStr = match[2];
    console.log('Options string raw:', optionsStr);
    const options = optionsStr.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    console.log('Parsed options:', options);
    options.forEach((o, i) => console.log(`Option ${i}: [${o}] (length ${o.length})`));
} else {
    console.log('Regex match failed for line!');
}
