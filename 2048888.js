var tileNum = 4;
var tileList = [];
var boardTemp = [];
var boardUp = [];
var boardDown = [];
var boardLeft = [];
var boardRight = [];
var slideOK = [0, 0, 0, 0]; 
var score = 0;
var tmpScore = [0, 0, 0, 0];
var colors = {
	2:"#fafafa",
	4:"#fae9d3",
	8:"#ffc148",
	16:"#ffa448",
	32:"#ff8348",
	64:"#ff6048",
	128:"#ffd072",
	256:"#ffe521",
	512:"#ffcf21",
	1024:"#ffb600",
	2048:"#ff8800",
	4096:"#ff6b00",
	8192:"#ff4f00",
	16384:"#ff3700",
	32768:"#ff1c00",
	65536:"#ff0000",
};

function init(){
    createTile();
    startRandom();
    show();
}

function createTile(){
    for (let i=0;i<tileNum*tileNum;i++){
        tileList[i] = new tile();
        document.getElementById('board').appendChild(tileList[i].node)
        //console.log(tileList[i].node);
        tileList[i].node.style.top = (2+Math.floor(i/4)*112) + "px";
        tileList[i].node.style.left = (2+(i%4)*112) + "px";
        tileList[i].pos = i;
		boardTemp[i] = 0;
		boardLeft[i] = 0;
		boardUp[i] = 0;
		boardRight[i] = 0;
		boardDown[i] = 0;
    }
}

function tile(){		//tile object
	this.node = document.createElement("div");
	this.node.className = "tile";
	this.val = 0;
	this.pos = 0;
}

function startRandom(){
    let pos1 = Math.floor(Math.random()*tileNum*tileNum);
    let pos2 = Math.floor(Math.random()*tileNum*tileNum);
    while( pos1 == pos2){
        pos2 = Math.floor(Math.random()*tileNum*tileNum);
    }
    tileList[pos1].val = twoOrFour();
    tileList[pos2].val = twoOrFour();
    boardTemp[pos1] = tileList[pos1].val;
    boardTemp[pos2] = tileList[pos2].val;
}

function twoOrFour(){
    return Math.random() < 0.1 ? 4 : 2;
}

function show(){
    for(i=0;i<tileList.length;i++){
        tileList[i].getColor();
        tileList[i].getNum();
    }
    var tmp = document.getElementById("score");
	tmp.innerText = "得分: " + score;
}

tile.prototype.getColor = function(){
    if(this.val!=0){
        this.node.style.backgroundColor = colors[this.val];
        if(this.val>4){
            this.node.style.color = 'white';
        }else{
            this.node.style.color = 'black';
        }
    }else{
        this.node.style.backgroundColor = "Lightgray";
    }
}

tile.prototype.getNum = function(){
    if(this.val!=0){
        this.node.innerText = this.val;
    }else{
        this.node.innerText = "";
    }
}

function randomPos(){
    let pos = Math.floor(Math.random()*16);
    while(tileList[pos].val!=0){
        pos = Math.floor(Math.random()*16);
    }
    return pos;
}



function createNewTile(){
    let pos = randomPos();
    let num = twoOrFour();
    tileList[pos].val = num;
    //show();
}
// function checkSame(){
//     let same = 1;
//     for(let i=0;i<tileNum*tileNum;i++){
//         if(boardTemp[i]!=tileList[i].val){
//             same = 0;
//         }
//     }
//     return same;
// }
function CheckSame(){	//check the board after moved is the same as the board before moved or not
	var same = 1;
	for(let i=0;i<16;i++){
		if(boardTemp[i] != tileList[i].val){
			same = 0;
		}
	}
	if(same == 1){
		return 1;
	}
	else{
		return 0;
	}
}

function tmp2true(){	//board_tmp array assign to the true board now
	for(let i=0;i<16;i++){
		boardTemp[i] = tileList[i].val;
	}
}

function all_tmp2true(){	//all tmp array assign to the true board now
	for(let i=0;i<16;i++){
		boardTemp[i] = tileList[i].val;
		boardUp[i] = tileList[i].val;
		boardDown[i] = tileList[i].val;
		boardLeft[i] = tileList[i].val;
		boardRight[i] = tileList[i].val;
	}
}
function slideLeft(){		//check slide left is legal or not
	for(let i=0;i<4;i++){
		let top = 0, hold = 0;
		for(let j=0;j<4;j++){	//4*i+j
			let index = boardTemp[i*4+j];
			if(index != 0){
                boardTemp[i*4+j]=0;
                if(index == hold){
                    boardTemp[i*4+top]=index*2;
                    tmpScore[0] += index*2;
                    top++;
                    hold = 0;
                }else{
                    boardTemp[i*4+top]=hold;
                    if(hold!=0){
                        top++;
                    }
                    hold = index;
                    
                }
			}	
		}
        if(hold){
            boardTemp[i*4+top]=hold;
        }
	}
    if(CheckSame()==1){
        return 0;
    }else{
        for(let i=0;i<16;i++){
        boardLeft[i]=boardTemp[i];
    }
    tmp2true();
    return 1;
    }
    
}

