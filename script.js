const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.backgroundColor = "#6b6b96";
    });
    card.addEventListener('mouseleave', () => {
        card.style.backgroundColor = "#b5b5d1";
    })
})

function selectDepartment(deptName) {
    localStorage.setItem("selectedDept", deptName);
    window.location.href = "years.html";
}

function selectYear(yearNumber) {
    localStorage.setItem("selectedYear", yearNumber);
    window.location.href = "subjects.html";
}

function startQuiz(subjectName) {
    localStorage.setItem("selectedSubject", subjectName);
    window.location.href = "quiz.html";
}

async function loadSubjects() {
    const container = document.getElementById("subjects-container");
    if (!container) return;

    const department = localStorage.getItem("selectedDept");
    const year = localStorage.getItem("selectedYear");

    try {
        const response = await fetch('/api/subjects');
        const data = await response.json();

        const mySubjects = data[department] && data[department][year]
            ? data[department][year]
            : [];

        if (mySubjects.length === 0) {
            container.innerHTML = "<h3>No subjects found for this selection.</h3>";
            return;
        }

        let htmlContent = "";
        mySubjects.forEach(subjectName => {
            htmlContent += `
              <div class="card" style="display: flex; flex-direction: column; ">
                    <h3>${subjectName}</h3>
                    <p style="color: #020202; font-weight: bold; margin-top: auto; align-self: center;">Department: ${department} | Year: ${year}</p>
                    <img src="etf_logo.png" alt="Etf Logo"
                style="width: 180px;  align-self: center;   margin-top: auto;    height: auto;       margin-bottom: 20px;">
                    <button onclick="startQuiz('${subjectName}')" style="margin-top: auto; align-self: center; border-radius: 15px; padding: 10px 25px; transition: 0.3s; cursor: pointer; background-color: #1f3246; color: white;">  Start Quiz  </button>
                </div>
            `;
        });

        container.innerHTML = htmlContent;

    } catch (error) {
        console.error("Error loading subjects:", error);
        container.innerHTML = "<h3>Failed to load subjects. Please try again later.</h3>";
    }
}



let currentQuestions = []; // ovdje cuvam niz pitanja za odabrani predmet
let currentIndex = 0;      // treba mi da pratim na kojem sam pitanju


let score = 0;             
let totalAnswered = 0;

async function loadQuiz() {
    const container = document.getElementById("quiz-container");
    if (!container) return;

    const selectedSubject = localStorage.getItem("selectedSubject");

    try {
        const response = await fetch('/api/questions');
        const allQuestions = await response.json();

        currentQuestions = allQuestions[selectedSubject] || [];

        if (currentQuestions.length === 0) {
            container.innerHTML = `<h2>No questions found for: ${selectedSubject}</h2>`;
            return;
        }

        renderQuestion();

    } catch (error) {
        container.innerHTML = "<h2>Error connecting to server.</h2>";
    }
}
// potrebna mi je i pomocna funkcija za prikazivanje bloka pitanja
function renderQuestion() {
    const container = document.getElementById("quiz-container");
    const q = currentQuestions[currentIndex];
    const selectedSubject = localStorage.getItem("selectedSubject");

    container.innerHTML = `
        <div class="quiz-card">
        <small>${selectedSubject} </small>
            <h3>Question ${currentIndex + 1} of ${currentQuestions.length}</h3>
            <p>${q.question}</p>
            <input type="text" id="answerInput" placeholder="Type your answer here...">
            <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                <button onclick="checkAnswer('${q.answer}')">Submit Answer</button>
                
                <button id="skipBtn" onclick="skipQuestion()">Skip Question </button>

                ${currentIndex < currentQuestions.length - 1
            ? `<button id="nextBtn" style="display:none; background-color: #4CAF50;" onclick="nextQuestion()">Next Question</button>`
            : `<button id="finishBtn" style="display:none; background-color: #2ecc71;" onclick="showFinalScore()">Finish Quiz</button>`
        }
            </div>
            <p id="feedback"></p>
            <p id="live-score">Current Score: ${score}</p>
        </div>
    `;
}

function nextQuestion() {
    currentIndex++;
    renderQuestion();
}

function skipQuestion() {
    totalAnswered++; 
    if (currentIndex < currentQuestions.length - 1) {
        nextQuestion();
    } else {
        showFinalScore();
    }
}

function checkAnswer(correctAnswer) {
    const userInput = document.getElementById("answerInput").value.trim();
    const feedback = document.getElementById("feedback");
    const nextBtn = document.getElementById("nextBtn");
    const finishBtn = document.getElementById("finishBtn");

    if (userInput.toLowerCase() === correctAnswer.toLowerCase()) {
        score += 10; // dodajemo 10 bodova za tačan odgovor
        totalAnswered++;
        feedback.textContent = "Correct! +10 points";
        feedback.style.color = "green";
        
        // Sakrivam skip dugme kad pogodi, pokaži Next ili Finish
        document.getElementById("skipBtn").style.display = "none";
        if (nextBtn) nextBtn.style.display = "inline-block";
        if (finishBtn) finishBtn.style.display = "inline-block";
        
        document.getElementById("live-score").textContent = `Current Score: ${score}`;
    } else {
        feedback.textContent = "Wrong! Try again or skip.";
        feedback.style.color = "red";
    }

}

function showFinalScore() {
    const container = document.getElementById("quiz-container");
    const percentage = Math.round((score / (currentQuestions.length * 10)) * 100);

    container.innerHTML = `
        <div class="quiz-card" style="text-align: center;">
            <h2>Quiz Finished!</h2>
            <hr>
            <p style="font-size: 1.5rem; margin: 20px 0;">Your total score is: <strong>${score}</strong></p>
            <p style="margin-bottom: 30px; font-size: 1.1rem;">Accuracy: ${percentage}%</p>
            
            <button onclick="location.href='subjects.html'">Back to Subjects</button>
            <button onclick="location.reload()" >Restart Quiz</button>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    // ako postoji kontejner za predmete, ucitamo predmete
    if (document.getElementById("subjects-container")) {
        loadSubjects();
    }
    // ako postoji kontejner za kviz, ucitamo kviz
    if (document.getElementById("quiz-container")) {
        loadQuiz();
    }
});