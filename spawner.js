function spawner(game){
/*
possible memory issues. Make sure things are removed. Otherwise might be best to reuse elements, etc.
*/
	console.log("spawner created");
	this.random = function(min, max){
		return min + Math.floor(Math.random() * (max - min + 1));
	};
	this.game = game;
	this.fiveShotAngles = [-35,-20,0,20,35];
	this.fiveShotDirection = [-1,-1,0,1,1];
	this.fiveShotOffset = [25,100, 0, -100, -25];
	this.sevenShotAngles = [-45,-35,-20,0,20,35,45];
	this.sevenShotDirection = [-1,-1,-1,0,1,1,1];
	this.sevenShotOffset = [-100,25,100, 0, -100, -25,100];
	this.lastSpawn = this.game.getTimeValue; //this.game.getTimeValue == 0 here
	this.lastHazard = this.game.getTimeValue + this.random(1000,5000);
	this.lastDoc = this.game.getTimeValue + this.random(3000, 15000);
	this.lastPowerup = this.game.getTimeValue + this.random(5000,30000);
	this.lastSurge = new Date().getTime() + this.random(5000,30000) + 3000;//accurate way to do it or so it seems
	this.lastBoss = this.lastSurge + this.random(5000,3000);
	this.lastBossShoot = 0;
	this.bullets = new Array();
	this.enemies = new Array();
	this.hazards = new Array();
	this.powerups = new Array();
	this.floatingTexts = new Array();
	this.bonusItems = new Array();
	this.lastBurstPos = {x:0,y:0};
	this.shooterPos = {x:0,y:0};
	this.spawnPos = {x:0,y:0};
	this.bossAlive = false;
	this.maxBullets = 200;
	this.floatingText = function(penalty, reason, what){
		var ai = -1;
		if(this.floatingTexts[this.floatingTexts.length] === undefined || this.floatingTexts[this.floatingTexts.length] === null){
			ai = this.floatingTexts.length;
		}
		else{
			var idx = this.floatingTexts.indexOf(null);
			if(idx == -1)
				idx = this.floatingTexts.indexOf(undefined);
			ai = idx;
		}
		if(ai >= 0){
			this.floatingTexts[ai] = new FloatingText(this);
			this.floatingTexts[ai].show(penalty,reason,what);
		}
	};
	this.spawn = function(type){ 
		switch(type){
		case "enemy":
			if(this.game.getTimeValue > this.lastSpawn && this.enemies.length <= 40){//maybe don't spawn during boss?
				this.lastSpawn = this.game.getTimeValue + this.random(200,1300);
				var enemiesPerTick = 1;
				if(this.game.getTimeValue > this.lastSurge && !this.bossAlive){
					this.lastSurge = this.game.getTimeValue + this.random(15000, 60000);
					enemiesPerTick = this.random(5,15);
				}
				for(var i = 0; i < enemiesPerTick; i++){
					var x = document.createElement("div");
					var accurateIndex = -1;
					if(this.enemies[this.enemies.length] === undefined || this.enemies[this.enemies.length] === null){
						accurateIndex = this.enemies.length;
					}
					else{
						var idx = this.enemies.indexOf(null);
						if(idx == -1){
							idx = this.enemies.indexOf(undefined);
							if(idx == -1){
								idx = this.enemies.length+1;
								//console.log("Added enemy at index of length+1 of enemies");
							}
							else{
								//console.log("Added enemy found und slot");
							}
						}
						else{
							//console.log("Added enemy found null slot");
						}
						accurateIndex = idx;
					}
					
					//console.log("Index: " + accurateIndex + "/"+this.enemies.length);
					this.game.ele.appendChild(x);
					this.enemies[accurateIndex] = new enemy(this.random(10,(winx*.9)), 0,x,this);
					this.enemies[accurateIndex].index = accurateIndex;//I don't remember why this is here
					if(this.bossAlive){
						this.lastBoss = this.game.getTimeValue + this.random(90000,18000);//make the timer start only when boss dies
					}
					if(!this.bossAlive && this.game.getTimeValue > this.lastBoss){//SET BOSS
						this.bossAlive = true;
						this.floatingText(0, "A Boss Appeared!","");
						this.lastBoss = this.game.getTimeValue + this.random(90000,18000);
						this.enemies[accurateIndex].setBoss();
						break;
					}
				}
			}
			break;
		case "powerup:override":
			if(this.random(1,100) >= 95){
				var x = document.createElement("div");
				var ai = -1;
				if(this.powerups[this.powerups.length] === undefined || this.powerups[this.powerups.length] === null){
					ai = this.powerups.length;
				}
				else{
					var idx = this.powerups.indexOf(null);
					if(idx == -1)
						idx = this.powerups.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.powerups[ai] = new powerup(this.spawnPos.x, this.spawnPos.y,x, this);
				}
				else{
					console.log("couldn't find an index");
				}
				this.game.ele.appendChild(x);
			}
		break;
		case "powerup":
			if(this.game.getTimeValue > this.lastPowerup){
				this.lastPowerup = this.game.getTimeValue + this.random(3000,10000);
				var x = document.createElement("div");
				var ai = -1;
				if(this.powerups[this.powerups.length] === undefined || this.powerups[this.powerups.length] === null){
					ai = this.powerups.length;
				}
				else{
					var idx = this.powerups.indexOf(null);
					if(idx == -1)
						idx = this.powerups.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.powerups[ai] = new powerup(this.random(10,(winx*.9)), this.random(10,(winy*.4)),x, this);
				}
				else{
					console.log("couldn't find an index");
				}
				this.game.ele.appendChild(x);
			}
		break;
		case "hazard:alert":
			var ai = -1;
			if(this.game.getTimeValue > this.lastHazard){
				this.lastHazard = this.game.getTimeValue + this.random(2000,60000);
				var x = document.createElement("div");
				//move some stuff to hazard class
				x.className = "hazard";
				x.style.position = "absoulte";
				if(this.hazards[this.hazards.length] === undefined || this.hazards[this.hazards.length] === null){
					ai = this.hazards.length;
				}
				else{
					var idx = this.hazards.indexOf(null);
					if(idx == -1)
						idx = this.hazards.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.hazards[ai] = new hazard(this.random(10,(winx*.9)), this.random(10,(winy*.9)),x,this);
					this.hazards[ai].setSpeed(this.random(4,30),this.random(5,30));
					this.hazards[ai].dx = this.random(1,2)==1?1:-1;
					this.hazards[ai].dy = this.random(1,2)==1?1:-1;
					this.hazards[ai].life = this.random(10,120);
					this.hazards[ai].setType("alert");
				}
				this.game.ele.appendChild(x);
			}
			break;
		case "hazard:doc":
			if(this.game.getTimeValue > this.lastDoc){
				this.lastDoc = this.game.getTimeValue + this.random(2000,60000);
				var x = document.createElement("div");
				//move some stuff to hazard class
				x.className = "hazard";
				x.style.position = "absoulte";
				if(this.hazards[this.hazards.length] === undefined || this.hazards[this.hazards.length] === null){
					ai = this.hazards.length;
				}
				else{
					var idx = this.hazards.indexOf(null);
					if(idx == -1)
						idx = this.hazards.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.hazards[ai] = new hazard(this.random(10,(winx*.9)), this.random(10,(winy*.9)),x,this);
					this.hazards[ai].life = this.random(1,5);
					this.hazards[ai].setType("doc");
				}
				this.game.ele.appendChild(x);
			}
		break;
		case "plane":
			var x = document.createElement("div");
			//move some stuff to hazard class
			x.className = "hazard";
			x.style.position = "absoulte";
			if(this.hazards[this.hazards.length] === undefined || this.hazards[this.hazards.length] === null){
				ai = this.hazards.length;
			}
			else{
				var idx = this.hazards.indexOf(null);
				if(idx == -1)
					idx = this.hazards.indexOf(undefined);
				ai = idx;
			}
			if(ai >= 0){
				var d = this.game.ele.querySelector("#doc");
				var b;
				var px = 0;
				var py = 0;
				if(d === null || d === undefined){
					d = document.getElementById("doc");
				}
				if(d !== null){
					b= d.getBoundingClientRect();
					if(d.getAttribute("dir") == "left"){
						
						px = b.right;
					}
					else{
						px = b.left;
					}
					py = b.top + ((b.bottom - b.top)/2);
				}
				this.hazards[ai] = new hazard(px,py,x,this);
				this.hazards[ai].life = this.random(3,10);
				this.hazards[ai].setType("plane");
			}
			this.game.ele.appendChild(x);
		break;
		case "virus":
			if(this.game.getTimeValue > this.lastBossShoot){
				this.lastBossShoot = this.game.getTimeValue + this.random(1100,2500);
				var x = document.createElement("div");
				x.className = "hazard";
				x.style.position = "absoulte";
				if(this.hazards[this.hazards.length] === undefined || this.hazards[this.hazards.length] === null){
					ai = this.hazards.length;
				}
				else{
					var idx = this.hazards.indexOf(null);
					if(idx == -1)
						idx = this.hazards.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.hazards[ai] = new hazard(this.shooterPos.x, this.shooterPos.y,x,this);
					this.hazards[ai].life = 15;
					this.hazards[ai].setType("virus");
				}
				this.game.ele.appendChild(x);
			}
		break;
		case "cereal":
			if(this.game.getTimeValue > this.lastBossShoot){
				this.lastBossShoot = this.game.getTimeValue + this.random(1500,3000);
				var x = document.createElement("div");
				x.className = "hazard";
				x.style.position = "absoulte";
				if(this.hazards[this.hazards.length] === undefined || this.hazards[this.hazards.length] === null){
					ai = this.hazards.length;
				}
				else{
					var idx = this.hazards.indexOf(null);
					if(idx == -1)
						idx = this.hazards.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.hazards[ai] = new hazard(this.shooterPos.x, this.shooterPos.y,x,this);
					this.hazards[ai].life = 10;
					this.hazards[ai].setType("cereal");
				}
				this.game.ele.appendChild(x);
			}
		break;
		case "cereal:burst"://spawns from cereal shot
			var xs = [0, 1,1,1,0,-1,-1,-1];
			var ys = [-1,-1,0,1,1,1,0,-1];
			for(var i = 0; i < 8; i++){
				var x = document.createElement("div");
				x.className = "hazard";
				x.style.position = "absoulte";
				if(this.hazards[this.hazards.length] === undefined || this.hazards[this.hazards.length] === null){
					ai = this.hazards.length;
				}
				else{
					var idx = this.hazards.indexOf(null);
					if(idx == -1)
						idx = this.hazards.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.hazards[ai] = new hazard(this.lastBurstPos.x, this.lastBurstPos.y,x,this);
					this.hazards[ai].isChild = true;
					this.hazards[ai].setSpeed(12,12);
					this.hazards[ai].dx = xs[i];
					this.hazards[ai].dy = ys[i];
					this.hazards[ai].life = 10;
					
					this.hazards[ai].setType("cereal");
				}
				this.game.ele.appendChild(x);
			}
		break
		case "virus:burst"://spawns from virus shot
			var xs = [0, 1,1,1,0,-1,-1,-1];
			var ys = [-1,-1,0,1,1,1,0,-1];
			for(var i = 0; i < 8; i++){
				var x = document.createElement("div");
				x.className = "hazard";
				x.style.position = "absoulte";
				if(this.hazards[this.hazards.length] === undefined || this.hazards[this.hazards.length] === null){
					ai = this.hazards.length;
				}
				else{
					var idx = this.hazards.indexOf(null);
					if(idx == -1)
						idx = this.hazards.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.hazards[ai] = new hazard(this.lastBurstPos.x, this.lastBurstPos.y,x,this);
					this.hazards[ai].isChild = true;
					this.hazards[ai].setSpeed(12,12);
					this.hazards[ai].dx = xs[i];
					this.hazards[ai].dy = ys[i];
					this.hazards[ai].life = 15;
					
					this.hazards[ai].setType("virus");
				}
				this.game.ele.appendChild(x);
			}
		break
		case "singleshot":
			this.maxBullets = 200;
			if(this.bullets.length > this.maxBullets){
				break;
			}
			var x = document.createElement("div");
			x.setAttribute("shotType", type);
			var ai = -1;
			if(this.bullets[this.bullets.length] === undefined || this.bullets[this.bullets.length] === null){
				ai = this.bullets.length;
			}
			else{
				var idx = this.bullets.indexOf(null);
				if(idx == -1)
					idx = this.bullets.indexOf(undefined);
				ai = idx;
			}
			if(ai >= 0){
				this.bullets[ai] = new bullet(this.game.mousePos.x, this.game.mousePos.y,x,this);
			}
			this.game.ele.appendChild(x);
			break;
		case "3shot":
			this.maxBullets = 150;
			if(this.bullets.length > this.maxBullets){
				break;
			}
			var ai = -1;
			for(var i = 0; i < 3; i++){
				var x = document.createElement("div");
				x.setAttribute("shotType", type);
				if(i == 0 || i == 2)
					x.style.transform = "rotate("+ (i==0?"":"-") +"20deg)";
				if(this.bullets[this.bullets.length] === undefined || this.bullets[this.bullets.length] === null){
					ai = this.bullets.length;
				}
				else{
					var idx = this.bullets.indexOf(null);
					if(idx == -1)
						idx = this.bullets.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.bullets[ai] = new bullet(this.game.mousePos.x, this.game.mousePos.y,x,this);
					this.bullets[ai].dx = i!=1?(i==0?1:-1):0;
				}
				this.game.ele.appendChild(x);
			}
			break;
		case "5shot":
			this.maxBullets = 100;
			if(this.bullets.length > this.maxBullets){
				break;
			}
			var ai = -1;
			for(var i = 0; i < 5; i++){
				var x = document.createElement("div");
				x.setAttribute("shotType", type);
				x.style.transform = "rotate("+ this.fiveShotAngles[i] +"deg)";
				if(this.bullets[this.bullets.length] === undefined || this.bullets[this.bullets.length] === null){
					ai = this.bullets.length;
				}
				else{
					var idx = this.bullets.indexOf(null);
					if(idx == -1)
						idx = this.bullets.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.bullets[ai] = new bullet(this.game.mousePos.x+ this.fiveShotOffset[i], this.game.mousePos.y,x,this);

					this.bullets[ai].dx = this.fiveShotDirection[i];
				}
				this.game.ele.appendChild(x);
			}
			break;
		case "7shot":
			this.maxBullets = 75;
			if(this.bullets.length > this.maxBullets){
				break;
			}
		var ai = -1;
			for(var i = 0; i < 7; i++){
				var x = document.createElement("div");
				x.setAttribute("shotType", type);
				x.style.transform = "rotate("+ this.sevenShotAngles[i] +"deg)";
				if(this.bullets[this.bullets.length] === undefined || this.bullets[this.bullets.length] === null){
					ai = this.bullets.length;
				}
				else{
					var idx = this.bullets.indexOf(null);
					if(idx == -1)
						idx = this.bullets.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.bullets[ai] = new bullet(this.game.mousePos.x+ this.sevenShotOffset[i], this.game.mousePos.y,x,this);
					this.bullets[ai].dx = this.sevenShotDirection[i];
				}
				this.game.ele.appendChild(x);
			}
			break;
		case "missle"://continues to disc
		case "disc":
			var ai = -1;
			var x = document.createElement("div");
				x.setAttribute("shotType", type);
				if(this.bullets[this.bullets.length] === undefined || this.bullets[this.bullets.length] === null){
					ai = this.bullets.length;
				}
				else{
					var idx = this.bullets.indexOf(null);
					if(idx == -1)
						idx = this.bullets.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.bullets[ai] = new bullet(this.shooterPos.x, this.shooterPos.y,x,this);
				}
				this.game.ele.appendChild(x);
		break;
		case "server":
			var ai = -1;
			var x = document.createElement("div");
				x.setAttribute("bonusType", type);
				if(this.bonusItems[this.bonusItems.length] === undefined || this.bonusItems[this.bonusItems.length] === null){
					ai = this.bonusItems.length;
				}
				else{
					var idx = this.bonusItems.indexOf(null);
					if(idx == -1)
						idx = this.bonusItems.indexOf(undefined);
					ai = idx;
				}
				if(ai >= 0){
					this.bonusItems[ai] = new Bonus(this.game.mousePos.x, this.game.mousePos.y,x,this);
					this.bonusItems[ai].setSpeed(0,0);
				}
				this.game.ele.appendChild(x);
		break;
		default:
			console.log("Invalid spawn " + type);
			break;
		}
	}
	this.remove = function(item){
		var index = -1;
		switch(item.type){
			case "hazard":
				index = this.hazards.indexOf(item);
				this.hazards[index] = null;
				this.hazards.splice(index, 1);
			break;
			case "bullet":
				index = this.bullets.indexOf(item);
				this.bullets[index] = null;
				this.bullets.splice(index, 1);
			break;
			case "bonus":
				index = this.bonusItems.indexOf(item);
				this.bonusItems[index] = null;
				this.bonusItems.splice(index, 1);
			break;
			case "floatingText":
				index = this.floatingTexts.indexOf(item);
				this.floatingTexts[index] = null;
				this.floatingTexts.splice(index, 1);
			break;
			case "enemy":
				index = this.enemies.indexOf(item);
				this.enemies[index] = null;
				this.enemies.splice(index, 1);
			break;
			case "powerup":
				index = this.powerups.indexOf(item);
				this.powerups[index] = null;
				this.powerups.splice(index, 1);
			break;
			default:
			console.log("Invalid type: " + item.type );
			break;
		}
		item.ele.remove();
		
		
	};
	this.getClosest= function(mx,my){
		var closest = null;
		var distance = 10000;//some high number
		for(var i = 0; i < this.enemies.length; i++){
			if(this.enemies[i] !== undefined && this.enemies[i] !== null){
				var cx = this.enemies[i].bounds.left + (this.enemies[i].ele.style.width.substring(0,-2)*.5);
				var cy = this.enemies[i].bounds.top + (this.enemies[i].ele.style.height.substring(0,-2)*.5);
				var a = my-cy;
				var b = mx-cx;
				var d = Math.sqrt((a*a) + (b*b));
				if(d < distance){
					distance = d;
					closest = this.enemies[i];
				}
			}
		}
		return closest;
	}
	this.move = function(){
		for(var i = 0; i < this.floatingTexts.length; i++){
			this.floatingTexts[i].move();
		}
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].move();
		}
		for(var i = 0; i < this.powerups.length; i++){
			this.powerups[i].move();
		}
		for(var i = 0; i < this.bonusItems.length; i++){
			this.bonusItems[i].move();
		}
		for(var i = 0; i < this.enemies.length; i++){
			this.enemies[i].move();
			if(this.enemies[i] !== undefined && this.enemies[i].intersect(this.game.pc.bounds,true)){
				if(!this.enemies[i].isBoss){
					this.enemies[i].die();
				}
			}
			for(var k = 0; k < this.bullets.length; k++){
				if(this.enemies[i] !== undefined && this.enemies[i] !== null){
					if(this.enemies[i].intersect(this.bullets[k].bounds,false)){
						this.enemies[i].handleDamage(this.bullets[k].damage);
						this.bullets[k].die();
					}
				}
			}
		}
		for(var i = 0; i < this.hazards.length; i++){
			if(this.hazards[i] !== undefined && this.hazards[i] !== null){
				this.hazards[i].move();
			}
		}
	};
}