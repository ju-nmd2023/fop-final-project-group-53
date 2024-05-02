//Code for sprite animation, collision with logs and basic falling meatball https://www.youtube.com/watch?v=7JtLHJbm0kA&t=1675s

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 2000;
  canvas.height = 1500;
  let logs = [];
  let coins = [];
  let score = 0;
  let gameOver = false;

  function StartScreen() {
    document.getElementById("startScreenImage");
  }

  StartScreen();

  class inputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") &&
          this.keys.indexOf(e.key) === -1
        ) {
          this.keys.push(e.key);
        }
      });
      window.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"
        ) {
          this.keys.splice(this.keys.indexOf(e.key), 1);
        }
      });
    }
  }

  class Background {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.image = document.getElementById("backgroundImage");

      this.x = 0;
      this.y = 0;
      this.width = 2000;
      this.height = 1500;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
    }
  }

  class Player {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight - 270;
      this.width = 430;
      this.height = 360;
      this.x = 0;
      this.y = this.gameHeight - this.height;
      this.image = document.getElementById("sprites");
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
    draw(context) {
      /*context.strokeStyle = "black";
      context.strokeRect(
        this.x + 130,
        this.y + 40,
        this.width - 250,
        this.height - 40
      );*/ //box around player to easily detect collision

      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(input, deltaTime, logs) {
      // collision detection
      logs.forEach((log) => {
        const dx =
          this.x +
          130 +
          (this.width - 250) / 2 -
          (log.x + 90 + (log.width - 300) / 2);
        const dy =
          this.y +
          100 +
          (this.height - 40) / 2 -
          (log.y + 80 + (log.height - 200) / 2); // dx and dy givs us the center point of the two
        const distance = Math.sqrt(dx * dx + dy * dy); //the distance between those center points
        if (distance < (log.width - 300) / 2 + (this.width - 250) / 2) {
          gameOver = true;
        }
      });

      //sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0; //resets the frameTimer back to zero after making an animation of all 10 (0-9) frames
      } else {
        this.frameTimer += deltaTime;
      }

      //controls
      if (input.keys.indexOf("ArrowRight") > -1) {
        this.speed = 15;
        this.frameY = 0;
      } else if (input.keys.indexOf("ArrowLeft") > -1) {
        this.speed = -15;
        this.frameY = 1;
      } else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
        this.vy -= 24; //velocity on 20, meaning that when jumping up the speed goes from 20->0 and when he falls down again it goes from 0->20
        this.frameY = 2;
        this.maxFrame = 6;
      } else {
        this.speed = 0;
      }
      //horisontal movement - character cant move outside canvas
      this.x += this.speed;
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
      if (this.y > this.gameHeight - this.height)
        this.y = this.gameHeight - this.height;
    }

    onGround() {
      return this.y >= this.gameHeight - this.height;
    }
  }

  class Coin {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 500;
      this.height = 500;
      this.image = document.getElementById("meatballImage");
      this.x = Math.floor(Math.random() * 2000);
      this.y = 0;
      this.frameX = 0;
      this.speed = 8;
      this.markedForDeletion = false;
    }
    draw(context) {
      /*context.strokeStyle = "black";
      context.strokeRect(this.x, this.y, this.width - 430, this.height - 430); //box around meatballs to easily detect collision
*/
      context.drawImage(
        this.image,
        this.frameX * this.width,
        0 * this.height,
        this.width * 7,
        this.height * 7,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }

    update(deltaTime) {
      this.y += this.speed;

      // collecting coins (meatballs)
      coins.forEach((coin) => {
        const dx =
          player.x +
          130 +
          (player.width - 250) / 2 -
          (this.x + (this.width - 430) / 2);
        const dy =
          player.y +
          40 +
          (player.height - 40) / 2 -
          (this.y + (this.height - 430) / 2); // dx and dy givs us the center point of the two
        const distance = Math.sqrt(dx * dx + dy * dy); //the distance between those center points
        if (distance < (this.height - 430) / 2 + (player.height - 40) / 2) {
          this.markedForDeletion = true;
          score++;
        }
      });
      if (this.y > 1160) {
        gameOver = true;
      }
    }
  }

  function handleCoins(deltaTime) {
    if (coinTimer > coinInterval + randomCoinInterval) {
      coins.push(new Coin(canvas.width, canvas.height));
      coinTimer = 0;
    } else {
      coinTimer += deltaTime; //creates more meatballs
    }
    coins.forEach((coin) => {
      coin.draw(ctx);
      coin.update(deltaTime);
    });
    coins = coins.filter((coin) => !coin.markedForDeletion);
  }

  class Log {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 430;
      this.height = 360;
      this.image = document.getElementById("sprites");
      this.x = -300;
      this.y = 1000;
      this.frameX = 0;
      this.frameY = 4;
      this.maxFrame = 4;
      this.fps = 32;
      this.frameTimer = 4;
      this.frameInterval = 1000 / this.fps;
      this.speed = 9;
      this.markedForDeletion = false;
    }
    draw(context) {
      /* context.strokeStyle = "black";
      context.strokeRect(
        this.x + 90,
        this.y + 80,
        this.width - 300,
        this.height - 200
      ); */ //box around logs to easily detect collision
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width * 1.2,
        this.height * 1.2,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update(deltaTime) {
      //sprite animation
      if (this.frameTimer > this.frameInterval) {
        if (this.frameX >= this.maxFrame) this.frameX = 0;
        else this.frameX++;
        this.frameTimer = 0; //resets the frameTimer back to zero after making an animation of all 10 (0-9) frames
      } else {
        this.frameTimer += deltaTime;
      }
      this.x += this.speed;
      //if (this.x > 2400 - this.width) this.markedForDeletion = true;
    }
  }

  function handleLogs(deltaTime) {
    if (logTimer > logInterval + randomLogInterval) {
      logs.push(new Log(canvas.width, canvas.height));
      console.log(logs);
      randomLogInterval = Math.random() * 1000 + 500;
      logTimer = 0;
    } else {
      logTimer += deltaTime; //creates more logs
    }
    logs.forEach((log) => {
      log.draw(ctx);
      log.update(deltaTime);
    });
    logs = logs.filter((log) => !log.markedForDeletion); //all logs are tested and checked, if the markedfordeletion property is false. Only the amount of logs in picture are counted in console.log
  }

  function displayStatusText(context) {
    context.fillStyle = "black";
    context.font = "40px Times New Roman";
    context.fillText("SCORE: " + score, 40, 70);
    if (gameOver) {
      context.fillStyle = "black";
      context.font = "80px Times New Roman";
      context.fillText("GAME OVER", canvas.width / 2 - 240, canvas.height / 2);
    }
  }

  const input = new inputHandler();
  const player = new Player(canvas.width, canvas.height);
  const background = new Background(canvas.width, canvas.height);
  const log = new Log(canvas.width, canvas.height);

  let lastTime = 0;
  let coinTimer = 0;
  let coinInterval = 1000;
  let randomCoinInterval = Math.random() * 1000 + 500;

  let logTimer = 0;
  let logInterval = 1000;
  let randomLogInterval = Math.random() * 1000 + 500;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    //console.log(deltaTime);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(ctx);
    player.draw(ctx);
    player.update(input, deltaTime, logs);
    handleCoins(deltaTime);
    log.update(deltaTime);
    handleLogs(deltaTime);
    displayStatusText(ctx);
    if (!gameOver) requestAnimationFrame(animate); //Game stops when collision is detected.  "!gameOver" means when game over is false.
  }
  animate(0); //this starts the animation loop
});

//play button
function start() {
  alert("Button clicked!");
}

document.getElementById("playButton").addEventListener("click", play);
