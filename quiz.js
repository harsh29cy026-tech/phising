const quizContainer =
    document.getElementById("quizContainer");

const questions = [

    {
        question:
            "You receive a message saying your account will be suspended in 10 minutes. What should you do?",

        options: [
            "Click the link immediately",
            "Enter your password",
            "Navigate directly to the official service",
            "Send your OTP"
        ],

        answer: 2
    },

    {
        question:
            "Does HTTPS alone prove that a website is legitimate?",

        options: [
            "Yes",
            "No",
            "Only on mobile",
            "Only when there is a logo"
        ],

        answer: 1
    },

    {
        question:
            "Which is a useful additional account protection mechanism?",

        options: [
            "Multi-Factor Authentication",
            "Sharing your password",
            "Disabling security alerts",
            "Using the same password everywhere"
        ],

        answer: 0
    },

    {
        question:
            "What should you inspect before entering credentials?",

        options: [
            "Only the logo",
            "The website domain and context",
            "Only the background color",
            "The number of images"
        ],

        answer: 1
    },

    {
        question:
            "What is a common social-engineering technique?",

        options: [
            "Urgency",
            "Automatic software updates",
            "Screen brightness",
            "File compression"
        ],

        answer: 0
    }

];

let currentQuestion = 0;
let score = 0;

function renderQuestion() {

    const q = questions[currentQuestion];

    quizContainer.innerHTML = `

        <div class="quiz-card">

            <div class="quiz-progress">

                Question
                ${currentQuestion + 1}
                /
                ${questions.length}

            </div>

            <h2>
                ${q.question}
            </h2>

            <div class="quiz-options">

                ${q.options.map(
                    (option, index) => `

                    <button
                        class="quiz-option"
                        data-index="${index}">

                        ${option}

                    </button>

                `
                ).join("")}

            </div>

        </div>
    `;

    document
        .querySelectorAll(".quiz-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const selected =
                        Number(
                            button.dataset.index
                        );

                    if (
                        selected ===
                        q.answer
                    ) {
                        score++;
                    }

                    currentQuestion++;

                    if (
                        currentQuestion <
                        questions.length
                    ) {
                        renderQuestion();
                    } else {
                        showResult();
                    }
                }
            );

        });
}


function showResult() {

    const percentage =
        Math.round(
            (score / questions.length) * 100
        );

    let message;

    if (percentage >= 80) {
        message =
            "Excellent! You demonstrate strong phishing awareness.";
    } else if (percentage >= 60) {
        message =
            "Good work! Review a few defensive concepts.";
    } else {
        message =
            "Keep learning. Review the phishing indicators and defensive controls.";
    }

    quizContainer.innerHTML = `

        <div class="result-card">

            <div class="result-icon">
                🛡️
            </div>

            <h2>
                Quiz Complete
            </h2>

            <div class="score">
                ${score}/${questions.length}
            </div>

            <p>
                Awareness Score:
                <strong>${percentage}%</strong>
            </p>

            <p>
                ${message}
            </p>

            <a
                href="index.html"
                class="primary-button">

                Run Simulation Again

            </a>

        </div>
    `;
}


renderQuestion();