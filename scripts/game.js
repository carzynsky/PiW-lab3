const canvas = document.getElementById('canvas');
const scoreText = document.getElementById('scoreText');
const start = document.getElementById('labelStart');
const headColorInput = document.getElementById('headColor');
const bodyColorInput = document.getElementById('bodyColor');
const nextDifficulty = document.getElementById('nextDifficulty');
const previousDifficulty = document.getElementById('previousDifficulty');
const nextGameMode = document.getElementById('nextGameMode');
const previousGameMode = document.getElementById('previousGameMode');
const difficultyText = document.getElementById('difficulty');
const gameModeText = document.getElementById('gameMode');
const userNameInput = document.getElementById('userName');
const controlsInfo = document.getElementById('controlsInfo');

// canvas context
ctx = canvas.getContext('2d');

ctx.strokeStyle = '#000000';

// variables
var isStarted = false;
var headColor;
var bodyColor;
var fruitColor = 'red';
var bonsFruitColor = 'blue';
var gameTimer;
var bonusFruitTimer;
var bonusFruitTimeout;
var width = 400;
var height = 300;
var segments = 3;
var segmentSize = 10;
var body = []
var fruitPosition = []
var moveDirection = 'right';
var previousDirection = '';
var score = 0;
var difficulty = ['Easy', 'Normal', 'Hard'];
var gameModes = ['No walls', 'Walls', 'Extra']
var snakeInterval = 100;
var difficultyIndex = 1;
var gameModeIndex = 1;
var userName;
var leaderboard = [];
var pointsSize = 100;
var bonusFruitSpawned = false;
var bonusFruitX;
var bonusFruitY;


// set default values of a snake body
function initialize(){
    leaderboard = [];
    headColor = headColorInput.value;
    bodyColor = bodyColorInput.value;
    body = [];
    fruitPosition = [];
    moveDirection = 'right';
    previousDirection = '';
    segments = 3;
    body.push([200,90], [190,90], [180,90]);
    score = 0;
    bonusFruitSpawned = false;
    bonusFruitX = -1;
    bonusFruitY = -1;
}

// draw snake
function draw(){
    // set head fill color, draw head
    ctx.fillStyle = headColor;
    ctx.fillRect(body[0][0], body[0][1], segmentSize, segmentSize);

    // set body fill color, draw body
    ctx.fillStyle = bodyColor;
    for(var i=1; i<segments; i++){
        //ctx.strokeRect(body[i][0], body[i][1], segmentSize, segmentSize);
        ctx.fillRect(body[i][0], body[i][1], segmentSize, segmentSize);
    }
}

// snake movement
function move(){
    var tmp1, tmp2;
    for(var i=segments-1; i>0; i--){
        if(i==segments-1){
            tmp1 = body[i][0];
            tmp2 = body[i][1];
        }
        body[i][0] = body[i-1][0];
        body[i][1] = body[i-1][1];
        ctx.clearRect(tmp1, tmp2, segmentSize, segmentSize);
    }

    switch(moveDirection){
        case 'left':{
            body[0][0] -= segmentSize;
            break;
        }
        case 'right':{
            body[0][0] += segmentSize;
            break;
        }
        case 'up':{
            body[0][1] -= segmentSize;
            break;
        }
        case 'down':{
            body[0][1] += segmentSize;
            break;
        }
    }

    if(gameModes[gameModeIndex] === 'Walls'){
        if(body[0][0] >= width || body[0][0] <0 || body[0][1] > height-segmentSize || body[0][1] < 0){
            gameOver();
        }
    }
    else{
        if(body[0][0] >= width){
            body[0][0] = 0;
        }
        if (body[0][0] < 0 ){
            body[0][0] = width-segmentSize;
        }
        if(body[0][1] > height - segmentSize){
            body[0][1] = 0;
        }
        if (body[0][1] < 0 ){
            body[0][1] = height - segmentSize;
        }
    }

}

