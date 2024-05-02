let backgroundimg;
let startimg;
let img;
let fontStartScreen;

function setup() {
  startimg = loadImage("images/startscreen_image.png");
  backgroundimg = loadImage("images/backgroundImg.jpg");
  img = loadImage("images/sprites.png");
  fontStartScreen = loadFont("fonts/GillSansCondUltraBoNova.ttf");
  createCanvas();
}

function startScreen() {
  background(startimg);
  textSize(20);
  textAlign(CENTER);
  textFont(fontStartScreen);
  text("Rainy with a chance of meatballs", width / 2, height / 2 - 50);
  //Play Button
  let button = createButton("PLAY");
  button.position(width / 2, height / 2);
  button.mousePressed(gameScreen);
}

function gameScreen() {
  background(backgroundimg);
  image(img, 0, 0);
}

function draw() {
  gameScreen();
}
