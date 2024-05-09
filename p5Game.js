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

let gameHeight;
let gameWidth;
let player;

let log;
let dx;
let dy;
let distance;
let playerRadius;
let logRadius;
let totalRadius;
let logs = [];

let meatball;
let coins = [];
let score = 0;
let firstPlace = 1000;
let secondPlace = 872;
let thirdPlace = 360;

function preload() {
  // myFont = loadFont("LilitaOne-Regular.ttf");
  //for start screen
  startimg = loadImage("images/startscreen_image.png");
  //for game screen
  backgroundimg = loadImage("images/backgroundImg.jpg");
  img = loadImage("images/sprites2.png");
  meatballimg = loadImage("images/meatball.png");
  //for control screen
  controlimg = loadImage("images/controlscreen_image.png");
  resultimg = loadImage("images/resultscreen_image.png");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
  startScreen();
  reloadGameScreen();
  textFont("Times New Roman");

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
  //button3.remove();
}

//reset game page inspiration: https://www.youtube.com/watch?v=lm8Y8TD4CTM
function reloadGameScreen() {
  player = new Player(canvasWidth, canvasHeight); //creates player
  // Create logs and add them to the logs array
  logs = []; //clear logs array
  for (let i = 0; i < 5; i++) {
    logs.push(new Log(canvasWidth, canvasHeight));
  }
  meatball = new Meatball(canvasWidth, canvasHeight);
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
    this.logInterval = 1000;
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

class Meatball {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.imgWidth = 500;
    this.imgHeight = 500;
    this.x = Math.floor(Math.random() * 2000);
    this.y = 0;
    this.frameX = 0;
    this.speed = 8;
  }

  draw() {
    image(
      meatballimg,
      100,
      100,
      this.imgWidth,
      this.imgHeight,
      this.frameX * this.imgWidth,
      0 * this.imgHeight,
      this.imgWidth,
      this.imgHeight
    );
  }
}

function collision(player, log) {
  let pRectX = player.x + 365;
  let pRectY = player.y - 50;
  let pRectWidth = player.imgWidth - 240;
  let pRectHeight = player.imgHeight - 30;

  let lRectX = log.x + 90;
  let lRectY = log.y + 30;
  let lRectWidth = log.imgWidth - 250;
  let lRectHeight = log.imgHeight - 120;
  push();
  stroke(50);
  fill("rgba(0,0,0,0)");
  rect(pRectX, pRectY, pRectWidth, pRectHeight);
  stroke(50);
  fill("rgba(0,0,0,0)");
  rect(lRectX, lRectY, lRectWidth, lRectHeight);
  pop();

  //got help with what to write in this if-statement from: https://chatgpt.com/c/018a26bb-9246-423e-aac0-c394643ad1db

  if (
    pRectX < lRectX + lRectWidth &&
    pRectX + pRectWidth < lRectX &&
    pRectY < lRectY + lRectHeight &&
    pRectY + pRectHeight > lRectY
  ) {
    // gameOver = true;
  } else {
    gameOver = false;
  }
}

function resultScreen() {
  clear();
  screen = "result screen";
  background(resultimg);
  push();
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER);
  text("SCORE: " + score, canvasWidth / 2, 255);
  pop();
  push();
  textSize(18);
  textStyle(BOLD);
  textAlign(RIGHT);
  text(firstPlace + " p", canvasWidth / 2 + 70, 345);
  text(secondPlace + " p", canvasWidth / 2 + 70, 400);
  text(thirdPlace + " p", canvasWidth / 2 + 70, 452);
  pop();
  push();
  textSize(18);
  textAlign(CENTER);
  text("Play Again", canvasWidth / 2, 540);
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
  } else if (
    screen === "result screen" &&
    mouseX > 250 &&
    mouseX < 350 &&
    mouseY > 520 &&
    mouseY < 545
  ) {
    screen = "game screen"; // Go back to the start screen
    reloadGameScreen();
    gameOver = false;
  }
}

function animate() {
  for (let i = 0; i < logs.length; i++) {
    logs[i].draw();
    logs[i].update();
    collision(player, logs[i]); // Check collision with each log
  }
  player.update();
  player.draw();
  meatball.draw();
}

function draw() {
  // gameScreen();
  //  player.draw();

  // resultScreen();
  /*if (collision(player, log)) {
    gameOver = true;
  }*/
  if (screen === "start screen") {
    startScreen();
  } else if (screen === "game screen") {
    gameScreen();
    //reloadGameScreen();
    if (!gameOver) {
      animate(0);
    } else {
      resultScreen();
    }
  } else if (screen === "controls screen") {
    controlScreen();
  } else if (screen === "result screen") {
    resultScreen();
  }
}
