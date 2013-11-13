// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = Math.floor(window.innerWidth *.99);
canvas.height = Math.floor(window.innerHeight *.99);
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image(window.innerWidth, window.innerWidth);
bgImage.onload = function () {
	bgReady = true;
};

// character image
var characterReady = false;
var characterImage = new Image();
characterImage.onload = function () {
	characterReady = true;
};
characterImage.src = "images/paddle.png";

// cpu image
var cpuReady = false;
var cpuImage = new Image();
cpuImage.onload = function () {
	cpuReady = true;
};
cpuImage.src = "images/paddle.png";

var ballReady = false;
var ballImage = new Image();
ballImage.onload = function () {
	ballReady = true;
};
ballImage.src = "images/ball.png";

// Game objects
var character = {
	width: 14, 
	height: 60,
	speed: canvas.width / 2
};
var cpu = {
	width: 14, 
	height: 60,
	speed: canvas.width / 5
};
var ball = {
	width:16,
	height:16,
	x_dir: 1,
	y_dir: 1
};

// goals
var sumGoals = 0, cpuGoals = 0;
var currentScore = 0, highestScore = 0, lives = 3;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Places character in senter of canvas
var start = function () {
	character.x = 0;
	character.y = canvas.height/2;
	cpu.x = canvas.width - cpu.width;
	cpu.y = canvas.height/2;
	ball.x = canvas.width/2;
	ball.y = canvas.height/2;

};


// New goal appears 
var reset = function () {
	ball.x = canvas.width/2;
	ball.y = canvas.height/2;		
};

// Update game objects
var update = function (modifier) {
	// Player movement
	if (38 in keysDown) { // Player holding up
		if(character.y >0)
			character.y -= character.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		if(character.y < canvas.height - character.height)
			character.y += character.speed * modifier;
	}
	
	// CPU movement
	if(ball.x > canvas.width / 2 && ball.x_dir ==1) {
		if(cpu.y > ball.y - cpu.height/2 + ball.height/2 && cpu.y > 0 )
			cpu.y -= cpu.speed * modifier;
		if(cpu.y < ball.y - cpu.height/2  + ball.height/2 && cpu.y + 60 < canvas.height)
			cpu.y += cpu.speed * modifier;
	}

	// ball bounce on y 
	if(ball.y > canvas.height - ball.height) 
		ball.y_dir = -1;
	if(ball.y < 0) 
		ball.y_dir = 1;

	// Collision Detection
	if(ball.x + ball.width == cpu.x) {
		ball.x_dir = -1;
		++sumGoals;
	}

	if(ball.x == character.width && 
	   ball.y <=character.y+character.height &&
	   ball.y + ball.height >= character.y){
		ball.x_dir = 1;
		++currentScore;
	} 
	
	if(ball.x+ball.width > cpu.x) {
		reset();
	}
	if(ball.x < character.width) {
		--lives;
		if(currentScore > highestScore) {
			highestScore = currentScore;
			currentScore = 0;
		}
		reset();
	}

	ball.x = Math.floor(ball.x +(1*ball.x_dir));
	ball.y = Math.floor(ball.y +(1*ball.y_dir));
};

// Draw everything
var render = function () {	
	ctx.save();
	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Restore the transform
	ctx.restore();

	if (bgReady) 
		ctx.drawImage(bgImage, 0, 0);
	if (characterReady) 
		ctx.drawImage(characterImage, character.x, character.y);
	if (cpuReady) 
		ctx.drawImage(cpuImage, cpu.x, cpu.y);
	if (ballReady) 
		ctx.drawImage(ballImage, ball.x, ball.y);

	// Score
	ctx.fillStyle = "rgb(156, 255, 0)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Lives: "+lives, character.width+1, 5);
	ctx.textAlign = "center";
	ctx.fillText("Current Score: "+currentScore, canvas.width/2, 5);
	ctx.fillText("Highest Score: "+highestScore, canvas.width/2, canvas.height - 24 - 5);
	

	if(lives==0) {
		window.clearInterval(begin);
	
		ctx.fillStyle = "rgba(0, 0, 0, .7)"
		ctx.beginPath();
		ctx.rect(0, 0, canvas.width, canvas.height);
		ctx.closePath();
		ctx.fill();

		ctx.fillStyle = "rgb(156, 255, 0)";
		ctx.font = "108px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText("Highest Score: "+highestScore, canvas.width/2, canvas.height/2 - 54);
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;
};

// Start the game off
start();
var then, begin;
setTimeout(function() {
	then = Date.now();
	begin = setInterval(main, 1); 
}, 1000);