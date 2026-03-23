
const fs = require('fs');
const buf = fs.readFileSync('src/utils/quizProvider.js');
const hex = buf.toString('hex');
const searchText = Buffer.from('None - all are equally irrelevant.').toString('hex');
const index = hex.indexOf(searchText);
if (index !== -1) {
    const start = Math.max(0, index - 200);
    const end = Math.min(hex.length, index + 200);
    console.log('Hex around template:', hex.substring(start, end));
    console.log('Chars around template:', buf.toString('utf8', start / 2, end / 2));
} else {
    console.log('Template string not found in buffer!');
}
