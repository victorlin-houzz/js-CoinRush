class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.mario = this.game.addMario();
    this.lakitu = this.game.addLakitu();

    this.marioL1 = new Image();
    this.marioL1.src = 'sprites/mariol1.png';
    this.marioL2 = new Image();
    this.marioL2.src = 'sprites/mariol2.png';
    this.marioR1 = new Image();
    this.marioR1.src = 'sprites/marior1.png';
    this.marioR2 = new Image();
    this.marioR2.src = 'sprites/marior2.png';
    this.marioRj = new Image();
    this.marioRj.src = 'sprites/mariorj.png';
    this.marioLj = new Image();
    this.marioLj.src = 'sprites/mariolj.png';

    this.lakituL = new Image();
    this.lakituL.src = 'sprites/lakitul.png';
    this.lakituR = new Image();
    this.lakituR.src = 'sprites/lakitur.png';
  }

  bindKeyHandlers() {
    const mario = this.mario;

    // Object.keys(GameView.MOVES).forEach((k) => {
    //   let move = GameView.MOVES[k];
    //   key(k, () => { mario.power(move[0]); });
    // });
    //
    // key("space", () => { mario.jump(); });
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    this.marioAnime(time);
    this.lakituAnime(time);
    this.coinAnime(time);
    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;
    //every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }

  marioAnime(time) {
    if (this.mario.vel[0] === 0) {
      if (this.mario.facingRight) {
        this.mario.img = this.marioR1;
      } else {
        this.mario.img = this.marioL1;
      }
    } else if (((time / 50) % 2) <1) {
      if (this.mario.facingRight) {
        this.mario.img = this.marioR1;
      } else {
        this.mario.img = this.marioL1;
      }
    } else {
      if (this.mario.facingRight) {
        this.mario.img = this.marioR2;
      } else {
        this.mario.img = this.marioL2;
      }
    }
    if (this.mario.jumping && this.mario.facingRight) {
      this.mario.img = this.marioRj;
    } else if (this.mario.jumping && this.mario.facingRight === false) {
      this.mario.img = this.marioLj;
    }
  }

  lakituAnime(time) {
    let newVel = 2 * Math.random();
    if (this.lakitu.pos[0] < 60 || this.lakitu.pos[0] > 900) {
      this.lakitu.vel[0] = -this.lakitu.vel[0];
    }
    if (((time / 300) % 2) < 1) {
      this.lakitu.vel[0] -= newVel;
      if (this.lakitu.vel[0] > 15) {
        this.lakitu.vel[0] -= newVel;
      } else if (this.lakitu.vel[0] < -15) {
        this.lakitu.vel[0] += newVel;
      }
    } else {
      this.lakitu.vel[0] += newVel;
      if (this.lakitu.vel[0] > 15) {
        this.lakitu.vel[0] -= newVel;
      } else if (this.lakitu.vel[0] < -15) {
        this.lakitu.vel[0] += newVel;
      }
    }

    if (this.lakitu.vel[0] < -2) {
      this.lakitu.img = this.lakituL;
    } else if (this.lakitu.vel[0] > 2) {
      this.lakitu.img = this.lakituR;
    }
  }

  coinAnime(time) {
    let coins = this.game.coins;
    let images = [];
    for (var i = 1; i <= 10; i++) {
      let coinImage = new Image();
      coinImage.src = `sprites/coin${i}.png`;
      images.push(coinImage);
    }
    coins.forEach(coin => {
      let newIdx = Math.floor((time / 100) % 10);
      coin.img = images[(coin.index + newIdx) % 10];
    });
  }
}


module.exports = GameView;
