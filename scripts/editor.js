//@ts-check
// buttons
// const rectangleButton = document.getElementById('rectangleButton');
// const squareButton = document.getElementById('squareButton');
// const circleButton = document.getElementById('circleButton');
const buttons = document.getElementsByTagName("label");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

ctx.shadowOffsetX = 10;
ctx.shadowOffsetY = 10;
ctx.shadowColor = "rgba(0,0,0,0.3)";
ctx.shadowBlur = 10;

const colorPicker = document.getElementById('colorPicker');
const borderPicker = document.getElementById('borderPicker');

var figureToDraw = "rectangle";
var currentColor = colorPicker.value;
var currentBorder = borderPicker.value;

function clearFigure(){
    ctx.clearRect(0,0,400,200);
}

function draw(){
    switch(figureToDraw){
        case "rectangle":{
            drawRectangle();
            break;
        }
        case "fillRectangle":{
            filledRectangle();
            break;
        }
        case "circle":{
            drawCircle();
            break;
        }
        case "fillCircle":{
            filledCircle();
            break;
        }
        case "triangle":{
            drawTriangle();
            break;
        }
        case "fillTriangle":{
            filledTriangle();
            break;
        }
        default:{
            break;
        }
    }
}

function drawRectangle(){
    ctx.lineWidth = 1;
    ctx.strokeStyle = currentBorder;
    ctx.strokeRect(100,50,200,100);
}

function filledRectangle(){
    ctx.lineWidth = 1;
    ctx.strokeStyle = currentBorder;
    ctx.strokeRect(100,50,200,100);
    ctx.fillStyle = currentColor;
    ctx.fillRect(100,50,200,100);
}

function drawCircle(){
    ctx.beginPath();
    ctx.arc(200,100,80,0*Math.PI, 2*Math.PI);
    ctx.lineWidth = 1;
    ctx.strokeStyle = currentBorder;
    ctx.stroke();
}

function filledCircle(){
    ctx.beginPath();
    ctx.arc(200,100,80,0*Math.PI, 2*Math.PI);
    ctx.fillStyle = currentColor;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = currentBorder;
    ctx.stroke();
}

function drawTriangle(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(120,170);
    ctx.lineTo(280,170);
    ctx.lineTo(200,20);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = currentBorder;
    ctx.stroke();
}

function filledTriangle(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(120,170);
    ctx.lineTo(280,170);
    ctx.lineTo(200,20);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = currentBorder;
    ctx.fillStyle = currentColor;
    ctx.stroke();
    ctx.fill();
}

for(var i=0; i<buttons.length; i++){
    buttons[i].addEventListener('click', function(e){
        figureToDraw = e.target.id;
        clearFigure();
        draw();
    });
}

colorPicker.addEventListener('change', function(e){
    currentColor = e.target.value;
})

borderPicker.addEventListener('change', function(e){
    currentBorder = e.target.value;
})