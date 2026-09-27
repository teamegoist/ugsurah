let currentDay = 1;
let currentWords = [];
let wordIndex = 0;
let score = 0;
let timeLeft = 60;
let timerInterval = null;
let gameActive = false;

function initTabs() {
    const container = document.getElementById('tabs-container');
    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${i === 1 ? 'active' : ''}`;
        btn.innerText = `ӨДӨР ${i}`;
        btn.onclick = () => selectDay(i, btn);
        container.appendChild(btn);
    }
    loadDayWords();
}

function selectDay(day, element) {
    if (gameActive) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
    currentDay = day;
    loadDayWords();
}

function loadDayWords() {
    currentWords = [...wordData[currentDay]];
    currentWords.sort(() => Math.random() - 0.5); // Санамсаргүй холих
    wordIndex = 0;
    document.getElementById('word-box').innerText = currentWords[wordIndex];
}

function startGame() {
    document.getElementById('start-overlay').classList.add('hidden');
    document.getElementById('btn-wrong').disabled = false;
    document.getElementById('btn-correct').disabled = false;
    gameActive = true;
    score = 0;
    timeLeft = 60;
    document.getElementById('score').innerText = score;
    document.getElementById('timer').innerText = timeLeft;
    
    loadDayWords();

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function nextWord(isCorrect) {
    if (!gameActive) return;

    if (isCorrect) {
        score += 10;
        document.getElementById('score').innerText = score;
    }

    wordIndex++;
    if (wordIndex >= currentWords.length) {
        currentWords.sort(() => Math.random() - 0.5);
        wordIndex = 0;
    }
    document.getElementById('word-box').innerText = currentWords[wordIndex];
}

function endGame() {
    clearInterval(timerInterval);
    gameActive = false;
    document.getElementById('btn-wrong').disabled = true;
    document.getElementById('btn-correct').disabled = true;
    document.getElementById('final-score').innerText = score;
    document.getElementById('end-overlay').classList.remove('hidden');
}

function resetGame() {
    document.getElementById('end-overlay').classList.add('hidden');
    document.getElementById('start-overlay').classList.remove('hidden');
    document.getElementById('word-box').innerText = "-";
}

window.onload = initTabs;