function slideUp(){		//check slide up is legal or not
	for(let i=0;i<4;i++){
		let top = 0, hold = 0;
		for(let j=0;j<4;j++){	
			let index = boardTemp[i+4*j];
			if(index != 0){
                boardTemp[i+4*j]=0;
                if(index == hold){
                    boardTemp[i+4*top]=index*2;
                    tmpScore[1] += index*2;
                    top++;
                    hold = 0;
                }else{
                    boardTemp[i+4*top]=hold;
                    if(hold!=0){
                        top++;
                    }
                    hold = index;
                }
			}	
		}
        if(hold){
            boardTemp[i+4*top]=hold;
        }
	}
    if(CheckSame()==1){
        return 0;
    }else{
        for(let i=0;i<16;i++){
        boardUp[i]=boardTemp[i];
    }
    tmp2true();
    return 1;
    }
}

function slideRight(){		//check slide right is legal or not
	for(let i=0;i<4;i++){
		let top = 3, hold = 0;
		for(let j=3;j>-1;j--){	//4*i+j
			let index = boardTemp[i*4+j];
			if(index != 0){
                boardTemp[i*4+j]=0;
                if(index == hold){
                    boardTemp[i*4+top]=index*2;
                    tmpScore[2] += index*2;
                    top--;
                    hold = 0;
                }else{
                    boardTemp[i*4+top]=hold;
                    if(hold!=0){
                        top--;
                    }
                    hold = index;
                    
                }
			}	
		}
        if(hold){
            boardTemp[i*4+top]=hold;
        }
	}
    if(CheckSame()==1){
        return 0;
    }else{
        for(let i=0;i<16;i++){
        boardRight[i]=boardTemp[i];
    }
    tmp2true();
    return 1;
    }
}

function slideDown(){		//check slide up is legal or not
	for(let i=0;i<4;i++){
		let top = 3, hold = 0;
		for(let j=3;j>-1;j--){	
			let index = boardTemp[i+4*j];
			if(index != 0){
                boardTemp[i+4*j]=0;
                if(index == hold){
                    boardTemp[i+4*top]=index*2;
                    tmpScore[3] += index*2;
                    top--;
                    hold = 0;
                }else{
                    boardTemp[i+4*top]=hold;
                    if(hold!=0){
                        top--;
                    }
                    hold = index;
                }
			}	
		}
        if(hold){
            boardTemp[i+4*top]=hold;
        }
	}
    if(CheckSame()==1){
        return 0;
    }else{
        for(let i=0;i<16;i++){
        boardDown[i]=boardTemp[i];
    }
    tmp2true();
    return 1;
    }
}
function checkLose(){
    all_tmp2true()
    var lose = 1;
    if(slideLeft()){
        slideOK[0] = 1;
		lose = 0;
    }
    if(slideUp()){
        slideOK[1] = 1;
		lose = 0;
    }
    if(slideRight()){
        slideOK[2] = 1;
		lose = 0;
    }
    if(slideDown()){
        slideOK[3] = 1;
		lose = 0;
    }
    if(lose ==1){
        return 1;
    }
    return 0;
}
function computeScore(tilePoint){		//compute the score
	if(tilePoint != 0){
		
		score += tilePoint;
	}
}
function keyboardCtrl(key){
    //console.log(key.keyCode)
    switch (key.keyCode) {
        
        case 37:
            if(slideOK[0]){
                //slideLeft();
                for(let i=0;i<16;i++){
                    tileList[i].val = boardLeft[i];
                }
                createNewTile();
                computeScore(tmpScore[0]);
            }
        
            break;
    
        case 38:
            if(slideOK[1]){
                //slideUp();
                for(let i=0;i<16;i++){
                    tileList[i].val = boardUp[i];
                }
                createNewTile();
                computeScore(tmpScore[1]);

            }

            break;

        case 39:
            if(slideOK[2]){

                //slideRight();
                for(let i=0;i<16;i++){
                    tileList[i].val = boardRight[i];
                }
                createNewTile();
                computeScore(tmpScore[2]);
            }

            break;

        case 40:
            if(slideOK[3]){
                //slideDown();
                for(let i=0;i<16;i++){
                    tileList[i].val = boardDown[i];
                }
                createNewTile();
                computeScore(tmpScore[3]);

            }

            break;
    }
    show();
    for(let i=0;i<4;i++){
        slideOK[i]=0;
        tmpScore[i]=0;
    }
    if(checkLose()==1){
        lose();
    }

}
function lose(){
    document.getElementById('lose').style.display = 'flex'
}
window.addEventListener("load", init);  //等html完整後執行init
window.addEventListener("keyup", keyboardCtrl);