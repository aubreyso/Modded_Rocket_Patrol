class Spaceship extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, pointValue, shipType) {
        // call parent constructor
        super(scene, x, y, texture, frame);

        scene.add.existing(this);    // add object to existing scene

        this.shipType = shipType;
        if(shipType == 'standard') {
            this.points = pointValue;
        }
        else {
            this.points = pointValue*2;
        }
    }

    update() {
        // move spaceship left
        if(this.shipType == 'standard') {
            this.x -= game.settings.spaceshipSpeed;
        }
        // move spaceship left (type 2)
        else if (this.shipType == 'fast') {
            this.x -= game.settings.spaceshipSpeed*2;
        }

        // wraparound screen bounds
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}