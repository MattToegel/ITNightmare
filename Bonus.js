function Bonus(x, y, ele, spawner){
	this.x = x;
	this.y = y;
	this.type="bonus";
	this.dx = 1;
	this.dy = -1;//negative is up
	this.sx = 15;
	this.sy = 15;
	this.ele = ele;
	this._type = "";
	this.center = {x:0,y:0};
	this.spawner = spawner;
	this.lastDecay = 0;
	this.life;
	this.damage = Math.ceil(1+(5 * ((this.spawner.game.getTimeValue - this.spawner.game.startTime)/30000)) + this.spawner.game.pc.bonusDamage);//increases every 30 seconds
	this.fireDelay = 0;
	this.lastFire = 0;
	this.Bonus = function(){
		this.life = this.spawner.random(5,45);
		this.fireDelay = this.spawner.random(500, 5000);
		this._type = this.ele.getAttribute("bonusType");
		this.ele.className += "bonus";
		this.ele.style.backgroundSize = "100% 100%";
		this.ele.style.backgroundRepeat ="no-repeat";
		this.ele.style.backgroundImage="url('server.png')";
		switch(this._type){
			case "server":
				this.ele.style.backgroundImage="url('server.png')";
				this.ele.style.width = "40px";
				this.ele.style.height = "40px";
				this.ele.style.left = this.spawner.game.mousePos.x;//can use this since it's player's position when powerup is used
				this.ele.style.top = this.spawner.game.mousePos.y;
			break;
			default:
			break;
		}
		
		this.bounds = this.ele.getBoundingClientRect();
		return true;
	}
	this.loaded = this.Bonus();
	this.bounds = {left:0,right:0,top:0,bottom:0};
	this.setSpeed = function(x,y){
		this.sx = x;
		this.sy = y;
	};
	this.die = function(){
		if(this._type == "missle" && !this.outOfBounds){
			if(this.spawner.game.getTimeValue > this.lastCollisionCheck){
				this.lastCollisionCheck = this.spawner.game.getTimeValue + this.collisionCheckDelay;
				this.collisions++;
				if(this.collisions > this.maxCollisions){
					this.spawner.remove(this);
				}
			}
		}
		else{
			this.spawner.remove(this);
		}
	};
	this.expire = function(){
		if(this.spawner.game.getTimeValue > this.lastDecay){
			this.lastDecay = this.spawner.game.getTimeValue + 1000;
			this.life -= 1;
			if(this.life <= 0){
				this.life = 0;
				
				this.die();
			}
		}
	};
	this.move = function(){
		this.expire();
		if(this.ele !== undefined){
			if(this._type == "server"){
				if(this.spawner.game.getTimeValue > this.lastFire){
					this.lastFire = this.spawner.game.getTimeValue + this.fireDelay;
					this.spawner.shooterPos = {x:this.x+20, y:this.y};
					this.spawner.spawn("disc");
				}
			}
			else{
				this.x += this.dx * this.sx;
				this.y += this.dy * this.sy;
				this.translate(this.x, this.y);
				this.bounds = this.ele.getBoundingClientRect();
				if((this.x < -300 || this.x  > winx+300) || (this.y < -300 || this.y > winy+300)){
					this.outOfBounds = true;
					this.die();
				}
				else{
				}
			}
		}
		
		
	};
	this.translate = function(x,y){
		this.ele.style.left = this.x + "px";
		this.ele.style.top = this.y + "px";
		this.center.x = this.x + (this.ele.style.width.substring(0,-2)*.5);
		this.center.y = this.y + (this.ele.style.height.substring(0,-2)*.5);
		//overrides the transform rotate
		/*this.ele.style["-webkit-transform"] = "translate("+x+"px, "+ y +"px)";
		this.ele.style["-moz-transform"] = "translate("+x+"px, "+ y +"px)";
		this.ele.style["-ms-transform"] = "translate("+x+"px, "+ y +"px)";
		this.ele.style["-o-transform"] = "translate("+x+"px, "+ y +"px)";
		this.ele.style["transform"] = "translate("+x+"px, "+ y +"px)";*/
	};
}