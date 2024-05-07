let canvasWidth = 700;
let canvasHeight = 500;
let backgroundimg;
let startimg;
let img;
let myFont;
let button;
let button2;

let gameHeight;
let gameWidth;
let player;
let log;
let logs = [];

function preload() {
  // myFont = loadFont("LilitaOne-Regular.ttf");
  //for start screen
  startimg = loadImage("images/startscreen_image.png");
  //for game screen
  backgroundimg = loadImage("images/backgroundImg.jpg");
  img = loadImage("images/sprites2.png");
  //for control screen
  controlimg = loadImage("images/controlscreen_image.png");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
  startScreen();
  textFont("Times New Roman");
  player = new Player(canvasWidth, canvasHeight); //creates player
  log = new Log(canvasWidth, canvasHeight); //creates log

  //Play Button
  button = createButton("Start Game");
  button.position(220, 410);
  button.size(110, 34);
  button.mousePressed(gameScreen);
  button2 = createButton("Controls");
  button2.position(400, 410);
  button2.size(110, 34);
  button2.mousePressed(controlScreen);
}

function startScreen() {
  background(startimg);
  /* textSize(65);
  textAlign(CENTER);
  textStyle(BOLD);
  text("Cloudy", width / 2, height / 2 - 140);
  text("with a chance of", width / 2, height / 2 - 70);
  text("meatballs", width / 2, height / 2);*/
}

function gameScreen() {
  clear();
  background(backgroundimg);
  button.remove();
  button2.remove();
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
    //push();
    image(
      img,
      this.x + 250,
      this.y - 95,
      this.imgWidth,
      this.imgHeight,
      this.frameX * this.imgWidth,
      this.frameY * this.imgHeight,
      this.imgWidth,
      this.imgHeight
    ); //draws the player
    //pop();
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
      this.y = this.y - 15; //highness of the jump
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
    if (this.x > 310) {
      this.x = 310;
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
    this.x = -100;
    this.y = 330;
    this.frameX = 0;
    this.frameY = 4;
    this.maxFrame = 4;
    this.fps = 32;
    this.frameTimer = 4;
    this.frameInterval = 1000 / this.fps;
    this.speed = 9;
    this.logTimer = random(100, 200);
    this.logInterval = random(100, 200);
    //this.markedForDeletion = false;
  }

  draw(context) {
    /* context.strokeStyle = "black";
    context.strokeRect(
      this.x + 90,
      this.y + 80,
      this.width - 300,
      this.height - 200
    ); */ //box around logs to easily detect collision
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
    this.logTimer += deltaTime; //creates more logs
    logs.push(new Log(canvasWidth, canvasHeight));

    //logs = logs.filter((log) => !log.markedForDeletion); //all logs are tested and checked, if the markedfordeletion property is false. Only the amount of logs in picture are counted in console.log
  }
}

function controlScreen() {
  clear();
  background(controlimg);

  button.remove();
  button2.remove();
}

function animate() {
  player.draw();
  player.update();
  log.draw();
  log.update();
}

function draw() {
  //startScreen();
  gameScreen();
  animate(0);
  //controlScreen();
  for (let i = 0; i < logs.length; i++) {
    logs[i].draw();
    //logs[i].update();
  }
}
