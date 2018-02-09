var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

var gameOver = false;  

var score = 0;
// Increment player score every 10 ms while !gameOver
var timeScore = setInterval(function(){score++}, 10);

// Declare sounds & music 
var backgroundMusic = new Audio("sound/backgroundMusic.mp3");
    backgroundMusic.volume= 1;
var crash = new Audio ("sound/crash.mp3");
    crash.volume=.1;
var honk = new Audio("sound/honk.mp3")
    honk.volume= 0.1;
// Honk horn during game every 7 seconds
var honkHorn = setInterval(function(){honk.play();},7000);
// Declare player as batmobile
var carSprite = new Image();
carSprite.src = "Images/batmobile.png";
// Drivers as sprites
var ambulance = new Image();
ambulance.src = "Images/ambulence.png";
var audi = new Image();
audi.src = "Images/Audi.png";
var police = new Image();
police.src = "Images/Police.png"
var taxi = new Image();
taxi.src = "Images/taxi.png"
var truck = new Image();
truck.src = "Images/truck.png"

// Player Object
var player = {
  x: canvas.width / 2.06,  // Player x-position
  y: canvas.height/ 2,     // Player y-position
  vx: 0,                   // Player x-velocity
  vy: 0,                   // Player y-velocity
  ax: 0,                   // Player x-acceleration
  ay: 0,                   // Player y-acceleration
  rotation: 0,             // Player rotation
  friction: .985,          // Friction applied to x/y velocities
  
  // Draw player on canvas
	drawPlayer: function(){
    ctx.save();
    // Aid in turning player sprite
    ctx.translate(this.x + 30, this.y + 15);
    // Aid in turning player sprite
    ctx.rotate(this.rotation);
    ctx.drawImage(carSprite, -30, -15, 60, 30);
    ctx.stroke();
		ctx.restore();
  },

  // Update player position on frame
  updatePosition: function(){
    // Apply acceleration to velocity
    this.vx += this.ax;
    this.vy += this.ay;
    this.updateFriction();
    // Apply velocity to position
    this.x += this.vx;
    this.y += this.vy;
    this.boundaries();
    },

  updateFriction: function(){
    // Apply friction to velocity to slow car down
    this.vx *= this.friction;
    this.vy *= this.friction;
  },

  // Boundary check on player (faulty)
  boundaries: function(){
    switch(true){
      case this.x < 40: this.x = 40; break; 
      case this.x > 1060: this.x = 1060; break;
      case this.y < 40: this.y = 40; break;
      case this.y > 550: this.y = 550; break;
    }
  }
};

// User Controls
var keys = [];
document.addEventListener('keydown', function(e){
	keys[e.which] = true;
});
document.addEventListener('keyup', function(e){
	keys[e.which] = false;
});

// Driver Object
var drivers = {
  spawnTopY: 0,       // Spawnpoint for cars moving down
  spawnBottomY: 580,  // Spawnpoint for cars moving up
  spawnRate: 800,     // Rate at which new cars spawn
  lastSpawn: -1,      // Used in formula to determine if enough time passed to spawn new car
  driversArr: [],     // Array that will store all drivers spawned

  // Function to spawn random drivers
  spawnDriver: function(){
    // Define characteristics of cars 
    var speed, h, w, c, spawnPoint, sprite;
    // Spawned driver type picked at random
    var rand = Math.random() * 2;
    // 5 "types" of drivers that spawn
    if (rand < 0.4) {
      speed = 0.5;
      h = 70;
      w = 60;
      c = "rgb(25, 42, 150)";
      sp = taxi; 
    } else if (rand < 0.9){
      speed = 1;
      h = 80;
      w = 80;
      c = "rgb(255, 178, 71)";
      sp = truck; 
    } else if (rand < 1.4){
      speed = 1.5;
      h = 70;
      w = 60;
      c = "rgb(255, 68, 230)";;
      sp = police; 
    } else if (rand < 1.85){
      speed = 1;
      h = 70;
      w = 60;
      c = "rgb(32, 215, 247)";;
      sp = audi; 
    } else{
      speed = .25;
      h = 100;
      w = 120;
      c = "rgb(255, 255, 255)";;
      sp = ambulance; 
    }
    // Determine if car spawns from top or bottom
    if(rand < 1.01){
      // Spawn from bottom & reverse direction
      speed *= -1;
      spawnPoint = this.spawnBottomY;
    } else{
      // Spawn from top and use default direction
      spawnPoint = this.spawnTopY;
    }
    // Spawn Driver object to hold type features
    var driver = {
      height: h,
      width: w,
      color: c,
      spawnRateOfDescent: speed,
      // Set x to start on random x position within canvas width
      x: Math.random() * (canvas.width - 30),
      // Set y to start on the line where objects are spawned
      y: spawnPoint,
      // Set sprite image
      sprite: sp
    }
    // Push to an Array to store drivers
    this.driversArr.push(driver);
  }
}

