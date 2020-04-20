// Terence So
// (15) display for remaining time (top right)
// (25) add time for successful hits
// (10) persistent high score (top middle)
// (25) new ship type (smaller, faster, worth more)
// (25) particle emitter when rocket hits the spaceship

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
}

let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
    highScore: 0,
}

// reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT; //640 - 47