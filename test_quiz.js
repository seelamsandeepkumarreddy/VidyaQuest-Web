
const QuizProvider = require('./src/utils/quizProvider').default;

const subjects = ["Science", "Hindi", "Telugu", "Mathematics", "Social"];
const grades = ["8", "9", "10"];

subjects.forEach(subject => {
    grades.forEach(grade => {
        console.log(`--- Testing ${subject} Grade ${grade} ---`);
        const questions = QuizProvider.getQuestions(grade, subject, "Test Chapter");
        questions.forEach((q, i) => {
            console.log(`Q${i+1}: ${q.text || q.question_text}`);
            console.log(`Options: ${JSON.stringify(q.options)}`);
            if (!q.text && !q.question_text) console.error("!!! EMPTY QUESTION TEXT !!!");
            if (!q.options || q.options.length < 4) console.error("!!! INVALID OPTIONS !!!");
            q.options.forEach((opt, oi) => {
                if (!opt) console.error(`!!! EMPTY OPTION AT INDEX ${oi} !!!`);
            });
        });
    });
});
