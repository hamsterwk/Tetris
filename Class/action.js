
function dealKB(e){
	var key = e.key;
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
	}
}
window.onload = function(){
	document.getElementById("Btn").onclick=function(){
		document.onkeypress=dealKB;
		BeginNewGame();
	}
}
