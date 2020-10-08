
var DELAYED_TIME=10;

function dealKey(key){
	//document.getElementById("keyId").innerText = key;
	switch(key){
		case "a":
			if(curBlock==null)return;
			curBlock.move(2);
			refresh();
			break;
		case "d":
			if(curBlock==null)return;
			curBlock.move(3);
			refresh();
			break;
		case "s":
			if(curBlock==null)return;
			curBlock.move(0);
			refresh();
			break;
		case "q":
			if(curBlock==null)return;
			curBlock.rotate(-1);
			refresh();
			break;
		case "e":
			if(curBlock==null)return;
			curBlock.rotate(1);
			refresh();
			break;
		case "p":
			BtnPause.click();
			break;
	}
}

function dealKB(e){
	var key = e.key;
	var curTime = new Date().getTime();
	if(curTime-lastHit<DELAYED_TIME){
		return;
	}
	
	if(Paused==1&&key!="p")return;
	
	lastHit=curTime;
	dealKey(key);
}

var lastHit,Paused=0;
var lastX=0,lastY=0;

function touchStart(e){
	lastX=e.changedTouches[0].clientX;
	lastY=e.changedTouches[0].clientY;
	console.log(lastX,lastY);
}

var RADIUS=18.0;

function judgeDir(x,y){
	if(x*x+y*y<=RADIUS*RADIUS)return 0;
	console.log(x*x+y*y);
	var cos = x/Math.sqrt(x*x+y*y);
	if(cos>Math.sqrt(2)/2 || cos< -Math.sqrt(2)/2){
		if(cos>0)return 3;
		else return 2;
	}
	var sin = y/Math.sqrt(x*x+y*y);
	if(sin<0)return 4;
	else return 5;
}

var msg=["e","","a","d","p","s",""];

function touchEnd(e){
	var newX = e.changedTouches[0].clientX;
	var newY = e.changedTouches[0].clientY;
	//console.log(newX,newY);
	var dir=judgeDir(newX-lastX,newY-lastY);
	if(Paused==1&&dir!=4)return;
	//console.log(msg[dir]);
	dealKey(msg[dir]);
}

//识别移动端
function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        return true;
    }
    return false;
}

var mobileHint="<span id=\"hintWord\">操作指南：</span><br><span id=\"hintWord\">左右滑动</span><br><span id=\"hintWord\">单击旋转</span><br><span id=\"hintWord\">上滑暂停</span><br><span id=\"hintWord\">下滑加速</span><br>";

window.onload = function(){
	event.preventDefault();
	//if(!!self.touch) self.slider.addEventListener('touchmove',self.events,false); 
	
	if(isMobile()){
		document.getElementById("hint").innerHTML=mobileHint;
	}
	
	document.getElementById("BtnStart").onclick=function(){
		document.ontouchstart=touchStart;
		document.ontouchend=touchEnd;
		document.onkeypress=dealKB;
		if(INGAME&&MainInt!=null){
			MainInt = clearInterval(MainInt);
			INGAME=false;
		}
		BeginNewGame();
	}
	
	var BtnPause = document.getElementById("BtnPause");
	
	BtnPause.onclick=function(){
		if(!INGAME)return;
		if(Paused){
			RecoverGame();
			BtnPause.innerText="Pause Game";
		}
		else{
			PauseGame();
			BtnPause.innerText="Continue";
		}
	}
	lastHit =new Date().getTime();
	
}