// Check player collision with other drivers
function checkCollision(){
    for(var i = 0; i < drivers.driversArr.length; i ++){
    if (player.x < drivers.driversArr[i].x + drivers.driversArr[i].width &&
      player.x + 40 > drivers.driversArr[i].x &&
      player.y < drivers.driversArr[i].y + drivers.driversArr[i].height &&
      20 + player.y > drivers.driversArr[i].y) {
      // collision detected, game is over
      gameOver = true;
      clearInterval(timeScore); // Stop player score from incrementing 
      clearInterval(honkHorn);  // Stop Miami from honking at your life 
      crash.play();             // Play crash sound when collision occurs
    }
  }
}

//Display final score & try again when collision occurs
function gameOverText(){
  ctx.font = '72px sans-serif';
  ctx.textAlign="center"; 
  ctx.fillStyle = "rgb(50, 50, 50)";
  ctx.fillText("Final Score:", canvas.width/2, canvas.height/3);  
  ctx.font = '36px sans-serif';
  ctx.fillText("Press the spacebar to retry!", canvas.width/2, canvas.height/1.4);  
}

// Main function that updates canvas
function updateCanvas(){
  backgroundMusic.play();
  requestAnimationFrame(updateCanvas);
  ctx.clearRect(0, 0, 1100, 620);
  // Score displayed on canvas & increments
  ctx.font = '180px sans-serif';
  ctx.textAlign="center"; 
  ctx.fillStyle = "rgb(50, 50, 50)";
  ctx.fillText(score, canvas.width/2, canvas.height/1.65);  
  ctx.strokeStyle = "rgb(255, 255, 255)";
  ctx.strokeText(score, canvas.width/2, canvas.height/1.65);
  // Keys array will hold user input * rotate player sprite
  switch(true){
    //Player turning (Rotation)
    case keys[37]: player.rotation -= 0.04; break;
    case keys[39]: player.rotation += 0.04; break;
  };

  switch(true){
    //Accelerate Forward with regard to player rotation
    case keys[38]: player.ax = Math.cos(player.rotation) * 0.11, 
                   player.ay = Math.sin(player.rotation) * 0.11; 
    break;
    //player acceleration should be zero if no keys are pressed                   
    default: player.ax = player.ay = 0;
  }
  // Used for elasped time condition
  var time = Date.now();
  // See if its time to spawn a new object
  if (time > (drivers.lastSpawn + drivers.spawnRate)) {
      // Set last spawn to current time
      drivers.lastSpawn = time;
      // Spawn driver when condition is true
      drivers.spawnDriver();
  }

  // assign characteristics to drivers in driversArr
  for (var i = 0; i < drivers.driversArr.length; i++) {
    var carSpawn = drivers.driversArr[i];
    carSpawn.y += carSpawn.spawnRateOfDescent;
    ctx.fillStyle = carSpawn.color;
    ctx.drawImage(carSpawn.sprite, carSpawn.x, carSpawn.y, carSpawn.width , carSpawn.height);
    // ctx.strokeStyle = "rgb(0, 0, 0)";
    // ctx.strokeRect(carSpawn.x, carSpawn.y, carSpawn.width , carSpawn.height);
    }
  // Update player position 
  player.updatePosition();
  // Only draw player when !gameOver
  if(!gameOver){
    player.drawPlayer();
  } else{
    // When gameOver is true:
    gameOverText();
    backgroundMusic.pause()
    document.addEventListener('keydown', function(e){
      if(e.which === 32){
        // Reload page with spacebar press
        window.location.reload(false); 
      }
    });
  }
  // Check colliion on each frame
  checkCollision();
};
// Begin game on window start
updateCanvas();