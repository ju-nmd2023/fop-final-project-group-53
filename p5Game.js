let canvasWidth = 600;
let canvasHeight = 600;
let gameOver = false;
let backgroundimg;
let startimg;
let img;
let myFont;
let button;
let button2;
let button3;
let cloudX = 0;
let cloudY = 0;

let gameHeight;
let gameWidth;
let pauseGame;
let player;

let log;
let dx1;
let dy1;
let distance1;
let playerRadius;
let logRadius;
let totalRadius;
let logs = [];

let meatballimg;
let meatball;
let coins = [];
let score = 0;
let firstPlace = 0;
let secondPlace = 0;
let thirdPlace = 0;
let timer = 1;
let dx2;
let dy2;
let distance2;
let meatballTimer = 0;
let meatballInterval = 1000;
let randomMeatballInterval = Math.random() * 1000 + 500;

/*bubbles*/ let minusCoins = [];
/*flowers*/ let food = [];
let rottenFood;
let rottenTimer = 0;
let rottenInterval = 1000 * 10;
let randomRottenInterval = Math.random() * 1000 + 500;
let r = floor(random(0, food.length));
let dx3;
let dy3;
let distance3;

function preload() {
  //for start screen
  startimg = loadImage("images/startscreen_image.png");
  //for game screen
  backgroundimg = loadImage("images/backgroundImg.jpg");
  img = loadImage("images/sprites2.png");
  meatballimg = loadImage("images/meatball.png");
  for (let i = 0; i < 5; i++) {
    food[i] = loadImage("foodimages/food" + i + ".png"); //learnt from https://www.youtube.com/watch?v=FVYGyaxG4To
  }

  //for control screen
  controlimg = loadImage("images/controlscreen_image.png");
  resultimg = loadImage("images/resultscreen_image.png");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
  startScreen();
  textFont("Times New Roman");
  reloadGameScreen();

  //Play Button
  button = createButton("Start Game");
  button.position(180, 435);
  button.size(110, 34);
  button.mousePressed(gameScreen);
  button2 = createButton("Controls");
  button2.position(350, 435);
  button2.size(110, 34);
  button2.mousePressed(controlScreen);
}

function clouds(x, y) {
  //CLOUDS
  push();
  translate(cloudX, cloudY);
  fill("rgba(255, 255, 255, 0.75)");
  noStroke();
  beginShape();
  vertex(x + 50, y + 60);
  bezierVertex(x + 50, y + 60, x + 65, y + 35, x + 100, y + 55);
  bezierVertex(x + 100, y + 55, x + 120, y + 45, x + 140, y + 65);
  bezierVertex(x + 140, y + 65, x + 175, y + 80, x + 150, y + 100);
  bezierVertex(x + 120, y + 110, x + 140, y + 110, x + 90, y + 110);
  bezierVertex(x + 90, y + 110, x + 45, y + 120, x + 40, y + 90);
  bezierVertex(x + 40, y + 90, x + 20, y + 70, x + 50, y + 60);
  endShape();
  pop();
}

function startScreen() {
  clear();
  background(startimg);
  screen = "start screen";
}

function controlScreen() {
  clear();
  screen = "controls screen";
  background(controlimg);

  push();
  noStroke();
  fill(210, 210, 250);
  rect(26, 30, 80, 30);
  fill("black");
  textSize(18);
  text("back", 50, 50);
  pop();

  button.remove();
  button2.remove();
}

function gameScreen() {
  clear();
  screen = "game screen";
  background(backgroundimg);
  button.remove();
  button2.remove();
  push();
  //SCORE
  textSize(16);
  text("SCORE: " + score, 25, 37);
  //PAUSE BUTTON
  noStroke();
  fill(200, 200, 250);
  ellipse(555, 35, 30, 30);
  fill("black");
  pop();

  if (!pauseGame) {
    push();
    noStroke();
    fill("white");
    rect(550, 27, 3, 15);
    rect(557, 27, 3, 15);
    pop();
  } else {
    push();
    stroke("white");
    strokeWeight(2.2);
    line(551, 27, 563, 35);
    line(563, 35, 551, 43);
    line(551, 43, 551, 27);
    pop();
  }
}

//reset game page inspiration: https://www.youtube.com/watch?v=lm8Y8TD4CTM
function reloadGameScreen() {
  player = new Player(canvasWidth, canvasHeight); //creates player
  // Create logs and add them to the logs array
  logs = []; //clear logs array
  for (let i = 0; i < 5; i++) {
    logs.push(new Log(canvasWidth, canvasHeight));
  }
  coins = [];
  coins.push(new Meatball(canvasWidth, canvasHeight));
  minusCoins = [];
  minusCoins.push(new Rotten(canvasWidth, canvasHeight, food[r]));
  //pauseGame = !pauseGame;
}

