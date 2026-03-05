if (!document.cookie.includes(`login=true`)) {
    alert("You are not signed in!");
    window.location.replace("signin.html");
}

history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};

window.onbeforeunload = function() {
    return "Your progress will be lost if you leave now!";
};


const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (currentUser) {
    const nameDisplay = document.getElementById('username-display');
    nameDisplay.innerHTML = `<i class="bi bi-person-circle"></i> ${currentUser.firstName} ${currentUser.lastName}`;
}

let questionsList = []; 
let currentIndex = 0;
let timeLeft = 90;
let timerInterval; 

async function loadExam() {
    try {
        let response = await fetch('question.json');
        let data = await response.json();
        
        questionsList = data.map(q => new Question(q));
        questionsList.sort(() => Math.random() - 0.5);
        
        displayQuestion();
        startTimer();
    } catch (error) {
        console.error(`Questions display error ${error}`);
    }
}

function displayQuestion() {
    let currentQ = questionsList[currentIndex];
    let displayNum = currentIndex + 1;

    document.getElementById('question-title').innerText = `Question ${displayNum}`;
    document.getElementById('question-text').innerText = currentQ.text;
    document.getElementById('q-counter').innerText = `Question ${displayNum} of ${questionsList.length}`;

    const container = document.getElementById('options-container');
    container.innerHTML = ""; 

    for (let i = 0; i < currentQ.options.length; i++) {
        const btn = document.createElement('button');
        btn.innerText = currentQ.options[i];
        btn.className = `list-group-item list-group-item-action p-3 mb-2 rounded border shadow-sm text-start`;
        
        if (currentQ.userAnswer === i) {
            btn.classList.add("active");
        }
        
        btn.onclick = function() {
            currentQ.userAnswer = i; 
            displayQuestion(); 
        };
        
        container.appendChild(btn);
    }

    document.getElementById('prevBtn').style.visibility = (currentIndex === 0) ? "hidden" : "visible";
    
    if (currentIndex === questionsList.length - 1) {
        document.getElementById('nextBtn').style.display = "none";
        document.getElementById('submitBtn').style.display = "block";
    } else {
        document.getElementById('nextBtn').style.display = "block";
        document.getElementById('submitBtn').style.display = "none";
    }
}

function startTimer() {
    const timerDisplay = document.getElementById('timer-display');
    const timerBar = document.getElementById('timer-progress');

    timerInterval = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.innerText = `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
            timerBar.style.width = `${(timeLeft / 90) * 100}%`; 
        } else {
            clearInterval(timerInterval);
            alert("Time's Up!");
            finishExam();
        }
    }, 1000);
}

function finishExam() {
    clearInterval(timerInterval);

    let score = 0;
    for (let i = 0; i < questionsList.length; i++) {
        if (questionsList[i].isCorrect()) {
            score++;
        }
    }
    alert(`Finished! Your Score: ${score} / ${questionsList.length}`);
}

document.getElementById('nextBtn').onclick = function() {
    currentIndex++;
    displayQuestion();
};

document.getElementById('prevBtn').onclick = function() {
    currentIndex--;
    displayQuestion();
};

document.getElementById('submitBtn').onclick = finishExam;

loadExam();