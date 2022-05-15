function hazard(x,y,ele, spawner){
	this.x = x;
	this.y = y;
	this.tx;
	this.ty;
	this.type = "hazard";
	this.ele = ele;
	this.spawner = spawner;
	this.dx = 0;
	this.dy = 0;
	this.sx;
	this.sy;
	this.life;
	this._type;
	this.isDead = false;
	this.damage = Math.round(this.spawner.random(45,95));
	this.bounds = {left:0,right:0,top:0,bottom:0};
	this.lastDecay = 0;
	this.lastExtra = 0;
	this.lastDirUpdate = 0;
	this.distance = 0;
	this.isChild = false;
	this.isColliding = false;
	this.setSpeed = function(xs,ys){
		this.sx = xs;
		this.sy = ys;
	};
	this.setType = function(type){
		this._type = type;
		this.ele.style.zIndex = 1000;
		switch(type){
			case "alert":
				this.ele.style.backgroundImage="url('alert.png')";
				this.ele.style.backgroundRepeat ="no-repeat";
				this.ele.style.backgroundSize="contain";
				this.ele.style.top = this.y;
				this.ele.style.left = this.x;
			break;
			case "doc":
				this.ele.style.backgroundImage="url('doc.png')";
				this.ele.style.backgroundRepeat ="no-repeat";
				this.ele.style.backgroundSize="contain";
				
				this.ele.setAttribute("id", "doc");
				this.ele.style.width = "431px";
				this.ele.style.height = "655px";
				if(this.spawner.random(1,10)  >= 5){
					this.ele.style.transform = "rotate(15deg)";
					this.ele.style.left = -250;
					this.ele.setAttribute("dir", "left");
				}
				else{
					this.ele.style.transform = "rotate(-15deg)";
					this.ele.style.left = winx - 150;
					this.ele.setAttribute("dir", "right");
				}
			break;
			case "plane":
				this.ele.style.backgroundImage="url('plane.png')";
				this.ele.style.backgroundRepeat ="no-repeat";
				this.ele.style.backgroundSize="contain";
				this.ele.style.top = this.y;
				this.ele.style.left = this.x;
				this.tx = this.spawner.game.pc.x;
				if(this.tx < this.x){
					this.ele.style.transform = "scaleX(-1)";
				}
				this.ty = this.spawner.game.pc.y;
				this.dx = (this.tx - this.x) > 0?1:-1;
				this.dy = (this.ty - this.y) >0?1:-1;
				this.sx = 10;
				this.sy = 10;
			break;
			case "virus":
				this.ele.style.backgroundImage = "url('virus.png')";
				this.ele.style.backgroundRepeat ="no-repeat";
				this.ele.style.backgroundSize="contain";
				this.ele.style.top = this.y;
				this.ele.style.left = this.x;
				this.ele.style.width = "30px";
				this.ele.style.height = "30px";
				this.tx = this.spawner.game.pc.x;
				this.ty = this.spawner.game.pc.y;
				this.sx = 8;
				this.sy = 8;
				this.distance = this.spawner.random(300,600);
			break;
			case "cereal":
				this.ele.style.backgroundImage = "url('cereal.png')";
				this.ele.style.backgroundRepeat ="no-repeat";
				this.ele.style.backgroundSize="contain";
				this.ele.style.top = this.y;
				this.ele.style.left = this.x;
				this.tx = this.spawner.game.pc.x;
				this.ty = this.spawner.game.pc.y;
				this.sx = 10;
				this.sy = 10;
				this.distance = this.spawner.random(200,500);
			break;
			default:
				console.log("Invalid option.");
			break;
		}
	}
	this.die = function(){
		if(!this.isDead){
			this.isDead = true;
			this.spawner.remove(this);
		}
	};
	this.expire = function(){
		if(this.spawner.game.getTimeValue > this.lastDecay){
			this.lastDecay = this.spawner.game.getTimeValue + 1000;
			this.life -= 1;
			if(this.life <= 0){
				this.life = 0;
				if(this._type == "cereal"){
					this.burst();
				}
				else{
					this.die();
				}
			}
		}
	};
	this.move = function(){
		switch(this._type){
			case "alert":
				if(!this.isDead){
					if(this.x < 0 || this.x > winx)
						this.dx *= -1;
					if(this.y < 0 || this.y > winy)
						this.dy *= -1;
					this.x += this.sx * this.dx;
					this.y += this.sy * this.dy;
					//this.ele.style.left = this.x;
					//this.ele.style.top = this.y;
					this.translate(this.x,this.y);
					this.bounds = this.ele.getBoundingClientRect();
					if(this.spawner.game.pc.intersect(this.bounds)){
						this.handleCollision();
					}
					else{
						this.isColliding = false;
					}
					this.expire();
				}
				break;
			case "doc":
				this.x = -400;
				this.y = winy *.5;
				this.expire();
				if(!this.isDead && this.spawner.game.getTimeValue > this.lastExtra){
					this.lastExtra = this.spawner.game.getTimeValue + this.spawner.random(1000, 2500);
					this.spawner.spawn("plane");
				}
			break;
			case "plane":
				if(this.spawner.game.getTimeValue > this.lastDirUpdate){
					this.lastDirUpdate = this.spawner.game.getTimeValue + 3000;
					this.tx = this.spawner.game.pc.x;
					this.ty = this.spawner.game.pc.y;
					this.dx = (this.tx - this.x) >=0?1:-1;
					this.dy = (this.ty - this.y) >=0?1:-1;
					this.expire();
					if(this.tx < this.x){
						this.ele.style.transform = "scaleX(-1)";
					}
					else{
						this.ele.style.transform = "scaleX(1)";
					}
				}
				this.x += this.sx * this.dx;
				this.y += this.sy * this.dy;
				//this.ele.style.left = this.x;
				//this.ele.style.top = this.y;
				this.translate(this.x,this.y);
				this.bounds = this.ele.getBoundingClientRect();
				if((this.x < 0 || this.x > winx) || (this.y < 0 || this.y > winy)){
					this.die();
				}
				if(this.spawner.game.pc.intersect(this.bounds)){
					this.handleCollision();
				}
				else{
					this.isColliding = false;
				}
			break;
			case "virus":
			case "cereal":
				if(this.spawner.game.getTimeValue > this.lastDirUpdate){
					this.lastDirUpdate = this.spawner.game.getTimeValue + 500;
					if(!this.isChild){
						this.tx = this.spawner.game.pc.x;
						this.ty = this.spawner.game.pc.y;
						this.dx = (this.tx - this.x) >=0?1:-1;
						this.dy = (this.ty - this.y) >=0?1:-1;
					}
					else{
						this.expire();
					}
				}
				this.distance -= (this.sx + this.sy)/2;
				if(this.distance <= 0){
					this.burst();
				}
				this.x += this.sx * this.dx;
				this.y += this.sy * this.dy;
				this.translate(this.x,this.y);
				this.bounds = this.ele.getBoundingClientRect();
				if((this.x < 0 || this.x > winx) || (this.y < 0 || this.y > winy)){
					this.burst();
				}
				if(this.spawner.game.pc.intersect(this.bounds)){
					this.handleCollision();
					this.burst();
				}
				else{
					this.isColliding = false;
				}
			break;
			default:
				console.log("Invalid type in move");
			break;
		}
	};
	this.handleCollision = function(){
		if(!this.isColliding){
			this.isColliding = true;
			this.spawner.game.pc.handleDamage(this.damage);
		}
	};
	this.burst = function(){
		if(!this.isChild){
			this.spawner.lastBurstPos = {x:this.x,y:this.y};
			this.spawner.spawn(this._type=="virus"?"virus:burst":"cereal:burst");
		}
		this.die();
	};
	this.translate = function(x,y){
		this.ele.style.left = this.x + "px";
		this.ele.style.top = this.y + "px";
		//overrides the transform rotate
		/*this.ele.style["-webkit-transform"] = "translate("+x+"px, "+ y +"px)";
		this.ele.style["-moz-transform"] = "translate("+x+"px, "+ y +"px)";
		this.ele.style["-ms-transform"] = "translate("+x+"px, "+ y +"px)";
		this.ele.style["-o-transform"] = "translate("+x+"px, "+ y +"px)";
		this.ele.style["transform"] = "translate("+x+"px, "+ y +"px)";*/
	};
	this.intersect = function(p){
		var hit = !(p.left > this.bounds.right || 
				p.right < this.bounds.left || 
				p.top > this.bounds.bottom ||
				p.bottom < this.bounds.top);
		
		this.ele.style.borderColor = hit?"red":"black";
		if(this.isDead){
			return false;
		}
		if(hit){
			this.die();
		}
		return hit;
	};
}