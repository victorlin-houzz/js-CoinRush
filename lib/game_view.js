class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.mario = this.game.addMario();

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

    this.mario.img = this.marioR1;
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

    if (((time / 50) % 2) <1) {
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
    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;
    //every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  }
}

module.exports = GameView;
