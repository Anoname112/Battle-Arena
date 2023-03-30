const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isPortrait = window.innerWidth < window.innerHeight;

const bodyMargin = "0";
const bodyBackColor = "transparent";
const bodyTextColor = "#000000";
const bodyFontSize = 15;
const bodyFont = bodyFontSize + "px Segoe UI";
const canvasBorderRadius = 0;
const canvasBackColor = "#333333";
const canvasPosition = "fixed";
const canvasCursor = "pointer";
const canvasCursorAttack = "crosshair";
const audioVisibility = "hidden";
const msgY = 15;
const msgTextColor = "#000000";
const msgFontSize = 13;
const msgFont = msgFontSize + "px Consolas";

const upVec2 = new Vec2(0, -1);
const mapWidth = 1455;
const mapHeight = 726;
const minionSpawnTime = 600;
const hpBarDistance = 10;
const hpBarColor = {
	0: "#00FF00",
	1: "#FF0000"
};

// Image
const images = [];
const mochiWalkImg1 = newImg("resources/playerWalk1.png");
const mochiWalkImg2 = newImg("resources/playerWalk2.png");
const mochiAttackImg1 = newImg("resources/playerAttack1.png");
const mochiAttackImg2 = newImg("resources/playerAttack2.png");
const mochiAttackImg3 = newImg("resources/playerAttack3.png");
const whiteZombieImg = newImg("resources/zombie.png");
const towerImg = newImg("resources/tower.png");
const fireBallImg = newImg("resources/fireball.png");
const bulletImg = newImg("resources/bullet.png");
const scratchImg = newImg("resources/scratch.png");
