
var DELAYED_TIME=10;

function dealKB(e){
	var key = e.key;
	var curTime = new Date().getTime();
	if(curTime-lastHit<DELAYED_TIME){
		return;
	}
	
	if(Paused==1&&key!="p")return;
	
	lastHit=curTime;
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

var lastHit,Paused=0;

window.onload = function(){
	document.getElementById("BtnStart").onclick=function(){
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
