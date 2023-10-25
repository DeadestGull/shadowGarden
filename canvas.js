var canvas = document.querySelector('canvas');
resizeCanvas();
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
let center = {
    x : 0,
    y : 0,
}
let materials = {
    coins : 0,
    wood : 0, 
}
let mouse = {
    x : 0,
    y : 0,
}
let keys = new Map();
keys.set('a',false);
keys.set('d',false);
keys.set('s',false);
keys.set('w',false);
keys.set('t',false);
keys.set('r',false);
keys.set('mouse',false);
var c =canvas.getContext("2d");
class Player {
    constructor(px, py) {
        this.position = {
            x:px,
            y:py,
        }
        this.dimensions ={
            width : 50,
            height : 50,
        }
        this.direction = "left";
        this.mode = "none";
        this.speed = 3;
        this.tempWall = {
            orientation : 0, 
            wall : new Wall(0,0,0,0),
        };
    }
    draw () {
        c.fillStyle = 'red';
        c.fillRect( canvas.width/2 - this.dimensions.width/2, canvas.height/2 - this.dimensions.height/2, this.dimensions.width, this.dimensions.height);
    }
    actions(walls) {
        this.move (walls);
        this.makeWalls(walls);
    }
    makeWalls (walls)
    {
        if (keys.get("t")==true){
            if (this.mode!="wall")
                this.mode = "wall";
            else
                this.mode = "none";
            keys.set("t",false);
            keys.set('mouse',false);
        }
        
        if (this.mode == "wall")
        {
            if (keys.get("r")==true)
            {
                keys.set("r",false);
                this.tempWall.orientation = (this.tempWall.orientation+1)%2;
            }

            if (this.tempWall.orientation == 0){
                this.tempWall.wall.position.x1 = Math.round((mouse.x+center.x-canvas.width/2-100/2)/100)*100;
                this.tempWall.wall.position.x2 = Math.round((mouse.x+center.x-canvas.width/2-100/2)/100)*100+100;
                this.tempWall.wall.position.y1 = Math.round((mouse.y+center.y-canvas.height/2)/100)*100;
                this.tempWall.wall.position.y2 = Math.round((mouse.y+center.y-canvas.height/2)/100)*100;
            }
            if (this.tempWall.orientation == 1){
                this.tempWall.wall.position.x1 = Math.round((mouse.x+center.x-canvas.width/2)/100)*100;
                this.tempWall.wall.position.x2 = Math.round((mouse.x+center.x-canvas.width/2)/100)*100;
                this.tempWall.wall.position.y1 = Math.round((mouse.y+center.y-canvas.height/2-100/2)/100)*100;
                this.tempWall.wall.position.y2 = Math.round((mouse.y+center.y-canvas.height/2-100/2)/100)*100+100;
            }


            let touchWall=false;
            if (keys.get("mouse")==true){
                if (this.tempWall.wall.touchingPlayer(this)==false)
                {
                    walls.forEach( a => {if (JSON.stringify(a.position) == JSON.stringify(this.tempWall.wall.position))touchWall = true;});
                    if (touchWall==false)            
                    {
                        walls.push(this.tempWall.wall);
                        this.tempWall.wall = new Wall();
                    }
                }
            }

            c.globalAlpha = .25;
            this.tempWall.wall.draw();
            c.globalAlpha = 1;
            
        }    
        
    }
    move(walls)
    {
        //face directions
        if (Math.abs(mouse.x-canvas.width/2)/canvas.width > Math.abs(mouse.y-canvas.height/2)/ canvas.height)
            if (mouse.x-canvas.width/2 > 0)
                this.direction = "right";
            else 
                this.direction = "left";
        else
            if (mouse.y-canvas.height/2 > 0)
                this.direction = "down";
            else
                this.direction = "up";
        //move
        if (keys.get("d")==true && keys.get("a")==false)//move right
            this.position.x+=this.speed;
        if (keys.get("a")==true && keys.get("d")==false)//move left
            this.position.x-=this.speed;
        walls.forEach( a => a.collisionX(this)); 
        if (keys.get("w")==true && keys.get("s")==false)//move up
            this.position.y-=this.speed;
        if (keys.get("s")==true && keys.get("w")==false)//move down
            this.position.y+=this.speed;
        walls.forEach( a => a.collisionY(this)); 

        center.x = this.position.x + this.dimensions.width/2;
        center.y = this.position.y + this.dimensions.height/2;
    }
}

