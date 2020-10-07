
function DrawTriangle(A,B,C,col){
	colors.push(col);
	points.push(A);
	colors.push(col);
	points.push(B);
	colors.push(col);
	points.push(C);
}

function DrawSquare(x,y,color){
	var sz = BLOCK_SIZE;
	y=HEIGHT/sz-y-1;
	//console.log(x,y);
	//在坐标（X，Y）处放置一个正方形
	var sX = x*sz,sY = y*sz;
	var tX = sX+sz,tY = sY+sz;
	var A = Vec2(sX,sY);
	var B = Vec2(sX,tY);
	var C = Vec2(tX,tY);
	var D = Vec2(tX,sY);
	DrawTriangle(A,B,C,color);
	DrawTriangle(A,D,C,color);
}

function DrawSmallSquare(x,y,color){
	var sz = BLOCK_SIZE*4;
	y=HEIGHT/sz-y-1;
	var sX = x*sz,sY = y*sz;
	var tX = sX+sz,tY = sY+sz;
	var A = Vec2(sX,sY);
	var B = Vec2(sX,tY);
	var C = Vec2(tX,tY);
	var D = Vec2(tX,sY);
	DrawTriangle(A,B,C,color);
	DrawTriangle(A,D,C,color);
}


function DrawAnySquare(sx,sy,tx,ty,color){
	var A = Vec2(sx,sy);
	var B = Vec2(sx,ty);
	var C = Vec2(tx,ty);
	var D = Vec2(tx,sy);
	DrawTriangle(A,B,C,color);
	DrawTriangle(A,D,C,color);
}

/*

#... #### .... .... .... .... .... .... 
#... ...# .... .... .... .... .... .... 
#... .... .... .... .... .... .... .... 
#... .... .... .... .... .... .... .... 

*/
/*
0123
4567
89AB
CDEF
*/
Shapes = [
   [0, 1, 4, 5], //+ 0
   [0, 1, 2, 3], [0, 4, 8, 12],  // - 1
   [1, 2, 4, 5], [0, 4, 5, 9 ],  // Z 3
   [0, 1, 5, 6], [1, 4, 5, 8 ],  // S 5
   [0, 1, 2, 5], [1, 4, 5, 9 ], [1, 4, 5, 6], [1, 5, 6, 9],  // T 7
   [0, 1, 4, 8], [0, 1, 2, 6 ], [1, 5, 8, 9], [0, 4, 5, 6],  // L 11
   [1, 5, 8, 9], [0, 4, 5, 6 ], [1, 2, 5, 9], [0, 1, 2, 6],  // 7 15
];
var dx=[0,0,-1,1,0];
var dy=[1,-1,0,0,0];
//0: down 1: up(?) 2: left 3:right

var RotPre=[0,2,1,4,3,6,5,10,7,8,9,14,11,12,13,18,15,16,17];
var RotNt =[0,2,1,4,3,6,5,8,9,10,7,12,13,14,11,16,17,18,15];
/*
0123
4567
89AB
CDEF
*/

var ShapeTypes=[
[0],[1,2],[3,4],[5,6],[7,8,9,10],[11,12,13,14],[15,16,17,18]
];

function randomType(){
	var type = randomInt(ShapeTypes.length);
	return ShapeTypes[type][ randomInt(ShapeTypes[type].length) ];
}

function collsion(x,y){
	if(x<0||x>=(WIDTH/BLOCK_SIZE)||y<0||y>=(HEIGHT/BLOCK_SIZE))return true;
	var id=x*COL+y;
	//console.log(Board[id])
	if(Board[id]!=COLOR_NONE)return true;
	return false;
}

