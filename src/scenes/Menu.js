class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        // display menu text
        //this.add.text(20, 20, "Rocket Patrol Menu");

        // menu display
        let menuConfig = {
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

        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY-textSpacer, 'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'Use ←→ arrows to move & (F) to Fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY+textSpacer, 'Press ← for Easy or → for Hard', menuConfig).setOrigin(0.5);

        // INPUT
        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // launch the next scene
        //this.scene.start("playScene");
    }

    update() {
        // easy mode
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            {
                game.settings.spaceshipSpeed = 3;
                game.settings.gameTimer = 6000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }

        // hard mode
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            {
                game.settings.spaceshipSpeed = 3;
                game.settings.gameTimer = 6000
            }
            this.sound.play('sfx_select');
            this.scene.start("playScene");
        }
    }
}