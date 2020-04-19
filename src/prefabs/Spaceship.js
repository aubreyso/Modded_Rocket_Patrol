class Spaceship extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y, texture, frame, pointValue) {
        // call parent constructor
        super(scene, x, y, texture, frame);

        scene.add.existing(this);    // add object to existing scene
        this.points = pointValue;
    }

    update() {
        // move spaceship left
        //this.x -= 3;
        this.x -= game.settings.spaceshipSpeed;

        // wraparound screen bounds
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}