function Block(type,color,x,y){
	this.color=color;
	this.type=type;
	this.movable=true;
	this.shape=Shapes[type];
	this.place=[x,y];

	
	
	this.move=function move(dir){
		this.movable=true;
		//首先判断是否碰撞
		
		for(var i=0;i<this.shape.length;i++){
			var v=this.shape[i];
			var tx=this.place[0]+v%4;
			var ty=this.place[1]+Math.floor(v/4);
			var oldId = tx*(WIDTH/BLOCK_SIZE)+ty;
			Board[oldId]=COLOR_NONE;
		}

		for(var i=0;i<this.shape.length;i++){
			var v=this.shape[i];
			var tx=this.place[0]+dx[dir]+v%4;
			var ty=this.place[1]+dy[dir]+Math.floor(v/4);
			//console.log(tx,ty);
			if(collsion(tx,ty)){
				this.movable=false;
				break;
			}
		}
		
		if(this.movable==false){
			for(var i=0;i<this.shape.length;i++){
				var v=this.shape[i];
				var tx=this.place[0]+v%4;
				var ty=this.place[1]+Math.floor(v/4);
				var oldId = tx*(WIDTH/BLOCK_SIZE)+ty;
				Board[oldId]=this.color;
			}
			if(dir==0)return false;
			return true;
		}
		
		//然后，移动
		for(var i=0;i<this.shape.length;i++){
			var v=this.shape[i];
			var tx=this.place[0]+dx[dir]+v%4;
			var ty=this.place[1]+dy[dir]+Math.floor(v/4);
			var newId = tx*(WIDTH/BLOCK_SIZE)+ty;
			Board[newId]=this.color;
		}
		//console.log(this.place);
		var tx = this.place[0]+dx[dir];
		var ty = this.place[1]+dy[dir];
		this.place=[tx,ty];
		return true;
	}
	
	this.rotate=function rot(d){
		this.movable=true;
		//首先判断是否碰撞
		for(var i=0;i<this.shape.length;i++){
			var v=this.shape[i];
			var tx=this.place[0]+v%4;
			var ty=this.place[1]+Math.floor(v/4);
			var oldId = tx*(WIDTH/BLOCK_SIZE)+ty;
			Board[oldId]=COLOR_NONE;
		}
		var tmp;
		if(d==-1)tmp=Shapes[RotPre[this.type] ];
		else tmp = Shapes[RotNt[this.type] ]
		for(var i=0;i<tmp.length;i++){
			var v=tmp[i];
			var tx=this.place[0]+v%4;
			var ty=this.place[1]+Math.floor(v/4);
			//console.log(tx,ty);
			if(collsion(tx,ty)){
				this.movable=false;
				break;
			}
		}
		
		if(this.movable==false){
			for(var i=0;i<this.shape.length;i++){
				var v=this.shape[i];
				var tx=this.place[0]+v%4;
				var ty=this.place[1]+Math.floor(v/4);
				var oldId = tx*(WIDTH/BLOCK_SIZE)+ty;
				Board[oldId]=this.color;
			}
			return;
		}
		
		this.shape=tmp;
		if(d==-1)this.type =RotPre[this.type];
		else this.type=RotNt[this.type];
		for(var i=0;i<this.shape.length;i++){
			var v=this.shape[i];
			var tx=this.place[0]+v%4;
			var ty=this.place[1]+Math.floor(v/4);
			var newId = tx*(WIDTH/BLOCK_SIZE)+ty;
			Board[newId]=this.color;
		}
	}
	
	this.draw=function drawBlock(){
		for(var i=0;i<this.shape.length;i++){
			var v=this.shape[i];
			var tx=v%4;
			var ty=Math.floor(v/4);
			//console.log(tx,ty);
			DrawSmallSquare(tx,ty,this.color);
		}
	}
}

function SetBlock(block){
	for(var i=0;i<block.shape.length;i++){
		var v=block.shape[i];
		var tx=block.place[0]+v%4;
		var ty=block.place[1]+Math.floor(v/4);
		//console.log(tx,ty);
		if(collsion(tx,ty)){
			return false;
		}
	}
	for(var i=0;i<block.shape.length;i++){
		var v=block.shape[i];
		var tx=block.place[0]+v%4;
		var ty=block.place[1]+Math.floor(v/4);
		var Id = tx*ROW+ty;
		Board[Id]=block.color;
	}
	return true;
	
}

function drawLines(){
	for(var i=0;i*BLOCK_SIZE<WIDTH;i++){
		var x=i*BLOCK_SIZE;
		DrawAnySquare(x-LINE_WIDTH,0,x+LINE_WIDTH,WIDTH,LINECOLOR);
	}
	for(var i=0;i*BLOCK_SIZE<HEIGHT;i++){
		var y=i*BLOCK_SIZE;
		DrawAnySquare(0,y-LINE_WIDTH,HEIGHT,y+LINE_WIDTH,LINECOLOR);
	}
}

function drawsmallLines(tmp){
	var LINE_WIDTH=5;
	for(var i=-5;i<6;i++){
		var x=i*BLOCK_SIZE*4-tmp[0]*WIDTH/2;
		DrawAnySquare(x-LINE_WIDTH,0,x+LINE_WIDTH,WIDTH,LINECOLOR);
	}
	for(var i=-5;i<6;i++){
		var y=i*BLOCK_SIZE*4-tmp[1]*HEIGHT/2;
		DrawAnySquare(0,y-LINE_WIDTH,HEIGHT,y+LINE_WIDTH,LINECOLOR);
	}
}
