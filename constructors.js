function Background (image, position, z) {
	this.Image = image;
	this.Position = position;
	this.Z = (z == null) ? backgroundZIndex : z;
}

function Camera (position, z, speed) {
	this.Position = position;
	this.Z = (z == null) ? 1 : z;
	this.Speed = (speed == null) ? cameraSpeed : speed;
}

function LifeBeing (health, attack, range, attackDelay, missileSpeed, missileImage, sightRange, speed, stepCounter, walkImages, attackImages, party, position, rotation) {
	this.CurHealth = this.MaxHealth = health;
	this.Attack = attack;
	this.Range = range;
	this.CurAttackDelay = 0;
	this.MaxAttackDelay = attackDelay;
	this.MissileSpeed = missileSpeed;
	this.MissileImage = missileImage;
	this.SightRange = sightRange;
	this.Speed = speed;
	this.CurStep = 0;
	this.MaxStep = stepCounter;
	this.WalkImages = walkImages;
	this.AttackImages = attackImages;
	this.Image = this.WalkImages[0];
	this.Party = party;
	this.Position = position;
	this.Rotation = rotation;
	
	this.stop();
}

LifeBeing.prototype.stop = function () {
	this.WalkTo = getCenter(this);
	this.Target = null;
	this.FindTarget = false;
}

LifeBeing.Mochi = function (party, position, rotation) {
	party = (party == null) ? 1 : party;
	position = (position == null) ? Vec2.Zero() : position;
	rotation = (rotation == null) ? 0 : rotation;
	var health = 100;
	var attack = 5;
	var range = 200;
	var attackDelay = 30;
	var missileSpeed = 8;
	var missileImage = fireBallImg;
	var sightRange = 250;
	var speed = 4;
	var stepCounter = 15;
	var walkImages = [mochiWalkImg1, mochiWalkImg2];
	var attackImages = [mochiAttackImg1, mochiAttackImg2, mochiAttackImg3];
	return new LifeBeing(health, attack, range, attackDelay, missileSpeed, missileImage, sightRange, speed, stepCounter, walkImages, attackImages, party, position, rotation);
}

LifeBeing.WhiteZombie = function (party, position, rotation) {
	party = (party == null) ? 0 : party;
	position = (position == null) ? Vec2.Zero() : position;
	rotation = (rotation == null) ? 0 : rotation;
	var health = 50;
	var attack = 2;
	var range = 40;
	var attackDelay = 30;
	var missileSpeed = 30;
	var missileImage = scratchImg;
	var sightRange = 250;
	var speed = 2;
	var stepCounter = 15;
	var walkImages = [whiteZombieImg];
	var attackImages = [whiteZombieImg];
	return new LifeBeing(health, attack, range, attackDelay, missileSpeed, missileImage, sightRange, speed, stepCounter, walkImages, attackImages, party, position, rotation);
}

LifeBeing.Tower = function (party, position, rotation) {
	party = (party == null) ? 0 : party;
	position = (position == null) ? Vec2.Zero() : position;
	rotation = (rotation == null) ? 0 : rotation;
	var health = 600;
	var attack = 10;
	var range = 300;
	var attackDelay = 30;
	var missileSpeed = 8;
	var missileImage = bulletImg;
	var sightRange = 300;
	var speed = 0;
	var stepCounter = 15;
	var walkImages = [towerImg];
	var attackImages = [towerImg];
	return new LifeBeing(health, attack, range, attackDelay, missileSpeed, missileImage, sightRange, speed, stepCounter, walkImages, attackImages, party, position, rotation);
}

function Projectile (target, attack, speed, image, position, rotation) {
	rotation = (rotation == null) ? 0 : rotation;
	this.Target = target;
	this.Attack = attack;
	this.Speed = speed;
	this.Image = image;
	this.Position = position;
	this.Rotation = rotation;
}

function Vec2 (x, y) {
	this.X = x;
	this.Y = y;
}

Vec2.prototype.length = function () {
	return Math.sqrt(this.X * this.X + this.Y * this.Y);
};

Vec2.prototype.normalize = function () {
	var length = this.length();
	return new Vec2(this.X / length, this.Y / length);
}

Vec2.prototype.add = function (vec) {
	return new Vec2(this.X + vec.X, this.Y + vec.Y);
}

Vec2.prototype.subtract = function (vec) {
	return new Vec2(this.X - vec.X, this.Y - vec.Y);
}

Vec2.prototype.scale = function (scale) {
	return new Vec2(this.X * scale, this.Y * scale);
}

Vec2.Zero = function () {
	return new Vec2(0, 0);
}

function Vec3 (x, y, z) {
	this.X = x;
	this.Y = y;
	this.Z = z;
}

Vec3.prototype.length = function () {
	return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
}

Vec3.prototype.normalize = function () {
	var length = this.length();
	return new Vec3(this.X / length, this.Y / length, this.Z / length);
}

Vec3.prototype.add = function (vec) {
	return new Vec3(this.X + vec.X, this.Y + vec.Y, this.Z + vec.Z);
}

Vec3.prototype.subtract = function (vec) {
	return new Vec3(this.X - vec.X, this.Y - vec.Y, this.Z - vec.Z);
}

Vec3.prototype.scale = function (scale) {
	return new Vec3(this.X * scale, this.Y * scale, this.Z * scale);
}

Vec3.Zero = function () {
	return new Vec3(0, 0, 0);
}
