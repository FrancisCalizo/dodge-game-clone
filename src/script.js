var canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');

var player = {
  x: 500, 
  y: 250,
  vx: 0, 
  vy: 0,
  ax: 0, 
  ay: 0,
  rotation: 0,
  friction: .985,
  
	drawPlayer: function(){
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.fillRect(0, 0, 40, 20);
		ctx.restore();
  },
  
  updatePosition: function(){
    //apply acceleration to velocity
    this.vx += this.ax;
    this.vy += this.ay;
    this.updateFriction();
    //Apply velocity to position
    this.x += this.vx;
    this.y += this.vy;
    },

  updateFriction: function(){
    //Apply friction to velocity to
    this.vx *= this.friction;
    this.vy *= this.friction;
  }
};

//user interactivity
var keys = [];
document.addEventListener('keydown', function(e){
	keys[e.which] = true;
});
document.addEventListener('keyup', function(e){
	keys[e.which] = false;
});

function updateCanvas(){
	requestAnimationFrame(updateCanvas);
	ctx.clearRect(0, 0, 1100, 620);
	
	//Player turning (Rotation)
	if(keys[37]) player.rotation -= 0.04;
	if(keys[39]) player.rotation += 0.04;
	
	//Accelerate Forward 
	if(keys[38]){
		player.ax = Math.cos(player.rotation) * 0.07;
		player.ay = Math.sin(player.rotation) * 0.07;
	} else{
    //player acceleration should be zero if no keys are pressed
		player.ax = player.ay = 0;
	}
	
	//friction is applied inside the updatePosition function
	player.updatePosition();
	player.drawPlayer();
};

updateCanvas();