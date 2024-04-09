let character;
let spriteStatic;

function preload() {
  img = loadImage("images/backgroundImg.jpg");
}
function setup() {
  const canvas = createCanvas(800, 600);
  frameRate(30);
}

function draw() {
  background(img);
}
