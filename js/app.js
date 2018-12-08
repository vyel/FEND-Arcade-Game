
/*
    Create game objects
*/
class Enemy {
    constructor (x, y){
        this.x = x;
        this.y = y;
        // Assign speed a random value
        this.speed = this.getRandomInt(100, 200);
        this.sprite = 'images/enemy-bug.png';
    }
    // Function taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    getRandomInt(min, max) {
        this.min = Math.ceil(min);
        this.max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    // Parameter: dt, a time delta between ticks
    update(dt) {
        // Multiply enemies movements by the dt parameter to ensure the game runs
        // at the same speed for all computers
        this.x += this.speed * dt;
        // Reset enemies positions and assign a random speed after every reset
        if (this.x > 5 * 101){
            this.x = -101;
            this.speed = this.getRandomInt(300, 400);
        }

        // If player collides with the enemies, reset the player to original position and decrement lives
        if ((Math.abs(this.x - player.x) < 101) && Math.abs(this.y - player.y) < 70) {
            player.reset();
            gamePanel.decrementLives();
        }
    };

    // Draw the enemy on canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
};


class Player {
    constructor(){
        this.x = 202;
        this.y = 405;
        this.player = 'images/char-horn-girl.png';
    }

    update(){
        // Prevent player from moving beyond game boundaries
        if(this.x < 0) {
            this.x = 0;
        };
        if(this.x> 404) {
            this.x = 404;
        };
        if(this.y > 404){
            this.y = 404;
        };
        if(this.y < 0){
            this.y = 0;
            // If player reaches water, reset player's position
            setTimeout(() => {
                this.reset();
            }, 100);
        };

        // Reset player's position when the game is over and make it unable to move
        if (gamePanel.life !== 0){
            if(gamePanel.score === 15) {
                setTimeout(() => {
                    this.reset();
                }, 0);
            };
        } else {
            setTimeout(() => {
                this.reset();
            }, 0);
        };
    };
    // Reset player to initial position function
    reset(){
        this.x = 202;
        this.y = 405;
    };
    // Draw the player on canvas
    render(){
        ctx.drawImage(Resources.get(this.player), this.x, this.y);
    };
    // Move player using the arrow keys
    handleInput(keyPress){
        switch (keyPress) {
            case "left":
                this.x -= 101;
                break;
            case'right':
                this.x += 101;
                break;
            case 'up':
                this.y -= 83;
                break;
            case 'down':
                this.y += 83;
                break;
        };
    };
};

class Gem {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.gems = 3;
        this.gemImage = 'images/Gem Blue.png';
    }

    update() {
        // If player collides with a gem, hide it and increment the score
        if ((Math.abs(this.x - player.x) < 101) && Math.abs(this.y - player.y) < 70) {
            this.x = -500;
            gamePanel.incrementScore();
        }
    }
    // Draw the gem on canvas
    render(){
        ctx.drawImage(Resources.get(this.gemImage), this.x+15, this.y+40, 71, 111);
    }
};

class ScorePanel {
    constructor(){
        this.lifeImg = "images/Heart.png";
        this.life = 3;
        this.score = 0;
    };

    decrementLives(){
        this.life--;
    };

    incrementScore(){
        this.score++;
    };

    message(txt, font, x, y, color, txtAlign){
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(txt, x, y);
        ctx.textAlign = txtAlign;
    };

    render(){
        // Draw player lives on canvas
        let x = 0;
        for (let i=0; i<this.life; i++){
            ctx.drawImage(Resources.get(this.lifeImg), x, 0, 50, 60);
            x += 50;
        }
        // Add score on canvas
        this.message(`Score: ${this.score}`, "30px Arial", 370, 40, "white", );

        if (this.life !== 0){
            if(gamePanel.score === 15) {
                // Message to display is player wins
                ctx.fillStyle = "rgba(14, 31, 9, 0.8)";
                ctx.fillRect(0, 306/2, 505, 606/2);
                this.message("Game won!", "60px Arial", 505/2, 506/2, "white", "center");
                this.message(`You have collected all ${this.score} gems.`, "30px Arial", 505/2, 353, "white", "center");
            };
        } else {
            // Message to display if player loses
            ctx.fillStyle = "rgba(14, 31, 9, 0.8)";
            ctx.fillRect(0, 306/2, 505, 606/2);
            this.message("Game over!", "60px Arial", 505/2, 506/2, "white", "center");
            this.message(`You have failed to collect all gems.`, "30px Arial", 505/2, 353, "white", "center");
            this.message(`Gems collected: ${this.score}/15`, "30px Arial", 505/2, 403, "white", "center");
        };
    };
};

/*
    Instantiate game objects: player, enemies, gems, score panel
*/

// Instantiate player
const player = new Player();

// Instantiate enemies
let allEnemies = [];
let enemyLocation = [63, 63, 147, 230];

enemyLocation.forEach(function(yIndex){
    enemy = new Enemy(0, yIndex);
    allEnemies.push(enemy);
});

// Instantiate gems
let allGems = [];
const gemLocationX = [0, 101, 201, 303, 404, 505];

//populate the stone area with gems
gemLocationX.forEach(function(xIndex){
    gem1 = new Gem(xIndex, 63);
    gem2 = new Gem(xIndex, 147);
    gem3 = new Gem(xIndex, 230);
    allGems.push(gem1, gem2, gem3);
});

// Instantiate score panel
let gamePanel = new ScorePanel();


// Listen for key presses and sends the keys to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


