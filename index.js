let canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    ballRadius = 9,
    x = canvas.width / 2,
    y = canvas.height - 40,
    dx = 2,
    dy = -2;

let paddleHeight = 12,
    paddleWidth = 72;

let gamePaused = false;

// Paddle start position
let paddleX = (canvas.width - paddleWidth) / 2;

// Bricks
let rowCount = 5,
    columnCount = 9,
    brickWidth = 54,
    brickHeight = 18,
    brickPadding = 12,
    topOffset = 40,
    leftOffset = 33,
    score = 0;

// Bricks array
let bricks = [];
for (let c = 0; c < columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rowCount; r++) {
        // Set position of bricks
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        if (paddleX + 10 + paddleWidth < canvas.width) {
            paddleX += 50;
        }
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        if (paddleX - 10 > 0) {
            paddleX -= 50;
        }
    }
    if (e.key === " ") { // Spacebar
        if (gamePaused) {
            unpauseGame();
        } else {
            togglePause();
        }
    }
    if (e.key === "r" || e.key === "R") {
        restartGame();
    }
}

function restartGame() {
    document.location.reload();
}

function togglePause() {
    gamePaused = true;
    alert('The Game is Paused!');
}

function unpauseGame() {
    gamePaused = false;
}

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#D3CDD7';
    ctx.fill();
    ctx.closePath();
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8552';
    ctx.fill();
    ctx.closePath();
}

// Draw Bricks
function drawBricks() {
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + leftOffset;
                let brickY = r * (brickHeight + brickPadding) + topOffset;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#297373';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Track score
function trackScore() {
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#0C1B33';
    ctx.fillText('Score : ' + score, 8, 24);
}

// Check ball hit bricks
function hitDetection() {
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    // Check win
                    if (score === rowCount * columnCount) {
                        alert('WINNER WINNER CHICKEN DINNER');
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Main function
function init() {
    if (!gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        trackScore();
        drawBricks();
        drawBall();
        drawPaddle();
        hitDetection();

        // Detect left and right walls
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        // Detect top wall
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            // Detect paddle hits
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                // If ball doesn't hit paddle
                alert('You Suck!');
                document.location.reload();
            }
        }

        // Bottom wall
        if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
            dy = -dy;
        }

        // Move Ball
        x += dx;
        y += dy;
    }
}

setInterval(init, 10);
