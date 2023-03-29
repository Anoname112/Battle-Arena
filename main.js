var canvas;
var ctx;
var hidden;
var music;

var minionSpawnTick;
var player;
var tower0;
var tower1;
var lifeBeings;
var projectiles;

start();

function start() {
	window.onload = init;
	window.oncontextmenu = onContextMenu;
	window.onresize = updateCanvasLocation;
	window.onkeydown = onKeyDown;
}

function init() {
	initDocument();
	initGame();
	
	var contentLoaded = false;
	while (!contentLoaded) {
		contentLoaded = true;
		for (var i = 0; i < images.length; i++) {
			if (!images[i].complete) contentLoaded = false;
		}
		if (contentLoaded) requestAnimationFrame(timerTick);
	}
}

function initDocument() {
	// Prepare body
	document.body.style.background = bodyBackColor;
	document.body.style.color = bodyTextColor;
	document.body.style.font = bodyFont;
	
	// Prepare canvas
	canvas = document.getElementById("myCanvas");
	canvas.onmousedown = onMouseDown;
	canvas.onmouseup = onMouseUp;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.Position = canvasPosition;
	canvas.style.borderRadius = canvasBorderRadius;
	canvas.style.background = canvasBackColor;
	canvas.style.cursor = canvasCursor;
	updateCanvasLocation();
	ctx = canvas.getContext("2d");
	
	// Prepare hidden area
	hidden = document.getElementById("hidden");
	hidden.style.visibility = "hidden";
	
	// Prepare music
	hidden.innerHTML += "<audio id=\"music\" autoplay><source src=\"resources/music.mp3\" /></audio>";
	music = document.getElementById("music");
	music.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
}

function initGame() {
	lifeBeings = [];
	projectiles = [];
	
	player = new LifeBeing.Mochi(0, new Vec2((mapWidth - mochiWalkImg1.width) / 2, mapHeight - mapHeight / 7), 0);
	lifeBeings.push(player);
	
	var towerX = (mapWidth - towerImg.width) / 2;
	var towerY = mapHeight / 10 - towerImg.height / 2;
	
	tower0 = new LifeBeing.Tower(0, new Vec2(towerX, mapHeight - towerY - towerImg.height), 0);
	lifeBeings.push(tower0);
	tower1 = new LifeBeing.Tower(1, new Vec2(towerX, towerY), 0);
	lifeBeings.push(tower1);
	
	genMinionWave();
}

function onContextMenu(e) {
	e.preventDefault();
	
	// DO SOMETHING HERE
}

function onKeyDown(e) {
	var key = e.keyCode;
	switch (key) {
		case 65:	// A
			canvas.style.cursor = (canvas.style.cursor == canvasCursor) ? canvasCursorAttack : canvasCursor;
			break;
		case 82:	// R
			initGame();
			break;
		case 83:	// S
			player.stop();
			break;
		default:
			break;
	}
}

function onMouseDown(e) {
	var playerPos = new Vec2((canvas.width - player.Image.width) / 2, (canvas.height - player.Image.height) / 2);
	var boundingRect = canvas.getBoundingClientRect();
	var mousePosition = (new Vec2(e.clientX - boundingRect.left, e.clientY - boundingRect.top)).add(player.Position).subtract(playerPos);
	
	// Reset action
	player.stop();
	
	// Check clicking target or not
	for (var i = 0; i < lifeBeings.length; i++) {
		if (lifeBeings[i].Party != player.Party) {
			for (var j = 0; j < lifeBeings[i].Image.width; j++) {
				for (var k = 0; k < lifeBeings[i].Image.height; k++) {
					if (mousePosition.X >= lifeBeings[i].Position.X &&
						mousePosition.X < lifeBeings[i].Position.X + lifeBeings[i].Image.width &&
						mousePosition.Y >= lifeBeings[i].Position.Y &&
						mousePosition.Y < lifeBeings[i].Position.Y + lifeBeings[i].Image.height) {
						player.Target = lifeBeings[i];
					}
				}
			}
		}
	}
	
	var playerCenter = getCenter(player);
	if (player.Target == null) {
		player.WalkTo = new Vec2(mousePosition.X, mousePosition.Y);
		
		if (canvas.style.cursor == canvasCursorAttack) player.FindTarget = true;
	}
	
	canvas.style.cursor = canvasCursor;
}

function onMouseUp(e) {

}

