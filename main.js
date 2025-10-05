const userId = crypto.randomUUID();
console.log("Quiz initialized. Session User ID:", userId);

// --- Quiz Data ---
const quizQuestions = [
    {
        question: "What is the main job of an **`if`** statement in a JavaScript program?",
        options: [
            { text: "To say hello to the user.", isCorrect: false },
            { text: "To make the program do one thing if a rule is True.", isCorrect: true },
            { text: "To count numbers up to 100.", isCorrect: false },
            { text: "To make the program stop completely.", isCorrect: false }
        ],
        rationale: "The `if` statement runs a block of code only when the condition (the rule) inside its parentheses is True."
    },
    {
        question: "What will be the result of this comparison: `15 > 10`?",
        options: [
            { text: "15", isCorrect: false },
            { text: "False", isCorrect: false },
            { text: "True", isCorrect: true },
            { text: "10", isCorrect: false }
        ],
        rationale: "The `>` operator checks if the number on the left (15) is greater than the number on the right (10), which is correct, so the result is True."
    },
    {
        question: "Why is it best to use the **strict equality operator (`===`)** instead of the loose equality operator (`==`)?",
        options: [
            { text: "The `===` operator is faster to type.", isCorrect: false },
            { text: "The `===` operator only checks the value of the numbers.", isCorrect: false },
            { text: "The `===` operator checks both the value AND the data type (like if it's a number or a text string).", isCorrect: true },
            { text: "The `===` operator is used only for text, not for numbers.", isCorrect: false }
        ],
        rationale: "The strict operator checks if both the value (like 5) and the type (like a Number) are the same, which prevents tricky mistakes in your code."
    },
    {
        question: "If the condition in the **`if`** statement is **False**, which block of code will the program look for next?",
        options: [
            { text: "The `then` block.", isCorrect: false },
            { text: "The `else` block.", isCorrect: true },
            { text: "The `while` block.", isCorrect: false },
            { text: "The `true` block.", isCorrect: false }
        ],
        rationale: "The `else` statement is the backup plan and is only executed when the original `if` condition is False."
    },
    {
        question: "In the logical operator **`&&` (AND)**, how many conditions need to be True for the whole thing to be True?",
        options: [
            { text: "Only the first condition.", isCorrect: false },
            { text: "Both conditions.", isCorrect: true },
            { text: "Only one condition.", isCorrect: false },
            { text: "It doesn't matter if they are True or False.", isCorrect: false }
        ],
        rationale: "The `&&` (AND) operator requires that all connected conditions are True for the final result to be True."
    },
    {
        question: "What is the result of this condition using the **`||` (OR) operator**: `(8 < 5) || (20 > 10)`?",
        options: [
            { text: "False", isCorrect: false },
            { text: "8", isCorrect: false },
            { text: "True", isCorrect: true },
            { text: "Error", isCorrect: false }
        ],
        rationale: "The first part is False (`8 < 5`), but the second part is True (`20 > 10`). Because the `||` operator only needs one part to be True, the whole condition is True."
    },
    {
        question: "Which of these numbers would make the condition `number <= 5` result in **True**?",
        options: [
            { text: "7", isCorrect: false },
            { text: "6", isCorrect: false },
            { text: "5", isCorrect: true },
            { text: "10", isCorrect: false }
        ],
        rationale: "The operator `<=` means 'less than **or equal to**'. Since 5 is equal to 5, the condition is True."
    },
    {
        question: "Which sentence is printed by the program?\n\n`let day = \"Sunday\";`\n`if (day === \"Saturday\") { console.log(\"Relax\"); } else if (day === \"Sunday\") { console.log(\"Play\"); } else { console.log(\"Work\"); }`",
        options: [
            { text: "Relax", isCorrect: false },
            { text: "Play", isCorrect: true },
            { text: "Work", isCorrect: false },
            { text: "Both Relax and Play", isCorrect: false }
        ],
        rationale: "The first `if` is False, but the `else if` condition is True because the variable `day` is exactly 'Sunday', so this sentence is printed."
    },
    {
        question: "What is the result of using the **`!` (NOT)** operator on a condition that is **True**?\n\n`! (5 === 5)`",
        options: [
            { text: "True", isCorrect: false },
            { text: "Error", isCorrect: false },
            { text: "False", isCorrect: true },
            { text: "5", isCorrect: false }
        ],
        rationale: "The `!` operator means 'opposite of'. Since `5 === 5` is True, the opposite of True is False."
    },
    {
        question: "The operator `!=` means 'Not Equal To' (loose comparison). What does the operator **`!==`** mean?",
        options: [
            { text: "It means 'Much Greater Than'.", isCorrect: false },
            { text: "It means 'Not Less Than'.", isCorrect: false },
            { text: "It means 'Not Equal To' (checking both value and type).", isCorrect: true },
            { text: "It means 'Almost Equal To'.", isCorrect: false }
        ],
        rationale: "Just like `===`, the extra `=` makes it the strict version, checking if the values are different OR if their types are different."
    }
];

