function powerup(x,y,ele,spawner){
	this.x = x;
	this.y = y;
	this.type = "powerup";
	this.spawner = spawner;
	this.powerupList = ["coffee","health","shield","speedup", "software", "server","star"];
	this.ele = ele;
	this.dx;
	this.dy;
	this.sx;
	this.sy;
	this.life;
	this._type = "";
	this.isDead = false;
	this.bounds = {left:0,right:0,top:0,bottom:0};
	this.lastDecay = this.spawner.random(5000,15000);
	this.setSpeed = function(xs,ys){
		this.sx = xs;
		this.sy = ys;
	};
	this.powerup = function(){
		//this._type = this.powerupList[this.random(0,this.powerupList.length-1)];
		var ran = this.spawner.random(0,1200);
		if(ran >= 0 && ran <= 100){
			this._type = this.powerupList[2];
		}
		else if(ran > 100 && ran <= 400){
			this._type = this.powerupList[0];
		}
		else if(ran > 400 && ran <= 800){
			this._type = this.powerupList[3];
		}
		else if(ran > 800 && ran <= 1000){
			this._type = this.powerupList[4];
		}
		else if(ran > 1000 && ran <= 1200){
			this._type = this.powerupList[5];
		}
		else if(ran > 1200 && ran <= 1300){
			this._type = this.powerupList[1];
		}
		else if(ran > 1300 && ran <= 1325){
			this._type = this.powerupList[6];
		}
		this.ele.className = "powerup";
		this.ele.style.backgroundSize="contain";
		this.ele.style.backgroundSize = "100% 100%";
		this.ele.style.backgroundRepeat ="no-repeat";
		this.ele.style.position = "absoulte";
		this.ele.style.top = this.y;
		this.ele.style.left = this.x;
		this.setSpeed(this.spawner.random(1,20),this.spawner.random(1,20));
		this.dx = this.spawner.random(1,2)==1?1:-1;
		this.dy = 1;
		this.life = this.spawner.random(10,120);
		switch(this._type){
			case this.powerupList[0]:
				this.ele.style.backgroundImage="url('coffee.png')";
			break;
			case this.powerupList[1]:
				this.ele.style.backgroundImage="url('report.jpg')";
			break;
			case this.powerupList[2]:
				if(this.spawner.random(1,100) <= 10){
					this.powerup();
				}
				else{
					this.ele.style.backgroundImage="url('shield.png')";
				}
			break;
			case this.powerupList[3]:
				this.ele.style.backgroundImage="url('wrench.png')";
			break;
			case this.powerupList[4]:
				this.ele.style.backgroundImage="url('software.png')";
			break;
			case this.powerupList[5]:
				this.ele.style.backgroundImage="url('box.png')";
			break;
			case this.powerupList[6]:
				this.ele.style.backgroundImage = "url('star.png')";
			break;
		}
	};
	this.loaded = this.powerup();
	
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
				this.die();
			}
		}
	};
	this.move = function(){
		if(!this.isDead){
			if(this.x < 0 || this.x > winx)
				this.dx *= -1;
			if(this.y < 0 )
				this.dy *= -1;
			if(this.y > winy){
				this.die();
				return;
			}
			this.x += this.sx * this.dx;
			this.y += this.sy * this.dy;
			this.ele.style.left = this.x;
			this.ele.style.top = this.y;
		
			this.bounds = this.ele.getBoundingClientRect();
			if(this.spawner.game.pc !== undefined && this.intersect(this.spawner.game.pc.bounds)){
				//pc.handleDamage(this.damage);
				//apply power up
				switch(this._type){
					case this.powerupList[0]:
						this.spawner.game.pc.upgradeShot();
					break;
					case this.powerupList[1]:
						this.spawner.game.pc.life += 15;
					break;
					case this.powerupList[2]:
						this.spawner.game.pc.applyShield(10000);//10 seconds
					break;
					case this.powerupList[3]:
						this.spawner.game.pc.adjustShootSpeed();
					break;
					case this.powerupList[4]:
						this.spawner.game.pc.missleCount++;
						this.spawner.game.setStorage("missleCount", this.spawner.game.pc.missleCount);
					break;
					case this.powerupList[5]:
						this.spawner.spawn("server");
					break;
					case this.powerupList[6]:
						this.spawner.game.pc.bonusDamage += 3;
					break;
					default:
					break;
				}
				this.die();
			}
			this.expire();
		}
	};
	this.intersect = function(p){
		var hit = !(p.left > this.bounds.right || 
				p.right < this.bounds.left || 
				p.top > this.bounds.bottom ||
				p.bottom < this.bounds.top);
		
		this.ele.style.borderColor = hit?"red":"black";
		return hit;
	};
}