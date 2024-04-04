function setup() {
  createCanvas(400, 400);
  stroke();
  frameRate(30);
}
let x = 0;
let y = 0;

function scenery() {
  //sky
  let backgroundImage = document.getElementById("skyImage");
  skyImage.setAttribute("src", "/images/backgroundImg.jpg");

  //bridge
  fill(20, 20, 20);
  rect(0, 100, 400, 50);
}
