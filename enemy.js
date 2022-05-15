function enemy(x, y, ele,spawner){
	
	this.x = x;
	this.y = y;
	this.dx = 1;
	this.dy = 1;
	this.sx = 0;
	this.life = 1;
	this.maxLife = 100;
	this.index = -1;
	this._type = "";
	this.spawner = spawner;
	this.type = "enemy";
	this.sy = this.spawner.random(3,15);
	this.ele = ele;
	this.isDead = false;
	this.bounds = {left:0, right:0, top:0,bottom:0};
	this.damage = this.spawner.random(5,95);
	this.isBoss = false;
	this.bonusValue = 0;
	this.isJames = false;
	this.center = {x:0,y:0};
	this.showLife = function(){
		var bar = "<p style='color:red;position:relative;top:-40px;'>[";
		var bars = (this.life / this.maxLife) * 10;
		for(var i = 0; i < 10; i++){
			bar += i<bars?"|":"_";
		}
		
		bar += "]</p>";
		this.ele.innerHTML = bar;
	};
	this.setLife = function(){
		var max = 1+Math.floor((this.spawner.game.getTimeValue - this.spawner.game.startTime)/1500);
		var min = 1+Math.floor((this.spawner.game.getTimeValue - this.spawner.game.startTime)/5500);
		this.life = this.spawner.random(min,max);//1 every 10 seconds
		this.life *= this.spawner.random(1, Math.floor((this.spawner.game.getTimeValue - this.spawner.game.startTime)/60000));
		if(this.life <= 0){
			this.life = 1;
		}
		this.maxLife = this.life;
		this.showLife();
	};
	this.enemy = function(){
		this.ele.style.position = "absoulte";
		this.ele.className = "enemy";
		this.ele.style.left = this.spawner.random(10,(winx*.9));
		this.ele.style.top = 0;
		this.ele.style.width = "100px";
		this.ele.style.height = "25px";
		this.ele.style.backgroundcolor = "black";
		this.ele.style.backgroundSize = "100% 100%";
		this.ele.style.backgroundRepeat ="no-repeat";
		this.ele.style.backgroundImage="url('error-messages-small.gif')";
		this.setLife();
		return true;
	};
	this.loaded = this.enemy();
	this.setBoss = function(){
		this.isBoss = true;
		this.isJames = this.spawner.random(1,100)>=80?true:false;//20% to be James
		var max = 1+Math.floor((this.spawner.game.getTimeValue - this.spawner.game.startTime)/1000);
		var min = 1+Math.floor((this.spawner.game.getTimeValue - this.spawner.game.startTime)/2500);
		
		this.life = (this.spawner.random(min,max) * this.spawner.random(1,5));
		//late game boost
		max = 1+Math.floor((this.spawner.game.getTimeValue - this.spawner.game.startTime)/30000);
		min = 1+Math.floor((this.spawner.game.getTimeValue - this.spawner.game.startTime)/60000);
		this.life *=  (this.isJames?this.spawner.random(min,max):1.5);
		this.life *= this.spawner.random(min, max);
		this.bonusValue = this.life;
		this.sy = this.isJames?15:this.sy;
		this.damage = this.isJames?this.spawner.random(50,95)*2:this.damage;
		this.ele.style.backgroundImage= this.isJames?"url('m2.jpg')":"url('pc.png')";//yes, James wanted to be a boss.
		this.ele.style.width = this.isJames?"150px":"200px";
		this.ele.style.height = "100px";
		this.x = winx*.45;
		this.y = winy*.15;
		this.maxLife = this.life;
		this.showLife();
	};
	this.intersect = function(p,isPlayer){
		var hit = !(p.left > this.bounds.right || 
				p.right < this.bounds.left || 
				p.top > this.bounds.bottom ||
				p.bottom < this.bounds.top);
		
		this.ele.style.borderColor = hit?"red":"black";
		if(hit && !this.isDead && isPlayer && !this.spawner.game.pc.isDead) this.spawner.game.pc.handleDamage(this.damage);
		if(hit && !this.isDead && !isPlayer && !this.spawner.game.pc.isDead)this.spawner.game.pc.handleKill();
		 return hit;
	};
	this.handleDamage = function(damage){
		this.life -= damage;
		if(this.life <= 0){
			this.life = 0;
			this.die();
		}
		this.showLife();
	};
	
	this.die = function(){
		if(!this.idDead){
			if(this.isBoss){
				this.spawner.game.score += this.bonusValue;
				this.spawner.bossAlive = false;
			}
			this.isDead = true;
			this.spawner.spawnPos = {x:this.x,y:this.y};
			this.spawner.spawn("powerup:override");
			this.spawner.remove(this);
		}
	};
	this.move = function(){
		
		if(this.ele !== undefined){
			this.x += this.dx * this.sx;
			this.y += this.dy * this.sy;
			this.center.x = this.x + (this.ele.style.width.substring(0,-2)*.5);
			this.center.y = this.y + (this.ele.style.height.substring(0,-2)*.5);
			this.ele.style.left = this.center.x + "px";
			this.ele.style.top = this.center.y + "px";
			this.bounds = this.ele.getBoundingClientRect();
		}
		else{
			console.log("ELEMENT UNDEFINED");
		}
		
		if(!this.isBoss){
			if(this.y > winy){
				if(this.spawner.game.pc !== undefined && !this.isDead){
					this.spawner.game.pc.updateMissed();
					var penalty = 20*this.spawner.game.pc.chain;
					this.spawner.game.score -= penalty;
					this.spawner.floatingText(penalty,"missed","score");
				}
				this.die();
			}
		}
		else{
			
			if(this.isJames){
				this.spawner.shooterPos = {x:this.x - 40, y:this.y};
				this.spawner.spawn("cereal");
				this.spawner.shooterPos = {x:this.x + 40, y:this.y};
				this.spawner.spawn("cereal");
			}
			else{
				this.spawner.shooterPos = {x:this.x, y:this.y};
				this.spawner.spawn("virus");
			}
			if((this.x > (winx*.8) || this.x < (winx*.2))){
				this.dx *= -1;
			}
			if(this.y> (winy*.3) || this.y < (winy*.1) ){
				this.dy *= -1;
			}
		}
	};
}