class Play extends Phaser.Scene {

    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship2', './assets/spaceship2.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('particle', './assets/particle.png');

        // load explosion spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png',
                                {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // BG
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield')
        .setOrigin(0, 0);


        // UI
        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);
        // score
        this.p1Score = 0;
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);


        // timer display
        this.timeLeft = game.settings.gameTimer;
        this.timeDisplay = this.add.text(470, 54, this.timeLeft / 1000, scoreConfig);
        // game over flag
        this.gameOver = false;
        // call function which decrements timeLeft every second
        this.decrementTimer();

        // high score display
        this.highScore = this.add.text(269, 54,game.settings.highScore, scoreConfig);

        // ASSETS
        // add rocket (p1)
        // constructor(scene, x, y, texture, frame)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431,
                                    'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        // add spaceship (3x)
        this.ship01 = new Spaceship(this, this.game.config.width+192, 132,
                                    'spaceship', 0, 30, 'standard').setOrigin(0, 0);
        this.ship02 = new Spaceship(this, this.game.config.width+96, 196,
                                    'spaceship', 0, 20, 'standard').setOrigin(0, 0);
        this.ship03 = new Spaceship(this, this.game.config.width, 260,
                                    'spaceship', 10, 10, 'standard').setOrigin(0, 0);
        this.ship04 = new Spaceship(this, this.game.config.width, 300,
                                    'spaceship2', 10, 25, 'fast').setOrigin(0, 0);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30,
        })


        // INPUT
        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        
        // trigger game over if timeLeft runs out
        if (this.timeLeft == 0){
            this.gameOver = true;
            this.gameOverText();
        }

        // check input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        // check input for menu
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        // scroll starfield
        this.starfield.tilePositionX -= 4;

        // update sprites
        if (!this.gameOver){
            // update rocket
            this.p1Rocket.update();
            // update spaceship
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
    }

    shipExplode(ship) {
        this.sound.play('sfx_explosion');       // play explosion sfx
        ship.alpha = 0;                         // temporarily hide ship

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });

        // particle
        let particles = this.add.particles('particle');
        let emitter = particles.createEmitter();
        emitter.setPosition(ship.x, ship.y);
        emitter.setSpeed(400);
        // destroy particle emitter after set time
        this.particleClock = this.time.delayedCall(200, () => {
            particles.destroy();
        }, null, this);


        

        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // increase time and repaint
        this.timeLeft += 2000;
        this.timeDisplay.text = this.timeLeft/1000;

        // increase high score and repaint (if applicable)
        if (this.p1Score > game.settings.highScore) {
            game.settings.highScore = this.p1Score;
            this.highScore.text = game.settings.highScore;
        }

    }

    decrementTimer() {
        if(this.timeLeft > 0) {
            this.clock = this.time.delayedCall(1000, () => {
                this.timeLeft -= 1000;
                this.timeDisplay.text = this.timeLeft/1000;
                this.decrementTimer();
                }, null, this);
        }
    }

    gameOverText() {
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // add game over text
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
    }
}