function Game(){
	this.score = 0;
	this.player = document.getElementById("player");
	this.pc;
	this.mousePos = {x:0,y:0};
	this.display = document.getElementById("position");
	this.ele = document.getElementById("game");
	this.startTime = 0;
	this.GUI;
	this.showHighscore;
	this.getTimeValue = 0;
	this.isPaused = false;
	
	this.alert = document.getElementById("alert");
	this.spawner = new spawner(this);
	this.self;
	this.showText = false;
	this.showHelp = false;
	this.msToTime = function(duration) {//msToTime
        var milliseconds = parseInt((duration%1000)/100)
            , seconds = parseInt((duration/1000)%60)
            , minutes = parseInt((duration/(1000*60))%60)
            , hours = parseInt((duration/(1000*60*60))%24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    };
	this.setStorage = function(key,value){
		localStorage[key] = parseInt(value);
	};
	this.getStorage = function(key){
		return parseInt(localStorage[key]==null?(key=="speed"?100:0):localStorage[key]);
	};
	this.resetStorage = function(){
		this.setStorage("missed",0);//localStorage.missed = 0;
		this.setStorage("deaths",0);//localStorage.deaths = 0;
		this.setStorage("highscore",0);//localStorage.highscore = 0;
		this.setStorage("missleCount",0);//localStorage.missleCount = 0;
		this.setStorage("speed",0);//localStorage.speed = 100;
		this.isPaused = true;
		this.highscore = 0;
		this.pc.missed = 0;
		this.pc.deaths = 0;
		this.isPaused = confirm("Reset all stats.");
	};
	this.Game = function(){//onload/constructor
		
		if(this.startTime === undefined || this.startTime === null || this.startTime == 0){
			this.startTime = new Date().getTime();
		}
		if(this.spawner === undefined || this.spawner === null){
			this.getTimeValue = new Date().getTime();
			this.spawner = new spawner(this);
		}
		if(localStorage.highscore === undefined || localStorage.highscore === null){
			localStorage.highscore = 0;
		}
		this.showHighscore = localStorage.highscore;
		
		this.ele = document.getElementById("game");
		this.player = document.getElementById("player");
		this.display = document.getElementById("position")
		this.help = document.getElementById("help");
		this.help.style.visibility = "hidden";
		if((this.player !== undefined && this.player !== null) && (this.pc === undefined || this.pc === null)){
			this.pc = new playerEntity(this.player, this);
		}
		if(this.GUI === undefined || this.GUI === null){
			this.GUI = new GUI(this);
		}
		this.GUI.updateGUI();
		console.log("Loaded");
		var self = this;
		//register listeners;
		window.onresize=function(){
			g = d.getElementsByTagName('body')[0],
			winx = w.innerWidth || e.clientWidth || g.clientWidth,
			winy = w.innerHeight|| e.clientHeight|| g.clientHeight;
		};
		window.onkeydown=function(event){

			if (event.keyCode == 32) {
				self.isPaused = !self.isPaused;
				if(self.alert === undefined || self.alert === null){
					self.alert = document.getElementById("alert");
				}
				if(self.isPaused){
					if(self.alert !== undefined && self.alert !== null)
					self.alert.style.visibility = "visible";
				}
				else{
					if(self.alert !== undefined && self.alert !== null)
					self.alert.style.visibility = "hidden";
				}
			}
			else if(event.keyCode == 82){
				self.resetStorage();
			}
			else if(event.keyCode == 83){
				self.showText = !self.showText;
			}
			else if(event.keyCode == 72){
				self.showHelp = !self.showHelp;
				self.help.style.visibility = self.showHelp?"visible":"hidden";
				self.isPaused = self.showHelp;
				
				if(self.alert === undefined || self.alert === null){
					self.alert = document.getElementById("alert");
				}
				if(self.isPaused){
					if(self.alert !== undefined && self.alert !== null)
					self.alert.style.visibility = "visible";
				}
				else{
					if(self.alert !== undefined && self.alert !== null)
					self.alert.style.visibility = "hidden";
				}
			}
		};
		window.onmousemove = function(event){
			event = event || window.event;
			self.mousePos = {
				x: event.clientX,
				y: event.clientY
			};
		};
		window.onmousedown = function(event){
			event = event || window.event;
			self.mousePos = {
				x: event.clientX,
				y: event.clientY
			};
			if(self.pc !== undefined && self.pc !== null){
				switch(event.which){
					case 1:
						self.pc.isShooting = event.type=="mousedown"?true:false;
					break;
					case 3:
						self.pc.isShooting = event.type=="mousedown"?true:false;
						if(event.type == "mousedown"){
							self.pc.special();
						}
					break;
					default:
					break;
				}
			}
		};
		window.onmouseup = function(event){
			event = event || window.event;
			self.mousePos = {
				x: event.clientX,
				y: event.clientY
			};
			if(self.pc !== undefined && self.pc !== null){
				self.pc.isShooting = event.type=="mousedown"?true:false;
			}
		};
		return true;
	};
	this.loaded = this.Game();
	

	this.getMousePos = function(){
		var pos =this.mousePos;
		if(!pos){

		}
		else{
			if(this.player !== undefined && this.player !== null){
				if(this.pc !== undefined && this.pc !== null){
					this.pc.move(pos.x, pos.y);
				}
			}
			else{
				this.player = document.getElementById("player");
			}
		}
	};
	
	this.run = function(){
		var myGame = this;
		return window.setInterval(
			function update(){
				myGame.getTimeValue = new Date().getTime();
				if(!myGame.isPaused){
					
					//showMiss(false);
					myGame.getMousePos();
					myGame.spawner.spawn("enemy", myGame.spawner);
					myGame.spawner.spawn("hazard:alert", myGame.spawner);
					myGame.spawner.spawn("hazard:doc",myGame.spawner);
					myGame.spawner.spawn("powerup", myGame.spawner);
					if((myGame.player !== undefined && myGame.player !== null) && (myGame.pc === undefined || myGame.pc === null)){
						myGame.pc = new playerEntity(player, myGame);
					}
					else{
						myGame.pc.handleLife();
					}
					myGame.spawner.move();
				}
				myGame.GUI.updateGUI();
			}, 
	60);
	};
	
	this.update = this.run();
}