function timerTick() {
	if (minionSpawnTick > 0) minionSpawnTick--;
	else genMinionWave();
	
	// Move projectiles
	for (var i = 0; i < projectiles.length; i++) {
		var proCenter = getCenter(projectiles[i]);
		var targetCenter = getCenter(projectiles[i].Target);
		var distance = proCenter.subtract(targetCenter);
		var distanceLen = distance.length();
		var distanceNormalized = distance.normalize();
		
		if (distanceLen <= projectiles[i].Speed) {
			// Hit the target
			var target = projectiles[i].Target;
			target.CurHealth -= projectiles[i].Attack;
			projectiles.splice(i, 1);
			
			if (target.CurHealth <= 0) {
				// Remove killed target from other life beings target
				for (var j = 0; j < lifeBeings.length; j++) {
					if (lifeBeings[j].Target == target) {
						lifeBeings[j].Target = null;
						if (lifeBeings[j].FindTarget) lifeBeings[j].WalkTo = lifeBeings[j].FinalDestination;
					}
				}
				
				// Remove killed target from life beings array
				for (var j = 0; j < lifeBeings.length; j++) {
					if (lifeBeings[j] == target) lifeBeings.splice(j, 1);
				}
			}
		}
		else {
			// Move closer to target
			projectiles[i].Position = projectiles[i].Position.subtract(distanceNormalized.scale(projectiles[i].Speed));
			projectiles[i].Rotation = 180 + radianToDegree(computeRadian(upVec2, distanceNormalized));
		}
	}

	// Life beings
	for (var i = 0; i < lifeBeings.length; i++) {
		var life = lifeBeings[i];
		var lifeCenter = getCenter(life);
		
		// Attack delay
		if (life.CurAttackDelay > 0) life.CurAttackDelay--;
		
		// If life being have target, then update movement
		if (life.Target) {
			var targetCenter = getCenter(life.Target);
			var distance = targetCenter.subtract(lifeCenter);
			var distanceLen = distance.length();
			var distanceNormalized = distance.normalize();
			
			if (life.FindTarget && distanceLen > life.SightRange) {
				life.WalkTo = life.FinalDestination;
				life.Target = null;
			}
			else {
				if (distanceLen > life.Range) {
					// Target is outside of attack range
					life.WalkTo = targetCenter;
				}
				else life.WalkTo = lifeCenter;
				
				life.Rotation = radianToDegree(computeRadian(upVec2, distanceNormalized));
			}
		}
		
		// Move life being
		if (life.CurAttackDelay < life.MaxAttackDelay / 2) {
			var centerToDest = life.WalkTo.subtract(lifeCenter);
			var centerToDestLen = centerToDest.length();
			var centerToDestNormalized = centerToDest.normalize();
			if (centerToDestLen > life.Speed) {
				// Not arrived after moving
				life.Position = life.Position.add(centerToDestNormalized.scale(life.Speed));
				life.CurStep++;
				if (life.CurStep >= life.MaxStep) life.CurStep = 0;
			}
			else {
				// Arrived after moving
				life.Position = life.Position.add(centerToDest);
				life.CurStep = 0;
			}
			
			if (centerToDestLen > 0) {
				life.Rotation = radianToDegree(computeRadian(upVec2, centerToDestNormalized));
			}
			
			// Find target
			if (life.Target == null && life.FindTarget) {
				var closestDistance = life.SightRange;
				for (var j = 0; j < lifeBeings.length; j++) {
					var lifeX = lifeBeings[j];
					if (lifeX.Party != life.Party) {
						var lifeXCenter = getCenter(lifeX);
						var distance = lifeXCenter.subtract(lifeCenter);
						var distanceLen = distance.length();
						
						if (distanceLen <= closestDistance) {
							closestDistance = distanceLen;
							life.Target = lifeX;
						}
					}
				}
				
				if (life.Target) life.FinalDestination = life.WalkTo;
			}
		}
		
		// Life being attack
		if (life.Target) {
			var targetCenter = getCenter(life.Target);
			var distance = targetCenter.subtract(lifeCenter);
			var distanceLen = distance.length();
			var distanceNormalized = distance.normalize();
			
			if (distanceLen <= life.Range) {
				if (life.CurAttackDelay == 0) {
					var missilePosition = lifeCenter.add(distanceNormalized.scale(life.Image.height / 2)).subtract(new Vec2(life.MissileImage.width / 2, life.MissileImage.height / 2));
					projectiles.push(new Projectile(life.Target, life.Attack, life.MissileSpeed, life.MissileImage, missilePosition, life.Rotation));
					life.CurAttackDelay = life.MaxAttackDelay;
				}
			}
		}
		
		updateImage(life);
	}
	
	// Invalidate
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	var playerPos = new Vec2((canvas.width - player.Image.width) / 2, (canvas.height - player.Image.height) / 2);
	
	// Draw life beings
	for (var i = lifeBeings.length - 1; i >= 0; i--) {
		var life = lifeBeings[i];
		drawLifeBeing(life.Image, playerPos.add(life.Position).subtract(player.Position), life.Rotation);
	}
	
	// Draw hp bars
	for (var i = 0; i < lifeBeings.length; i++) {
		var life = lifeBeings[i];
		var hpBarY = life.Position.Y - hpBarDistance;
		var point1 = new Vec2(life.Position.X, hpBarY);
		var point2 = new Vec2(life.Position.X + life.Image.width, hpBarY);
		var point3 = new Vec2(life.Position.X + life.Image.width * life.CurHealth / life.MaxHealth, hpBarY);
		var projected1 = playerPos.add(point1).subtract(player.Position);
		var projected2 = playerPos.add(point2).subtract(player.Position);
		var projected3 = playerPos.add(point3).subtract(player.Position);
		drawLine(projected1.X, projected1.Y, projected2.X, projected2.Y);
		drawLine(projected1.X, projected1.Y, projected3.X, projected3.Y, hpBarColor[life.Party]);
	}
	
	// Draw projectiles
	for (var i = 0; i < projectiles.length; i++) drawLifeBeing(projectiles[i].Image, playerPos.add(projectiles[i].Position).subtract(player.Position), projectiles[i].Rotation);
	
	requestAnimationFrame(timerTick);
}