function playerEntity(ele, game){
	
	this.game = game;
	this.x =200;
	this.y = 200;
	this.life = 100;
	this.ele = ele;
	this.dieDelay = 3000;
	this.lastCheck = 0;
	this.isDead = false;
	this.lastRegen = 0;
	this.regenDelay = 5000;
	this.lastShoot = 0;
	this.shootDelay = 300;
	this.deaths = 0;
	this.bounds = {left:0, right:0, top:0,bottom:0};
	this.chain = 0;
	this.missed = 0;
	this.shootStage = 0;
	this.isShooting = false;
	this.shotType = "singleshot";
	this.bonusDamage = 0;
	this.preventDamage = false;
	this.shieldCooldown = 0;
	this.shieldLength = 5000;//3 seconds
	this.speedUpPercent = parseInt(100);//normal speed
	this.center = {x:0,y:0};
	this.missleCount = 0;
	this.handleKill = function(){
		this.chain++;
		//localStorage.chain = this.chain;
		//move to score thing
		this.game.score += 10*this.chain;
		
		if(this.game.score > localStorage.highscore){
			this.game.setStorage("highscore", this.game.score);//localStorage.highscore = parseInt(this.game.score);
		}
	};
	this.regen = function(){
		var t = this.game.getTimeValue;
		if(t > this.lastRegen){
			this.lastRegen = t + this.regenDelay;
			this.life += 5;
		}
	};
	this.handleDamage = function(damage){
		if(!this.isDead && !this.preventDamage){
			this.chain = 0;
			damage = damage==0?15:Math.round(damage);
			this.life -= damage;
			switch(this.shotType){
				case "singleshot":
				
				break;
				case "3shot":
					this.shotType = "singleshot";
				break;
				case "5shot":
					this.shotType = "3shot";
				break;
				case "7shot":
					this.shotType = "5shot";
				break;
				default:
				
				break;
			}
			this.bonusDamage = Math.round(this.bonusDamage * .33);//loses 1/3rd 
			this.game.spawner.floatingText(damage,"Hit","life");
			this.handleLife();
		}
	};
	this.handleLife = function(){
		this.regen();
		//this.life = this.life>100?100:this.life;
		if (this.life <= 0){
			this.game.score = 0;
			if(!this.isDead){
				this.isDead = true;
				this.deaths++;
				//this.ele.style.border = "1px solid red";
				this.ele.innerHTML = "<br><br><br>Benched";
				this.game.setStorage("deaths", this.deaths);//localStorage.deaths = this.deaths;
				this.lastCheck = this.game.getTimeValue + this.dieDelay;
				var penalty = Math.round(50 * ((this.game.getTimeValue - this.game.startTime)/1000));//50 * every 1 sec interval
				this.game.score -= penalty;
				this.speedUpPercent += 10;
				this.game.spawner.floatingText(penalty, "Work Overload", "score");
			}
			this.life = 0;
			//do something
		}
		if(this.isDead && (this.game.getTimeValue) > this.lastCheck){
			this.life = 100;
			//this.ele.style.border = "0px";
			this.ele.innerHTML = "";
			this.isDead = false;
			console.log("RESPAWNED");
			this.applyShield(this.shieldLength);
		}
	};
	this.applyShield = function(duration){
		this.preventDamage = true;
		this.shieldCooldown = this.game.getTimeValue + duration;
		this.ele.className = this.ele.className.replace( /(?:^|\s)expiring(?!\S)/g , '' );
		if(!this.ele.className.match(/(?:^|\s)shielded(?!\S)/))
			this.ele.className += "shielded";
	};
	this.removeShield = function(){
		if(this.preventDamage){
			if(this.shieldCooldown - this.game.getTimeValue <= 3000){
				if(!this.ele.className.match(/(?:^|\s)expiring(?!\S)/))
					this.ele.className += " expiring";
			}
			if(this.game.getTimeValue > this.shieldCooldown){
			console.log("remove shield");
				this.preventDamage = false;
				this.ele.className = this.ele.className.replace( /(?:^|\s)shielded(?!\S)/g , '' );
				this.ele.className = this.ele.className.replace( /(?:^|\s)expiring(?!\S)/g , '' );
			}
		}
	}
	this.intersect = function(p){
		
		var hit = !(p.left > this.bounds.right || 
				p.right < this.bounds.left || 
				p.top > this.bounds.bottom ||
				p.bottom < this.bounds.top);
		
		//this.ele.style.borderColor = hit?"red":"black";
		 return hit;
	};
	this.updateEnergy = function(){
		var e = 10 - ((this.game.spawner.bullets.length/this.game.spawner.maxBullets)*10);
		var se = "<p style='color:blue;position:relative;top:20px;left:-20px;'>[";
		for(var i = 0; i < 10; i++){
			se += (i<e?"||":"_");
		}
		se += "]</p>";
		this.ele.innerHTML = se;
	};
	this.move = function(x,y){
		if(!this.isDead){
			this.removeShield();
			this.shoot();
			this.x = x;
			this.y = y;
			this.center.x = this.x - (this.ele.style.width.substring(0,-2)*.5);
			this.center.y = this.y + (this.ele.style.height.substring(0,-2)*.5);
			this.ele.style.left = this.center.x;
			this.ele.style.top = this.center.y;
			this.bounds = this.ele.getBoundingClientRect();
			this.updateEnergy();
		}
	};
	this.adjustShootSpeed = function(){
		//if(this.speedUpPercent > 10){
			this.speedUpPercent -= 5;
			if(this.speedUpPercent <= 0){
				this.speedUpPercent = .01;// basically 100% speed according to HUD
				this.bonusDamage++;//add 1 damage at full speed
			}
			//if(this.speedUpPercent < 10)
				//this.speedUpPercent = 10; //shoots twice per update? probably not even necessary, should be 60 instead 
		//}
		this.game.setStorage("speed",this.speedUpPercent);
	};
	this.shoot = function(){
		if(this.isShooting && !this.game.isPaused && !this.isDead && this.game.getTimeValue > this.lastShoot){
			this.lastShoot = this.game.getTimeValue + (this.shootDelay * (this.speedUpPercent/100));
			switch(this.shootStage){
				default:
					this.game.spawner.spawn(this.shotType);
					break;
			}
		}
	};
	this.special = function(){
		if(!this.game.isPaused && !this.isDead && this.missleCount > 0){
			this.game.spawner.shooterPos = {x:this.x,y:this.y};
			this.game.spawner.spawn("missle");
			this.missleCount--;
			if(this.missleCount < 0){
				this.missleCount = 0;
			}
		}
	}
	this.upgradeShot = function(){
		switch(this.shotType){
			case "singleshot":
				this.shotType = "3shot";
			break;
			case "3shot":
				this.shotType = "5shot";
			break;
			case "5shot":
				this.shotType = "7shot";
			break;
			case "7shot":
				this.bonusDamage+= 1//10;//at max all others increase damage --1.925+ changed from 10 to 1 for scaling
			break;
			default:
			
			break;
		}
	};
	this.updateMissed = function(){
		this.missed++;
		this.game.setStorage("missed", this.missed);
	}
	this.setPlayer = function(){
		this.ele.style.backgroundImage="url('tech.png')";
		this.ele.style.backgroundRepeat ="no-repeat";
		this.ele.style.backgroundSize ="contain";
		this.deaths = this.game.getStorage("deaths");//parseInt(localStorage.deaths !== undefined?localStorage.deaths: 0);
		this.missed = this.game.getStorage("missed");//parseInt(localStorage.missed !== undefined?localStorage.missed: 0);
		var speed = this.game.getStorage("speed");//parseInt(localStorage.speed);
		if(speed > 1500){
			speed = 100;
			//localStorage.speed = 100;
			this.game.setStorage("speed",100);
		}
		this.speedUpPercent = ((speed !== null && speed !== undefined && speed !== NaN)?speed: 100);
		var missles = this.game.getStorage("missleCount");//localStorage.missleCount;
		this.missleCount = missles != null?missles:0;
		this.ele.style.zIndex = 1001;
		return true;
	};
	this.loaded = this.setPlayer();
}