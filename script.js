const boardWidth = 750;
const boardHeight = 250;

let board;
let context;
let dinoImage1;
let dinoImage2;
let gameOver = false;
let score = 0;

// dino
const dinoWidth = 88;
const dinoHeight = 94;
const dinoX = 50;
let dinoY = boardHeight - dinoHeight;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
};

// cactus
let cactusArray = [];
const cactus1Width = 34;
const cactus2Width = 69;
const cactus3Width = 102;
const cactusHeight = 70;

let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// physics
let velocityX = -10;
let velocityY = 0;
const gravity = 0.4;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;

  context = board.getContext("2d");

  dinoImage1 = new Image();
  dinoImage2 = new Image();
  dinoImage1.src = "img/dino-run1.png";
  dinoImage2.src = "img/dino-run2.png";

  dinoImage1.onload = function () {
    context.drawImage(dinoImage1, dino.x, dino.y, dino.width, dino.height);
  };

  cactus1Img = new Image();
  cactus2Img = new Image();
  cactus3Img = new Image();
  cactus1Img.src = "img/cactus1.png";
  cactus2Img.src = "img/cactus2.png";
  cactus3Img.src = "img/cactus3.png";

  requestAnimationFrame(update);
  setInterval(createCactus, 1000);

  document.addEventListener("keydown", moveDino);
};

function update() {
  if (gameOver) return;
  score++;
  requestAnimationFrame(update);
  context.clearRect(0, 0, boardWidth, boardHeight);

  velocityY += gravity;
  dino.y = Math.min(dinoY, dino.y + velocityY);
  if (score % 8 === 0) {
    context.drawImage(dinoImage1, dino.x, dino.y, dino.width, dino.height);
  } else {
    context.drawImage(dinoImage2, dino.x, dino.y, dino.width, dino.height);
  }

  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(
      cactus.img,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (detectCollision(dino, cactus)) {
      gameOver = true;
      alert("Game Over! Your score: " + score);
      dinoImage1.src = "img/dino-dead.png";
      dinoImage1.onload = function () {
        context.drawImage(dinoImage1, dino.x, dino.y, dino.width, dino.height);
      };

      return;
    }
  }

  context.fillStyle = "black";
  context.font = "20px Arial";
  context.fillText("Score: " + score, board.width-150, 20);
}

function createCactus() {
  if (gameOver) return;
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: 0,
    height: cactusHeight,
  };

  let randomCactus = Math.random();

  if (randomCactus >= 0.8) {
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
  } else if (randomCactus >= 0.5) {
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
  } else {
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
  }
  cactusArray.push(cactus);

  if (cactusArray.length > 5) {
    cactusArray.shift();
  }
}

function moveDino(e) {
  if (gameOver) return;
  if ((e.code === "ArrowUp" || e.code === "Space") && dino.y === dinoY) {
    velocityY = -10;
  }
}

function detectCollision(dino, cactus) {
  // Check horizontal overlap (X-axis)
  const horizontalOverlap =
    dino.x + dino.width > cactus.x && dino.x < cactus.x + cactus.width;

  // Check vertical overlap (Y-axis)
  const verticalOverlap =
    dino.y + dino.height > cactus.y && dino.y < cactus.y + cactus.height;

  // If both horizontal and vertical ranges overlap, there's a collision
  return horizontalOverlap && verticalOverlap;
}
