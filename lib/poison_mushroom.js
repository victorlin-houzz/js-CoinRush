const Util = require("./util");
const MovingObject = require("./moving_object");
const Mario = require('./mario');
const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 25,
	SPEED: 7
};

class PoisonMushroom extends MovingObject {
    constructor(options = {}) {
			options.img = new Image();
	    options.img.src = 'sprites/orbpm.png';
      options.pos = options.pos || options.game.lakitus[0].pos;
      options.radius = DEFAULTS.RADIUS;
      options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
			super(options);
			this.index =  Math.floor(Math.random() * 10);
			this.isWrappable = false;
			this.startTime = 0;
			this.emptyCoin = new Image();
			this.emptyCoin.src = 'sprites/coin_empty.png';
			this.bumpAud = new Audio('sounds/bump.wav');
    }

    collideWith(otherObject) {
      if (otherObject instanceof Mario && !otherObject.bumped) {
        this.remove();
				otherObject.bumped = true;
				this.bumpAud.play();
        return true;
      }
    }

		checkOnTheGround(delta) {
			if (this.pos[1] >= 550) {
				this.vel = [0, 0];
				this.startTime += delta;
			}
			let check = Math.floor((this.startTime) % 10);
			if (this.startTime > 1000) {
				this.remove();
			}
			// console.log(this.startTime);
		}
}

module.exports = PoisonMushroom;
