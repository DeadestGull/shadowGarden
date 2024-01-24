class Player {
    constructor(px, py) {
        this.position = {
            x:px,
            y:py,
        }
        this.width = 25;
        this.pheight= 25;
        this.height = 25;
        this.direction = "up";
        this.mode = "none";
        this.speed = 3;
        this.tempWall = new Wall(0,0,0,0,true,true,0),
        this.inPickUp = false;
        this.imageUp = [document.getElementById("player-up-s1"), document.getElementById("player-up-idle"), document.getElementById("player-up-s2"), document.getElementById("player-up-idle")];
        this.imageDown = [document.getElementById("player-down-s1"), document.getElementById("player-down-idle"), document.getElementById("player-down-s2"), document.getElementById("player-down-idle")];
        this.imageLeft = [document.getElementById("player-left-s1"), document.getElementById("player-left-idle"), document.getElementById("player-left-s2"), document.getElementById("player-left-idle")];
        this.imageLeftPickUp = [document.getElementById("player-left-idle"), document.getElementById("player-left-p2"), document.getElementById("player-left-p1"),document.getElementById("player-left-p2")];
        this.imageRight = [document.getElementById("player-right-s1"), document.getElementById("player-right-idle"), document.getElementById("player-right-s2"), document.getElementById("player-right-idle")]
        this.imageRightPickUp = [document.getElementById("player-right-idle"), document.getElementById("player-right-p2"), document.getElementById("player-right-p1"),document.getElementById("player-right-p2")];

        this.imageIndex = 1;
        this.lastImage = 0;
    }
    draw () {
        

        if (this.direction == "up")
            if (this.inPickUp)
                c.drawImage(this.imageUp[1], canvas.width/2 - this.width/2, canvas.height/2 - this.height/2 - 40);
            else
                c.drawImage(this.imageUp[this.imageIndex], canvas.width/2 - this.width/2, canvas.height/2 - this.height/2 - 40);
        else if (this.direction == "down")
            if (this.inPickUp)
                c.drawImage(this.imageDown[1], canvas.width/2 - this.width/2, canvas.height/2 - this.height/2 - 40);
            else
                c.drawImage(this.imageDown[this.imageIndex], canvas.width/2 - this.width/2, canvas.height/2 - this.height/2 - 40);
        else if (this.direction == "left")
            if (this.inPickUp&&this.imageIndex!=0)
                c.drawImage(this.imageLeftPickUp[this.imageIndex], canvas.width/2 - this.width/2 -19, canvas.height/2 - this.height/2 - 40);
            else if (this.inPickUp)
                c.drawImage(this.imageLeft[1], canvas.width/2 - this.width/2, canvas.height/2 - this.height/2 - 40);
            else
                c.drawImage(this.imageLeft[this.imageIndex], canvas.width/2 - this.width/2, canvas.height/2 - this.height/2 - 40);
        else if (this.direction == "right")
            if (this.inPickUp&&this.imageIndex!=0)
                c.drawImage(this.imageRightPickUp[this.imageIndex], canvas.width/2 - this.width/2 - 13, canvas.height/2 - this.height/2 - 40);
            else if (this.inPickUp)
                c.drawImage(this.imageRight[1], canvas.width/2 - this.width/2, canvas.height/2 - this.height/2 - 40);
            else
                c.drawImage(this.imageRight[this.imageIndex], canvas.width/2 - this.width/2, canvas.height/2 - this.height/2 - 40);
        else
        {
            c.fillStyle = 'red';
            c.fillRect( canvas.width/2 - this.width/2, canvas.height/2 - this.height/2, this.width, this.height);
        }
    }
    actions(walls) {
        this.move ();
        this.makeWalls();
    }
    drawWall ()
    {
        if (this.mode == "wall")
        {
            c.globalAlpha = .25;
            this.tempWall.draw();
            c.globalAlpha = 1;
        }
    }
    makeWalls ()
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
                console.log(this.tempWall.orientation);
            }

            if (this.tempWall.orientation == 0){
                this.tempWall.position.x1 = Math.round((mouse.x+center.x-canvas.width/2-100/2)/100)*100;
                this.tempWall.position.x2 = Math.round((mouse.x+center.x-canvas.width/2-100/2)/100)*100+100;
                this.tempWall.position.y1 = Math.round((mouse.y+center.y-canvas.height/2)/100)*100;
                this.tempWall.position.y2 = Math.round((mouse.y+center.y-canvas.height/2)/100)*100;
            }
            if (this.tempWall.orientation == 1){
                this.tempWall.position.x1 = Math.round((mouse.x+center.x-canvas.width/2)/100)*100;
                this.tempWall.position.x2 = Math.round((mouse.x+center.x-canvas.width/2)/100)*100;
                this.tempWall.position.y1 = Math.round((mouse.y+center.y-canvas.height/2-100/2)/100)*100;
                this.tempWall.position.y2 = Math.round((mouse.y+center.y-canvas.height/2-100/2)/100)*100+100;
            }


            if (keys.get("mouse")){
                this.tempWall.makeID();
                if (this.tempWall.touchingPlayer(this)==false&&addWall(this.tempWall))
                {
                    this.tempWall = new Wall(0,0,0,0,true,true,this.tempWall.orientation);
                }
            }
        }    
        
    }
    move()
    {
        //move
        let cx = this.position.x
        let cy = this.position.y
        if (movementKeys[0]=="d")//move right
            {this.position.x+=this.speed; this.direction = "right";}
        if (movementKeys[0]=="a")//move left
            {this.position.x-=this.speed; this.direction = "left"; }
        wallsX.forEach( a => a.collisionX(this));
        onScreenElements.forEach( a => {if(a!=null)a.collisionX(this)});
        if (movementKeys[0]=="w")//move up
            {this.position.y-=this.speed; this.direction= "up"; }
        if (movementKeys[0]=="s")//move down
            {this.position.y+=this.speed;this.direction = 'down'; }
        wallsY.forEach( a => a.collisionY(this)); 
        onScreenElements.forEach( a => {if(a!=null)a.collisionY(this)});

        center.x = this.position.x + this.width/2;
        center.y = this.position.y + this.height/2;

        if (this.lastImage++ > 20)
        {
            this.lastImage = 0;
            this.imageIndex ++;
            if (this.imageIndex == 4)
                this.imageIndex = 0;
        }
        if (!this.inPickUp&&cx == this.position.x && cy == this.position.y)
        {
            this.imageIndex=1;
            this.lastImage=0;
        }
    }
}
class Mana{
    constructor (x, y, vx, vy)
    {
        this.image = document.getElementById("mana");

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
        let temp = true
            weeds.forEach( a => a.vines.forEach(b => {
                    if (temp&&isIntersectingCircle(this.position.x,this.position.y, this.size/2, b.position.x1, b.position.y1, b.position.x2, b.position.y2))
                    {
                        temp = false;
                        a.reverseMeter += 40;
                    }
            }
            ));
            let tree = ltree[0];

            if (temp&&isIntersectingCircle(this.position.x, this.position.y, this.size/2, tree.position.x, tree.position.y, tree.position.x + tree.width, tree.position.y + tree.height))
            {
                tree.heal();
                temp = false;
            }
            if (!temp)
                mana.splice(mana.indexOf(this),1);
    }
    draw()
    {
        c.drawImage(this.image, this.position.x - center.x +canvas.width/2 - this.size/2,this.position.y - center.y +canvas.height/2-this.size/2);
    }
}
class Wall{
    constructor(px,py, px2, py2, see, touch, orientation) {
        this.orientation = orientation;
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
        this.height = 10;
        this.thickness = 10;
        this.health=150;

        this.image1 = document.getElementById("fence-across");

        this.image2 = document.getElementById("fence-up");
    }
    makeID()
    {

         this.id = parseInt(""+0+this.position.x1+this.position.y1+this.position.x2+this.position.y2);
         this.position.y = this.position.y2 + 10;
    }
    draw () {
        if (!(this.see==false))
        {
            if (this.orientation == 0)
                c.drawImage(this.image1, this.position.x1 - center.x +canvas.width/2, this.position.y1 - 25  - center.y +canvas.height/2);
            else
                c.drawImage(this.image2, this.position.x1 - 10 - center.x +canvas.width/2, this.position.y1  - center.y +canvas.height/2);
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
let nextTree = generateNormallyDistributedRandom(5,30);
let nextFlower = generateNormallyDistributedRandom(5,15);
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
        this.image = document.getElementById("grass");

        this.assignType();
    }
    draw()
    {
        c.drawImage(this.image, this.position.x - center.x +canvas.width/2,this.position.y - center.y +canvas.height/2);
        this.objects.forEach(a=> {if (a!=null) onScreenElements.push(a)});
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
            if (tiles.has(this.position.x+100+""+this.position.y) && tiles.get(this.position.x+100+""+this.position.y).objects == [])
                randX += Math.random()*100;
            if (tiles.has(this.position.x-100+""+this.position.y) && tiles.get(this.position.x-100+""+this.position.y).objects == [])
            {
                randX += Math.random()*100;
                randX -=50;
            }
            tempX +=randX;
            let temp = new Tree(tempX, tempY);
            if (!isIntersecting(tempX,tempX + temp.width, tempY, tempY + temp.height, ltree[0].position.x, ltree[0].position.x + ltree[0].height, ltree[0].position.y, ltree[0].position.y + ltree[0].height,10))
            {
                this.objects.push(temp);
            }
            lastTree = 0;
            nextTree = generateNormallyDistributedRandom(5,45);
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
            if (!isIntersecting(tempX,tempX + temp.width, tempY, tempY + temp.height, ltree[0].position.x, ltree[0].position.x + ltree[0].height, ltree[0].position.y, ltree[0].position.y + ltree[0].height,10))
                this.objects.push(temp);
            lastFlower = 0;
            nextFlower = generateNormallyDistributedRandom(5,15);
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
        this.image = document.getElementById("lifetree");

    }
    draw()
    {     
        c.drawImage(this.image, this.position.x - center.x +canvas.width/2,this.position.y - center.y +canvas.height/2-55);
    }
    heal()
    {
        this.health+=50;
        if (this.health > 1000)
            this.health = 1000;
    }
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
        this.pickupTime=79;
    }
    draw()
    {
        c.drawImage(this.image, this.position.x - center.x +canvas.width/2 -25,this.position.y - center.y +canvas.height/2 - 70);
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
                 for(let i =0; i<Math.floor(Math.random()*4+1);i++)
                 {
                    let deg = Math.random()*Math.PI*2;
                    icon.push(new Icon(this.position.x+25,this.position.y+20, Math.cos(deg)*1.5,Math.sin(deg)*1.5,50,50,"wood-icon"));
                 }
                if (this.health<=0)
                    tile.objects.splice(tile.objects.indexOf(this),1)
            }
            this.timer++;
            p.inPickUp = true;
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
        this.pickupTime=79;
        switch(Math.floor(Math.random()*3))
        {
            case 0:
                this.image = document.getElementById("blue_flower");
                this.id="blue_flower";
                break;
            case 1:
                this.image = document.getElementById("yellow_flower");
                this.id="yellow_flower";
                break;
            default:
                this.image = document.getElementById("pink_flower");
                this.id="pink_flower";
                break;
        }
    }
    collisionX(){}
    collisionY(){}
    draw()
    {  
        c.drawImage(this.image, this.position.x - center.x +canvas.width/2 ,this.position.y - center.y +canvas.height/2);
    }
    pickup(tile)
    {
        if(keys.get("e")&&isIntersecting(p.position.x , p.position.x+p.width , p.position.y , p.height+p.position.y , this.position.x , this.position.x+this.width,this.position.y , this.position.y+this.height, 2))
        {
            p.inPickUp = true;
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
                    let deg = Math.random()*Math.PI*2;
                    icon.push(new Icon(this.position.x+25,this.position.y+20, Math.cos(deg)*1.5,Math.sin(deg)*1.5,50,100,this.id));
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
        this.reverseMeter = 0;
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
       } 
        else 
        {
            if (this.position.x > tree.position.x)
                vines.push(new Vine(this.position.x, tree.position.x + tree.width/2, this.position.y - this.width/2, this.position.y + this.width/2, "left"))
            else
                vines.push(new Vine(this.position.x, tree.position.x + tree.width/2, this.position.y - this.width/2, this.position.y + this.width/2, "right"))
        }

        this.vines = vines;
    }
    makeVines(){
        let i = 0
        for (i=0; i<this.vines.length; i++)
        {

            
            if (!this.vines[i].isFull())
            {
                this.vines[i].update(1);
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
                let tree = ltree[0] 
                if (this.vines[i].isTarget()&&(this.vines[i].dir == "up"|| this.vines[i].dir== "down")&&this.vines.length<2)
                    if (this.position.x> tree.position.x)
                        this.vines.push(new Vine(this.position.x,tree.position.x+tree.width,tree.position.y+tree.height/2+this.width/2,tree.position.y+tree.height/2+this.width/2,"left"));
                    else
                        this.vines.push(new Vine(this.position.x,tree.position.x,tree.position.y+tree.height/2+this.width/2,tree.position.y+tree.height/2+this.width/2,"right"));
            else if (this.vines[i].isTarget()&&this.vines.length<2)
                if (this.position.y > tree.position.x)
                    this.vines.push(new Vine(tree.position.x + tree.width/2 - this.width, tree.position.x + tree.width/2 +this.width, this.position.y, tree.position.y + tree.height, "up"));
                else
                    this.vines.push(new Vine(tree.position.x + tree.width/2 - this.width + 10, tree.position.x + tree.width/2 +this.width + 10, this.position.y, tree.position.y, "down"));

                if (this.vines[i].nutrients<0)
                    this.vines.splice(this.vines.indexOf(this.vines[i]),1);
                break;
            }
        }
        if (this.vines.length==0)
            weeds.splice(weeds.indexOf(this),1);
        if (this.vines.length>0&&this.reverseMeter>0)
        {
            this.reverseMeter-=1;
            this.vines[this.vines.length-1].nutrients-=5;
        }
        if (i!=0&&i == this.vines.length)
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
        this.imageAcross =  document.getElementById("vine-across");
        this.imageUp =  document.getElementById("vine-up");

    }
    update(i)
    {
        this.nutrients+=i;
        if (this.dir == "up")
            this.position.y2 = this.position.y1 - this.nutrients;
        if (this.dir == "down")
            this.position.y2 = this.position.y1 + this.nutrients;
        if (this.dir == "left")
            this.position.x2 = this.position.x1 - this.nutrients;
        if (this.dir == "right")
            this.position.x2 = this.position.x1 + this.nutrients;
    
        }
    isTarget()
    {
        if (this.dir == "up"|| this.dir == "down")
            return this.position.y2 == this.target;
        else
            return this.position.x2 == this.target;
    }
    isFull()
    {
        if (this.dir == "up"||this.dir == "down")
            return (this.nutrients>=Math.abs(this.position.y1-this.target));
        return (this.nutrients>=Math.abs(this.position.x1-this.target));
    }
    draw()
    {
        let tempY = 0;
        let tempX = 0;
        let tempSize = this.nutrients;
        c.fillStyle = "yellow";
        switch(this.dir)
        {
            case "up":
                tempY = this.position.y2;
                while (tempSize > 100)
                {
                    c.drawImage(this.imageUp, this.position.x1- center.x +canvas.width/2, tempY- center.y +canvas.height/2);
                    tempY += 100;
                    tempSize -= 100;
                }
                c.drawImage(this.imageUp,0,0,20,tempSize, this.position.x1- center.x +canvas.width/2, tempY- center.y +canvas.height/2,this.width,tempSize)
                break;
            case "down":
                tempY = this.position.y1;
                while(tempSize>100)
                {
                    c.drawImage(this.imageUp, this.position.x1- center.x +canvas.width/2, tempY- center.y +canvas.height/2)
                    tempY += 100;
                    tempSize -= 100;
                }
                c.drawImage(this.imageUp,0,0,20,tempSize, this.position.x1- center.x +canvas.width/2, tempY- center.y +canvas.height/2,this.width,tempSize)
                break;
            case "left":
                tempX = this.position.x2; 
                while(tempSize>100)
                {
                    c.drawImage(this.imageAcross, tempX - center.x + canvas.width/2, this.position.y1 - center.y +canvas.height/2)
                    tempX +=100;
                    tempSize -=100;
                }
                c.drawImage(this.imageAcross, 0,0, tempSize,this.width, tempX - center.x + canvas.width/2, this.position.y1 - center.y +canvas.height/2,tempSize, this.width);
                break;    
            case "right":
                tempX = this.position.x1; 
                while(tempSize>100)
                {
                    c.drawImage(this.imageAcross, tempX - center.x + canvas.width/2, this.position.y1 - center.y +canvas.height/2)
                    tempX +=100;
                    tempSize -=100;
                }
                c.drawImage(this.imageAcross, 0,0, tempSize,this.width, tempX - center.x + canvas.width/2, this.position.y1 - center.y +canvas.height/2,tempSize, this.width);
                break;
        }
    }
}
const wallCost = 2;
class Icon
{
    constructor (x, y, vx, vy, tx, ty ,id)
    {
        this.image = document.getElementById(id);
        this.tx=tx;
        this.ty=ty;
        this.id=id;
        this.position = {
            x:x,
            y:y
        }
        this.velocity = {
            x:vx,
            y:vy
        }
    }
    move()
    {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.velocity.x < 0)
            this.velocity.x +=.015
        if (this.velocity.x > 0)
            this.velocity.x -=.015
        if (this.velocity.y < 0)
            this.velocity.y +=.015
        if (this.velocity.y > 0)
            this.velocity.y -=.015
        if(Math.abs(this.velocity.x)<.015)
        {
            this.velocity.x=0;
        }
        if(Math.abs(this.velocity.y)<.015)
        {
            this.velocity.y=0;
        }
        if (this.velocity.x == 0 && this.velocity.y == 0)
        {
            let yomom=Math.atan2(this.position.y-this.ty-center.y+canvas.height/2,this.position.x-this.tx-center.x+canvas.width/2);
            this.position.x-=Math.cos(yomom)*10;
            this.position.y-=Math.sin(yomom)*10;
            if(Math.abs(this.position.x-this.tx-center.x+canvas.width/2)<10 && Math.abs(this.position.y-this.ty-center.y+canvas.height/2)<10)
            {
                if(this.id=="wood-icon")
                    materials.wood++;
                else
                    materials.mana+=5;

                icon.splice(icon.indexOf(this),1);
            }
        }
    }
    draw()
    {
        if(this.id=="wood-icon")
            c.drawImage(this.image,this.position.x-center.x+canvas.width/2,this.position.y-center.y+canvas.height/2);
        else
            c.drawImage(this.image,0,0,40,40,this.position.x-center.x+canvas.width/2,this.position.y-center.y+canvas.height/2,30,30);
    }

}
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
    let a = ltree[0];
    if (isIntersecting(a.position.x, a.position.x+a.width,a.position.y, a.position.y+a.height,wall.position.x1 - wall.thickness/2, wall.position.x2+wall.thickness/2,wall.position.y1 - wall.thickness/2, wall.position.y2 +wall.thickness/2,-6))
    {   
        intersect = true;
    }
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

        
        mana.push(new Mana(p.position.x, p.position.y,vx,vy));
    }
}
function drawText()
{
    c.fillStyle = "black";
    c.font= "20px Impact";
    c.textAlign = "left";

    c.drawImage(document.getElementById("wood-icon"),20,32);
    c.drawImage(document.getElementById("mana"),0,0,40,40,22,82,25,25);

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
                tiles.get(""+x+"a"+y).objects.forEach(a=> {if (a!=null) a.pickup(tiles.get(""+x+"a"+y))});

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
    p.inPickUp = false;
    const start = performance.now();
    c.clearRect(0,0,canvas.width,canvas.height)
    
    renderTiles();
    mana.forEach( a=> a.move())
    weeds.forEach(a => a.makeVines());


    onScreenElements.forEach(a=> {if(a!=null)
                                    drawElements.push(a)});
    weeds.forEach( a => drawElements.push(a));

    drawElements.push(p)
    walls.forEach( a => drawElements.push(a));
    drawElements.sort(compareHeight);
    p.actions();

    drawElements.forEach(a => a.draw());
    
    


    icon.forEach(a=>a.move())
    icon.forEach(a=>a.draw())
    p.drawWall();
    mana.forEach(a=> a.draw());
    drawText();
    
    
    

    drawElements.length=0;
    onScreenElements.length=0;
    tilesTouching.length=0;
    manaDelay ++;

    if (life.health<=0)
    {
        c.fillStyle = 'red';
        c.fillRect(0,0,canvas.width, canvas.height);
        clearInterval(myInterval);
    }
    if (startTimer==false)
    {
        tutorial();
        addText();
    }
    else
        weedTimer();
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
    myInterval= setInterval(animate,16);
}
function compareHeight(a,b)
{  
    if (a.position.y + a.height > b.position.y + b.height)
        return 1;
    else
        return -1;
}
let startTimer = false;
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
        tutorialText("Gathering Flowers Gives You Mana", 150, false);
        tutorialStage+=.5
    }
    if (tutorialStage==16)
    {
        tutorialText("It Can Be Used For Healing Life Tree Along With Repelling The Weeds", 250 ,false)
        tutorialStage+=.5
    }
    if (tutorialStage==17)
    {
        tutorialText("Speaking of Weeds One Just Appeared", 150, true)
        weeds.push(new Weed(11050,10000));
        weeds[0].makePath();
        tutorialStage+=.5
        materials.mana = 100;
    }
    if (tutorialStage==18)
    {
        tutorialText("Quickly Deal With It By Going Next To It And Pressing F To Use Mana",50,false)

        if (weeds.length==0)
            tutorialStage +=.5
    }
    if (tutorialStage==19)
    {
        tutorialText("Thats Everything You Need To Know Good Luck Saving This Planet",250,false)
        tutorialStage+=.5

    }
    if (tutorialStage==20)
    {
        startTimer = true;
        tutorialStage++;
    }
}

