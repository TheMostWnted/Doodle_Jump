//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;


//doddler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
}

//physics 
let velocityX = 0;
let velocityY = 0; // doodler jump speed
let initialVelocityY = -8; //starting velocity Y
let gravity = 0.4;

//platforms
let platformArray = []
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;


window.onload = function(){
    board = document.getElementById("board");
    board.height= boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw green square to test
    //context.fillStyle = "green";
    //context.fillRect(doodler.x,doodler.y,doodler.width,doodler.height);

    //load facing right doodler image
    doodlerRightImg = new Image();
    doodlerRightImg.src = "./doodle_right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function(){
        context.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height);
    }
    // load facing left doodler image
    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./doodle_left.png";

    platformImg = new Image();
    platformImg.src = "./platform.png";

    velocityY = initialVelocityY;

    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown",moveDoodler);

 } 

function update(){
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    // clear the past frames of the doodler
    context.clearRect(0, 0, board.width, board.height);

    // doodler
    doodler.x += velocityX;
    // for the doodler to appear on the other side of the board
    // right side
    if (doodler.x > boardWidth){
        doodler.x = 0;
    }
    // left side
    else if (doodler.x + doodler.width < 0){
        doodler.x = boardWidth;
    }
    

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height){
        gameOver = true;
    }
    context.drawImage(doodler.img,doodler.x,doodler.y,doodler.width,doodler.height);

    //platforms
    for(let i = 0; i < platformArray.length; i++){
        let platform = platformArray[i];
        if(velocityY < 0 && doodler.y < boardHeight * 3/4){
            platform.y -= initialVelocityY; // slide platform down
        }
        // detect if the doodler touches the platform
        console.log(velocityY);
        if (detectCollision(doodler,platform) && velocityY >= 0){
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while(platformArray.length > 0 && platformArray[0].y >= boardHeight){
        platformArray.shift(); // Remove the first platform from the array
        newPlatform();

    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver){
        context.fillText("Game Over : Press 'SPACE' to restart", boardWidth/7, boardHeight*7/8);
    }
}

function moveDoodler(e){
    if (e.code == "ArrowRight" || e.code == "KeyD"){ // move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA"){ // move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver){
        // reset
        doodler = {
            img: doodlerRightImg,
            x: doodlerX,
            y: doodlerY,
            width: doodlerWidth,
            height: doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();


    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    //platformArray.push(platform);

    //starting platforms
    /*platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 250,
        width : platformWidth,
        height : platformHeight
    }*/

    platformArray.push(platform);

    for(let i=0; i < 6; i++){
        let randomX = Math.floor(Math.random() * boardWidth * 3/4);
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
        platformArray.push(platform);
    }

}

function newPlatform(){
    let randomX = Math.floor(Math.random() * boardWidth * 3/4);
        let platform = {
            img : platformImg,
            x : randomX,
            y : - platformHeight,
            width : platformWidth,
            height : platformHeight
        }
        platformArray.push(platform);

}

function detectCollision(a, b){
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y; 
}

function updateScore(){
    let points = Math.floor(50*Math.random()); 
    if (velocityY < 0){ // negative going up
        maxScore += points;
        if (score < maxScore){
            score = maxScore;
        }
    }
    else if (velocityY >= 0){ // going down
        maxScore -= points
    }
}