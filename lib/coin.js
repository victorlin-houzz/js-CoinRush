const Util = require("./util");
const MovingObject = require("./moving_object");
const Mario = require('./mario');
const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 20,
	SPEED: 6
};

class Coin extends MovingObject {
    constructor(options = {}) {
			options.img = new Image();
	    options.img.src = 'sprites/coin.png';
      options.color = DEFAULTS.COLOR;
      options.pos = options.pos || options.game.lakitus[0].pos;
      options.radius = DEFAULTS.RADIUS;
      options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
			super(options);
			this.index =  Math.floor(Math.random() * 10);
			this.isWrappable = false;
			this.startTime = 0;
			this.emptyCoin = new Image();
			this.emptyCoin.src = 'sprites/coin_empty.png';
			this.coinAud = new Audio('sounds/coin.wav');
    }

    collideWith(otherObject) {
      if (otherObject instanceof Mario && !otherObject.bumped) {
				if (otherObject.bonus) {
					otherObject.coins += 2;
				} else {
					otherObject.coins += 1;
				}
				this.coinAud.play();
        this.remove();
        return true;
      }
    }

		checkOnTheGround(delta) {
			if (this.pos[1] >= 550) {
				this.vel = [0, 0];
				this.startTime += delta;
			}
			let check = Math.floor((this.startTime) % 10);
			if (this.startTime > 10 && (check === 7 || check === 8 || check === 9)) {
				this.img = this.emptyCoin;
			}
			if (this.startTime > 2000) {
				this.remove();
			}
			// console.log(this.startTime);
		}
}

module.exports = Coin;
