function displayFinalResult() {
    const result = JSON.parse(localStorage.getItem('lastResult'));
    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (result && user) {
        const score = result.score;
        const total = result.total;
        const half = total / 2;

        const greeting = document.getElementById('user-greeting');
        const scoreText = document.getElementById('score-display');
        const icon = document.querySelector('.display-1');

        scoreText.innerText = `${score} / ${total}`;

        if (score >= half) {
            greeting.innerText = `Congratulations, ${user.firstName}! You Passed!`;
            icon.className = "display-1 text-success mb-4";
            icon.innerHTML = '<i class="bi bi-patch-check-fill"></i>';
        } else {
            greeting.innerText = `Sorry, ${user.firstName}! You Failed.`;
            icon.className = "display-1 text-danger mb-4";
            icon.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
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

displayFinalResult();