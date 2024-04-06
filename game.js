let mySprite; //Video game developers use the word "sprite" to refer to characters, items, or anything else that moves above a background.
let img;
let spriteStatic;

function preload() {
  img = loadImage("images/backgroundImg.jpg");
  //spriteStatic = loadImage("images/flintStartPosition.png");
}
function setup() {
  createCanvas(400, 400);
  //frameRate(30);
  mySprite = createSprite(200, 200, 20, 20);
  mySprite.shapeColor = [0, 0, 200];
  //friction = 0.03;
  // mySprite.onMousePressed = function () {
  // mySprite.rotationSpeed = 1;
  //};

  //mySprite.addImage(spriteStatic);
  // mySprite.scale = 0.2;
}
function draw() {
  background(img);
  drawSprites();
}
