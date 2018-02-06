var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

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
      case this.y > 600: this.y = 600; break;
    }
  }
};

function checkCollision(){
  for(var i = 0; i < drivers.driversArr.length; i ++){
    if (player.x < drivers.driversArr[i].x + 20 &&
      player.x + 40 > drivers.driversArr[i].x &&
      player.y < drivers.driversArr[i].y + 40 &&
      20 + player.y > drivers.driversArr[i].y) {
      // collision detected
      console.log("you suck");
      cancelAnimationFrame(updateCanvas);
    }
  }
}

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
  spawnRate: 700,
  spawnRateOfDescent: 0.50,
  lastSpawn: -1,
  driversArr: [],

  spawnDriver: function(){
    var driver = {
      // Set x to start on random x position within canvas width
      x: Math.random() * (canvas.width - 30),
      // Set y to start on the line where objects are spawned
      y: drivers.spawnTopY,
    }
    this.driversArr.push(driver);
  }
}

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
    carSpawn.y += drivers.spawnRateOfDescent;
    ctx.fillStyle = "rgb("+
    Math.floor(Math.random()*256)+","+
    Math.floor(Math.random()*256)+","+
    Math.floor(Math.random()*256)+")";
    ctx.fillRect(carSpawn.x, carSpawn.y, 20, 40);
    }
	
	player.updatePosition();
  player.drawPlayer();
  checkCollision();
};

updateCanvas();