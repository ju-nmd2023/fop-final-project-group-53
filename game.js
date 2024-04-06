let character;
let spriteStatic;

function preload() {
  img = loadImage("images/backgroundImg.jpg");
  //spriteStatic = loadImage("images/flintStartPosition.png");
}
function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("sketch-holder"); //move the canvas so it's inside our <div id="sketch-holder">
  frameRate(30);
  //character = new Sprite();
  //character.diameter = 50;
  //friction = 0.03;
  // character.onMousePressed = function () {
  // character.rotationSpeed = 1;
  //};

  //character.addImage(spriteStatic);
  // character.scale = 0.2;
}

function draw() {
  background(img);
  //drawSprites();
}
