let currentDay = 1;
let dayWords = [];
let currentIndex = 0;
let score = 0;
let lives = 10;
let timeLeft = 60;
let timerInterval = null;
let gameActive = false;

function initTabs() {
    const container = document.getElementById('tabs-container');
    container.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${i === 1 ? 'active' : ''}`;
        btn.innerText = `ӨДӨР ${i}`;
        btn.onclick = () => selectDay(i, btn);
        container.appendChild(btn);
    }
    setupDay();
}

function selectDay(day, element) {
    if (gameActive) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    element.classList.add('active');
    currentDay = day;
    setupDay();
}

function setupDay() {
    dayWords = [...wordData[currentDay]];
    dayWords.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    updateDisplay();
}

function updateDisplay() {
    if (dayWords.length === 0) return;
    const currentItem = dayWords[currentIndex];
    
    const wordBox = document.getElementById('word-card');
    wordBox.className = "word-card animate__animated animate__zoomIn";
    document.getElementById('word-box').innerText = currentItem.word;
    
    generateOptions(currentItem);
    
    setTimeout(() => {
        wordBox.className = "word-card";
    }, 600);
}

function generateOptions(correctItem) {
    const grid = document.getElementById('options-grid');
    grid.innerHTML = "";

    let choices = [correctItem];
    let allOtherItems = [];
    
    for (let day in wordData) {
        wordData[day].forEach(item => {
            if (item.word !== correctItem.word) {
                allOtherItems.push(item);
            }
        });
    }
    
    allOtherItems.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) {
        if (allOtherItems[i]) choices.push(allOtherItems[i]);
    }

    choices.sort(() => Math.random() - 0.5);

    choices.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "img-option animate__animated animate__backInUp";
        div.style.animationDelay = `${index * 0.08}s`;
        // Зургийн таг биш шууд Эможи дүрсийг маш томоор (зураг шиг) харуулна
        div.innerHTML = `<span style="font-size: 4.5rem;">${item.img}</span>`;
        div.onclick = () => checkAnswer(item.word, correctItem.word, div);
        grid.appendChild(div);
    });
}

function startGame() {
    document.getElementById('start-overlay').classList.add('hidden');
    gameActive = true;
    score = 0;
    lives = 10;
    timeLeft = 60;
    
    document.getElementById('score').innerText = score;
    document.getElementById('timer').innerText = timeLeft;
    updateLivesDisplay();
    setupDay();

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) endGame(true);
    }, 1000);
}

function checkAnswer(selectedWord, correctWord, element) {
    if (!gameActive) return;

    if (selectedWord === correctWord) {
        element.style.borderColor = "var(--rumi-green)";
        element.className = "img-option animate__animated animate__flipInY";
        score += 10;
        document.getElementById('score').innerText = score;
        
        setTimeout(() => {
            currentIndex++;
            if (currentIndex >= dayWords.length) {
                currentIndex = 0;
                dayWords.sort(() => Math.random() - 0.5);
            }
            updateDisplay();
        }, 500);
    } else {
        lives--;
        updateLivesDisplay();
        element.classList.add('wrong-flash');
        setTimeout(() => {
            element.classList.remove('wrong-flash');
        }, 400);
        if (lives <= 0) endGame(false);
    }
}

function updateLivesDisplay() {
    let hearts = "";
    for (let i = 0; i < lives; i++) hearts += "❤️";
    document.getElementById('lives-display').innerText = hearts || "GAME OVER 👾";
}

function endGame(timeOut) {
    clearInterval(timerInterval);
    gameActive = false;
    document.getElementById('final-score').innerText = score;
    
    const endTitle = document.getElementById('end-title');
    if (timeOut) {
        endTitle.innerText = "Хугацаа Дууслаа! ⏰";
        endTitle.style.color = "var(--rumi-cyan)";
    } else {
        endTitle.innerText = "Руми Ялагдлаа! 🎤";
        endTitle.style.color = "var(--rumi-magenta)";
    }
    
    document.getElementById('end-overlay').classList.remove('hidden');
}

function resetGame() {
    document.getElementById('end-overlay').classList.add('hidden');
    document.getElementById('start-overlay').classList.remove('hidden');
    document.getElementById('word-box').innerText = "-";
    document.getElementById('options-grid').innerHTML = "";
}

window.onload = initTabs;
