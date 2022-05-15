function GUI(game){
	this.game = game;
	this.updateGUI = function(){
		var life = this.game.pc.life;//10;// (pc !== undefined?pc.life:100)/10;
		if(life > 100) life=100;
		life /= 10;
		var color;
		if(life <= 3){
			color = "#FF0000";
		}
		else if(life > 3 && life <= 5){
			color = "#FF8000";
		}
		else if(life > 5 && life <= 8){
			color = "#CCCC00";
		}
		else if(life > 8){
			color = "#00FF00";
		}
		var combo = this.game.pc.chain;
	
		var s = ""; 
			s += "<table><tr><td>IT Nightmare</td></tr>";
			s += "<tr><td>Highscore:</td><td>" + this.game.showHighscore+"</td></tr>";
			s += "<tr><td>Duration:" + this.game.msToTime((this.game.getTimeValue - this.game.startTime)) + "</td></tr>";
			s += "<tr><td>[<font color='"+color+"'>";
			for(var i = 0; i < life;i++){
				s+="|";
			}
			for(var i = 0; i < (10 - life);i++){
				s += "_";
			}
			s += "</font>]</td><td><font color='"+color+"'>"+ this.game.pc.life  + "</font></td></tr>";
			s += "<tr><td>Score:</td><td>" + this.game.score + "</td></tr>";
			s += "<tr><td>Combo:</td><td>" + combo + "</td></tr>";
			s += "<tr><td>Missed:</td><td>" + this.game.pc.missed  +"</td></tr>";
			s += "<tr><td>Times Benched:</td><td>" + this.game.pc.deaths  + "</td></tr>";
			s += "</table><div id='hud' style='display:block;'>";
			s += "<p>+Damage " + this.game.pc.bonusDamage + "</p>";
			s += "<p>Shielded: " + this.game.pc.preventDamage + "</p>";
			s += "<p>+Speed: " + (100 - parseInt(this.game.pc.speedUpPercent))+ "%</p>";
			s += "<p>Specialty Software: " + this.game.pc.missleCount+ "<small>(Right Click)</small></p>";
			s += "</div>";
			if(this.game.display !== undefined && this.game.display !== null){
				this.game.display.innerHTML =  s;
			}
	};
}