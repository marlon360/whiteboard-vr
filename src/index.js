import io from 'socket.io-client';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let room = getParameterByName('room');
if (room != null) {
    const vrButton = document.getElementById('vr-button');
    vrButton.href = "vr.html?room="+room;
    const roomNumber = document.getElementById('room-number');
    roomNumber.textContent = room;
} else {
    room = Math.random().toString(36).substr(2, 5).toUpperCase();
    window.location.href = "index.html?room="+room;
}
 
const socket = io();

let id = Math.floor(Math.random() * 100000000);
let lastX = null;
let lastY = null;
let background = "#EEF8FD";
let color = "#000000";
let size = 10;
let clearing = false;

const canvasWidth = 1500;
const canvasHeight = 1000;

const canvas = document.querySelector("#canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const context2D = canvas.getContext( "2d" );

// draw background
context2D.fillStyle = background;
context2D.fillRect(0, 0, canvas.width, canvas.height); 

socket.on('remoteDraw', (remoteDrawObject) => {
    if (remoteDrawObject.id != id) {
        drawRemote(remoteDrawObject);
    }
});

socket.on('remoteEraseAll', (remoteEraseAllObject) => {
    if (remoteEraseAllObject.id != id) {
        eraseAllRemote(remoteEraseAllObject);
    }
});


canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);

function eraseAllRemote(eraseAllRemoteObject) {
    if (room != eraseAllRemoteObject.room) {
        return;
    }
    context2D.fillStyle = background;
    context2D.fillRect(0, 0, canvas.width, canvas.height);     
}

function drawRemote(remoteDrawObject) {
    if (room != remoteDrawObject.room) {
        return;
    }
    if (remoteDrawObject.lastX != null && remoteDrawObject.lastY != null) {            
        context2D.beginPath();
        context2D.strokeStyle = remoteDrawObject.color;
        if (remoteDrawObject.clearing) {
            context2D.strokeStyle = background;
        }
        context2D.lineJoin = 'round';
        context2D.lineWidth = remoteDrawObject.size;
        context2D.moveTo(remoteDrawObject.lastX, remoteDrawObject.lastY);
        context2D.lineTo(remoteDrawObject.x, remoteDrawObject.y);
        context2D.closePath();
        context2D.stroke();
        
    }
}

function draw (x, y) {
    if (lastX != null && lastY != null) {        
        var drawObject= {};
        drawObject.id = id;
        drawObject.lastX = lastX;
        drawObject.lastY = lastY;
        drawObject.x = x;
        drawObject.y = y;
        drawObject.color = color;
        drawObject.room = room;
        drawObject.size = size;
        drawObject.clearing = clearing;
        socket.emit('draw', drawObject);
        drawRemote(drawObject);
        lastX = x;
        lastY = y;
    }
}

function onMouseMove( evt ) {

    evt.preventDefault();

    let scalingX = canvasWidth / canvas.clientWidth;
    let scalingY = canvasHeight / canvas.clientHeight;

    let x = (evt.pageX - canvas.offsetLeft) * scalingX;
    let y = (evt.pageY - canvas.offsetTop) * scalingY;
    draw(x,y);

}
function onMouseDown (evt) {
    let scalingX = canvasWidth / canvas.clientWidth;
    let scalingY = canvasHeight / canvas.clientHeight;

    lastX = (evt.pageX - canvas.offsetLeft) * scalingX;
    lastY = (evt.pageY - canvas.offsetTop) * scalingY;
}
function onMouseUp (evt) {
    lastX = null;
    lastY = null;
}

canvas.addEventListener('touchstart', function (evt) {
    evt.preventDefault();

    let scalingX = canvasWidth / canvas.clientWidth;
    let scalingY = canvasHeight / canvas.clientHeight;

    lastX = (evt.targetTouches[0].pageX - canvas.offsetLeft) * scalingX;
    lastY = (evt.targetTouches[0].pageY - canvas.offsetTop) * scalingY;
}, false);
  
  canvas.addEventListener('touchmove', function (evt) {
    evt.preventDefault();
    let scalingX = canvasWidth / canvas.clientWidth;
    let scalingY = canvasHeight / canvas.clientHeight;

    let x = (evt.targetTouches[0].pageX - canvas.offsetLeft) * scalingX;
    let y = (evt.targetTouches[0].pageY - canvas.offsetTop) * scalingY;
    draw(x,y);
  }, true);
  
  canvas.addEventListener('touchend', function (evt) {
    evt.preventDefault();
    lastX = null;
    lastY = null;
  }, false);
  
  canvas.addEventListener('touchcancel', function () {
    lastX = null;
    lastY = null;
  });


const colorPicker = document.querySelector("#color-picker");

colorPicker.addEventListener("change", (evt) => {
    color = evt.target.value;
}, false);

const brushSize = document.querySelector("#brush-size");

brushSize.addEventListener("change", (evt) => {
    size = evt.target.value;
}, false);

const eraser = document.querySelector("#eraser");

eraser.addEventListener("change", (evt) => {
    clearing = evt.target.checked;
}, false);

window.addEventListener('resize', onResize)

function onResize() {
    canvas.style.width = "94%";
    const height = canvas.clientWidth / 1.5;
    if (height > window.innerHeight * 0.9) {
        canvas.style.height = window.innerHeight - 100 + "px";
        canvas.style.width = canvas.clientHeight / 0.66 + "px";
    } else {
        canvas.style.height = canvas.clientWidth / 1.5 + "px";
    }
}

onResize()

let saveBoard = document.getElementById('save-board');
saveBoard.addEventListener('click', () => {
    document.getElementById("save-board").href = document.getElementById("canvas").toDataURL();
    document.getElementById("save-board").download = "whiteboard.png";
})

let eraseAll = document.getElementById('erase-all');
eraseAll.addEventListener('click', () => {
    var eraseAllObject= {};
    eraseAllObject.id = id;
    eraseAllObject.room = room;
    socket.emit('eraseAll', eraseAllObject);
    eraseAllRemote(eraseAllObject);
})

let joinRoom = document.getElementById('join-room');
joinRoom.addEventListener('click', () => {
    let enteredRoom = window.prompt("Room Code: ","");
    if (enteredRoom == null || enteredRoom == "") {
        // canceled
      } else {
        enteredRoom = enteredRoom.toUpperCase();
        window.location.href = "index.html?room="+enteredRoom;
      }
})