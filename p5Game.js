let canvas;
let canvasWidth = 600;
let canvasHeight = 600;
let gameOver = false;
let gameHeight;
let gameWidth;

let backgroundimg;
let startimg;
let controlimg;
let resultimg;

let meatballsGIF;
let gifX = 0;
let gifY = -30;
let button1Hover = false;
let button2Hover = false;
let buttonBackHover = false;
let buttonQuitHover = false;
let buttonPlayAgainHover = false;
let cloudX = 0;
let cloudY = 0;

let img;
let twoPlayerImg;
let onePlayer;
let twoPlayers;
let pauseGame;
let player;
let player2;
let keys = {};
let playerRadius;

let logs;
let dx1;
let dy1;
let distance1;
let dx1_2;
let dy1_2;
let distance1_2;
let logRadius;
let totalRadius;

let meatballimg;
let meatball;
let coins = [];
let score = 0;
let currentScore;
let scores = [];
let timer = 1; //for time when meatball touches the ground
let dx2;
let dy2;
let distance2;
let dx2_2;
let dy2_2;
let distance2_2;
let meatballTimer = 0;
let meatballInterval = 1000;
let randomMeatballInterval = Math.random() * 1000 + 500;

let minusCoins = [];
let food = [];
let rottenFood;
let rottenTimer = 0;
let rottenInterval = 1000 * 10;
let randomRottenInterval = Math.random() * 1000 + 500;
let r = Math.floor(Math.random() * food.length);
let dx3;
let dy3;
let distance3;
let dx3_2;
let dy3_2;
let distance3_2;

function preload() {
  //for start screen
  startimg = loadImage("images/startscreen_image.png");
  meatballsGIF = loadImage("images/rainingMeatballs.png");
  //for game screen
  backgroundimg = loadImage("images/backgroundImg.jpg");
  img = loadImage("images/sprites2.png");
  steve = loadImage("images/steve_sprite.png");
  meatballimg = loadImage("images/meatball.png");
  for (let i = 0; i < 5; i++) {
    food[i] = loadImage("foodimages/food" + i + ".png"); //learnt how to write this from https://www.youtube.com/watch?v=FVYGyaxG4To
  }

  //for control screen
  controlimg = loadImage("images/controlscreen_image.png");
  twoPlayerImg = loadImage("images/controlscreen_image_2players.png");
  //for result screen
  resultimg = loadImage("images/resultscreen_image.png");
}

function setup() {
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvasForHTML");
  frameRate(30);
  startScreen();
  textFont("verdana");
  //reload game
  reloadGameScreen();
  //get highscores from localstorage
  getHighscores();
}

//How to be able to press multiple keys at the same time, got help from: https://chatgpt.com/c/b45ece3d-ce26-4d85-aa00-977030eda267
function keyPressed() {
  keys[keyCode] = true; // When a key is pressed, set its value in the keys object to true
}

function keyReleased() {
  keys[keyCode] = false; // When a key is released, set its value in the keys object to false
}

