const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const gameOver = document.getElementById("game-over");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score");

let jumping = false;
let gameRunning = true;
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;

//
const obstacleTypes = [
  [30, 30],   // 
  [60, 60],   // 
  [80, 30],   // 
  [30, 80],   // 
  [100, 20],  // 
  [20, 100],  // 
  [100, 50],  // 
  [50, 150],  //
  [90, 100],  //
  [50, 15],   //
  [250, 50],  //
  [80, 80],   //
  [10, 90],   //
  [90, 20],   //
  [70, 10],   //
  [100, 100], //
  [70, 40]    //
];

function jump() {
  if (!gameRunning || jumping) return;
  jumping = true;
  let height = 0;
  const jumpLimit = 225;

  const up = setInterval(() => {
    if (height >= jumpLimit) {
      clearInterval(up);
      const down = setInterval(() => {
        if (height <= 0) {
          clearInterval(down);
          jumping = false;
        } else {
          height -= 8;
          player.style.bottom = `${50 + height}px`;
        }
      }, 16);
    } else {
      height += 8;
      player.style.bottom = `${50 + height}px`;
    }
  }, 16);
}

function spawnObstacle() {
  if (!gameRunning) return;
  
  //
  const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  const width = type[0];
  const height = type[1];
  
  obstacle.style.width = `${width}px`;
  obstacle.style.height = `${height}px`;
  obstacle.style.bottom = "50px";
  obstacle.style.right = "-100px";

  let pos = -100;
  let moveSpeed = 25 + Math.floor(Math.random() * 3);

  const move = setInterval(() => {
    if (!gameRunning) {
      clearInterval(move);
      return;
    }

    pos += moveSpeed;
    obstacle.style.right = `${pos}px`;

    checkCollision();

    if (pos > window.innerWidth + 100) {
      clearInterval(move);
      score += 1;
      scoreDisplay.innerText = `Score: ${score}`;
      
      //
      setTimeout(spawnObstacle, 0 + Math.floor(Math.random() * 0));
    }
  }, 16);
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    playerRect.right > obstacleRect.left &&
    playerRect.left < obstacleRect.right &&
    playerRect.bottom > obstacleRect.top &&
    playerRect.top < obstacleRect.bottom
  ) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  gameOver.style.display = "block";
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  finalScoreDisplay.innerHTML = `Your Score: ${score}<br>Best: ${bestScore}`;
}

function restartGame() {
  location.reload();
}

document.body.addEventListener("mousedown", () => jump());
document.body.addEventListener("touchstart", () => jump());

spawnObstacle();