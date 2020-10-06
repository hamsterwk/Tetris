"use strict";

var canvas;
var gl;
var points = [],colors=[]; 
var renderDepth;
var angle;
var renderType;
var vertices,baseColors;
var viewMatrix;
window.onload = function init()
{
	canvas = document.getElementById( "gl-canvas" );

	gl = WebGLUtils.setupWebGL( canvas );
	if ( !gl ) { alert( "WebGL isn't available" ); }

	Init();
   
	
};

function Init(){
	gl.enable(gl.DEPTH_TEST);
	
	//renderDepth=document.getElementById("depth").value;
}



function render() {
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram( program );
	gl.clear( gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT );
	var bufferId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );

	var colorId = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, colorId );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
	


	var vcolor = gl.getAttribLocation( program, "vcolor" );
	gl.vertexAttribPointer( vcolor, 3, gl.FLOAT, false, 0,0 );
	gl.enableVertexAttribArray( vcolor );
	
	var vmat = mult(mult(rotateX(Xdegree),rotateY(Ydegree)),rotateZ(Zdegree) );
	gl.uniformMatrix4fv(viewMatrix,false,flatten(vmat));
	gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
