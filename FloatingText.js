function FloatingText(spawner){
	this.spawner = spawner;
	this.type = "floatingText";
	this.x = winx*.8;
	this.y = winy*.3;
	this.sx = 0;
	this.sy = 15;
	this.dy = -1;
	this.dx = 1;
	this.ele;
	this.show = function(penalty, reason,what){
		var a = document.createElement("div");
		a.className = "floatingText";
		a.style.left = this.x;
		
		if(reason == "Work Overload"){
			this.y += 40;
		}
		a.style.top = this.y;
		a.innerHTML = reason+(penalty>0?" (-"+penalty + " "+what+")":"");
		a.style.visibility = "visible";
		this.ele = a;
		this.spawner.game.ele.appendChild(a);
	};
	this.die = function(){
		this.spawner.remove(this);
	};
	this.move = function(){
		if(this.ele !== undefined){
			this.x += this.dx * this.sx;
			this.y += this.dy * this.sy;
			this.ele.style.left = this.x + "px";
			this.ele.style.top = this.y + "px";
		}
		if(this.y < 0){
			this.die();
		}
		else{
		}
	};
}