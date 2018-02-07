var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

// Player Object
var player = {
  x: 520,          // Player x-position
  y: 300,          // Player y-position
  vx: 0,           // Player x-velocity
  vy: 0,           // Player y-velocity
  ax: 0,           // Player x-acceleration
  ay: 0,           // Player y-acceleration
  rotation: 0,     // Player rotation
  friction: .985,  // Friction applied to x/y velocities
  
  // Draw player on canvas
	drawPlayer: function(){
		ctx.save();
		ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = "black";
		ctx.fillRect(0, 0, 40, 20);
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

  // Boundary check (faulty)
  boundaries: function(){
    switch(true){
      case this.x < 20: this.x = 20; break; 
      case this.x > 1080: this.x = 1080; break;
      case this.y < 10: this.y = 10; break;
      case this.y > 560: this.y = 560; break;
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
  spawnTopY: 0,
  spawnBottomY: 580,
  spawnRate: 350,
  lastSpawn: -1,
  driversArr: [],

  spawnDriver: function(){
    var speed;
    var length;
    var spawnPoint;
    var rand = Math.random() * 2;

    if (rand < 0.4) {
      speed = 0.5;
      h = 60;
      w = 45;
      c = "rgb(168, 168, 168)"
    } else if (rand < 0.9){
      speed = 1;
      h = 35;
      w = 20;
      c = "rgb(239, 212, 7)"
    } else if (rand < 1.4){
      speed = 1.5;
      h = 25;
      w = 10;
      c = "rgb(73, 216, 41)";
    } else if (rand < 1.85){
      speed = 1;
      h = 30;
      w = 25;
      c = "rgb(234, 51, 51)";
    } else{
      speed = .25;
      h = 70;
      w = 50;
      c = "rgb(229, 39, 216)";
    }

    if(rand < 1.01){
      speed *= -1;
      spawnPoint = this.spawnBottomY;
    } else{
      spawnPoint = this.spawnTopY;
    }

    var driver = {
      height: h,
      width: w,
      color: c,
      spawnRateOfDescent: speed,
      // Set x to start on random x position within canvas width
      x: Math.random() * (canvas.width - 30),
      // Set y to start on the line where objects are spawned
      y: spawnPoint,
    }
    this.driversArr.push(driver);
  }
}

function checkCollision(){
  for(var i = 0; i < drivers.driversArr.length; i ++){
    if (player.x < drivers.driversArr[i].x + 20 &&
      player.x + 40 > drivers.driversArr[i].x &&
      player.y < drivers.driversArr[i].y + 40 &&
      20 + player.y > drivers.driversArr[i].y) {
      // collision detected
      console.log("you lose");
      gameOver = true;
    }
  }
}

var gameOver = false;

function updateCanvas(){
  requestAnimationFrame(updateCanvas);
  ctx.clearRect(0, 0, 1100, 620);
  
  switch(true){
    //Player turning (Rotation)
    case keys[37]: player.rotation -= 0.04; break;
    case keys[39]: player.rotation += 0.04; break;
  };

  switch(true){
    //Accelerate Forward 
    case keys[38]: player.ax = Math.cos(player.rotation) * 0.07, 
                    player.ay = Math.sin(player.rotation) * 0.07; break;
    //player acceleration should be zero if no keys are pressed                   
    default: player.ax = player.ay = 0;
  }

  var time = Date.now();
  // see if its time to spawn a new object
  if (time > (drivers.lastSpawn + drivers.spawnRate)) {
      drivers.lastSpawn = time;
      drivers.spawnDriver();
  }

  for (var i = 0; i < drivers.driversArr.length; i++) {
    var carSpawn = drivers.driversArr[i];
    carSpawn.y += carSpawn.spawnRateOfDescent;
    ctx.fillStyle = carSpawn.color;
    ctx.fillRect(carSpawn.x, carSpawn.y, carSpawn.width , carSpawn.height);
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.strokeRect(carSpawn.x, carSpawn.y, carSpawn.width + 1 , carSpawn.height + 1);

    }
  
  player.updatePosition();
  player.drawPlayer();
  checkCollision();
};

updateCanvas();