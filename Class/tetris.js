"use strict";

var canvas,PROGRAM,PROGRAM2;
var gl,gl2;
var points = [],colors=[]; 
var angle;
var renderType;
var BLOCK_SIZE=32;
var vertices,baseColors;
var WIDTH=512,HEIGHT=512;
var LINE_WIDTH=1;
var curBlock=null;var nextBlock;
var TimeInt=500;
var Board=[];
var COL,ROW,INGAME;
var MainInt,score=0;
function BeginNewGame()
{

	Init();
	
	//Main();
	
	//preRender();
	
	MainInt = setInterval(Main,TimeInt);
	//console.log(MainInt);
};

function PauseGame(){
	MainInt = clearInterval(MainInt);
	Paused=1;
}

function RecoverGame(){
	MainInt = setInterval(Main,TimeInt);
	Paused=0;
}

function RGB(R,G,B){
	return vec3(R/255,G/255,B/255);
}

var WHITE = RGB(255,245,247);
var BLACK = RGB(0,0,0);
var LINECOLOR = RGB(0,0,0);
var COLOR_NONE = RGB(255,245,247);
var BASE_COLORS=[
RGB(182,194,154),
RGB(138,151,123),
RGB(244,208,  0),
RGB(229,131,  8),
RGB(220, 87, 18),
]

function randomInt(x){
	return Math.floor( Math.random()*x );
}

function randomColor(){
	return BASE_COLORS[randomInt(BASE_COLORS.length)];
}



function Vec2(x,y,tx=0,ty=0){
	//console.log(x,y);
	var newX = 2*x/WIDTH-1+tx;
	var newY = 2*y/HEIGHT-1+ty;
	//console.log(newX,newY);
	return vec2(newX,newY);
}

function Init(){
	INGAME=true;
	points=[];
	colors=[];
	Board=[];
	curBlock=null;
	score=0;
	Paused=0;
	document.getElementById("BtnPause").innerText="Pause Game";
	if(MainInt!=null)MainInt=clearInterval(MainInt);
	document.getElementById("Score").innerText=score;
	canvas = document.getElementById( "gl-canvas" );
	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT );
	gl.viewport( 0, 0, canvas.width, canvas.height );
	PROGRAM = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( PROGRAM );
	
	canvas = document.getElementById( "gl-incoming" );
	gl2 = WebGLUtils.setupWebGL( canvas );
	if ( !gl2 ) { alert( "WebGL isn't available" ); }
	gl2.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl2.viewport( 0, 0, canvas.width, canvas.height );
	PROGRAM2 = initShaders( gl2, "vertex-shader", "fragment-shader" );
	gl2.useProgram( PROGRAM2 );
	
	COL = WIDTH/BLOCK_SIZE;
	ROW = HEIGHT/BLOCK_SIZE;
	for(var i=0;i<(WIDTH*HEIGHT)/(BLOCK_SIZE*BLOCK_SIZE);i++)Board.push(COLOR_NONE);
	
	nextBlock = new Block(randomType(),randomColor(),randomInt(10),0);
	
	/*for(var i=0;i<1;i++){
		for(var j=0;j<8;j++){
			DrawSquare(i,j,randomColor());
		}
	}*/

	//a.draw();
	//renderDepth=document.getElementById("depth").value;
}

function drawFrame(){
	for(var i=0;i<COL;i++){
		for(var j=0;j<ROW;j++){
			var id=i*ROW+j;
			DrawSquare(i,j,Board[id]);
		}
	}
}



function moveBlock(){
	if(curBlock==null){
		curBlock = nextBlock;
		nextBlock = new Block(randomType(),randomColor(),randomInt(10),0);
		if(SetBlock(curBlock)==false)return -1;
		return 1;
	}else{
		if(curBlock.move(0)==false){
			curBlock=null;
			return 0;
		}
		return 1;
	}
}

function clearFull(){
	for(var i=ROW-1;i>=0;i--){
		var flag=0;
		for(var j=0;j<COL;j++){
			var id=j*ROW+i;
			if(Board[id]==COLOR_NONE){
				flag=-1;break;
			}
		}
		if(flag==-1)continue;
		for(var j=0;j<COL;j++)Board[j*ROW+i]=COLOR_NONE;
		for(var k=i-1;k>=0;k--){
			for(var j=0;j<COL;j++)Board[j*ROW+k+1]=Board[j*ROW+k];
		}
		for(var j=0;j<COL;j++)Board[j*ROW]=COLOR_NONE;
		score+=10;
		i++;
	}
	
	document.getElementById("Score").innerText=score;
}

function drawNextBlock(){
	nextBlock.draw();
}

function adjustBlock(){
	var tmpx=0.0,tmpy=0.0;
	for(var i=0;i<points.length;i++){
		var point=points[i];
		tmpx+=point[0];
		tmpy+=point[1];
	}
	tmpx/=points.length;
	tmpy/=points.length;
	for(var i=0;i<points.length;i++){
		var point=points[i];
		points[i]=[ point[0]-tmpx,point[1]-tmpy ];
	}
	return [tmpx,tmpy];
}

function Main(){
	var result = moveBlock();
	//console.log(result);
	if(result==-1){
		alert("You Lose....");
		MainInt = clearInterval(MainInt);
		MainInt = null;
		INGAME=false;
	}
	if(result==0){
		clearFull();
	}
	drawFrame();
	drawLines();
	render(gl,PROGRAM,gl.TRIANGLES);
	points=[];
	colors=[];
	drawNextBlock();
	var tmp = adjustBlock();
	//console.log(tmp);
	drawsmallLines(tmp);
	render(gl2,PROGRAM2,gl2.TRIANGLES);
}

function refresh(){
	points=[];
	colors=[];
	drawFrame();
	drawLines();
	render(gl,PROGRAM,gl.TRIANGLES);
	points=[];
	colors=[];
	drawNextBlock();
	var tmp = adjustBlock();
	drawsmallLines(tmp);
	render(gl2,PROGRAM2,gl2.TRIANGLES);
}

function render(gl,PROGRAM,type) {
	
	gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT );
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( PROGRAM, "vPosition" );
	gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	var colorId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, colorId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

	var vcolor = gl.getAttribLocation( PROGRAM, "vcolor" );
	gl.vertexAttribPointer( vcolor, 3, gl.FLOAT, false, 0,0 );
	gl.enableVertexAttribArray( vcolor );
	
	//var vmat = mult(mult(rotateX(Xdegree),rotateY(Ydegree)),rotateZ(Zdegree) );
	//gl.uniformMatrix4fv(viewMatrix,false,flatten(vmat));
	gl.drawArrays( type, 0, points.length );
	
	
}
