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

function preload() {
  // myFont = loadFont("LilitaOne-Regular.ttf");
  //for start screen
  startimg = loadImage("images/startscreen_image.png");
  //for game screen
  backgroundimg = loadImage("images/backgroundImg.jpg");
  img = loadImage("images/sprites2.png");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  frameRate(30);
  startScreen();
  textFont("Times New Roman");
  player = new Player(canvasWidth, canvasHeight); //creates player
}

function startScreen() {
  background(startimg);
  textSize(65);
  textAlign(CENTER);
  textStyle(BOLD);
  text("Cloudy", width / 2, height / 2 - 140);
  text("with a chance of", width / 2, height / 2 - 70);
  text("meatballs", width / 2, height / 2);

  //Play Button
  let button = createButton("Start Game");
  button.position(canvasWidth / 4, height / 2 + 50);
  button.size(120, 40);
  button.mousePressed(gameScreen);
  let button2 = createButton("Controls");
  button2.position(canvasWidth / 2 + canvasWidth / 7, height / 2 + 50);
  button2.size(120, 40);
  button2.mousePressed(controlScreen);
}

function gameScreen() {
  clear();
  background(backgroundimg);
  // button.remove();
  //button2.remove();
}

class Player {
  //sprite code, learnt from this tutorial https://www.youtube.com/watch?v=7JtLHJbm0kA&t=1675s
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.imgWidht = 200;
    this.imgHeight = 166;
    this.x = 0;
    this.y = this.gameHeight - this.imgHeight;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 10;
    this.fps = 20;
    this.frameTimer = 5;
    this.frameInterval = 1000 / this.fps;
    this.speed = 0;
    this.vy = 0;
    this.weight = 1;
  }

  draw() {
    //sprite image by https://p5js.org/reference/#/p5/image
    image(
      img,
      this.x + 250,
      this.y - 95,
      this.imgWidht,
      this.imgHeight,
      this.frameX * this.imgWidht,
      this.frameY * this.imgHeight,
      this.imgWidht,
      this.imgHeight
    ); //draws the player
    //this.frameX = (this.frameX + 1) % this.maxFrame;
  }

  update() {
    //millis() returns the number of milliseconds since the sketch started.
    if (millis() - this.frameTimer > this.frameInterval) {
      this.frameX = (this.frameX + 1) % this.maxFrame;
      this.frameTimer = millis(); // Reset the frame timer
    }

    //controls
    if (keyCode == RIGHT_ARROW) {
      this.x += this.speed;
      this.frameY = 0;
    }
    if (keyCode == LEFT_ARROW) {
      this.x -= this.speed;
      this.frameY = 1;
    }
    if (keyCode == UP_ARROW && this.onGround()) {
      this.vy -= 14; //velocity on 20, meaning that when jumping up the speed goes from 20->0 and when he falls down again it goes from 0->20
      this.frameY = 2;
      this.maxFrame = 7;
    } else {
      this.x = 0;
    }
    //horisontal movement - character cant move outside canvas
    if (this.x < -80) this.x = -80;
    else if (this.x > this.gameWidth - this.width + 80)
      this.x = this.gameWidth - this.width + 80;
    //vertical movement - velocity when jumping and telling which sprite to use.
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.weight;
      this.maxFrame = 6;
      //this.frameY = 0;
    } else {
      this.vy = 0;
      this.maxFrame = 9;
      //this.frameY = 2;
    }
    if (this.y > this.gameHeight - this.imgHeight)
      this.y = this.gameHeight - this.imgHeight;
  }
  onGround() {
    return this.y >= this.gameHeight - this.imgHeight;
  }
}

function controlScreen() {
  clear();
}

function animate() {
  player.draw();
  player.update();
  requestAnimationFrame(animate);
}

function draw() {
  gameScreen();
  animate();
}
