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
    move()
    {
        //move
        if (movementKeys[0]=="d")//move right
            {this.position.x+=this.speed; this.direction = "right";}
        if (movementKeys[0]=="a")//move left
            {this.position.x-=this.speed; this.direction = "left";}
        wallsX.forEach( a => a.collisionX(this));
        onScreenElements.forEach( a => {if(a!=null)a.collisionX(this)});
        if (movementKeys[0]=="w")//move up
            {this.position.y-=this.speed; this.direction= "up";}
        if (movementKeys[0]=="s")//move down
            {this.position.y+=this.speed;this.direction = 'down';}
        wallsY.forEach( a => a.collisionY(this)); 


        onScreenElements.forEach( a => {if(a!=null)a.collisionY(this)});

        center.x = this.position.x + this.width/2;
        center.y = this.position.y + this.height/2;
    }
}
class Mana{
    constructor (x, y, vx, vy)
    {
        this.position = {
            x:x,
            y:y
        }
        this.velocity = {
            x:vx,
            y:vy
        }
        this.size = 25;
        this.timer = 0;

    }
    move()
    {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.velocity.x < 0)
            this.velocity.x +=.01
        if (this.velocity.x > 0)
            this.velocity.x -=.01
        if (this.velocity.y < 0)
            this.velocity.y +=.01
        if (this.velocity.y > 0)
            this.velocity.y -=.01
        if (this.velocity.x == 0 && this.velocity.y == 0)
        {
            this.timer++;
            if (this.timer >=250)
                mana.splice(mana.indexOf(this),1);
        }
        if (Math.abs(this.velocity.x) < .02)
            this.velocity.x = 0;
        if (Math.abs(this.velocity.y) < .02)
            this.velocity.y = 0;
        
    }
    draw()
    {
        c.fillStyle = "blue";
        c.beginPath();
        c.arc(this.position.x- center.x +canvas.width/2, this.position.y- center.y +canvas.height/2, this.size/2, 0, Math.PI*2);
        c.fill();
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
                movementKeys.length = 0;
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
    if (materials.mana>=5)
    {
        manaDelay = 0;
        materials.mana -= 5;
        let vx = 0;
        let vy = 0;
        if (p.direction == "up")
            vy = -2;
        if (p.direction == "down")
            vy = 2;
        if (p.direction == "left")
            vx = -2;
        if (p.direction == "right")
            vx = 2;
        if (vy==0)
            vy=Math.random()*1.5-.75
        else
            vy+=(Math.random()/4-.125)    
        if (vx==0)
            vx=Math.random()*1.5-.75
        else
            vx+=(Math.random()/4-.125)    

        
        console.log(p.position.x, p.position.y,vx,vy);
        mana.push(new Mana(p.position.x, p.position.y,vx,vy));
    }
}
function drawText()
{
    c.fillStyle = "black";
    c.font= "25px Impact";
    c.textAlign = "left";

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
    while (movementKeys.indexOf(event.key.toLowerCase())>-1)
    {
        movementKeys.splice(movementKeys.indexOf(event.key.toLowerCase()),1)
    }
    keys.set(event.key.toLowerCase(),false);
    
}
let manaDelay = 0;
function down (event)
{
    if(!event.repeat)
    {
        if (event.key.toLowerCase() == 'a' || event.key.toLowerCase() == 's' || event.key.toLowerCase() == 'd' || event.key.toLowerCase() == 'w')
        {
            movementKeys.unshift(event.key.toLowerCase());
        }
        keys.set(event.key.toLowerCase(),true);

    }
    if (event.key.toLowerCase() == 'f' && manaDelay > 7)
        shootMana();
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
let temp = 0;
function animate()
{
    
    const start = performance.now();
    c.clearRect(0,0,canvas.width,canvas.height)
    
    renderTiles();
    mana.forEach( a=> a.move())
    p.actions();
    weeds.forEach(a => a.makeVines());

    onScreenElements.forEach(a=> {if(a!=null)
                                    a.draw()});

    
    p.draw();
    walls.forEach( a => a.draw());
    weeds.forEach( a => a.draw());



    
    drawElementsAfter.forEach(a=> a.draw());
    p.drawWall();
    mana.forEach(a=> a.draw());
    drawText();
    tutorial();
   
    drawElementsAfter.length=0;
    onScreenElements.length=0;
    tilesTouching.length=0;
    manaDelay ++;

    if (life.health<=0)
    {
        c.fillStyle = 'red';
        c.fillRect(0,0,canvas.width, canvas.height);
        clearInterval(myInterval);
    }
    addText ()
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
function tutorial()
{
    if (tutorialStage==0)
    {
        tutorialStage+=.5;
        tutorialText("Welcome To Shadow Garden!", 100,false);
    }
    if (tutorialStage==1)
    {
        tutorialStage+=.5;
        tutorialText("This Magical Tree Give Life This World", 100,false);
    }
    if (tutorialStage==2)
    {
        tutorialStage+=.5;
        tutorialText("But Weeds Are Trying To Drain Its Energy", 100,false);
    }
    if (tutorialStage==3)
    {
        tutorialStage+=.5;
        tutorialText("Your Job Is To Ward Of The Weeds", 100 ,false);
    }
    if (tutorialStage==4)
    {
        tutorialText("Use WASD To Move", 150, true);
        if (keys.get("a")||keys.get("s")||keys.get("d")||keys.get("w"))
            tutorialStage+=.5;
    }
    if (tutorialStage==5)
    {
        tutorialStage+=.5;
        tutorialText("Lets Learn How To Harvest Wood", 150, false);
        temp = materials.wood;
    }
    if (tutorialStage==6)
    {
        tutorialText("Travel To A Tree And Hold E", 50, true);
        if (materials.wood>temp)
        {
            tutorialStage+=.5;
            keys.set("e",false);
        }
    }
    if (tutorialStage==7)
    {
        tutorialStage+=.5;
        tutorialText("A Tree Can Be Harvest A Few Times Before Breaking", 150, false)
    }
    if (tutorialStage==8)
    {
        tutorialText("Now Harvest 5 Wood", 50, true)
        if (materials.wood>=5)
            tutorialStage+=.5;
    }
    if (tutorialStage==9)
    {
        tutorialText("To Build A Wall Press Q", 25, true)
        if (p.mode=="wall")
            tutorialStage+=.5
    }
    if (tutorialStage==10)
    {
        tutorialText("Now Move Your Mouse To Position The Walls Then Click To Place", 45, true)
        if (walls.length>0)
            tutorialStage+=.5;
    }
    if (tutorialStage==11)
    {
        tutorialText("Walls Can Be Also Rotated When Placing By Pressing R", 50, true)
        if (p.tempWall.orientation == 1)
            tutorialStage+=.5
    }
    if (tutorialStage==12)
    {
        tutorialText("To Stop Building Walls Press Q Again", 50, true)
        if (p.mode!="wall")
            tutorialStage+=.5
    }
    if (tutorialStage==13)
    {
        tutorialText("Now Lets Harvest Flowers", 50, false)
        tutorialStage+=.5
        temp = materials.mana;
    }
    if (tutorialStage==14)
    {
        tutorialText("Travel to A Flower And Hold E", 50, true)
        if (materials.mana> temp)
            tutorialStage+=.5;
    }
    if (tutorialStage==15)
    {
        tutorialText("Gathering Flowers Gives You Mana That Can Be Used For Many Things", 150, false);
        tutorialStage+=.5
    }
    if (tutorialStage==16)
    {
        tutorialText("It Can Be Used For Healing Walls And The Life Tree Along With Warding Off The Weeds", 250 ,false)
        tutorialStage+=.5
    }
    if (tutorialStage==17)
    {
        tutorialText("Speaking of Weeds One Just Appeared", 150, false)
        tutorialStage+=.5
        materials.mana = 100;
    }
    if (tutorialStage==18)
    {
        tutorialText("Quickly Deal With It By Going Next To It And Pressing F To Use Mana",50,true)
        if (weeds.length==0)
            tutorialStage +=.5
    }
    if (tutorialStage==20)
    {
        tutorialText("You Have Time Before The Next Wave Of Weeds Shown ->",150,false)
        tutorialStage+=.5;
    }
    if (tutorialStage==20)
    {
        tutorialText("If You Ever Forget The Controls Press Esc", 150 ,false)
        tutorialStage+=.5;
    }
    if (tutorialStage==21)
    {
        tutorialText("Best Of Luck", 150 ,false)
        tutorialStage+=.5;
    }
    if (tutorialStage==22)
    {
        startWeedTimer();
    }
}
function startWeedTimer(){

}
let text = "";
let complete = false; 
function addText ()
{
    if (frames < endFrame || !complete)
    {
        c.fillStyle = "black";
        c.font= "bold 36px serif";
        c.textAlign = "center";
        c.fillText(text,canvas.width/2,50);
        frames++;
        if (frames > endFrame){
            c.font= "bold 24px serif";
            c.fillText("Click to Continue",canvas.width/2,85);
        }
        if (frames >= endFrame && keys.get("mouse"))
            complete = true;
            
        
    }
    if (complete && frames >= endFrame)
    {
        complete=false;
        tutorialStage++;
        tutorialStage=Math.floor(tutorialStage);
        console.log(tutorialStage)
    }
}
let frames = 0;
let endFrame = 0;
function tutorialText (t,f,c)
{
    frames = 0;
    endFrame = f;
    text = t
    complete=c;
    
}
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

function RectCircleColliding(Cx,Cy,Cr,X1,Y1,X2,Y2)
{
    var circle={x:Cx,y:Cy,r:Cr};
    var rect={x:X1,y:Y1,w:Math.abs(X1-X2),h:Math.abs(Y1-Y2)};
    
    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
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
keys.set('q',false);
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

let tutorialStage = 0;

resizeCanvas();
let chargeMana = 0;
const p = new Player(10000,10000);
const walls = [];
const wallsX = [];
const wallsY = [];
const flowers = [];
const weeds = [];
const mana = [];
const movementKeys = [];
let onScreenElements = [];
let tilesTouching = [];
let drawElementsAfter = [];
let myInterval = null;
//weeds.push(new Weed(9550,9000));
//weeds[0].makePath();
//weeds[0].makeVines();
gameSetUp();


