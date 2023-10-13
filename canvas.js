var canvas = document.querySelector('canvas');
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
var c =canvas.getContext("2d");
class Circle {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.xVel = dx;
        this.yVel = dy;
        this.yAcc = .25;
        this.y = y;
        this.bounce = .90;
        this.friction = .98;
        this.draw = function () {
            c.beginPath();
            c.arc(this.x, this.y, 30, 0, Math.PI * 2, false);
            c.fillStyle = 'red';
            c.fill();
            c.closePath();
        };
        this.move = function () {
            if (this.y + 30 > canvas.height) {
                this.yVel = -this.yVel * this.bounce + .25;
                this.xVel = this.xVel * this.friction + -.0001 * Math.sign(this.xVel);
                if (Math.abs(this.yVel) < .25)
                    this.yVel = 0;
                if (Math.abs(this.xVel) < .25)
                    this.xVel = 0;
                this.y = canvas.height - 30.01;
            }

            else
                this.yVel += this.yAcc;
            if (this.x + 30 > canvas.width) {
                this.xVel = -this.xVel * this.bounce + .1;
                if (Math.abs(this.xVel) < .25)
                    this.xVel = 0;
                this.x = canvas.width - 30.01;
            }
            if (this.x - 30 < 0) {
                this.xVel = -this.xVel * this.bounce + .1;
                if (Math.abs(this.xVel) < .25)
                    this.xVel = 0;
                this.x = 30.01;
            }
            this.x += this.xVel;
            this.y += this.yVel;
        };
    }
}
var dx = 0;
var dy = 0;
var x=0;
var y=0;
let x1=0;
let x2=0;
let y1=0;
let y2=0;
addEventListener("click",click);
addEventListener("mousemove",follow);

function click (event)
{
    circles.push(new Circle(event.offsetX,event.offsetY,dx,dy));
}
function follow (event)
{
    x = event.offsetX;
    y = event.offsetY;
}

function calcMove ()
{
    dx=-.25*(x2-x1);
    dy=-.25*(y2-y1);
    y2=y1;
    x2=x1;
    x1=x;
    y1=y;
}
var circles = [];
setInterval(calcMove, 25);
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height)
    
    circles.forEach(a=>
    {
        a.draw();
        a.move();
        
    });
    
}
animate();

window.onload = window.onresize = resizeCanvas;