// check if snakes head has the same xy as fruit
function eat(){
    if(fruitPosition[0] == body[0][0] && fruitPosition[1] == body[0][1]){
        body.push([body[segments-1][0], body[segments-1][1]]);
        segments += 1;
        score += pointsSize;
        fruitPosition = []
        spawnFruit();
    }
    if(bonusFruitSpawned){
        if(bonusFruitX == body[0][0] && bonusFruitY == body[0][1]){
            body.push([body[segments-1][0], body[segments-1][1]]);
            body.push([body[segments-1][0], body[segments-1][1]]);
            segments += 2;
            score += 3*pointsSize;
            clearTimeout(bonusFruitTimeout);
            bonusFruitSpawned = false;
        }
    }
}

// spawn fruit when other has been collected
function spawnFruit(){
    var collision;
    let x,y;
    while(true){
        collision = false;
        x = Math.floor(Math.random() * (width-10)/10)*segmentSize;
        y = Math.floor(Math.random() * (height-10)/10)*segmentSize;

        for(var i=0; i<segments; i++){
            if(body[i][0] == x && body[i][1] == y){
                collision = true;
                break;              
            }
        }
        if(gameModes[gameModeIndex] === 'Extra'){
            if((x >= 120 && x < 280 && y >= 60 && y < 70) || (x >= 120 && x < 280 && y >= 240 && y < 250) ){
                collision = true;
            }
        }
        if(!collision){
            break;
        }
    }

    fruitPosition.push(x,y);
    ctx.fillStyle = fruitColor;
    ctx.fillRect(fruitPosition[0], fruitPosition[1], segmentSize, segmentSize);
}

// check whether snakes head collides with body / obstacles
function collision(){
    for(var i=1; i<segments; i++){
        if(body[i][0] == body[0][0] && body[i][1] == body[0][1]){
            gameOver();
        }
    }
    if(gameModes[gameModeIndex] === 'Extra'){
        if((body[0][0] >= 120  && body[0][0] < 280 && body[0][1] >= 60 && body[0][1] < 70) 
        || (body[0][0] >= 120  && body[0][0] < 280 && body[0][1] >= 240 && body[0][1] < 250)){
            gameOver();
        }
    }
}

// draw bonus fruit
function spawnBonusFruit(){
    var collision = true;
    if(!bonusFruitSpawned){
        let probability = Math.random();
        if(probability >= 0.75){
            while(collision){
                collision = false;
                bonusFruitX = Math.floor(Math.random() * (width-10)/10)*segmentSize;
                bonusFruitY = Math.floor(Math.random() * (height-10)/10)*segmentSize;
        
                for(var i=0; i<segments; i++){
                    if(body[i][0] == bonusFruitX && body[i][1] == bonusFruitY){
                        collision = true;
                        break;              
                    }
                }
                if(gameModes[gameModeIndex] === 'Extra'){
                    if((bonusFruitX >= 120 && bonusFruitX < 280 && bonusFruitY >= 60 && bonusFruitY < 70) 
                    || (bonusFruitX >= 120 && bonusFruitX < 280 && bonusFruitY >= 240 && bonusFruitY < 250) ){
                        collision = true;
                    }
                }
                if(bonusFruitX == fruitPosition[0] && bonusFruitY == fruitPosition[1]){
                    collision = true;
                }
            }

            ctx.fillStyle = bonsFruitColor;
            ctx.fillRect(bonusFruitX, bonusFruitY, segmentSize, segmentSize);
            bonusFruitSpawned = true;

            bonusFruitTimeout = setTimeout( () => {
                ctx.clearRect(bonusFruitX, bonusFruitY, segmentSize, segmentSize);
                bonusFruitX = -1;
                bonusFruitY = -1;
                bonusFruitSpawned = false;
            }, 5000);           
        }
    }

}
// draw obstacle - 2 rectangles
function drawObstacle(){
    ctx.fillStyle = '#97ff17';
    ctx.fillRect(120,60, 160,10);
    ctx.fillRect(120,240, 160,10);
}

// game over
function gameOver(){
    clearInterval(gameTimer);
    clearInterval(bonusFruitTimer);
    clearTimeout(bonusFruitTimeout);
    ctx.fillStyle = '#b8f10d';
    ctx.fillText("GAME OVER", 50, 160);
    if(localStorage.getItem(userName) < score){
        localStorage.setItem(userName, score);
    }
    allStorage();
    start.innerHTML = 'Restart';
    isStarted = false;
}

