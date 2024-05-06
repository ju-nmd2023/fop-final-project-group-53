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
    this.imgHeight = 170;
    this.x = 0;
    this.y = this.gameHeight - this.imgHeight;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 9;
    this.fps = 20;
    this.frameTimer = 5;
    this.frameInterval = 1000 / this.fps;
    this.speed = 0.2;
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
      this.imgWidht,
      this.imgHeight,
      this.frameX * this.imgWidht,
      this.frameY * this.imgHeight,
      this.imgWidht,
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
      // got help with writing previous direction detection code from https://chatgpt.com/c/5b563428-b8d0-44be-b4b3-cc8fcd2e7562
      if (this.previousDirection === "right") {
        this.vy -= 2; //velocity on 20, meaning that when jumping up the speed goes from 20->0 and when he falls down again it goes from 0->20
        this.frameY = 2;
        this.x += placement / 2;
      } else if (this.previousDirection === "left") {
        this.vy -= 2; //velocity on 20, meaning that when jumping up the speed goes from 20->0 and when he falls down again it goes from 0->20
        this.frameY = 3;
        this.x -= placement / 2;
      }
    }
    //velocity when jumping.
    this.y += this.vy;
    //if the player is not on the ground...
    if (!this.onGround()) {
      this.vy += this.weight; //simulates gravity
      this.maxFrame = 6;
    } else {
      this.vy = 0;
      this.maxFrame = 9;
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

function controlScreen() {
  clear();
}

function animate() {
  player.draw();
  player.update();
  //requestAnimationFrame(animate);
}

function draw() {
  gameScreen();
  animate(0);
}