class Player {
  //sprite code, learnt from this tutorial https://www.youtube.com/watch?v=7JtLHJbm0kA&t=1675s
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.imgWidth = 200;
    this.imgHeight = 170;
    this.x = 0;
    this.y = this.gameHeight - this.imgHeight;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 9;
    this.fps = 30;
    this.frameTimer = 5;
    this.frameInterval = 1000 / this.fps;
    this.speed = 0.4;
    this.vy = 1;
    this.weight = 1;
    this.previousDirection = null;
  }

  draw() {
    //create sprite image by https://p5js.org/reference/#/p5/image
    image(
      img,
      this.x + 250,
      this.y - 75,
      this.imgWidth,
      this.imgHeight,
      this.frameX * this.imgWidth,
      this.frameY * this.imgHeight,
      this.imgWidth,
      this.imgHeight
    ); //draws the player
  }

  update() {
    //SPRITE ANIMATION FRAME BY FRAME
    //checks if enough time has passed for the next frame to be shown. If this condition is true, it means it's time to update the frame.
    if (this.frameTimer > this.frameInterval) {
      //checks if the current frame index exceeds the maximum frame index. If it does, it resets spriteanimation back to 0
      if (this.frameX >= this.maxFrame) this.frameX = 0; //resets animation loop
      else this.frameX++; //display next frame in the animation
      this.frameTimer = 0; //resets the frameTimer back to zero after making an animation of all 10 (0-9) frames
    } else {
      //controls the animation and ensure consistent timing, player is running
      this.frameTimer += deltaTime; //deltatime calculates the amount of time it took draw() to execute each frame of the sprite img.
    }
    //CONTROLS
    let placement = this.speed * deltaTime; //deltatime calculates the amount of time it took draw() to execute each frame of the sprite img.
    if (keyIsPressed && keyCode == RIGHT_ARROW) {
      this.x += placement;
      this.frameY = 0;
      this.maxFrame = 9;
      this.previousDirection = "right";
    } else if (keyIsPressed && keyCode == LEFT_ARROW) {
      this.x -= placement;
      this.frameY = 1;
      this.maxFrame = 9;
      this.previousDirection = "left";
    } else if (keyIsPressed && keyCode == UP_ARROW) {
      this.maxFrame = 6;
      this.y = this.y - 25; //highness of the jump
      // got help with writing previous direction detection code from https://chatgpt.com/c/5b563428-b8d0-44be-b4b3-cc8fcd2e7562
      if (this.previousDirection === "right") {
        //this.vy -= 2; //velocity on 20, meaning that when jumping up the speed goes from 20->0 and when he falls down again it goes from 0->20
        this.frameY = 2;
        this.x += placement / 2;
      } else if (this.previousDirection === "left") {
        //this.vy -= 2; //velocity on 20, meaning that when jumping up the speed goes from 20->0 and when he falls down again it goes from 0->20
        this.frameY = 3;
        this.x -= placement / 2;
      }
    } else if (!keyIsPressed) {
      this.frameTimer = 0;
      this.frameX = 0;
    }
    this.y += this.vy; //velocity when jumping.
    //if the player is not on the ground...
    if (!this.onGround()) {
      this.vy += this.weight; //simulates gravity
      this.maxFrame = 6;
    } else {
      this.vy = 0;
      this.maxFrame = 9;
      //make the player land on ground with running sprite
      if (this.previousDirection === "right") {
        this.frameY = 0;
      }
      if (this.previousDirection === "left") {
        this.frameY = 1;
      }
    }

    //CANT RUN OR JUMP OUTSIDE CANVAS
    if (this.x > 210) {
      this.x = 210;
    }
    if (this.x < -310) {
      this.x = -310;
    }
    if (this.y > this.gameHeight - this.imgHeight) {
      this.y = this.gameHeight - this.imgHeight;
    }
  }
  onGround() {
    return this.y > this.gameHeight - this.imgHeight;
  }
}

