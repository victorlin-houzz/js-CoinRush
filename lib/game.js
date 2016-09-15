const Coin = require("./coin");
const Mario = require("./mario");
const Util = require("./util");
const Lakitu = require("./lakitu");
const PoisonMushroom = require("./poison_mushroom");

class Game {
  constructor() {
    this.reset();
  }

  reset() {
    this.coins = [];
    this.marios = [];
    this.lakitus = [];
    this.pMushrooms = [];
    this.remainTime = 30;
  }

  add(object) {
    if (object instanceof Coin) {
      this.coins.push(object);
    } else if (object instanceof Mario) {
      this.marios.push(object);
    } else if (object instanceof Lakitu) {
      this.lakitus.push(object);
    } else if (object instanceof PoisonMushroom) {
      this.pMushrooms.push(object);
    } else {
      throw "wtf?";
    }
  }

  addCoins() {
    for (let i = 0; i < Game.NUM_COINS; i++) {
      this.add(new Coin({
        game: this,
       }));
    }
  }

  addPMushroom() {
    let pmCount = Math.floor(Game.NUM_PMUSHROOMS * Math.random());
    for (let i = 0; i < pmCount; i++) {
      this.add(new PoisonMushroom({
        game: this,
       }));
    }
  }

  addMario() {
    const mario = new Mario({
      pos: [400,450],
      game: this
    });
    this.add(mario);
    return mario;
  }

  addLakitu() {
    const lakitu = new Lakitu({
      pos: [600,40],
      game: this
    });
    this.add(lakitu);
    return lakitu;
  }

  allObjects() {
    return [].concat(this.marios, this.coins, this.lakitus, this.pMushrooms);
  }

  checkCollisions() {
    const allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = 0; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];

        if (obj1.isCollidedWith(obj2)) {
          const collision = obj1.collideWith(obj2);
          if (collision) return;
        }
      }
    }
  }

  draw(ctx, gameLeftTime) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    let bg = new Image();
    bg.src = 'sprites/bg.png';
    ctx.drawImage(bg, 0, 0);
    let coinImg = new Image();
    coinImg.src = 'sprites/coin.png';
    ctx.drawImage(coinImg, Game.DIM_X - 150, 15);
    ctx.font="30px Sans-serif";
    ctx.fillText(' x ' + this.marios[0].coins,Game.DIM_X - 100, 50);
    this.remainTime = Math.round((gameLeftTime) * 100) / 100;
    if (this.remainTime < 0.01) {
      this.remainTime = 0;
    }
    ctx.fillText(' Time: ' + this.remainTime, 10, 50);

    this.allObjects().forEach((object) => {
      object.draw(ctx, object.img);
    });
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  handleInput() {
    if (!this.marios[0].bumped) {
      if (input.isDown('LEFT')) {
        this.marios[0].run(Game.MOVES['left'][0]);
        this.marios[0].facingRight = false;
      } else if (input.isDown('RIGHT')) {
        this.marios[0].run(Game.MOVES['right'][0]);
        this.marios[0].facingRight = true;
      } else {
        this.marios[0].noRun();
      }
      if (input.isDown('SPACE')) {
        this.marios[0].jump();
      } else {
        this.marios[0].noJump();
      }
    }

  }

  moveObjects(delta) {
    this.allObjects().forEach((object) => {
      object.move(delta);
    });
    this.marios.forEach(mario => {
      mario.checkBumped(delta);
    });
    this.coins.forEach((coin) => {
      coin.checkOnTheGround(delta);
    });
    this.pMushrooms.forEach((pm) => {
      pm.checkOnTheGround(delta);
    });
  }

  randomPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  remove(object) {
    if (object instanceof Coin) {
      this.coins.splice(this.coins.indexOf(object), 1);
    } else if (object instanceof Mario) {
      this.marios.splice(this.marios.indexOf(object), 1);
    } else if (object instanceof PoisonMushroom) {
      this.pMushrooms.splice(this.pMushrooms.indexOf(object), 1);
    } else {
      throw "wtf?";
    }
  }

  step(delta) {
    this.handleInput();
    this.moveObjects(delta);
    this.checkCollisions();
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }
}

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 700;
Game.FPS = 32;
Game.NUM_COINS = 25;
Game.NUM_PMUSHROOMS = 2;
Game.MOVES = {
  "left": [-6,  0],
  "right": [ 6,  0],
};
module.exports = Game;
