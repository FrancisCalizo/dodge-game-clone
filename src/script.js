// Selecting the canvas & two-dimensional context
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//Player object
var player = {
  x: 225,
  y: 225,
  moveUp:    function(){ 
    this.y -= 10 
  },
  moveDown:  function() { this.y += 10 },
  moveLeft:  function() { this.x -= 10 },
  moveRight: function() { this.x += 10 },
}

//Update canvas per event
function updateCanvas(){
  clearCanvas();
  drawPlayer(player); 
  console.log(player.x);
}

//create player on canvas
function drawPlayer(player){
  ctx.fillRect(player.x, player.y, 50, 50);
}

//clear whole canvas
function clearCanvas(){
  ctx.clearRect(0, 0, 500, 500);
}

  document.onkeydown = function(e) {
    //player movement
    switch (e.keyCode) {
      case 38: player.moveUp();    break;
      case 40: player.moveDown();  break;
      case 37: player.moveLeft();  break;
      case 39: player.moveRight(); break;
    }
    //boundaries
    switch (true){
      case player.x < 0: player.x = 0; break;
      case player.x > 450: player.x = 450; break;
      case player.y < 0: player.y = 0; break;
      case player.y > 450: player.y = 450; break;
    }
    updateCanvas();
  }

updateCanvas();