class Log {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.imgWidth = 200;
    this.imgHeight = 170;
    this.x = -200;
    this.y = 450;
    this.frameX = 0;
    this.frameY = 4;
    this.maxFrame = 4;
    this.fps = 32;
    this.frameTimer = 4;
    this.frameInterval = 1000 / this.fps;
    this.speed = 9;
    this.logTimer = 0;
    this.logInterval = 8000;
    this.randomLogInterval = Math.random() * 1000 + 500;
    //this.markedForDeletion = false;
  }

  draw(context) {
    image(
      img,
      this.x,
      this.y,
      this.imgWidth * 0.8,
      this.imgHeight * 0.65,
      this.frameX * this.imgWidth,
      this.frameY * this.imgHeight,
      this.imgWidth,
      this.imgHeight
    ); //draws the log
  }
  update() {
    //log sprite animation
    if (score > 4) {
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0; //resets the frameTimer back to zero after making an animation of all 10 (0-9) frames
      } else {
        this.frameTimer += deltaTime;
      }
      this.x += this.speed;

      //create more logs
      if (this.x > canvasWidth) {
        this.x = -200;
      }
    }
  }
}

class Meatball {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.imgWidth = 25;
    this.imgHeight = 25;
    //got help to create right x window, between 50 and 550, for the meatballs https://chatgpt.com/c/4e3512bb-735f-442b-8ccc-56fda2de9cdf
    this.x = Math.floor(Math.random() * (550 - 50 + 1)) + 50;
    this.y = -100;
    this.frameX = 0;
    this.speed = 8;
  }

  draw() {
    /* push();
    stroke(50);
    fill("rgba(0,0,0,0)");
    rect(this.x, this.y, this.imgWidth, this.imgHeight);
    pop();*/
    image(meatballimg, this.x, this.y, this.imgWidth, this.imgHeight);
  }

  update() {
    this.y += this.speed;

    //MEATBALL TOUCHES THE GROUND
    if (this.y > 495) {
      this.speed = 0;
      //  TIMER
      //code inspiration from https://editor.p5js.org/marynotari/sketches/S1T2ZTMp-
      if ((frameCount * 2) % 60 == 0 && timer > 0) {
        // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
        timer--;
      }
      if (timer == 0) {
        gameOver = true;
      }
    }
  }
}

function Rotten(gameWidth, gameHeight) {
  this.gameWidth = gameWidth;
  this.gameHeight = gameHeight;
  this.x = Math.floor(Math.random() * (550 - 50 + 1)) + 50;
  this.y = -100;
  this.speed = 8;
  this.img = food[floor(random(0, food.length))];
  this.imgWidth = 50;
  this.imgHeight = 50;

  this.draw = function () {
    /* push();
    stroke(50);
    fill("rgba(0,0,0,0)");
    rect(this.x + 20, this.y + 15, this.imgWidth - 40, this.imgHeight - 30);
    pop();*/
    image(this.img, this.x, this.y, this.imgWidth, this.imgHeight);
  };

  this.update = function () {
    if (score > 8) {
      this.y += this.speed;
    }
  };
}

function collision(player, log, meatball, food) {
  //COLLISION WITH LOGS
  let pRectX = player.x + 367;
  let pRectY = player.y - 50;
  let pRectWidth = player.imgWidth - 230;
  let pRectHeight = player.imgHeight - 30;

  let lRectX = log.x + 75;
  let lRectY = log.y + 40;
  let lRectWidth = log.imgWidth - 230;
  let lRectHeight = log.imgHeight - 140;
  /*push();
  stroke(50);
  fill("rgba(0,0,0,0)");
  rect(pRectX, pRectY, pRectWidth, pRectHeight);
  stroke(50);
  fill("rgba(0,0,0,0)");
  rect(lRectX, lRectY, lRectWidth, lRectHeight);
  pop();*/

  logs.forEach((log) => {
    const dx1 = lRectX + lRectWidth / 2 - (pRectX + pRectWidth / 2);
    const dy1 = lRectY + lRectHeight / 2 - (pRectY + pRectHeight / 2);
    const distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    if (distance1 < lRectHeight / 2 + pRectHeight / 2) {
      gameOver = true;
    }
  });

  //COLLISION WITH MEATBALLS
  coins.forEach((meatball) => {
    const dx2 = pRectX + pRectWidth / 2 - (meatball.x + meatball.imgWidth / 2);
    const dy2 =
      pRectY + pRectHeight / 2 - (meatball.y + meatball.imgHeight / 2);
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2); //the distance2 between those center points
    if (distance2 < meatball.imgHeight / 2 + pRectHeight / 2) {
      score++;
      coins.splice(0, 1);
    }
  });

  minusCoins.forEach((food, i) => {
    //FOOD TOUCHES THE GROUND
    if (food.y > 490) {
      for (i = 0; i < 5; i++) {
        minusCoins.splice(i, 1);
      }
    }
    //COLLISION WITH FOOD
    const dx3 =
      pRectX + pRectWidth / 2 - (food.x + 20 + (food.imgWidth - 40) / 2);
    const dy3 =
      pRectY + pRectHeight / 2 - (food.y + 15 + (food.imgHeight - 30) / 2);
    const distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);
    if (distance3 < (food.imgHeight - 30) / 2 + pRectHeight / 2) {
      score--;
      minusCoins.splice(i, 1);
    }
  });
}

