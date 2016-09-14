const Util = require("./util");
const MovingObject = require("./moving_object");
const Mario = require('./mario');
const DEFAULTS = {
	COLOR: "#505050",
	RADIUS: 20,
	SPEED: 4
};

class Coin extends MovingObject {
    constructor(options = {}) {
			options.img = new Image();
	    options.img.src = 'sprites/coin.png';
      options.color = DEFAULTS.COLOR;
      options.pos = options.pos || options.game.randomPosition();
      options.radius = DEFAULTS.RADIUS;
      options.vel = options.vel || Util.randomVec(DEFAULTS.SPEED);
			super(options);
			this.index =  Math.floor(Math.random() * 10);
    }

    collideWith(otherObject) {
      if (otherObject instanceof Mario) {
				otherObject.coins += 1;
				document.getElementById("score").innerHTML = otherObject.coins;
        this.remove();
        return true;
      }
    }
}

module.exports = Coin;
