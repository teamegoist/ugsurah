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
    dayWords.sort(() => Math.random() - 0.5); // Үгсийг холих
    currentIndex = 0;
    updateDisplay();
}

function updateDisplay() {
    if (dayWords.length === 0) return;
    const currentItem = dayWords[currentIndex];
    document.getElementById('word-box').innerText = currentItem.word;
    generateOptions(currentItem);
}

// 4 Сонголт үүсгэх (1 зөв, 3 буруу)
function generateOptions(correctItem) {
    const grid = document.getElementById('options-grid');
    grid.innerHTML = "";

    let choices = [correctItem];
    
    // Бусад бүх өдрүүдийн үгсийг нэгтгэж буруу сонголт хийх санг бэлдэх
    let allOtherItems = [];
    for (let day in wordData) {
        wordData[day].forEach(item => {
            if (item.word !== correctItem.word) {
                allOtherItems.push(item);
            }
        });
    }
    
    // Санамсаргүй 3 буруу сонголт нэмэх
    allOtherItems.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) {
        if (allOtherItems[i]) choices.push(allOtherItems[i]);
    }

    // 4 сонголтоо дахин холих
    choices.sort(() => Math.random() - 0.5);

    // Дэлгэцэнд зураг хэлбэрээр гаргах
    choices.forEach(item => {
        const div = document.createElement('div');
        div.className = "img-option";
        div.innerHTML = `<img src="${item.img}" alt="сонголт">`;
        div.onclick = () => checkAnswer(item.word, correctItem.word);
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
        if (timeLeft <= 0) {
            endGame(true); // Хугацаа дууссан
        }
    }, 1000);
}

function checkAnswer(selectedWord, correctWord) {
    if (!gameActive) return;

    if (selectedWord === correctWord) {
        score += 10;
        document.getElementById('score').innerText = score;
        
        // Дараагийн үг рүү шилжих
        currentIndex++;
        if (currentIndex >= dayWords.length) {
            currentIndex = 0;
            dayWords.sort(() => Math.random() - 0.5);
        }
        updateDisplay();
    } else {
        // Буруу хариулбал амь хасагдана
        lives--;
        updateLivesDisplay();
        if (lives <= 0) {
            endGame(false); // Амь дууссан
        }
    }
}

function updateLivesDisplay() {
    let hearts = "";
    for (let i = 0; i < lives; i++) {
        hearts += "❤️";
    }
    document.getElementById('lives-display').innerText = hearts || "ҮХЭШГҮЙ ДҮҮ СӨНӨЛӨӨ";
}

function endGame(timeOut) {
    clearInterval(timerInterval);
    gameActive = false;
    document.getElementById('final-score').innerText = score;
    
    const endTitle = document.getElementById('end-title');
    if (timeOut) {
        endTitle.innerText = "Хугацаа Дууслаа! ⏰";
        endTitle.style.color = "var(--neon-blue)";
    } else {
        endTitle.innerText = "Амь Дууслаа! 💀";
        endTitle.style.color = "var(--neon-pink)";
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