function resultScreen() {
  clear();
  screen = "result screen";
  background(resultimg);
  push();
  //SCORE
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER);
  text("SCORE: " + score, canvasWidth / 2, 255);
  //SCOREBOARD
  textSize(18);
  textStyle(BOLD);
  textAlign(RIGHT);
  text(firstPlace + " p", canvasWidth / 2 + 70, 345);
  text(secondPlace + " p", canvasWidth / 2 + 70, 400);
  text(thirdPlace + " p", canvasWidth / 2 + 70, 452);
  pop();
  //PLAY AGAIN BUTTON
  push();
  textSize(18);
  textAlign(CENTER);
  text("Play Again", canvasWidth / 2, 540);
  //BACK TO START BUTTON

  noStroke();
  fill(210, 210, 250);
  rect(26, 30, 80, 30);
  fill("black");
  textSize(18);
  text("quit", 65, 50);
  pop();
  button.remove();
  button2.remove();
}

function mousePressed() {
  if (
    screen === "controls screen" &&
    mouseX > 26 &&
    mouseX < 106 &&
    mouseY > 30 &&
    mouseY < 60
  ) {
    screen = "start screen"; // Go back to the start screen
    setup();
  }
  if (
    screen === "result screen" &&
    mouseX > 250 &&
    mouseX < 350 &&
    mouseY > 520 &&
    mouseY < 545
  ) {
    screen = "game screen"; // Run game again
    reloadGameScreen();
    gameOver = false;
    score = 0;
  }
  if (
    screen === "result screen" &&
    mouseX > 26 &&
    mouseX < 106 &&
    mouseY > 30 &&
    mouseY < 60
  ) {
    screen = "start screen"; // Go back to the start screen
    setup();
    reloadGameScreen();
    gameOver = false;
    score = 0;
  }
  if (
    screen === "game screen" &&
    mouseX > 540 &&
    mouseX < 570 &&
    mouseY > 20 &&
    mouseY < 50
  ) {
    pauseGame = !pauseGame; // Pause game while playing
  }
}

function animate() {
  for (let i = 0; i < logs.length; i++) {
    logs[i].draw();
    logs[i].update();
    collision(player, logs[i], coins[i], minusCoins[i]); // Check collision with each log
  }
  player.update();
  player.draw();

  coins.forEach((meatball) => {
    meatball.draw();
    meatball.update();
  });

  //ROTTEN FOOD
  minusCoins.forEach((food) => {
    food.draw();
    food.update();
  });
}

//got help with timerSpeed code from https://chatgpt.com/c/38c0759d-0e54-4e36-9bcd-6c0aabe86a71
let timerSpeed = 1.0;
let cloudSpeed = -2.5;

function draw() {
  if (screen === "start screen") {
    startScreen();
  } else if (screen === "game screen") {
    gameScreen();
    if (!gameOver) {
      animate(0);
      //meatball
      if (score % 5 === 0) {
        timerSpeed += 0.01;
      }
      if (meatballTimer > meatballInterval + randomMeatballInterval) {
        coins.push(new Meatball(canvasWidth, canvasHeight));
        meatballTimer = 0;
      } else {
        meatballTimer += deltaTime * timerSpeed; //creates more meatballs
      }
      //rotten food
      if (rottenTimer > rottenInterval + randomRottenInterval) {
        minusCoins.push(new Rotten(canvasWidth, canvasHeight));
        rottenTimer = 0;
        randomRottenInterval = Math.random() * 1000 + 500;
      } else {
        rottenTimer += deltaTime; //creates more rotten food
      }
      //CLOUDS
      clouds(60, 30);
      clouds(350, 80);
      //cloudX += cloudSpeed;
      if (cloudX < -100) {
        cloudX = 600;
      }
    } else {
      resultScreen();
    }
  } else if (screen === "controls screen") {
    controlScreen();
  } else if (screen === "result screen") {
    resultScreen();
  }
}
