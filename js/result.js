const result = JSON.parse(localStorage.getItem('examResult'));

if (!result) {
    window.location.replace("exam.html"); // no data, go back
}

const passed = result.passed;

document.getElementById('result-title').innerText   = passed ? "Passed! 🎉" : "Failed 😞";
document.getElementById('result-score').innerText   = `${result.score} / ${result.total}`;
document.getElementById('result-name').innerText    = `${result.user.firstName} ${result.user.lastName}`;
document.getElementById('result-card').className   += passed ? " border-success" : " border-danger";
document.getElementById('result-title').className  += passed ? " text-success"   : " text-danger";

// localStorage.removeItem('examResult'); 