class Wall{
    constructor(px,py, px2, py2) {
        this.position = {
            x1:px,
            y1:py,
            x2:px2,
            y2:py2,
        }
        this.thickness = 10;
        this.health=50;
    }
    draw () {
        c.fillStyle = 'red';
        c.fillRect(this.position.x1 - this.thickness/2 - center.x + canvas.width/2, this.position.y1 - this.thickness/2 - center.y + canvas.height/2, this.position.x2 - this.position.x1 + this.thickness, this.position.y2 - this.position.y1 + this.thickness);
    }
    collisionX(player){
        if (player.position.y+player.dimensions.height>this.position.y1 - this.thickness/2  && player.position.y<this.position.y2 + this.thickness/2)
        {
            if (player.position.x + player.dimensions.width > this.position.x1 - this.thickness/2 && player.position.x + player.dimensions.width < this.position.x1 + this.thickness/2) //left
            {
                player.position.x = this.position.x1 - this.thickness/2 - player.dimensions.height;
            }
            if (player.position.x > this.position.x1 - this.thickness/2 && player.position.x < this.position.x2 + this.thickness/2) //right
            {
                player.position.x = this.position.x2 + this.thickness/2;
            }
        }
    }
    collisionY(player){
        if (player.position.x+player.dimensions.width>this.position.x1 - this.thickness/2  && player.position.x<this.position.x2 + this.thickness/2)
        {
            if (player.position.y + player.dimensions.height > this.position.y1 - this.thickness/2 && player.position.y + player.dimensions.height < this.position.y1 + this.thickness/2) //top
            {
                player.position.y = this.position.y1 - this.thickness/2 - player.dimensions.height;
            }
            if (player.position.y > this.position.y1 - this.thickness/2 && player.position.y < this.position.y2 + this.thickness/2) //bottom
            {
                player.position.y = this.position.y2 + this.thickness/2;
            }
        }
    }
    touchingPlayer(player)
    {
        if (player.position.x+player.dimensions.width>this.position.x1 - this.thickness/2  && player.position.x<this.position.x2 + this.thickness/2)
        {
            if (player.position.y + player.dimensions.height > this.position.y1 - this.thickness/2 && player.position.y + player.dimensions.height < this.position.y1 + this.thickness/2) //top
            {
                return true;
            }
            if (player.position.y > this.position.y1 - this.thickness/2 && player.position.y < this.position.y2 + this.thickness/2) //bottom
            {
                return true;
            }
        }
        if (player.position.y+player.dimensions.height>this.position.y1 - this.thickness/2  && player.position.y<this.position.y2 + this.thickness/2)
        {
            if (player.position.x + player.dimensions.width > this.position.x1 - this.thickness/2 && player.position.x + player.dimensions.width < this.position.x1 + this.thickness/2) //left
            {
                return true;
            }
            if (player.position.x + player.dimensions.width> this.position.x1 - this.thickness/2 && player.position.x < this.position.x2 + this.thickness/2) //right
            {
                return true;
            }
        }
        return false;
    }
    
}



    


const p = new Player(canvas.width/2,canvas.height/2);
let walls = [];
function up (event)
{
    keys.set(event.key.toLowerCase(),false);
}
function down (event)
{
    keys.set(event.key.toLowerCase(),true);
}
function mouseup(event)
{
    keys.set("mouse",false);
}
function mousedown(event)
{
    keys.set("mouse",true);
}
function follow (event)
{
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
}

function animate()
{
    window.requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    p.draw();
    walls.forEach( a => a.draw());

    p.actions(walls);
       
}
function gameSetUp()
{
    addEventListener("mouseup",mouseup);
    addEventListener("mousedown",mousedown);
    addEventListener("mousemove",follow);
    addEventListener("keyup",up);
    addEventListener("keydown",down);
    window.onload = window.onresize = resizeCanvas;
    animate();
}
gameSetUp();