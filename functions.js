function getElement (id) {
	return document.getElementById(id);
}

function genMinionWave () {
	var zombieX = (mapWidth - whiteZombieImg.width) / 2;
	
	// Party0
	lifeBeings.push(new LifeBeing.WhiteZombie(0, new Vec2(zombieX, mapHeight - mapHeight / 8 - whiteZombieImg.height), 0));
	lifeBeings.push(new LifeBeing.WhiteZombie(0, new Vec2(zombieX + mapWidth / 20, mapHeight - mapHeight / 7 - whiteZombieImg.height), 0));
	lifeBeings.push(new LifeBeing.WhiteZombie(0, new Vec2(zombieX - mapWidth / 20, mapHeight - mapHeight / 7 - whiteZombieImg.height), 0));
	
	// Party1
	lifeBeings.push(new LifeBeing.WhiteZombie(1, new Vec2(zombieX, mapHeight / 8), 180));
	lifeBeings.push(new LifeBeing.WhiteZombie(1, new Vec2(zombieX - mapWidth / 20, mapHeight / 7), 180));
	lifeBeings.push(new LifeBeing.WhiteZombie(1, new Vec2(zombieX + mapWidth / 20, mapHeight / 7), 180));
	
	for (var i = 0; i < lifeBeings.length; i++) {
		var life = lifeBeings[i];
		if (life.Party == 0 && life != player) {
			life.FindTarget = true;
			life.WalkTo = getCenter(tower1);
		}
		else if (life.Party == 1) {
			life.FindTarget = true;
			life.WalkTo = getCenter(tower0);
		}
	}
	
	minionSpawnTick = minionSpawnTime;
}

function updateImage (life) {
	var index = (life.CurStep / (life.MaxStep / life.WalkImages.length)) >> 0;
	index = clamp(index, 0, life.WalkImages.length - 1);
	life.Image = life.WalkImages[index];
	if (life.Target) {
		var lifeCenter = getCenter(life);
		var targetCenter = getCenter(life.Target);
		var distance = targetCenter.subtract(lifeCenter);
		var distanceLen = distance.length();
		
		if (distanceLen <= life.Range) {
			var index = (life.CurAttackDelay / (life.MaxAttackDelay / life.AttackImages.length)) >> 0;
			index = clamp(index, 0, life.AttackImages.length - 1);
			life.Image = life.AttackImages[index];
		}
	}
}

function updateCanvasLocation () {
	canvas.style.left = (window.innerWidth - canvas.width) / 2;
	canvas.style.top = (window.innerHeight - canvas.height) / 2;
}

function pause () {
	gState = 0;
	bgm.pause();
}

function resume () {
	gState = 1;
	bgm.play();
}

function playAudio (audio) {
	audio.currentTime = 0;
	audio.play();
}

function stopAudio (audio) {
	audio.pause();
	audio.currentTime = 0;
}

function newImg (path) {
	tempImg = new Image();
	tempImg.src = path;
	images.push(tempImg);
	return tempImg;
}

function drawImage (image, x, y, w, h) {
	w = (w == null) ? image.width : w;
	h = (h == null) ? image.height : h;
	ctx.drawImage(image, x, y, w, h);
}

function drawLifeBeing (image, position, rotation) {
	var centerX = position.X + image.width / 2;
	var centerY = position.Y + image.height / 2;
	
	ctx.save();
	ctx.translate(centerX, centerY);
	ctx.rotate(degreeToRadian(rotation));
	ctx.translate(-centerX, -centerY);
	drawImage(image, position.X, position.Y);
	ctx.restore();
}

function fillRect (x, y, w, h, s) {
	ctx.fillStyle = s == null ? "#000" : s;
	ctx.fillRect(x, y, w, h);
}

function drawLine (x1, y1, x2, y2, s) {
	ctx.strokeStyle = (s == null) ? "#000" : s;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.stroke();
}

function drawRect (x, y, w, h, s) {
	ctx.strokeStyle = (s == null) ? "#000" : s;
	ctx.lineWidth = scaling;
	ctx.beginPath();
	ctx.strokeRect(x, y, w, h);
	ctx.closePath();
	ctx.stroke();
}

function drawMessage (msg, x, y, align) {
	ctx.textAlign = (align == null) ? "start" : align;
	ctx.font = msgFont;
	ctx.fillStyle = msgFontColor;
	ctx.fillText(msg, x, y + 12);
	ctx.textAlign = "start";
}

function floor (value, floor) {
	return Math.floor(value / floor) * floor;
}

function clamp (value, min, max) {
	return Math.max(Math.min(value, max), min);
}

function getCenter (object) {
	return object.Image ? new Vec2(object.Position.X + object.Image.width / 2, object.Position.Y + object.Image.height / 2) : object.Position;
}

function computeDot (left, right) {
	return left.X * right.X + left.Y * right.Y;
}

function computeRadian (left, right) {
	var plusMinus = (right.X >= left.X) ? 1 : -1;
	return Math.acos(computeDot(left, right)) * plusMinus;
}

function radianToDegree (radian) {
	return radian * 57.2957795;
}

function degreeToRadian (degree) {
	return degree * Math.PI / 180;
}

function rotate (point, center, degree) {
	var radian = degreeToRadian(degree);
	var sin = Math.sin(radian);
	var cos = Math.cos(radian);
	var x = center.X + (point.X - center.X) * cos - (point.Y - center.Y) * sin;
	var y = center.Y + (point.X - center.X) * sin + (point.Y - center.Y) * cos;
	return new Vec2(x, y);
}