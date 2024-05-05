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
  constructor(gameWidth, gameHeight) {
    this.gameWidth = canvasWidth;
    this.gameHeight = canvasHeight;
    this.imgWidth = 200;
    this.imgHeight = 166;
    this.x = 0;
    this.y = this.gameHeight - this.imgHeight - 100;
    this.frameX = 2;
    this.frameY = 0;
    this.maxFrame = 9;
    this.fps = 20;
    this.frameTimer = 5;
    this.frameInterval = 1000 / this.fps;
    this.speed = 0;
    this.vy = 0;
    this.weight = 1;
  }

  draw() {
    //push();
    image(
      img,
      this.x,
      this.y,
      this.imgWidth,
      this.imgHeight,
      0,
      0,
      this.imgWidth,
      this.imgHeight
    );
    this.frameX++;
    //pop();
  }

  update() {
    //sprite animation, learnt from this tutorial https://www.youtube.com/watch?v=7JtLHJbm0kA&t=1675s
    /* if (frameTimer > frameInterval) {
      if (frameX >= maxFrame) frameX = 0;
      else frameX++;
      frameTimer = 0; //resets the frameTimer back to zero after making an animation of all 10 (0-9) frames
    } else {
      //frameTimer += deltaTime;
    }*/
    //controls
  }
}

function controlScreen() {
  clear();
}

function draw() {
  gameScreen();
  player.draw();
  player.update();
}