let inbetween = 45;
let wave = 1;
let spawned = false
function weedTimer(){
    if (Math.ceil(inbetween-timer) + 1 == 0)
    {
        if (spawned == false)
        for (let i = 0; i < wave/1.5; i++)
        {
            let changeX = Math.random()*500 + 400;
            let changeY = Math.random()*500 + 400;

            changeX = Math.floor(changeX/10) *10;
            changeY = Math.floor(changeY/10) *10;
            let tempX = ltree[0].position.x;
            let tempY = ltree[0].position.y;
            if (Math.random()>.5)
                tempX-=changeX;
            else
                tempX +=changeX
            if (Math.random()>.5)
                tempY-=changeY;
            else
                tempY+=changeY
            weeds.push(new Weed(tempX,tempY));
            weeds[i].makePath();
        } 
        c.font= "bold 36px serif";
        c.textAlign = "right";
        c.fillText("Wave: "+wave,canvas.width-50,50);
        spawned= true;
        if (spawned&&weeds.length == 0)
        {
            spawned = false;
            timer = 0;
            wave++;
        }
    }
    else
    {
        c.font= "bold 36px serif";
        c.textAlign = "right";
        c.fillText("Next Wave In "+Math.ceil(inbetween-timer)+ " Seconds",canvas.width-50,50);    
        timer += .016;
    }
    

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

function isIntersectingCircle(Cx,Cy,Cr,X1,Y1,X2,Y2)
{
    if (X1 > X2)
        [X1, X2] = [X2,X1]
    if (Y1 > Y2)
        [Y1, Y2] = [Y2, Y1]
    var circle={x:Cx,y:Cy,r:Cr};
    var rect={x:X1,y:Y1,w:Math.abs(X2-X1),h:Math.abs(Y2-Y1)};

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
let timer = 0;
let chargeMana = 0;
const p = new Player(10000,10200);
const walls = [];
const wallsX = [];
const wallsY = [];
const flowers = [];
const weeds = [];
const mana = [];
const movementKeys = [];
const icon = [];
let onScreenElements = [];
let tilesTouching = [];
let drawElements = [];
let myInterval = null;
gameSetUp();