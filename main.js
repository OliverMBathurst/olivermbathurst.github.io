var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var map = createMap(context.canvas.width);
canvas.width = window.innerWidth;

var footerHeight = document.getElementById('footer').clientHeight;
var footerWidth = document.getElementById('footer').clientWidth;

var paused = false;
var pausedToggle = false;
var mouseDown = false;
var debugMode = false;

var traceX = getRandomX();
var traceY = getRandomY();

context.fillStyle = "#000000";
window.addEventListener('resize', resizeCanvas);
document.addEventListener('keydown', keyDownListener);

context.canvas.addEventListener('mousedown', mouseDownListener);
context.canvas.addEventListener('mousemove', mouseMoveListener);
context.canvas.addEventListener('mouseup', mouseUpListener);
context.canvas.addEventListener('onclick', mouseClickListener);

randomifyMap();
tick();

function mouseDownListener(e) {
    e.preventDefault();
	if(debugMode){	
		mouseDown = true;
	}	
}

function mouseMoveListener(e) {
	e.preventDefault();
	if(mouseDown && debugMode){
		addLife(e);
	}
}

function mouseClickListener(e){
	if(debugMode){
		addLife(e);
	}	
}

function mouseUpListener(e) {
    e.preventDefault();
	if(debugMode){
		mouseDown = false;
		tick();
	}	
}

function addLife(e){
	var x = parseInt(e.clientX);
	var y = parseInt(e.clientY);
	traceX = x;
	traceY = y;
	debug("Set traceX to: " + x + " and traceY to: " + y);
	addLifeAtCoordinates(x, y);	
}

function addLifeAtCoordinates(x, y){
	if(map != undefined && map[x] != undefined && map[x][y] != undefined && debugMode){
		map[x][y] = 1;
		printMap();
	}	
}


function resizeCanvas() {
	paused = true;	
	canvas.width = window.innerWidth;
	paused = false;
	tick();
}

function createMap(width){
	var map = [];
	for(var i = 0; i < width; i++){
		map[i] = [];
	}
	return map;
}

function resetMap(){
    for (var i = 0; i < canvas.width; i++) {
        for (var j = 0; j < canvas.height; j++) {
            map[i][j] = 0;
        }
    }
}

function printMap(){
	var liveCount = 0;
	context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < canvas.width; i++){
        for(var j = 0; j < canvas.height; j++){
			if(map[i] == undefined){
				map[i] = newRow(canvas.height);
			}
			if(map[i][j] == undefined){
				map[i][j] = getCell();
			}
			if(map[i][j] != undefined && map[i][j] === 1){
				context.fillRect(i, j, 1, 1);
				liveCount++;
			}			
        }
    }
	debug(liveCount);
}

function showHeader(){
	if(!debugMode){
		var width = canvas.width/2;
		var height = (canvas.height - footerHeight) / 2;
		
		context.globalAlpha = 0.6;
		context.fillRect(0, 0, canvas.width, canvas.height);	
		context.globalAlpha = 1;
		
		context.fillStyle = "#FFFFFF";
		context.textAlign = "center";
		context.textBaseline = 'middle';
		context.font = "70px Calibri";
		context.fillText("Oliver Bathurst", width, height);
		context.font = "35px Calibri";
		context.fillText("C# Developer", width, height + 50);
		context.fillStyle = "#000000";
	}
}

function newRow(height){
	var arr = [];
	for(var i = 0; i < height; i++){
		arr[i] = getCell();
	}
	return arr;
}

function randomifyMap(){
    for (var i = 0; i < canvas.width; i++){
        for(var j = 0; j < canvas.height; j++){
			if(map[i] == undefined){
				map[i] = newRow();
			}else{
				map[i][j] = getCell();
			}			
        }
    }
}

function getCell(){
	if (Math.random() >  0.97){
		return 1;
	}else{
		return 0;
	}
}

function getRandomX(){
	return Math.floor(Math.random() * Math.floor(canvas.width));
}

function getRandomY(){
	return Math.floor(Math.random() * Math.floor(canvas.height));
}

function tick(){
	if(!paused && !mouseDown && !pausedToggle){
		printMap();
		showHeader();
		reCalculate();
		requestAnimationFrame(tick);
	}
}

function reCalculate(){
    for (var i = 0; i < canvas.width; i++){
        for(var j = 0; j < canvas.height; j++){
			if(map != undefined && map[i] != undefined && map[i][j] != undefined){
				if(map[i][j] === 0){
					if (liveNeighbours(i,j) === 3){
						map[i][j] = 1;
					}
				}else{ //it is alive
					var neighbours = liveNeighbours(i,j);
					if(neighbours < 2 || neighbours > 3){
						map[i][j] = 0;
					}
				}
			}
        }
    }
}

function liveNeighbours(x, y) {
    var count = 0;
	if(x + 1 < canvas.width){
		count += getCount(x+1, y);
		if(y + 1 < canvas.height){
			count += getCount(x+1, y+1);
		}
		if(y - 1 >= 0){
			count += getCount(x+1, y-1);
		}		
	}
	
	if(y + 1 < canvas.height){
		count += getCount(x, y+1);
		if(x - 1 >= 0){
			count += getCount(x-1, y+1);
		}		
	}
	
	if(y - 1 >= 0){
		count += getCount(x, y-1);
	}
	
	if(x - 1 >= 0){
		count += getCount(x-1, y);
		if(y - 1 >= 0){
			count += getCount(x-1, y-1);
		}		
	}
	
    return count;
}

function getCount(x, y){
	if(map != undefined && map[x] != undefined && map[x][y] != undefined){
		return map[x][y];
	}else{
		return 0;
	}
}

function toggleDebugMode(){
	if(debugMode){
			//unhide stuff
		debugMode = false;
	}else{
			//hide stuff
		debugMode = true;
	}
}

function togglePause(){
	if(pausedToggle){
		pausedToggle = false;
		tick();
	}else{
		pausedToggle = true
	}
}

function debug(message){
	if(debugMode){
		console.log(message);
	}	
}

function keyDownListener(e){
	switch(e.keyCode){
		case 80:
			togglePause();
			break;
		case 81: //q
			toggleDebugMode(); //shhhh
			break;			
		case 68: //right (d)
			addLifeAtCoordinates(traceX, traceY);
			traceX++;
			break;
		case 65: //left (a)
			addLifeAtCoordinates(traceX, traceY);
			traceX--;
			break;
		case 87: //up (w)
			addLifeAtCoordinates(traceX, traceY);
			traceY--;
			break;
		case 83: //down (s)
			addLifeAtCoordinates(traceX, traceY);
			traceY++;			
			break;
			
		case 82: //r
			break;
		case 84: //t
			break;
	}
}