function startScreen() {
  clear();
  background(startimg);
  screen = "start screen";
  image(meatballsGIF, gifX - 30, gifY, canvasWidth + 50, canvasHeight + 50);

  //buttons
  push();
  fill("rgb(172, 179, 215)");
  noStroke();
  push();
  if (button1Hover) {
    stroke(0, 0, 0);
    strokeWeight(1);
  }
  rect(canvasWidth * 0.2833, canvasHeight * 0.725, 110, 34);
  pop();
  push();
  if (button2Hover) {
    stroke(0, 0, 0);
    strokeWeight(1);
  }
  rect(canvasWidth * 0.533, canvasHeight * 0.725, 110, 34);
  pop();
  fill(0);
  textSize(14);
  textAlign(CENTER);
  text("Start Game", canvasWidth * 0.375, canvasHeight * 0.76);
  text("Controls", canvasWidth * 0.62, canvasHeight * 0.76);

  pop();
}
function controlScreen() {
  clear();
  background(controlimg);
  screen = "controls screen";
  if (onePlayer === true) {
    background(controlimg);
    strokeWeight(1);
    noFill();
    rect(170, 300, 100, 30);
  } else if (twoPlayers === true) {
    background(twoPlayerImg);
    strokeWeight(1);
    noFill();
    rect(340, 300, 100, 30);
  }

  push();
  noStroke();
  fill(216, 225, 250);
  push();
  if (buttonBackHover) {
    stroke(0, 0, 0);
    strokeWeight(1);
  }
  rect(26, 30, 80, 30);
  pop();
  fill("black");
  textSize(14);
  text("back", 50, 50);
  pop();

  push();
  noStroke();
  fill(240, 230, 250);
  rect(170, 300, 100, 30);
  rect(340, 300, 100, 30);
  pop();
  push();
  fill(0);
  textSize(14);
  text("one player", 183, 320);
  text("two players", 351, 320);
  pop();
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
    this.previousDirection;
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
    if (keys[RIGHT_ARROW]) {
      this.x += placement;
      this.frameY = 0;
      this.maxFrame = 9;
      this.previousDirection = "right";
    } else if (keys[LEFT_ARROW]) {
      this.x -= placement;
      this.frameY = 1;
      this.maxFrame = 9;
      this.previousDirection = "left";
    } else if (keys[UP_ARROW]) {
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
    } else if (!keys[RIGHT_ARROW] && !keys[LEFT_ARROW] && !keys[UP_ARROW]) {
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

class Player2 {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.imgWidth = 200;
    this.imgHeight = 170;
    this.x = 0;
    this.y = this.gameHeight - this.imgHeight;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 4;
    this.fps = 30;
    this.frameTimer = 5;
    this.frameInterval = 500 / this.fps;
    this.speed = 0.4;
    this.vy = 1;
    this.weight = 1;
    this.previousDirection;
  }

  draw() {
    //create sprite image by https://p5js.org/reference/#/p5/image
    image(
      steve,
      this.x + 250,
      this.y - 15,
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
    if (keys[68]) {
      //RIGHT
      this.previousDirection = "right";
      this.x += placement;
      this.frameY = 0;
      this.maxFrame = 4;
    } else if (keys[65]) {
      //LEFT
      this.previousDirection = "left";
      this.x -= placement;
      this.frameY = 1;
      this.maxFrame = 4;
    } else if (keys[87]) {
      //UP
      this.maxFrame = 4;
      this.frameTimer = this.frameTimer;

      this.y = this.y - 25; //highness of the jump
      if (this.previousDirection === "right") {
        //this.vy -= 2; //velocity on 20, meaning that when jumping up the speed goes from 20->0 and when he falls down again it goes from 0->20
        this.frameY = 2;
        this.frameX = 2;
        //this.frameTimer = 0;
        this.x += placement / 2;
      } else if (this.previousDirection === "left") {
        //this.vy -= 2; //velocity on 20, meaning that when jumping up the speed goes from 20->0 and when he falls down again it goes from 0->20
        this.frameY = 3;
        this.frameX = 2;
        // this.frameTimer = 0;
        this.x -= placement / 2;
      }
    }
    if (!keys[68] && !keys[65] && !keys[87]) {
      this.frameX = 0;
      this.frameTimer = 0;
      this.frameY = 4;
      if (this.previousDirection === "right") {
        this.frameY = 4;
      }
      if (this.previousDirection === "left") {
        this.frameY = 5;
      }
    }
    this.y += this.vy; //velocity when jumping.
    //if the player is not on the ground...
    if (!this.onGround()) {
      this.vy += this.weight; //simulates gravity
    } else {
      this.vy = 0;
      this.maxFrame = 4;
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
    this.speed = 5;
    this.logTimer = 0;
    this.logInterval = 8000;
    this.randomLogInterval = Math.random() * 1000 + 500;
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
    //rectangle around meatball for collision
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
  this.img = food[Math.floor(Math.random() * food.length)];
  this.imgWidth = 50;
  this.imgHeight = 50;

  this.draw = function () {
    //rectangle around rotten food for collision
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

//reset game page inspiration: https://www.youtube.com/watch?v=lm8Y8TD4CTM
function reloadGameScreen() {
  player = new Player(canvasWidth, canvasHeight); //creates player
  player2 = new Player2(canvasWidth, canvasHeight);
  // Create logs and add them to the logs array
  logs = new Log(canvasWidth, canvasHeight);

  timerSpeed = 1.0;
  timer = 1;
  coins = [];
  coins.push(new Meatball(canvasWidth, canvasHeight));
  meatballTimer = 0;
  meatballInterval = 1000;

  minusCoins = [];
  minusCoins.push(new Rotten(canvasWidth, canvasHeight, food[r]));
  rottenTimer = 0;
  rottenInterval = 1000 * 10;

  score = 0;
}

function gameScreen() {
  clear();
  screen = "game screen";
  background(backgroundimg);

  //SCORE
  push();
  textSize(16);
  fill(0);
  text("SCORE: " + score, 25, 37);
  pop();
}

//get highscore from localstorage
function getHighscores() {
  const scoresFromLocalStorage = localStorage.getItem("highscores");
  if (scoresFromLocalStorage) {
    //if we get the item from localstorage, we want to convert the item in scores[] that now are a string back to an array
    scores = JSON.parse(scoresFromLocalStorage);
  } else {
    scores = [];
  }
}
//update scores in localstorage(scoreboard)
function updateHighScores() {
  scores.push(score);
  scores = [...new Set(scores)]; //this one I got help from: https://chatgpt.com/c/bc028cf4-1e03-4fe9-a7bd-cbac64f67395
  scores.sort((a, b) => b - a);
  if (scores.length > 3) {
    scores = scores.slice(0, 3); //to only keep 3 scores in the array
  }

  localStorage.setItem("highscores", JSON.stringify(scores));
}

function resultScreen() {
  clear();
  screen = "result screen";
  background(resultimg);

  //PLAY AGAIN BUTTON
  push();
  noStroke();
  fill(218, 203, 233);
  push();
  if (buttonPlayAgainHover) {
    stroke(0, 0, 0);
    strokeWeight(1);
  }
  rect(201, 518, 198, 35);
  pop();
  textSize(16);
  textAlign(CENTER);
  fill(0);
  text("Play Again", canvasWidth / 2, 540);
  pop();
  //QUIT BUTTON
  push();
  noStroke();
  fill(210, 210, 250);
  push();
  if (buttonQuitHover) {
    stroke(0, 0, 0);
    strokeWeight(1);
  }
  rect(26, 30, 80, 30);
  pop();
  fill("black");
  textSize(14);
  textAlign(CENTER);
  text("quit", 65, 50);
  pop();
  //SCORE
  push();
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER);
  fill(0);
  text("SCORE: " + score, canvasWidth / 2, 255);
  pop();

  // Display top 3 scores
  for (let i = 0; i < 3; i++) {
    push();
    textSize(16);
    textAlign(CENTER);
    fill(0);
    //contrast on the players score on scoreboard
    if (score === scores[i]) {
      if (scores[0]) {
        textStyle(BOLD);
      }
    } else if (score < scores) {
      textStyle(NORMAL);
    }
    //writes out the top 3 scores on scoreboard
    text(scores[i] + "p", canvasWidth / 2 + 45, 343 + i * 56);
    pop();
    // new highscore
    if (i < 1) {
      if (score >= scores[0]) {
        push();
        textSize(22);
        textStyle(NORMAL);
        textAlign(CENTER);
        fill("gold");
        text("You Are The Best", canvasWidth / 2, canvasHeight / 2 - 2);
        pop();
      }
    }
  }

  updateHighScores();
}

function mouseMoved() {
  //hover on start button
  if (
    screen === "start screen" &&
    mouseX > 170 &&
    mouseX < 280 &&
    mouseY > 435 &&
    mouseY < 470
  ) {
    button1Hover = true;
  } else {
    button1Hover = false;
  }

  //hover on controls button
  if (
    screen === "start screen" &&
    mouseX > 320 &&
    mouseX < 430 &&
    mouseY > 435 &&
    mouseY < 470
  ) {
    button2Hover = true;
  } else {
    button2Hover = false;
  }

  //hover on back to start button
  if (
    screen === "controls screen" &&
    mouseX > 26 &&
    mouseX < 106 &&
    mouseY > 30 &&
    mouseY < 60
  ) {
    buttonBackHover = true;
  } else {
    buttonBackHover = false;
  }

  //hover on quit button
  if (
    screen === "result screen" &&
    mouseX > 26 &&
    mouseX < 106 &&
    mouseY > 30 &&
    mouseY < 60
  ) {
    buttonQuitHover = true;
  } else {
    buttonQuitHover = false;
  }

  //hover on play again button
  if (
    screen === "result screen" &&
    mouseX > 200 &&
    mouseX < 400 &&
    mouseY > 518 &&
    mouseY < 550
  ) {
    buttonPlayAgainHover = true;
  } else {
    buttonPlayAgainHover = false;
  }
}

function mousePressed() {
  //start game button
  if (
    screen === "start screen" &&
    mouseX > 170 &&
    mouseX < 280 &&
    mouseY > 435 &&
    mouseY < 470
  ) {
    gameScreen();
  }
  //go to controls button
  if (
    screen === "start screen" &&
    mouseX > 320 &&
    mouseX < 430 &&
    mouseY > 435 &&
    mouseY < 470
  ) {
    controlScreen();
  }

  if (screen === "controls screen") {
    if (mouseX > 170 && mouseX < 270 && mouseY > 300 && mouseY < 330) {
      onePlayer = true;
      twoPlayers = false;
    } else if (mouseX > 340 && mouseX < 440 && mouseY > 300 && mouseY < 330) {
      onePlayer = false;
      twoPlayers = true;
    }
  }
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
    mouseX > 200 &&
    mouseX < 400 &&
    mouseY > 518 &&
    mouseY < 550
  ) {
    screen = "game screen"; // Run game again
    gameOver = false;
    reloadGameScreen();
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
    gameOver = false;
    score = 0;
  }
}

function collision(player, player2, log, meatball, food) {
  //player one
  let pRectX = player.x + 367;
  let pRectY = player.y - 50;
  let pRectWidth = player.imgWidth - 230;
  let pRectHeight = player.imgHeight - 30;

  //player two-steve
  let p2RectX = player2.x + 330;
  let p2RectY = player2.y + 40;
  let p2RectWidth = player2.imgWidth - 170;
  let p2RectHeight = player2.imgHeight - 130;

  //logs
  let lRectX = log.x + 75;
  let lRectY = log.y + 40;
  let lRectWidth = log.imgWidth - 230;
  let lRectHeight = log.imgHeight - 140;

  //rectangle around player
  /*push();
  stroke(50);
  fill("rgba(0,0,0,0)");
  rect(pRectX, pRectY, pRectWidth, pRectHeight);  stroke(50);
  fill("rgba(0,0,0,0)");
  rect(p2RectX, p2RectY, p2RectWidth, p2RectHeight);

  //rectangle around log
  stroke(50);
  fill("rgba(0,0,0,0)");
  rect(lRectX, lRectY, lRectWidth, lRectHeight);
  pop();*/

  //--- COLLISION WITH LOGS---
  const dx1 = lRectX + lRectWidth / 2 - (pRectX + pRectWidth / 2);
  const dy1 = lRectY + lRectHeight / 2 - (pRectY + pRectHeight / 2);
  const distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  if (distance1 < lRectHeight / 2 + pRectHeight / 2) {
    gameOver = true;
  }

  if (twoPlayers) {
    //player two-steve
    const dx1_2 = lRectX + lRectWidth / 2 - (p2RectX + p2RectWidth / 2);
    const dy1_2 = lRectY + lRectHeight / 2 - (p2RectY + p2RectHeight / 2);
    const distance1_2 = Math.sqrt(dx1_2 * dx1_2 + dy1_2 * dy1_2);
    if (distance1_2 < lRectHeight / 2 + p2RectHeight / 2) {
      gameOver = true;
    }
  }

  //---COLLISION WITH MEATBALLS---
  coins.forEach((meatball, i) => {
    const dx2 = pRectX + pRectWidth / 2 - (meatball.x + meatball.imgWidth / 2);
    const dy2 =
      pRectY + pRectHeight / 2 - (meatball.y + meatball.imgHeight / 2);
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2); //the distance2 between those center points
    if (distance2 < meatball.imgHeight / 2 + pRectHeight / 2) {
      if (!gameOver) {
        score++;
        coins.splice(i, 1);
      }
    }

    if (twoPlayers) {
      //player two-steve
      const dx2_2 =
        p2RectX + p2RectWidth / 2 - (meatball.x + meatball.imgWidth / 2);
      const dy2_2 =
        p2RectY + p2RectHeight / 2 - (meatball.y + meatball.imgHeight / 2);
      const distance2_2 = Math.sqrt(dx2_2 * dx2_2 + dy2_2 * dy2_2); //the distance2 between those center points
      if (distance2_2 < meatball.imgHeight / 2 + p2RectHeight / 2) {
        if (!gameOver) {
          score++;
          coins.splice(i, 1);
        }
      }
    }
  });

  //---COLLISION WITH ROTTEN FOOD---
  minusCoins.forEach((food, i) => {
    //food touches the ground
    if (food.y > 490) {
      for (i = 0; i < 5; i++) {
        minusCoins.splice(i, 1);
      }
    }
    //collision between player and rotten food
    const dx3 =
      pRectX + pRectWidth / 2 - (food.x + 20 + (food.imgWidth - 40) / 2);
    const dy3 =
      pRectY + pRectHeight / 2 - (food.y + 15 + (food.imgHeight - 30) / 2);
    const distance3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);
    if (distance3 < (food.imgHeight - 30) / 2 + pRectHeight / 2) {
      score--;
      minusCoins.splice(i, 1);
    }

    if (twoPlayers) {
      //player two-steve
      const dx3_2 =
        p2RectX + p2RectWidth / 2 - (food.x + 20 + (food.imgWidth - 40) / 2);
      const dy3_2 =
        p2RectY + p2RectHeight / 2 - (food.y + 15 + (food.imgHeight - 30) / 2);
      const distance3_2 = Math.sqrt(dx3_2 * dx3_2 + dy3_2 * dy3_2);
      if (distance3_2 < (food.imgHeight - 30) / 2 + p2RectHeight / 2) {
        score--;
        minusCoins.splice(i, 1);
      }
    }
  });
}
//got help with timerSpeed code from https://chatgpt.com/c/38c0759d-0e54-4e36-9bcd-6c0aabe86a71
let timerSpeed = 1.0;
function animate() {
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
  //clouds
  clouds(cloudX1, cloudY1);
  clouds(cloudX2, cloudY2);
  cloudX1 += cloudSpeed1;
  cloudX2 += cloudSpeed2;
  if (cloudX1 < -170) {
    cloudX1 = 600;
  }
  if (cloudX2 < -170) {
    cloudX2 = 600;
  }
}

let cloudSpeed = 0.3;
let cloudSpeed1 = -0.9;
let cloudSpeed2 = -0.6;
let cloudX1 = 60;
let cloudY1 = 30;
let cloudX2 = 350;
let cloudY2 = 80;

function draw() {
  if (screen === "start screen") {
    startScreen();
    gifY = gifY + cloudSpeed;
    if (gifY > canvasHeight - 610 || gifY < -35) {
      cloudSpeed = -cloudSpeed;
    }
  }
  if (screen === "controls screen") {
    controlScreen();
  }
  if (screen === "game screen" && !gameOver) {
    gameScreen();
    animate();
    player.update();
    player.draw();
    if (twoPlayers === true) {
      player2.draw();
      player2.update();
    }
    logs.draw();
    logs.update();

    coins.forEach((meatball) => {
      meatball.draw();
      meatball.update();
    });

    //ROTTEN FOOD
    minusCoins.forEach((food) => {
      food.draw();
      food.update();
    });
    collision(player, player2, logs, coins, minusCoins); // Check collision
  } else if (gameOver === true || screen === "result screen") {
    resultScreen();
  }
}