// get all values from local storage
function allStorage(){
    let values = [];
    let keys = Object.keys(localStorage);
    let length = keys.length;

    while(length --){
        values.push([keys[length],localStorage.getItem(keys[length])]);
    }

    let ul = document.getElementById('scores');
    let tt = document.getElementById('scoreBoardTitle');
    tt.innerHTML = "See best results below:";

    values.forEach((element) => {
        var li = document.createElement('li');
        li.setAttribute('class','item');
        ul.appendChild(li);
        li.innerHTML = li.innerHTML + element[0] + ' ' + element[1];
    });
}

// display score
function displayScore(){
    document.getElementById('scoreText').innerHTML = score;
}


// set move direction
document.onkeydown = (event) => {
    switch(event.keyCode){

        case 39: {
            if(previousDirection != 'left'){
                moveDirection = 'right';
            }              
            break;
        }
        case 37: {
            if(previousDirection!= 'right'){
                moveDirection = 'left';
            }
            break;
        }
        case 38: {
            if(previousDirection != 'down'){
                moveDirection = 'up';
            }
            break;
        }
        case 40: {
            if(previousDirection != 'up'){
                moveDirection = 'down';
            }
            break;
        }
        default:{
            break;
        }
    } 
}

// restart game
function restart(){
    isStarted = true;
    ctx.clearRect(0,0,400,300);
    let ul = document.getElementById('scores');
    ul.innerHTML = " ";
    let tt = document.getElementById('scoreBoardTitle');
    tt.innerHTML = " ";
    initialize();
    spawnFruit();
    setDifficulty();
    if(gameModes[gameModeIndex] === 'Extra'){
        drawObstacle();
    }
    gameTimer = setInterval( () => {
        move();
        draw();
        collision();
        eat(); 
        displayScore();  
        previousDirection = moveDirection;
        console.log(previousDirection);
    }, snakeInterval); 

    bonusFruitTimer = setInterval(() => {
        spawnBonusFruit();
    }, 5000);
}

// set difficulty
function setDifficulty(){
    switch(difficulty[difficultyIndex]){
        case 'Easy':{
            snakeInterval = 120;
            pointsSize = 50;
            break;
        }
        case 'Normal':{
            snakeInterval = 100;
            pointsSize = 100;
            break;
        }
        case 'Hard':{
            snakeInterval = 50;
            pointsSize = 150;
            break;
        }
        default:{
            break;
        }
    }
}

// start button click listener
start.addEventListener('click', () => {
    if(!isStarted){
        start.innerHTML = '';
        userName = userNameInput.value;
        restart();
    }
})

// next difficulty
nextDifficulty.addEventListener('click', () => {
    if(!isStarted){
        difficultyIndex = (difficultyIndex + 1 ) % 3;
        difficultyText.innerHTML = difficulty[difficultyIndex];
    }
})

// previous difficulty
previousDifficulty.addEventListener('click', () => {
    if(!isStarted){
        if(difficultyIndex == 0){
            difficultyIndex = 2;
        }
        else{
            difficultyIndex -= 1;
        }
        difficultyText.innerHTML = difficulty[difficultyIndex];
    }
})

// next game mode
nextGameMode.addEventListener('click', () => {
    if(!isStarted){
        gameModeIndex = (gameModeIndex + 1 ) % 3;
        gameModeText.innerHTML = gameModes[gameModeIndex];
    }
})

// previous game mode
previousGameMode.addEventListener('click', () => {
    if(!isStarted){
        if(gameModeIndex == 0){
            gameModeIndex = 2;
        }
        else{
            gameModeIndex -=  1;
        }
        gameModeText.innerHTML = gameModes[gameModeIndex];
    }
})

allStorage();
difficultyText.innerHTML = difficulty[difficultyIndex];
ctx.font = "50px Arial";
ctx.fillStyle = '#c7ee54';
ctx.fillText("...", 175, 140);