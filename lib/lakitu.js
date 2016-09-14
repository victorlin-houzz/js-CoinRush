const MovingObject = require("./moving_object");

class Lakitu extends MovingObject {
  constructor(options) {
    options.radius = Lakitu.RADIUS;
    options.img = new Image();
    options.img.src = 'sprites/lakitul.png';
    options.vel = options.vel || [-1, 0];
    super(options);
    this.isWrappable = false;
  }
}

Lakitu.RADIUS = 40;
Lakitu.SPEED = 10;

module.exports = Lakitu;
