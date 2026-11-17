const road = document.getElementById('road');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const finalScoreEl = document.getElementById('final-score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

let playerX = 150;
let speed = 5;
let score = 0;
let isPlaying = false;
let animationId;
let keys = { ArrowLeft: false, ArrowRight: false };

// კლავიატურის კონტროლი
document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
    // წინა ელემენტების გასუფთავება
    document.querySelectorAll('.road-line, .enemy-car').forEach(el => el.remove());
    
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    playerX = 150;
    player.style.left = playerX + 'px';
    speed = 5;
    score = 0;
    scoreEl.innerText = score;
    isPlaying = true;

    // გზის ხაზების შექმნა
    for (let i = 0; i < 5; i++) {
        let line = document.createElement('div');
        line.classList.add('road-line');
        line.y = i * 130;
        line.style.top = line.y + 'px';
        road.appendChild(line);
    }

    // მოწინააღმდეგე მანქანების შექმნა
    for (let i = 0; i < 3; i++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy-car');
        enemy.y = ((i + 1) * -250);
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.floor(Math.random() * 290) + 'px';
        road.appendChild(enemy);
    }

    animationId = requestAnimationFrame(gameLoop);
}

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !(
        (aRect.bottom < bRect.top) ||
        (aRect.top > bRect.bottom) ||
        (aRect.right < bRect.left) ||
        (aRect.left > bRect.right)
    );
}

function gameLoop() {
    if (!isPlaying) return;

    // გზის ხაზების მოძრაობა
    document.querySelectorAll('.road-line').forEach(line => {
        if (line.y >= 600) line.y -= 650;
        line.y += speed;
        line.style.top = line.y + 'px';
    });

    // მოწინააღმდეგეების მოძრაობა და შეჯახების შემოწმება
    document.querySelectorAll('.enemy-car').forEach(enemy => {
        if (isCollide(player, enemy)) {
            endGame();
        }
        if (enemy.y >= 620) {
            enemy.y = -150;
            enemy.style.left = Math.floor(Math.random() * 290) + 'px';
            score += 10;
            scoreEl.innerText = score;
            if (score % 50 === 0) speed += 0.5; // სიჩქარის მომატება
        }
        enemy.y += speed;
        enemy.style.top = enemy.y + 'px';
    });

    // მოთამაშის მოძრაობა
    if (keys.ArrowLeft && playerX > 5) playerX -= 6;
    if (keys.ArrowRight && playerX < 295) playerX += 6;
    player.style.left = playerX + 'px';

    animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
    isPlaying = false;
    cancelAnimationFrame(animationId);
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');
}