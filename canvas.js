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
    drawWall ()
    {
        if (this.mode == "wall")
        {
            c.globalAlpha = .25;
            this.tempWall.wall.draw();
            c.globalAlpha = 1;
        }
    }
    makeWalls (walls)
    {
        if (keys.get("q")){
            if (this.mode!="wall")
                this.mode = "wall";
            else
                this.mode = "none";
            keys.set("q",false);
            keys.set('mouse',false);
        }
        
        if (this.mode == "wall")
        {
            if (keys.get("r"))
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


            if (keys.get("mouse")){
                this.tempWall.wall.makeID();
                if (this.tempWall.wall.touchingPlayer(this)==false&&addWall(this.tempWall.wall))
                {
                    this.tempWall.wall = new Wall();
                }
            }
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
        if (keys.get("d") && keys.get("a")==false)//move right
            this.position.x+=this.speed;
        if (keys.get("a") && keys.get("d")==false)//move left
            this.position.x-=this.speed;
        wallsX.forEach( a => a.collisionX(this));
        onScreenElements.forEach( a => {if(a!=null)a.collisionX(this)});
        if (keys.get("w") && keys.get("s")==false)//move up
            this.position.y-=this.speed;
        if (keys.get("s") && keys.get("w")==false)//move down
            this.position.y+=this.speed;
        wallsY.forEach( a => a.collisionY(this)); 
        onScreenElements.forEach( a => {if(a!=null)a.collisionY(this)});

        center.x = this.position.x + this.width/2;
        center.y = this.position.y + this.height/2;
    }
}
class Mana{
    constructor (x,y, size, vx, vy)
    {
        this.position = {
            x:x,
            y:y,
        }
        this.velocity = {
            x:vx,
            y:vy,
        }
        this.size = size;
    }
    move()
    {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    isTouching()
    {

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
        this.health=150;
        
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
let nextTree = generateNormallyDistributedRandom(20,25);
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
        this.objects.forEach(a=> {if (a!=null) onScreenElements.push(a)});

        this.objects.forEach(a=> {if (a!=null) a.pickup(this)});
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
            if (!isIntersecting(lifeTree.position.x , lifeTree.position.x+lifeTree.width , lifeTree.position.y , lifeTree.height+lifeTree.position.y , temp.position.x , temp.position.x+temp.width,temp.position.y , temp.position.y+temp.height, 10))
                this.objects.push(temp);
            lastTree = 0;
            nextTree = generateNormallyDistributedRandom(20,25);
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
            let randY = Math.random()*75;
            tempY += randY;
            tempX +=randX;
            let temp = new Flower(tempX, tempY);
            if (!isIntersecting(lifeTree.position.x , lifeTree.position.x+lifeTree.width , lifeTree.position.y , lifeTree.height+lifeTree.position.y , temp.position.x , temp.position.x+temp.width,temp.position.y , temp.position.y+temp.height, 10))
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
        this.health = 1000;
    }
    draw()
    {     
        if (this.position.y+this.size<p.position.y+p.height||drawElementsAfter.indexOf(this)>-1)
        {        
            c.strokeStyle = 'rgb(52,141,44)';
            c.strokeRect(this.position.x  - center.x +canvas.width/2 , this.position.y - center.y +canvas.height/2, this.width, this.height);
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
    pickup(){}
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
        this.health = 5;
        this.image = document.getElementById("tree");
        this.timer=0;
        this.pickupTime=100;
    }
    draw()
    {
        if (this.position.y+this.size<p.position.y+p.height||drawElementsAfter.indexOf(this)>-1)
        {        
            c.drawImage(this.image, this.position.x - center.x +canvas.width/2 -25,this.position.y - center.y +canvas.height/2 - 70);
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
    pickup(tile){
        if(keys.get("e")&&isIntersecting(p.position.x , p.position.x+p.width , p.position.y , p.height+p.position.y , this.position.x , this.position.x+this.width,this.position.y , this.position.y+this.height, 10))
        {
            if (this.timer==0)
            {
                keys.set("w",false);
                keys.set("a",false);
                keys.set("s",false);
                keys.set("d",false);
            }
            if (keys.get("w")||keys.get('a')||keys.get("s")||keys.get('d'))
                keys.set("e",false)
            if (this.timer>=this.pickupTime)
            {
                this.health--;
                this.timer=0;
                materials.wood += Math.floor(Math.random()*4+1);
                if (this.health<=0)
                    tile.objects.splice(tile.objects.indexOf(this),1)
            }
            this.timer++;
        }
        else
            this.timer = 0;
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
        this.width= 40;
        this.height=40;
        this.pickupFrames = 150;
        this.isTouchingPlayer = false;
        this.timer=0;
        this.pickupTime=100;
        switch(Math.floor(Math.random()*3))
        {
            case 0:
                this.image = document.getElementById("blue_flower");
                break;
            case 1:
                this.image = document.getElementById("yellow_flower");
                break;
            default:
                this.image = document.getElementById("pink_flower");
                break;
        }
    }
    collisionX(){}
    collisionY(){}
    draw()
    {
        if (this.position.y+this.size<p.position.y+p.height||drawElementsAfter.indexOf(this)>-1)
        {        
            c.fillStyle = "red";
            c.drawImage(this.image, this.position.x - center.x +canvas.width/2 ,this.position.y - center.y +canvas.height/2);
        }
        else
            drawElementsAfter.push(this);
    }
    pickup(tile)
    {
        if(keys.get("e")&&isIntersecting(p.position.x , p.position.x+p.width , p.position.y , p.height+p.position.y , this.position.x , this.position.x+this.width,this.position.y , this.position.y+this.height, 2))
        {
            if (this.timer==0)
            {
                keys.set("w",false);
                keys.set("a",false);
                keys.set("s",false);
                keys.set("d",false);
            }
            if (keys.get("w")||keys.get('a')||keys.get("s")||keys.get('d'))
                keys.set("e",false)
            if (this.timer>=this.pickupTime)
            {
                    tile.objects.splice(tile.objects.indexOf(this),1)
                    this.timer=0;
                    keys.set("e",false);
                    materials.mana+=10;
            }
            this.timer++;

        }
        else
            this.timer=0;
    }
}
class Weed{
    constructor(x,y) {
        this.nutrients = 0;
        this.path, this.dir = undefined; 
        this.position ={
            x:x,
            y:y,
        }
        this.vines = [];
        this.width = 20;
    }
    makePath(){
        let vines = [];
        let tree = lifeTree.objects[0];

        if (Math.abs(this.position.y - tree.position.y)>=Math.abs(this.position.x - tree.position.x))
        {
            if (this.position.y > tree.position.y)
                vines.push(new Vine(this.position.x-this.width/2,this.position.x+this.width/2,this.position.y,tree.position.y+tree.height/2+this.width/2,"up"));
            else
                vines.push(new Vine(this.position.x-this.width/2,this.position.x+this.width/2,this.position.y,tree.position.y+tree.height/2+this.width/2+20,"down"));
            if (this.position.x> tree.position.x)
                vines.push(new Vine(this.position.x,tree.position.x+tree.width,tree.position.y+tree.height/2+this.width/2,tree.position.y+tree.height/2+this.width/2,"left"));
            else
                vines.push(new Vine(this.position.x,tree.position.x,tree.position.y+tree.height/2+this.width/2,tree.position.y+tree.height/2+this.width/2,"right"));

        } 
        else 
        {
            if (this.position.x > tree.position.x)
            {

            }
            else
            {

            }
        }        

        this.vines = vines;
    }
    makeVines(){
        let i = 0
        for (i=0; i<this.vines.length; i++)
        {
            if (!this.vines[i].isFull())
            {
                this.vines[i].update();
                let intersect =false;
                walls.forEach(a => {    
                    if(isIntersecting(this.vines[i].position.x1,this.vines[i].position.x2,this.vines[i].position.y1, this.vines[i].position.y2, a.position.x1-a.thickness/2, a.position.x2+a.thickness/2, a.position.y1-a.thickness/2, a.position.y2+a.thickness/2,0))
                    {
                        a.health--;
                        if (a.health<=0)
                        {
                            walls.splice(walls.indexOf(a),1);
                            wallsX.splice(wallsX.indexOf(a),1);
                            wallsY.splice(wallsY.indexOf(a),1);

                        }
                        intersect=true;
                    }
                 });
                 if (intersect)
                 this.vines[i].nutrients--;
                break;
            }
        }
        if (i == this.vines.length)
            life.health--;
    }
    draw(){
        this.vines.forEach(a => {if(a.nutrients!=20) a.draw()});
    }
}
class Vine{
    constructor(x1,x2,y1,y2,dir)
    {
        if (dir=="up"||dir == "down")
        {
            this.position = {
                x1:x1,
                x2:x2,
                y1:y1,
                y2:y1,
            }
            this.target = y2;
        }
        else
        {
            this.position = {
                x1:x1,
                x2:x1,
                y1:y1,
                y2:y2,
            }
            this.target = x2;
        }
        this.dir = dir;
        this.nutrients = 20;
        this.width = 20; 
    }
    update()
    {
        this.nutrients++;
        if (this.dir == "up")
            this.position.y2 = this.position.y1 - this.nutrients;
        if (this.dir == "down")
            this.position.y2 = this.position.y1 + this.nutrients;
        if (this.dir == "left")
            this.position.x2 = this.position.x1 - this.nutrients;
        if (this.dir == "right")
            this.position.x2 = this.position.x1 + this.nutrients;
    
        }
    isFull()
    {
        if (this.dir == "up"||this.dir == "down")
            return (this.nutrients>=Math.abs(this.position.y1-this.target));
        return (this.nutrients>=Math.abs(this.position.x1-this.target));
    }
    draw()
    {
        c.fillStyle = "yellow";
        switch(this.dir)
        {
            case "up":
                c.fillRect(this.position.x1- center.x +canvas.width/2, this.position.y2- center.y +canvas.height/2, this.width, this.nutrients);
                break;
            case "down":
                c.fillRect(this.position.x1- center.x +canvas.width/2, this.position.y1- center.y +canvas.height/2, this.width, this.nutrients);
                break;
            case "left":
                c.fillRect(this.position.x2- center.x +canvas.width/2 , this.position.y1- center.y +canvas.height/2, this.nutrients, this.width);
                break;    
            case "right":
                c.fillRect(this.position.x1- center.x +canvas.width/2 , this.position.y1- center.y +canvas.height/2, this.nutrients, this.width); 
                break;
        }
    }
}
const wallCost = 0;

function addWall(wall){
    if (materials.wood<wallCost)
        return false;
    let intersect = false
    weeds.forEach( a => {
        a.vines.forEach(b => {
            if (b.nutrients>20){
                if(isIntersecting(b.position.x1,b.position.x2,b.position.y1, b.position.y2, wall.position.x1 - wall.thickness/2, wall.position.x2+wall.thickness/2,wall.position.y1 - wall.thickness/2, wall.position.y2 +wall.thickness/2,0))
                    intersect = true;
            }
        })
    })
    if (intersect)
        return false
    onScreenElements.forEach( a => {
        if (isIntersecting(a.position.x, a.position.x+a.width,a.position.y, a.position.y+a.height,wall.position.x1 - wall.thickness/2, wall.position.x2+wall.thickness/2,wall.position.y1 - wall.thickness/2, wall.position.y2 +wall.thickness/2,-6))
        {   
            intersect = true;

        }
    })
    if (intersect)
    return false
    let start = 0, end = walls.length-1;
    while (start <= end){
        let mid =Math.floor((start+end)/2);
        if (walls[mid].id == wall.id) return false;
        else if (walls[mid].id < wall.id)
            start = mid+1;
        else
            end = mid-1;

    }
    
    materials.wood-=wallCost;
    walls.push(wall);
    wallsX.push(wall);
    wallsY.push(wall);
    wallsX.sort(compareX);
    wallsY.sort(compareY);
    walls.sort(compareID);
    return true;
}
function shootMana()
{
    if (materials.mana>5)
    {

    }
}
function drawText()
{
    c.fillStyle = "black";
    c.font= "25px Impact";
    c.fillText(": "+materials.wood,50,50);
    c.fillText(": "+materials.mana,50,100);

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
    if (event.key.toLowerCase() == 'f')
        shootMana();
}
function down (event)
{
    if(!event.repeat)
        keys.set(event.key.toLowerCase(),true);
    if (event.key.toLowerCase() == 'f')
        chargeMana++;
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
    if (ax1 > ax2)
        [ax1, ax2] = [ax2,ax1]
    if (ay1 > ay2)
        [ay1, ay2] = [ay2, ay1]
    if (bx1 > bx2)
        [bx1, bx2] = [bx2, bx1]
    if (by1 > by2)
        [by1, by2] = [by2, by1]
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
    
    p.actions();
    weeds.forEach(a => a.makeVines());

    onScreenElements.forEach(a=> {if(a!=null)
                                    a.draw()});

    
    p.draw();
    walls.forEach( a => a.draw());
    weeds.forEach( a => a.draw());



    
    drawElementsAfter.forEach(a=> a.draw());
    p.drawWall();

    drawText();

    drawElementsAfter.length=0;
    onScreenElements.length=0;
    tilesTouching.length=0;

    if (life.health<=0)
    {
        c.fillStyle = 'red';
        c.fillRect(0,0,canvas.width, canvas.height);
        clearInterval(myInterval);
    }

    const end = performance.now();
    //console.log(end-start);
}
function gameSetUp()
{
    addEventListener("mouseup",mouseup);
    addEventListener("mousedown",mousedown);
    addEventListener("mousemove",follow);
    addEventListener("keyup",up);
    addEventListener("keydown",down);
    window.onload = window.onresize = resizeCanvas;
    myInterval= setInterval(animate,16);
}
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}


let center = {x : 0,y : 0,}
let materials = {wood : 0, mana: 0}
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
const life = ltree[0];
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
let chargeMana = 0;
const p = new Player(10000,10000);
const walls = [];
const wallsX = [];
const wallsY = [];
const flowers = [];
const weeds = [];
let onScreenElements = [];
let tilesTouching = [];
let drawElementsAfter = [];
let myInterval = null;
weeds.push(new Weed(9550,9000));
weeds[0].makePath();
weeds[0].makeVines();
gameSetUp();


