class Player {
    constructor(px, py) {
        this.position = {
            x:px,
            y:py,
        }
        this.width = 30;
        this.height = 50;
        this.direction = "left";
        this.mode = "none";
        this.speed = 3;
        this.tempWall = {
            orientation : 0, 
            wall : new Wall(0,0,0,0,true,true),
        };
    }
    draw () {
        c.fillStyle = 'red';
        c.fillRect( canvas.width/2 - this.width/2, canvas.height/2 - this.height/2, this.width, this.height);
    }
    actions(walls) {
        this.move (walls);
        this.makeWalls(walls);
    }
    makeWalls (walls)
    {
        if (keys.get("q")==true){
            if (this.mode!="wall")
                this.mode = "wall";
            else
                this.mode = "none";
            keys.set("q",false);
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


            if (keys.get("mouse")==true){
                this.tempWall.wall.makeID();
                if (this.tempWall.wall.touchingPlayer(this)==false&&addWall(this.tempWall.wall))
                {
                    this.tempWall.wall = new Wall();
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
        wallsX.forEach( a => a.collisionX(this));
        onScreenElements.forEach( a => {if(a!=null)a.collisionX(this)});
        if (keys.get("w")==true && keys.get("s")==false)//move up
            this.position.y-=this.speed;
        if (keys.get("s")==true && keys.get("w")==false)//move down
            this.position.y+=this.speed;
        wallsY.forEach( a => a.collisionY(this)); 
        onScreenElements.forEach( a => {if(a!=null)a.collisionY(this)});

        center.x = this.position.x + this.width/2;
        center.y = this.position.y + this.height/2;
    }
}

class Wall{
    constructor(px,py, px2, py2, see, touch) {
        let x = px;
        let y = py;
        this.see= see;
        this.touch=touch;
        this.position = {
            x1:x,
            y1:y,
            x2:px2,
            y2:py2,
        }
        this.thickness = 10;
        this.health=50;
        
    }
    makeID()
    {       
         this.id = parseInt(""+0+this.position.x1+this.position.y1+this.position.x2+this.position.y2);
    }
    draw () {
        if (!(this.see==false))
        {
            c.fillStyle = 'red';
            c.fillRect(this.position.x1 - this.thickness/2 - center.x + canvas.width/2, this.position.y1 - this.thickness/2 - center.y + canvas.height/2, this.position.x2 - this.position.x1 + this.thickness, this.position.y2 - this.position.y1 + this.thickness);
        }
    }
    collisionX(player){
        if (!(this.touch==false))
        if (player.position.y+player.height>this.position.y1 - this.thickness/2  && player.position.y<this.position.y2 + this.thickness/2)
        {
            if (player.position.x + player.width > this.position.x1 - this.thickness/2 && player.position.x + player.width < this.position.x1 + this.thickness/2) //left
            {
                player.position.x = this.position.x1 - this.thickness/2 - player.width;
            }
            if (player.position.x > this.position.x1 - this.thickness/2 && player.position.x < this.position.x2 + this.thickness/2) //right
            {
                player.position.x = this.position.x2 + this.thickness/2;
            }
        }
    }
    collisionY(player){
        if (!(this.touch==false))
        if (player.position.x+player.width>this.position.x1 - this.thickness/2  && player.position.x<this.position.x2 + this.thickness/2)
        {
            if (player.position.y + player.height > this.position.y1 - this.thickness/2 && player.position.y + player.height < this.position.y1 + this.thickness/2) //top
            {
                player.position.y = this.position.y1 - this.thickness/2 - player.height;
            }
            if (player.position.y > this.position.y1 - this.thickness/2 && player.position.y < this.position.y2 + this.thickness/2) //bottom
            {
                player.position.y = this.position.y2 + this.thickness/2;
            }
        }
    }
    touchingPlayer(player)
    {
        if (player.position.x+player.width>this.position.x1 - this.thickness/2  && player.position.x<this.position.x2 + this.thickness/2)
        {
            if (player.position.y + player.height > this.position.y1 - this.thickness/2 && player.position.y + player.height < this.position.y1 + this.thickness/2) //top
            {
                return true;
            }
            if (player.position.y > this.position.y1 - this.thickness/2 && player.position.y < this.position.y2 + this.thickness/2) //bottom
            {
                return true;
            }
        }
        if (player.position.y+player.height>this.position.y1 - this.thickness/2  && player.position.y<this.position.y2 + this.thickness/2)
        {
            if (player.position.x + player.width > this.position.x1 - this.thickness/2 && player.position.x + player.width < this.position.x1 + this.thickness/2) //left
            {
                return true;
            }
            if (player.position.x + player.width> this.position.x1 - this.thickness/2 && player.position.x < this.position.x2 + this.thickness/2) //right
            {
                return true;
            }
        }
        return false;
    }
    
}
let lastTree = 0;
let lastFlower = 0;
let lastForest = 0;
let nextTree = generateNormallyDistributedRandom(10,19);
let nextFlower = generateNormallyDistributedRandom(7,15);
let nextForest = generateNormallyDistributedRandom(20,30);
class Tile{
    constructor(x1,y1,objects)
    {
        this.position = {
            x:x1,
            y:y1,
        };
        if (objects != null)
            this.objects = objects;
        else
            this.objects = [];
        this.assignType();

    }
    draw()
    {
        c.fillStyle = 'green';
        c.fillRect(this.position.x - center.x +canvas.width/2, this.position.y - center.y +canvas.height/2,101,101);
        onScreenElements.push(...this.objects);
    }

    makeID()
    {
        this.id = ""+this.position.x+"a"+this.position.y;
        return this.id;
    }
    assignType()
    {
        if (nextTree <= lastTree)
        {
            let tempX = this.position.x;
            let tempY = this.position.y;
            let randX = Math.random()*50;
            if (tiles.has(this.position.x+100+""+this.position.y) && tiles.get(this.position.x-100+""+this.position.y).objects == [])
                randX += Math.random()*100;
            if (tiles.has(this.position.x-100+""+this.position.y) && tiles.get(this.position.x-100+""+this.position.y).objects == [])
            {
                randX += Math.random()*100;
                randX -=50;
            }
            tempX +=randX;
            let temp = new Tree(tempX, tempY);
            this.objects.push(temp);
            lastTree = 0;
            nextTree = generateNormallyDistributedRandom(10,25);
        }
        else if (nextFlower <= lastFlower)
        {
            let tempX = this.position.x;
            let tempY = this.position.y;
            let randX = Math.random()*50;
            if (tiles.has(this.position.x+100+""+this.position.y) && tiles.get(this.position.x-100+""+this.position.y).objects == [])
                randX += Math.random()*100;
            if (tiles.has(this.position.x-100+""+this.position.y) && tiles.get(this.position.x-100+""+this.position.y).objects == [])
            {
                randX += Math.random()*100;
                randX -=50;a
            }
            tempX +=randX;
            let temp = new Flower(tempX, tempY);
            console.log(this.position.x,this.position.y,temp.position.x,temp.position.y);

            this.objects.push(temp);
            lastFlower = 0;
            nextFlower = generateNormallyDistributedRandom(7,15);
        }
         lastTree++;
         lastFlower++;
         lastForest++;
    }
}
class LifeTree {
    constructor(x,y)
    {
        this.position ={
            x:x,
            y:y,
        };
        this.width = 200;
        this.height = 200; 
    }
    draw()
    {     
        if (this.position.y+this.size<p.position.y+p.height||drawElementsAfter.indexOf(this)>-1)
        {        
            c.fillStyle = 'rgb(52,141,44)';
            c.fillRect(this.position.x  - center.x +canvas.width/2 , this.position.y - center.y +canvas.height/2, this.width, this.height);
        }
        else
            drawElementsAfter.push(this);
    }
    
    /*
        p.position.x  //player x
        p.position.y  //player y
        p.size
        this.position.x
        this.position.y
        this.size 
    */
    collisionX()
    {
        
    }
    collisionY()
    {
       
    }
}
class Tree{
    constructor(x,y)
    {
        
        this.position ={
            x:x,
            y:y,
        };
        this.width = 50;
        this.height = 75;
        this.health = 50; 
    }
    draw()
    {
        let image = document.getElementById("tree");
        if (this.position.y+this.size<p.position.y+p.height||drawElementsAfter.indexOf(this)>-1)
        {        
            c.drawImage(image, this.position.x - center.x +canvas.width/2 -25,this.position.y - center.y +canvas.height/2 - 70);
        }
        else
            drawElementsAfter.push(this);
    }
   
    collisionX()
    {
        if (p.position.y+p.height>this.position.y && p.position.y<this.position.y + this.height)
        {
            if (p.position.x + p.width > this.position.x && p.position.x + p.width < this.position.x + this.width) //left
            {
                p.position.x = this.position.x - p.width;
            }
            if (p.position.x > this.position.x && p.position.x < this.position.x + this.width) //right
            {
                p.position.x = this.position.x + this.width;
            }
        }
    }
    collisionY()
    {
        if (p.position.x+p.width>this.position.x   && p.position.x<this.position.x + this.width)
        {
            if (p.position.y + p.height > this.position.y && p.position.y < this.position.y) //top
            {
                p.position.y = this.position.y - p.height;
            }
            if (p.position.y > this.position.y && p.position.y < this.position.y +this.height) //bottom
            {
                p.position.y = this.position.y +this.height;
            }
        }
    }
    
}
class Flower{
    constructor(x,y)
    {
        this.position = 
        {
            x:x,
            y:y,
        }
        this.size = 25;
        this.pickupFrames = 150;
        this.isTouchingPlayer = false;
        this.timer=0;
        this.pickupTime=100; 
    }
    collisionX(){}
    collisionY(){}
    draw()
    {
        let image = document.getElementById("blue_flower");
        if (this.position.y+this.size<p.position.y+p.height||drawElementsAfter.indexOf(this)>-1)
        {        
            c.fillStyle = "red";
            c.fillRect(this.position.x,this.position.y,10,10);
            c.drawImage(image, this.position.x - center.x +canvas.width/2 ,this.position.y - center.y +canvas.height/2);
        }
        else
            drawElementsAfter.push(this);
    }
    pickup(tile)
    {
        //when e pressed for a certain amount of time and an object is touching the player it will remove the object from that the specific tile
        // this.position.x/y gives position of object
        //tiles.object.pop(this) removes current object
        // isIntersecting( player right x, left x, top y, bottom y, object right x, object left x, object top y, object bottom y, 10);
        // player is called p.position.x gets left and p.pos.y gets top y
        // p.height + p.pos.y get bot y
        // p.width + p.pos.x get right x
        //same thing for object but its p.size
    }
}
class Weed{
    constructor(x,y) {
        this.nutrients = 0;
        this.path, this.dir = undefined; 
        this.x = x;
        this.y = y;
        this.vines = [];
    }
    makePath(){
        let dir = "";
        let vines = [];
        let tempX = this.x;
        let tempY = this.y;

        const lifeTreeWidth = 100;
        const lifeTreeHeight = 100;
        if (Math.abs(lifeTree.position.x - this.x) > Math.abs(lifeTree.position.y - this.y))
        {
            if (lifeTree.position.x > this.x)
            {
                dir = "right";
                tempX+=50;
                vines.push({x:tempX, y:tempY,});
                while (tempX>lifeTree.position.x+lifeTreeWidth/2)
                {
                    tempX+=100;
                    vines.push({x:tempX, y:tempY,});
                }
            }
            else
            {
                dir = "left";
                tempX-=50;
                vines.push({x:tempX, y:tempY,});
                while (tempX<lifeTree.position.x+lifeTreeWidth/2)
                {
                    tempX-=100;
                    vines.push({x:tempX, y:tempY,});
                }
            }
            if (lifeTree.position.y + lifeTreeHeight> tempY)
                while (lifeTree.position.y > tempY)
                {
                    tempY+=100;
                    vines.push({x:tempX, y:tempY,});
                }
            else
                while (lifeTree.position.y + lifeTreeHeight< tempY)
                {   
                    tempY-=100;
                    vines.push({x:tempX, y:tempY,});
                }
        }
        else
        {
            if (lifeTree.position.y + lifeTreeHeight> this.y)
            {
                dir = "down"
                tempY+=50;
                vines.push({x:tempX, y:tempY,});
                while (lifeTree.position.y + lifeTreeHeight> tempY)
                {
                    tempY+=100;
                    vines.push({x:tempX, y:tempY,});
                }
            }
            else
            {
                dir = "up"
                tempY-=50;
                vines.push({x:tempX, y:tempY,});
                while (lifeTree.position.y + lifeTreeHeight< tempY)
                {   
                    tempY-=100;
                    vines.push({x:tempX, y:tempY,});
                }
            }
            if (lifeTree.position.x+lifeTreeWidth/2 > tempX)
                while (tempX<lifeTree.position.x)
                {
                    tempX+=100;
                    vines.push({x:tempX, y:tempY,});
                }
            else
                while (tempX>lifeTree.position.x+lifeTreeWidth/2)
                {
                    tempX-=100;
                    vines.push({x:tempX, y:tempY,});
                }     
        }
        this.path=vines;
        this.dir=dir;
    }
    makeVines(){
        if (this.path == []&& this.nutrients == 100)
            this.nutrients--;
        else if (this.nutrients>50 && this.path != [])
        {
            if (this.vines.length == 0){
                let dir = "";
                let vine = this.path.shift();
                if (vine.x > this.path[0].x)
                    dir = "left";
                if (vine.x < this.path[0].x)
                    dir = "right";
                if (vine.y > this.path[0].y)
                    dir = "up";
                if (vine.y < this.path[0].y)
                    dir = "down";
                this.vines.push(new Vine(vine.x,vine.y,dir));
            }
            else if (this.vines[this.vines.length-1].nutrients==100)
            {
                let dir = ""
                let vine = this.path.shift();
                if (vine.x > this.path[0].x)
                    dir = "left";
                if (vine.x < this.path[0].x)
                    dir = "right";
                if (vine.y > this.path[0].y)
                    dir = "up";
                if (vine.y < this.path[0].y)
                    dir = "down";
                this.vines.push(new Vine(vine.x,vine.y,dir));
            }
            else 
                this.vines[this.vines.length-1].nutrients +=1;
        }
        else if (this.path != [])
            this.nutrients += 1;
    }
    draw(){
        
        c.fillStyle = 'yellow';
        if (this.dir == "up")
            c.fillRect(this.x-10 - center.x + canvas.width/2, this.y-10 - center.y + canvas.height/2 - this.nutrients, 20 , 20+ this.nutrients);
        if (this.dir == "down")
            c.fillRect(this.x-10 - center.x + canvas.width/2, this.y-10 - center.y + canvas.height/2, 20 , 20+ this.nutrients);
        if (this.dir == "left")
            c.fillRect(this.x-10 - center.x + canvas.width/2 - this.nutrients, this.y-10 - center.y + canvas.height/2 , 20 + this.nutrients, 20);
        if (this.dir == "right")
            c.fillRect(this.x-10 - center.x + canvas.width/2, this.y-10 - center.y + canvas.height/2, 20 + this.nutrients, 20);
        this.vines.forEach(a => a.draw());
    }
}
class Vine{
    constructor(x,y,dir){
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.nutrients = 0;
    }
    draw()
    {
        c.fillStyle = 'yellow';
        if (this.dir == "up")
            c.fillRect(this.x-10 - center.x + canvas.width/2, this.y-10 - center.y + canvas.height/2 - this.nutrients, 20 , 20+ this.nutrients);
        if (this.dir == "down")
            c.fillRect(this.x-10 - center.x + canvas.width/2, this.y-10 - center.y + canvas.height/2, 20 , 20+ this.nutrients);
        if (this.dir == "left")
            c.fillRect(this.x-10 - center.x + canvas.width/2 - this.nutrients, this.y-10 - center.y + canvas.height/2 , 20 + this.nutrients, 20);
        if (this.dir == "right")
            c.fillRect(this.x-10 - center.x + canvas.width/2, this.y-10 - center.y + canvas.height/2, 20 + this.nutrients, 20);
    }
    touchingPlayer()
    {
        
    }
}

function addWall(wall){
    let intersect = false;
    onScreenElements.forEach( a => {
        if (isIntersecting(a.position.x, a.position.x+a.width,a.position.y, a.position.y+a.height,wall.position.x1 - wall.thickness/2, wall.position.x2+wall.thickness/2,wall.position.y1 - wall.thickness/2, wall.position.y2 +wall.thickness/2,-6))
        {    
            intersect = true;
        }
    })
    if (intersect== true)
        return false;
    let start = 0, end = walls.length-1;
    while (start <= end){
        let mid =Math.floor((start+end)/2);
        if (walls[mid].id == wall.id) return false;
        else if (walls[mid].id < wall.id)
            start = mid+1;
        else
            end = mid-1;

    }
    

    walls.push(wall);
    wallsX.push(wall);
    wallsY.push(wall);
    wallsX.sort(compareX);
    wallsY.sort(compareY);
    walls.sort(compareID);
    return true;
}
function compareID (a,b)
{
    return a.id - b.id;
}
function compareX (a,b)
{
    return a.position.x - b.position.x;
}
function compareY (a,b)
{
    return a.position.y - b.position.y;
}
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
function generateRandomNumber() {
    const u1 = Math.random();
    const u2 = Math.random();

    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

    return z0;
}

function generateNormallyDistributedRandom(x,y)
{
    const mean = (x + y) / 2;
    const standardDeviation = (y - x) / 6; 

    let value = 0;
    do {

        value = generateRandomNumber()* standardDeviation + mean;
    } while (value < x || value > y);

    return Math.round(value);

}

function isIntersecting (ax1,ax2,ay1,ay2,bx1,bx2,by1,by2,margin)
{
    return !(ax2 < bx1 - margin || ax1 > bx2 + margin || ay1 > by2 + margin || ay2 < by1 - margin) 
}
function renderTiles()
{
    for(let x = Math.floor((center.x - canvas.width/2)/100)*100-100; x< Math.ceil((center.x + canvas.width/2)/100)*100+100; x+=100)
    {
        for(let y = Math.floor((center.y - canvas.height/2)/100)*100-100; y< Math.ceil((center.y + canvas.height/2)/100)*100+100; y+=100)
        {
            if (tiles.get( ""+x+"a"+y) == undefined)
            {
                let tempTile = new Tile(x,y,null);
                tempTile.makeID();
                tiles.set(tempTile.id, tempTile);
            }
            else
            {
                tiles.get(""+x+"a"+y).draw();
            }
        }
    }
    let i = 0;
    for (let x = p.position.x; i < 2; x+=50)
    {    
        let k = 0;
        for (let y=p.position.y; k < 2; y+=50)
        {
            if (tilesTouching.indexOf(tiles.get(""+Math.floor(x/100)*100+"a"+Math.floor(y/100)*100)) == -1)
                tilesTouching.push(tiles.get(""+Math.floor(x/100)*100+"a"+Math.floor(y/100)*100));
            k++;
        }
        i++;
    }
}
function animate()
{
    
    const start = performance.now();
    c.clearRect(0,0,canvas.width,canvas.height)
    renderTiles();

    onScreenElements.forEach(a=> {if(a!=null)
                                    a.draw()});

    
    p.draw();
    walls.forEach( a => a.draw());
    weeds.forEach( a => a.draw());

    p.actions();
    weeds.forEach(a => a.makeVines());

    
    drawElementsAfter.forEach(a=> a.draw());
    drawElementsAfter.length=0;
    onScreenElements.length=0;
    tilesTouching.length=0;


    const end = performance.now();
}
function gameSetUp()
{
    addEventListener("mouseup",mouseup);
    addEventListener("mousedown",mousedown);
    addEventListener("mousemove",follow);
    addEventListener("keyup",up);
    addEventListener("keydown",down);
    window.onload = window.onresize = resizeCanvas;
    setInterval(animate,16);
}
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}


let center = {x : 0,y : 0,}
let materials = {wood : 0}
let mouse = {x : 0,y : 0,}
const keys = new Map();
keys.set('a',false);
keys.set('d',false);
keys.set('s',false);
keys.set('w',false);
keys.set('t',false);
keys.set('r',false);
keys.set('mouse',false);
const tiles = new Map();
const ltree = [new LifeTree(10100,10100)];
const lifeTree = new Tile(10100,10100,ltree);
const t = []

for (let x =10000; x<10400; x+=100)
    for (let y = 10000; y<10400; y+=100)
        t.push(new Tile(x,y,[null]))
t.forEach(a=>{a.makeID();tiles.set(a.id,a)});
lifeTree.makeID();
tiles.set(lifeTree.id, lifeTree);

var canvas = document.querySelector('canvas');
var c =canvas.getContext("2d");

resizeCanvas();

const p = new Player(10000,10000);
const walls = [];
const wallsX = [];
const wallsY = [];
const flowers = [];
const weeds = [];
let onScreenElements = [];
let tilesTouching = [];
let drawElementsAfter = [];
//weeds.push(new Weed(10550,10550));
//weeds[0].makePath();
//weeds[0].makeVines();
gameSetUp();


