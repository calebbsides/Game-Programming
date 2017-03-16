window.onload = init;

var canvas, 
    ctx, 
    xWing,
    blast,
    currX, 
    gameTimer,
    attackTimer,
    score,
    numLives;

var speed;
var spacebar = 32;
var leftKey = 37;
var rightKey = 39;
var enterKey = 13;

var playing = false;

var shieldCharge;

var blasts = new Array();
var attackBlasts = new Array();
var fighters = new Array();

var keys = {};

function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    ctx.fillStyle = "white";
    ctx.font = GAME_FONTS;

    clearCanvas();
    
    currX = XWING_START_X;
    
    canvas.addEventListener("keydown", keyPress, true);
    
    score = 0;
    numLives = 3;
    shieldCharge = 5;
    speed = 2;
    
    createWave();
    
    attackTimer = setInterval(function() {
        var r = Math.floor(Math.random() * fighters.length);
        var attacker = fighters[r];
        var attack = new Blast(attacker.fighterX, attacker.fighterY);
        attackBlasts.push(attack);
    }, 1000);
    
    if(playing)
        gameTimer = setInterval(gameLoop, TIME_PER_FRAME);
    else {
        ctx.fillText("Press ENTER to Play", 175, 225);
    }
}

function clearCanvas() {
    ctx.drawImage(BACKGROUND, 0, 0, BACKGROUND_WIDTH, BACKGROUND_HEIGHT);
}

function gameLoop() {
    clearCanvas();
    
    //draw Shield
    if(shieldCharge != 0)
        ctx.drawImage(SHIELD, currX - XWING_WIDTH, XWING_START_Y - XWING_HEIGHT, SHIELD_WIDTH, SHIELD_HEIGHT);

    //draw xwing
    ctx.drawImage(XWING, currX, XWING_START_Y, XWING_WIDTH, XWING_HEIGHT);
        
    //draw fighters
    for(var i = 0; i < fighters.length; i++) {
        var f = fighters[i];
        
        ctx.drawImage(FIGHTER, f.fighterX, f.fighterY, FIGHTER_WIDTH, FIGHTER_HEIGHT);
        
        f.fighterX += speed;
        if(f.fighterX + FIGHTER_WIDTH >= CANVAS_WIDTH || f.fighterX <= 0) {
            f.fighterX -= speed;
            speed *= -1;
            fighters.forEach(function(f) {
                f.fighterY += FIGHTER_HEIGHT;
            });
        }
        
        //if fighters reach the player
        if(f.fighterY >= CANVAS_HEIGHT - XWING_HEIGHT*3) {
            if(numLives != 0) {
                numLives--;
                fighters.length = 0;
                createWave();
            }
        }
    }
    
    //draw blaster fire
    for(var i = 0; i < blasts.length; i++) {
        var b = blasts[i];
        ctx.drawImage(BLAST, b.blastX, b.blastY, BLAST_WIDTH, BLAST_HEIGHT);
        b.blastY -= BLAST_HEIGHT*2;
        if(b.blastY <= 0) {
            blasts.splice(0, 1);
        }
    }
    
    //draw attacks
    for(var i = 0; i < attackBlasts.length; i++) {
        var a = attackBlasts[i];
        ctx.drawImage(ATTACK, a.blastX, a.blastY, ATTACK_WIDTH, ATTACK_HEIGHT);
        a.blastY += 10;
        if(a.blastY <= 0) {
            attackBlasts.splice(0, 1);
        }
    }
    
    //check for enemy hits
    for(var i = 0; i < blasts.length; i++) {
        var b = blasts[i];
        for(var j = 0; j < fighters.length; j++) {
            var f = fighters[j];
            if(hit(b, f)) {
                score += 100;
                fighters.splice(j, 1);
                blasts.splice(i, 1);
                ctx.drawImage(HIT, f.fighterX, f.fighterY, HIT_WIDTH, HIT_HEIGHT);
            }
        }
    }
    
    //check for friendly hits
    for(var i = 0; i < attackBlasts.length; i++) {
        var a = attackBlasts[i];
        if(a.blastX >= currX && a.blastX <= currX + XWING_WIDTH &&
            a.blastY >= XWING_START_Y && a.blastY <= XWING_START_Y + XWING_HEIGHT) {
            attackBlasts.splice(i, 1);
            if(shieldCharge <= 0) {
                ctx.drawImage(HIT, currX, XWING_START_Y, XWING_WIDTH, XWING_HEIGHT);
                numLives--;
            } else {
                shieldCharge--;
            }
        }
    }
    
    //if player clears the wave
    if(fighters.length == 0) {
        shieldCharge += 2;
        score += 2187;
        createWave();
    }
    
    if(numLives == 0) {
        gameOver();
    }

    ctx.fillText("SCORE: " + score, 10, 20);
    ctx.fillText("SHIELDCHARGE: " + shieldCharge, 175, 20);
    ctx.fillText("LIVES: ", CANVAS_WIDTH - XWING_WIDTH * 3, 20);
    
    var livesX = CANVAS_WIDTH - XWING_WIDTH*2;
    
    for(var i = 0; i < numLives; i++) {
        ctx.drawImage(XWING, livesX, 5, 30, 30);
        livesX += 30;
    }
    
}// gameLoop

function keyPress(evt) {
    keys[evt.keyCode] = true;
    
    if(keys[leftKey]) {
        currX -= 15;
        if(currX < 0) currX = 0;
    } else if(keys[rightKey]) {
        currX += 15;
        if(currX + XWING_WIDTH >= CANVAS_WIDTH) currX = CANVAS_WIDTH - XWING_WIDTH;
    } else if(keys[spacebar]) {
        var b = new Blast(currX + XWING_WIDTH/2, BLAST_START);
        blasts.push(b);
    } else if(keys[enterKey]) {
        playing = true;
        clearCanvas();
        clearInterval(attackTimer);
        clearInterval(gameTimer);
        blasts.length = 0;
        fighters.length = 0;
        attackBlasts.length = 0;
        init();
    }
    
    keys[evt.keyCode] = false;
}

function Blast(blastX, blastY) {
    this.blastX = blastX;
    this.blastY = blastY;
}

function Fighter(fighterX, fighterY) {
    this.fighterX = fighterX;
    this.fighterY = fighterY;
}

function createWave() {
    var x = 0;
    var y = 50;
    
    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 13; j++) {
            var f = new Fighter(x, y);
            fighters.push(f);
            
            x += FIGHTER_WIDTH;
        }
        
        y += FIGHTER_HEIGHT;
        x = 0;
    }
}

function gameOver() {
    clearCanvas();
    clearInterval(gameTimer);
    ctx.fillText("Game Over", 225, 225);
}

function hit(b, f) {
    if(b.blastX >= f.fighterX && b.blastX <= f.fighterX + FIGHTER_WIDTH &&
        b.blastY >= f.fighterY && b.blastY <= f.fighterY + FIGHTER_HEIGHT) {
        return true;
    } else {
        return false;
    }
}