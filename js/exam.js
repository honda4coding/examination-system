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
const markedQuestions = new Map(); // index -> { answered: boolean }

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
            if (markedQuestions.has(currentIndex)) {
                markedQuestions.set(currentIndex, { answered: true });
                renderMarkedList();
                }
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

    syncMarkButton();
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
            alert("Time's Up!"); //redirect*
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
    console.log("Storing result:", score, questionsList.length, currentUser);
    localStorage.setItem('examResult', JSON.stringify({
    score,
    total: questionsList.length,
    passed: score >= 3,
    user: currentUser || { firstName: "Guest", lastName: "" } 
}));

window.onbeforeunload = null;
window.location.replace("result.html");
}

document.getElementById('nextBtn').onclick = function() {
    if (markedQuestions.has(currentIndex) && questionsList[currentIndex].userAnswer === undefined) {
        markedQuestions.set(currentIndex, { answered: false });
        renderMarkedList();
    }
    currentIndex++;
    displayQuestion();
};

document.getElementById('prevBtn').onclick = function() {
    currentIndex--;
    displayQuestion();
};

document.getElementById('submitBtn').onclick = finishExam;

function syncMarkButton() {
    const markBtn = document.getElementById('markBtn');
    const isMarked = markedQuestions.has(currentIndex);
    markBtn.className = `btn btn-sm shadow-sm ${isMarked ? "btn-secondary" : "btn-success"}`;
    markBtn.innerHTML = isMarked
        ? `<i class="bi bi-bookmark-x"></i> Unmark`
        : `<i class="bi bi-bookmark-check"></i> Mark`;
}

document.getElementById('markBtn').onclick = function() {
    if (markedQuestions.has(currentIndex)) {
        markedQuestions.delete(currentIndex);
    } else {
        const answered = questionsList[currentIndex].userAnswer !== undefined;
        markedQuestions.set(currentIndex, { answered });
    }
    renderMarkedList();
    syncMarkButton();
};

function renderMarkedList() {
    const markedList = document.getElementById('marked-list');
    markedList.innerHTML = "";

    if (markedQuestions.size === 0) {
        markedList.innerHTML = `<small class="text-muted">No marked questions yet.</small>`;
        return;
    }

    markedQuestions.forEach(({ answered }, index) => {
        const item = document.createElement('button');
        item.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
        item.innerHTML = `
            <span>Question ${index + 1}</span>
            <span class="badge rounded-pill ${answered ? "bg-success" : "bg-warning text-dark"}">
                ${answered ? "Answered" : "Skipped"}
            </span>`;
        item.onclick = () => { currentIndex = index; displayQuestion(); };
        markedList.appendChild(item);
    });
}

loadExam();