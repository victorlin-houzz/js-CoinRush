class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.addTimeAud = new Audio('sounds/one-up.wav');
    this.reset();
  }

  reset() {
    this.game.reset();
    this.time = 20;
    this.paused = true;
    this.mario = this.game.addMario();
    this.lakitu = this.game.addLakitu();
    this.wakeUpTime = 0;
    this.gameLeftTime = 30;
    this.addTimeIdx = 0;
  }

  bindKeyHandlers() {
    const mario = this.mario;
    $('#start').click(() => {
      this.paused = false;
      $('#start-bg').hide();
      $('#start').hide();
      $('#game-canvas').show();
    });
    $('#restart').click(() => {
      this.reset();
      $('#start-bg').show();
      $('#start').show();
      $('#pause').hide();
      $('#restart').hide();
      $('#game-canvas').hide();
    });
    $('html').keydown(event => {
      if ( event.which == 80 ) {
       this.paused = !this.paused;
       if (this.paused) {
         $('#pause').show();
         $('#restart').show();
       } else {
         $('#pause').hide();
         $('#restart').hide();
       }
      }
    });
    // Object.keys(GameView.MOVES).forEach((k) => {
    //   let move = GameView.MOVES[k];
    //   key(k, () => { mario.power(move[0]); });
    // });
    //
    // key("space", () => { mario.jump(); });
  }

  // togglePause() {
  //   if (!this.pause){
  //     clearInterval(this.timer);
  //     this.pause = true;
  //   } else {
  //     this.timer = setInterval(requestAnimationFrame, this.time);
  //     this.pause = false;
  //   }
  // }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    let timeDelta = time - this.lastTime;
    if (!this.paused) {
      this.marioAnime(time);
      this.lakituAnime(time);
      this.coinAnime(time);
      this.createCoins(time);
      this.wakeUpMario(timeDelta);
      this.calculateGameEndTime(timeDelta);
      this.game.step(timeDelta);
      this.game.draw(this.ctx, this.gameLeftTime);
    }
    this.lastTime = time;

    //every call to animate requests causes another call to animate
    // console.log(time);
    if (this.gameLeftTime > 0) {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      // this.gameOver();
      console.log('game over');
      $('#game-over').show();
    }
  }
  gameOver() {
    alert(this.mario.coins);
  }

  calculateGameEndTime(timeDelta) {

    this.gameLeftTime = ((this.gameLeftTime * 1000 - timeDelta) / 1000);
    if (Math.floor(this.mario.coins / 100) > this.addTimeIdx) {
      this.addTimeAud.play();
      this.gameLeftTime += 5;
      this.addTimeIdx += 1;
    }
  }
  wakeUpMario(timeDelta) {
    // console.log(this.wakeUpTime);
    if (this.mario.bumped) {
      this.wakeUpTime += timeDelta;
    }
    if (this.wakeUpTime > 3000) {
      this.mario.bumped = false;
      this.wakeUpTime = 0;
    }
  }
  marioAnime(time) {
    this.marioL1 = new Image();
    this.marioL1.src = 'sprites/mariol1.png';
    this.marioL2 = new Image();
    this.marioL2.src = 'sprites/mariol2.png';
    this.marioL3 = new Image();
    this.marioL3.src = 'sprites/mariol3.png';
    this.marioR1 = new Image();
    this.marioR1.src = 'sprites/marior1.png';
    this.marioR2 = new Image();
    this.marioR2.src = 'sprites/marior2.png';
    this.marioR3 = new Image();
    this.marioR3.src = 'sprites/marior3.png';
    this.marioRj = new Image();
    this.marioRj.src = 'sprites/mariorj.png';
    this.marioLj = new Image();
    this.marioLj.src = 'sprites/mariolj.png';

    if (this.mario.bumped) {
      if (this.mario.facingRight) {
        this.mario.img = this.marioR3;
      } else {
        this.mario.img = this.marioL3;
      }
    } else {
      if (this.mario.vel[0] === 0) {
        if (this.mario.facingRight) {
          this.mario.img = this.marioR1;
        } else {
          this.mario.img = this.marioL1;
        }
      } else if (((time / 50) % 2) < 1) {
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
  }

  lakituAnime(time) {
    this.lakituL = new Image();
    this.lakituL.src = 'sprites/lakitul.png';
    this.lakituR = new Image();
    this.lakituR.src = 'sprites/lakitur.png';
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

  createCoins(time) {
    // console.log(Math.floor((time / 10) % 100));
    if (Math.floor((time / 10) % 100) === 25) {
      this.game.addCoins();
      this.game.addPMushroom();
    }
  }
}


module.exports = GameView;
