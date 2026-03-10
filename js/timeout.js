function showResult() {
    const result = JSON.parse(localStorage.getItem('lastResult'));
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (result && user) {
        const score = result.score;
        const total = result.total;
        const passMark = total / 2;

        const scoreDisplay = document.getElementById('final-score');
        if (scoreDisplay) {
            scoreDisplay.innerText = `${score} / ${total}`;
            scoreDisplay.className = score >= passMark ? "display-4 fw-bold text-success" : "display-4 fw-bold text-danger";
        }

        const greeting = document.getElementById('user-greeting');
        if (greeting) {
            if (score >= passMark) {
                greeting.innerText = `Well done, ${user.firstName}! You Passed!`;
            } else {
                greeting.innerText = `Hard luck, ${user.firstName}! You Failed.`;
            }
        }
    } else {
        window.location.href = "signin.html";
    }
}

function logout() {
    document.cookie = "login=false; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('lastResult');
    window.location.href = "signin.html";
}

showResult();