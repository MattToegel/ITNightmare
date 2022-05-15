function bullet(x, y, ele, spawner){
	this.x = x;
	this.y = y;
	this.type="bullet";
	this.dx = 1;
	this.dy = -1;//negative is up
	this.sx = 15;
	this.sy = 15;
	this.ele = ele;
	this._type = "";
	this.center = {x:0,y:0};
	this.spawner = spawner;
	this.homingDelay = 200;
	//missle specifics
	this.outOfBounds = false;
	this.collisions = 0;
	this.maxCollisions = 5;
	this.collisionCheckDelay = 120;//two updates
	this.lastCollisionCheck = new Date().getTime() + this.collisionCheckDelay;

	
	this.lastHomingTick = new Date().getTime() + this.homingDelay;
	this.damage = Math.ceil(1+(5 * ((this.spawner.game.getTimeValue - this.spawner.game.startTime)/30000)) + this.spawner.game.pc.bonusDamage);//increases every 30 seconds
	this.setSpeed = function(x,y){
		this.sx = x;
		this.sy = y;
	};
	this.bullet = function(){
		this._type = this.ele.getAttribute("shotType");
		this.ele.style.position = "absoulte";
		this.ele.style.left = this.x;
		this.ele.style.top = this.y;
		this.ele.style.zIndex = 800;
		if(this._type.indexOf("shot") > -1){
				this.ele.innerHTML = (this.spawner.game.showText)?"Experience Certainty":""; 
				this.ele.style.backgroundColor = (this.spawner.game.showText)?"white":"black";
				this.ele.style.width = "1px";
				this.ele.style.height="20px";
				this.ele.className = "bullet";
		}
		switch(this._type){
			case "singleshot":
				this.setSpeed(0,15);
			break;
			case "3shot":
				this.setSpeed(10,15);
			break;
			case "5shot":
				this.setSpeed(10,15);
			break;
			case "7shot":
				this.setSpeed(10,15);
			break;
			case "missle":
				this.ele.className += "bullet outer-circle";
				var inner = document.createElement("div");
				inner.className += "inner-circle";
				this.ele.appendChild(inner);
				this.setSpeed(0,20);
			break;
			case "disc":
				this.ele.style.left = this.spawner.shooterPos.x;
				this.ele.style.top = this.spawner.shooterPos.y;
				this.ele.className += "bullet outer-circle-small";
				var inner = document.createElement("div");
				inner.className += "inner-circle-small";
				this.ele.appendChild(inner);
				this.setSpeed(0,20);
			break;
			default:
				console.log("Invalid type");
			break;
		}
		return true;
	};
	this.loaded = this.bullet();
	this.bounds = {left:0,right:0,top:0,bottom:0};
	
	this.die = function(){
		if(this._type == "missle" && !this.outOfBounds){
			if(this.spawner.game.getTimeValue > this.lastCollisionCheck){
				this.lastCollisionCheck = this.spawner.game.getTimeValue + this.collisionCheckDelay;
				this.collisions++;
				this.damage *= 1.25;
				if(this.collisions > this.maxCollisions){
					this.spawner.remove(this);
				}
			}
		}
		else{
			this.spawner.remove(this);
		}
	};
	this.move = function(){
		if(this.ele !== undefined){
			if(this._type == "missle"){
				if(this.spawner.game.getTimeValue > this.lastHomingTick){
					this.lastHomingTick = this.spawner.game.getTimeValue + this.homingDelay;
					var t = this.spawner.getClosest(this.center.x, this.center.y);
					if(t != null){
						var tx = t.center.x;
						var ty = t.center.y;
						var px = (tx - this.x);
						var py = (ty - this.y);
						this.dx =  px >=0?1:-1;
						this.dy =  py >=0?1:-1;
						this.sx = 20;
					}
					else{
						this.dx = 0;
					}
				}
			}
			this.x += this.dx * this.sx;
			this.y += this.dy * this.sy;
			this.translate(this.x, this.y);
			this.bounds = this.ele.getBoundingClientRect();
		}
		if((this.x < -300 || this.x  > winx+300) || (this.y < -300 || this.y > winy+300)){
			this.outOfBounds = true;
			this.die();
		}
		else{
		}
		
	};
	this.translate = function(x,y){
		if(this._type == ""){
			this._type = this.ele.getAttribute("shotType");
			switch(this._type){
				case "singleshot":
				break;
				case "3shot":
					this.damage = Math.ceil(this.damage/3);
				break;
				case "5shot":
					this.damage = Math.ceil(this.damage/5);
				break;
				case "7shot":
					this.damage = Math.ceil(this.damage/7);
				break;
				case "missle":
					this.damage = Math.ceil(1+(5 * ((this.spawner.game.getTimeValue - this.spawner.game.startTime)/22500)) + this.spawner.game.pc.bonusDamage)*1.5;
				break;
				case "disc":
					this.damage = Math.ceil(1+(5 * ((this.spawner.game.getTimeValue - this.spawner.game.startTime)/25000)) + this.spawner.game.pc.bonusDamage);
				break;
				default:
				break;
			}
		}
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