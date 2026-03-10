//Cookie Check
if (!document.cookie.includes("login=true")) {
    alert("You are not signed in");
    window.location.href = "signin.html";
}

//Blocks the browser back button and warns before page refresh
const preventCheating = () => {
    history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
    });
};


let allQuestions = [];
let currentQuestionIndex = 0;
let timerInterval;
// get data from questoin.json
async function getQuestions() {
    try {
        const response = await fetch('question.json');
        const data = await response.json();
        
        allQuestions = data.map(q => new Question(
            q.id, 
            q.text, 
            q.options, 
            q.correctAnswerIndex,
        ));
        
        allQuestions.sort(() => Math.random() - 0.5);

        startTimer(30);
        displayQuestion(currentQuestionIndex);
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}
// display the user name , questions , check keep track of selected button 
function displayQuestion(index) {
    const question = allQuestions[index];

    const titleElement = document.getElementById('question-title');
    const textElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const counterElement = document.getElementById('q-counter');

    // Display user name from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        document.getElementById('username-display').innerHTML = 
            <i class="bi bi-person-circle"></i> ${user.firstName} ${user.lastName};
    }

    // Update Question Title and Text
    titleElement.innerText = Question ${index + 1};
    textElement.innerText = question.text;
    counterElement.innerText = ${index + 1} of ${allQuestions.length};

    // Clear previous options and generate new ones
    optionsContainer.innerHTML = ""; 
   // Loop through options 
for (let i = 0; i < question.options.length; i++) {
    
    const optionText = question.options[i];
    
    const btn = document.createElement('button');
    btn.className = "list-group-item list-group-item-action mb-2 rounded border-2 p-3";
    btn.innerText = optionText;

    // Highlight the button if it is the user current answer
    if (question.userAnswer === i) {
        btn.classList.add('active');
    }

    btn.onclick = function() {
        question.userAnswer = i;
        displayQuestion(index);
    };

    optionsContainer.appendChild(btn);
}

    questionNav(index);
    preventCheating();
}


function questionNav(index) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

    prevBtn.style.display = (index === 0) ? "none" : "inline-block";

    if (index === allQuestions.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-block";
    } else {
        nextBtn.style.display = "inline-block";
        submitBtn.style.display = "none";
    }
}

document.getElementById('nextBtn').onclick = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
};

document.getElementById('prevBtn').onclick = () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
};


function startTimer(timeInSeconds) {
    let timeLeft = timeInSeconds;
    const totalDuration = timeInSeconds;
    const timerDisplay = document.getElementById('timer-display');
    const progressBar = document.getElementById('timer-progress');

    timerInterval = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        timerDisplay.innerText = 00:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds};

        // Update Visual Progress Bar
        let progressWidth = (timeLeft / totalDuration) * 100;
        progressBar.style.width = ${progressWidth}%;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time is up!");
            timeout();
        }
        timeLeft--;
    }, 1000);
}

function calculateScore() {
    let score = 0;
    for (let i = 0; i < allQuestions.length; i++) {
        const question = allQuestions[i];

        if (question.userAnswer !== null && question.userAnswer === question.correctIndex) {
            score++; 
        }
    }

    const finalResult = {
         score: score,
          total: allQuestions.length
         };
    localStorage.setItem('lastResult', JSON.stringify(finalResult));
    return finalResult;
}

function submit() {
    if (confirm("Are you sure you want to submit?")) {
        calculateScore(); 
        clearInterval(timerInterval); 
        window.location.href = "result.html"; 
    }
}

function timeout() {
    clearInterval(timerInterval); 
    calculateScore(); 
    window.location.href = "timeout.html"; 
}

document.getElementById('submitBtn').onclick = submit;

getQuestions();