// --- Quiz State and Logic ---
let userAnswers = {}; // { qIndex: selectedOptionIndex }
let currentQuestionIndex = 0;
let score = 0;
let isQuizSubmitted = false;

const quizArea = document.getElementById('quiz-area');
const resultsArea = document.getElementById('results-area');
const scoreSummary = document.getElementById('score-summary');
const reviewList = document.getElementById('review-list');
const restartButton = document.getElementById('restart-button');
const emailButton = document.getElementById('email-button');

// --- PDF Generation Function ---
const generateAndDownloadPDF = () => {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        console.error("jsPDF library not loaded.");
        return;
    }

    const doc = new jsPDF();
    let y = 15;
    const lineHeight = 7;
    const pageMargin = 15;
    const maxLineWidth = 180; // Max width for text wrapping

    // Title
    doc.setFontSize(22);
    doc.setTextColor(60, 60, 200); // Blue
    doc.text("Python print() Quiz Results", pageMargin, y);
    y += 10;

    // Score Summary
    const total = quizQuestions.length;
    doc.setFontSize(14);
    doc.setTextColor(0, 100, 0); // Green
    doc.text(`Student ID: ${userId}`, pageMargin, y);
    y += lineHeight * 0.7;
    doc.text(`Final Score: ${score} / ${total} (${((score / total) * 100).toFixed(1)}%)`, pageMargin, y);
    y += 15;

    // Q&A Loop
    quizQuestions.forEach((qData, qIndex) => {
        if (y > 280) { // Check for page overflow (A4 height is ~297mm)
            doc.addPage();
            y = pageMargin;
        }

        const selectedIndex = userAnswers[qIndex];
        const isCorrect = selectedIndex !== undefined && qData.options[selectedIndex]?.isCorrect;
        const status = isCorrect ? 'CORRECT' : 'INCORRECT';

        // Question Header
        doc.setFontSize(12);
        doc.setTextColor(20, 20, 20); // Black for headers
        doc.text(`Question ${qIndex + 1} (${status})`, pageMargin, y);
        y += lineHeight * 0.7;

        // Question Text (Multi-line support)
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50); // Dark Gray
        const questionText = qData.question.replace(/`/g, '').trim();
        const qLines = doc.splitTextToSize(questionText, maxLineWidth);
        doc.text(qLines, pageMargin, y);
        y += qLines.length * lineHeight;

        // Selected Answer
        doc.setFontSize(10);
        doc.setTextColor(150, 0, 0); // Red for answer
        const selectedOptionText = qData.options[selectedIndex] ? qData.options[selectedIndex].text : 'No Answer';
        const yourAnswerLines = doc.splitTextToSize(`Your Answer: ${selectedOptionText}`, maxLineWidth);
        doc.text(yourAnswerLines, pageMargin, y);
        y += yourAnswerLines.length * lineHeight;

        // Correct Answer
        const correctAnswer = qData.options.find(opt => opt.isCorrect).text;
        doc.setTextColor(0, 100, 0); // Dark Green
        const correctAnswerLines = doc.splitTextToSize(`Correct Answer: ${correctAnswer}`, maxLineWidth);
        doc.text(correctAnswerLines, pageMargin, y);
        y += correctAnswerLines.length * lineHeight;

        // Rationale/Explanation
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100); // Light Gray
        doc.text('Explanation:', pageMargin, y);
        y += lineHeight * 0.7;

        const rationaleLines = doc.splitTextToSize(qData.rationale, maxLineWidth);
        doc.text(rationaleLines, pageMargin, y);
        y += rationaleLines.length * lineHeight + 5; // Extra spacing
    });

    // Save PDF - triggers download
    doc.save('Python_print_Quiz_Results.pdf');
};

// Helper function to escape HTML for display
const escapeHtml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\\n/g, '<br>')
        .replace(/\\t/g, '&emsp;');
};

// Renders a single question
const renderQuestion = (qIndex) => {
    const qData = quizQuestions[qIndex];
    const isAnswered = userAnswers.hasOwnProperty(qIndex);
    const selectedIndex = isAnswered ? userAnswers[qIndex] : null;

    const questionHtml = `
                <div class="question-card">
                    <p class="text-lg">
                        Question ${qIndex + 1} of ${quizQuestions.length}:
                    </p>
                    <pre class="code-block">${escapeHtml(qData.question)}</pre>

                    <div class="options">
                        ${qData.options.map((option, oIndex) => {
        let optionClasses = 'option-button';
        let icon = '';

        if (isAnswered) {
            optionClasses += ' disabled-state';
            if (option.isCorrect) {
                optionClasses += ' correct';
                icon = '<span class="status-icon" style="color:#4ade80; margin-left: 0.5rem;">✓ Correct</span>';
            } else if (selectedIndex === oIndex) {
                optionClasses += ' incorrect';
                icon = '<span class="status-icon" style="color:#f87171; margin-left: 0.5rem;">✗ Your Answer</span>';
            }
        }

        return `
                                <button
                                    class="${optionClasses}"
                                    data-q-index="${qIndex}"
                                    data-o-index="${oIndex}"
                                    onclick="handleAnswer(this)"
                                    ${isAnswered ? 'disabled' : ''}
                                >
                                    <span style="font-weight: 700; margin-right: 0.5rem;">${String.fromCharCode(65 + oIndex)}.</span>
                                    ${escapeHtml(option.text)}
                                    ${icon}
                                </button>
                            `;
    }).join('')}
                    </div>

                    <!-- Rationale (Visible only after submission or review) -->
                    ${isQuizSubmitted || isAnswered ? `
                        <div class="rationale">
                            <p class="font-bold">Explanation:</p>
                            <p>${escapeHtml(qData.rationale)}</p>
                        </div>
                    ` : ''}
                </div>
            `;
    return questionHtml;
};

// Handles user selection of an option
window.handleAnswer = (button) => {
    const qIndex = parseInt(button.dataset.qIndex);
    const oIndex = parseInt(button.dataset.oIndex);

    // Store the answer
    userAnswers[qIndex] = oIndex;

    // Re-render the current question to show selection and rationale
    const questionElement = button.closest('.question-card');
    questionElement.outerHTML = renderQuestion(qIndex);

    // Re-render the current view to enable the "Next" button
    renderCurrentView();

    // Scroll to the rationale for better visibility
    const rationaleElement = document.querySelector('.rationale');
    if (rationaleElement) {
        rationaleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// Calculates score, shows results screen, and triggers PDF download
const submitQuiz = () => {
    score = 0;
    isQuizSubmitted = true;
    let reviewHtml = '';

    quizQuestions.forEach((qData, qIndex) => {
        const selectedIndex = userAnswers[qIndex];
        const isCorrect = selectedIndex !== undefined && qData.options[selectedIndex]?.isCorrect;

        if (isCorrect) {
            score++;
        }

        // Render all questions for review (including rationale)
        reviewHtml += renderQuestion(qIndex);
    });

    // --- NEW: Generate and Download PDF ---
    generateAndDownloadPDF();

    // Update UI elements
    const total = quizQuestions.length;
    scoreSummary.textContent = `You scored ${score} out of ${total}. (${((score / total) * 100).toFixed(1)}%)`;
    reviewList.innerHTML = reviewHtml;

    // Hide quiz, show results
    quizArea.style.display = 'none';
    resultsArea.style.display = 'block';

    // Set up email link (for text body)
    setupEmailLink(score, total);
};
// Expose submitQuiz globally for the button click
window.submitQuiz = submitQuiz;


// Generates the mailto link with basic results and instructions
const setupEmailLink = (score, total) => {
    const subject = encodeURIComponent(`JavaSCript Conditionals Quiz Results: ${score}/${total}`);
    const body = encodeURIComponent(`Hello Smitha,\n\nI have completed the JavaScript Conditionals Quiz.\n\nMy Score: ${score} out of ${total}.\nPercentage: ${((score / total) * 100).toFixed(1)}%\n\nThe detailed PDF file has been downloaded and is attached to this email.\n\n---\nSession User ID: ${userId}`);

    const mailtoUrl = `mailto:code.smitha@gmail.com?subject=${subject}&body=${body}`;

    emailButton.onclick = () => {
        window.location.href = mailtoUrl;
    };
};


// Navigates between questions
const navigate = (newIndex) => {
    if (newIndex >= 0 && newIndex < quizQuestions.length) {
        currentQuestionIndex = newIndex;
        renderCurrentView();
        // Scroll to top of the quiz area for better UX
        quizArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
// Making navigate available globally for existing inline handlers
window.navigate = navigate;


// Renders the current view (question or results)
const renderCurrentView = () => {
    if (isQuizSubmitted) {
        return;
    }

    const qIndex = currentQuestionIndex;
    const totalQuestions = quizQuestions.length;
    // Check if the current question has been answered
    const isCurrentAnswered = userAnswers.hasOwnProperty(qIndex);
    const allAnswered = Object.keys(userAnswers).length === totalQuestions;

    // Next button is disabled if it's the last question OR if the current question is unanswered.
    const isNextDisabled = qIndex === totalQuestions - 1 || !isCurrentAnswered;

    // 1. Generate HTML content
    const quizContentHtml = `
                ${renderQuestion(qIndex)}
                <div id="navigation-area">
                    <button id="prev-button" data-index="${qIndex - 1}" ${qIndex === 0 ? 'disabled' : ''} class="nav-button prev">
                        &larr; Previous
                    </button>
                    <div class="status-text">
                        Question ${qIndex + 1} / ${totalQuestions}
                    </div>
                    <button id="next-button" data-index="${qIndex + 1}" ${isNextDisabled ? 'disabled' : ''} class="nav-button next">
                        Next &rarr;
                    </button>
                </div>
                ${allAnswered ? `
                    <div style="margin-top: 1rem;">
                        <button onclick="submitQuiz()" class="main-button submit-button">
                            Download & Review Results
                        </button>
                    </div>
                ` : ''}
            `;

    // 2. Insert HTML
    quizArea.innerHTML = quizContentHtml;

    // Scroll to top of the quiz area only after the initial load
    if (quizArea.dataset.initialLoad === 'true') {
        quizArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        quizArea.dataset.initialLoad = 'true';
    }
};

// Resets the quiz state
const resetQuiz = () => {
    userAnswers = {};
    currentQuestionIndex = 0;
    score = 0;
    isQuizSubmitted = false;
    resultsArea.style.display = 'none';
    quizArea.style.display = 'flex';
    delete quizArea.dataset.initialLoad;
    renderCurrentView();
};

// Event listener for restart button
restartButton.addEventListener('click', resetQuiz);

// Initial render: Start the quiz immediately and set up event delegation
document.addEventListener('DOMContentLoaded', () => {
    // Add robust event delegation for navigation buttons on the main quiz area
    quizArea.addEventListener('click', (event) => {
        const target = event.target.closest('.nav-button');

        if (target) {
            const newIndex = parseInt(target.dataset.index);
            if (!target.disabled) {
                navigate(newIndex);
            }
        }
    });

    renderCurrentView();
});