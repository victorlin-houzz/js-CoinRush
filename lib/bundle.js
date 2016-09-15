/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(6);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  let gameView = new GameView(game, ctx);
	  gameView.start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Coin = __webpack_require__(2);
	const Mario = __webpack_require__(5);
	const Util = __webpack_require__(3);
	const Lakitu = __webpack_require__(8);
	const PoisonMushroom = __webpack_require__(9);
	
	class Game {
	  constructor() {
	    this.coins = [];
	    this.marios = [];
	    this.lakitus = [];
	    this.pMushrooms = [];
	    this.remainTime = 30;
	    // this.addCoins();
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
	
	  draw(ctx, time) {
	    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	    let bg = new Image();
	    bg.src = 'sprites/bg.png';
	    ctx.drawImage(bg, 0, 0);
	    let coinImg = new Image();
	    coinImg.src = 'sprites/coin.png';
	    ctx.drawImage(coinImg, Game.DIM_X - 150, 15);
	    ctx.font="30px Sans-serif";
	    ctx.fillText(' x ' + this.marios[0].coins,Game.DIM_X - 100, 50);
	    this.remainTime = Math.round((30000 - time)/10) / 100;
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Mario = __webpack_require__(5);
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
					otherObject.coins += 1;
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	  // Normalize the length of the vector to 1, maintaining direction.
	  dir (vec) {
	    var norm = Util.norm(vec);
	    return Util.scale(vec, 1 / norm);
	  },
	  // Find distance between two points.
	  dist (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	  // Find the length of the vector.
	  norm (vec) {
	    return Util.dist([0, 0], vec);
	  },
	  // Return a randomly oriented vector with the given length.
	  randomVec (length) {
	    var deg = 2 * Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	  // Scale the length of a vector by the given amount.
	  scale (vec, m) {
	    let yV = Math.abs(vec[1] * m);
	    if (yV < 3) {
	      yV += 3;
	    }
	    return [vec[0] * m, yV];
	  },
	
	  wrap (coord, max) {
	    if (coord < 0) {
	      return max - (coord % max);
	    } else if (coord > max) {
	      return coord % max;
	    } else {
	      return coord;
	    }
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	
	class MovingObject {
	  constructor(options) {
	    this.pos = options.pos;
	    this.vel = options.vel;
	    this.radius = options.radius;
	    this.color = options.color;
	    this.game = options.game;
	    this.img = options.img;
	    this.width = options.width;
	    this.height = options.height;
	    this.isWrappable = true;
	  }
	
	  collideWith(otherObject) {
	    // default do nothing
	  }
	
	  draw(ctx, img) {
	    ctx.drawImage(img,this.pos[0],this.pos[1]);
	  }
	
	  isCollidedWith(otherObject) {
	    let newPos = [this.pos[0] + this.radius, this.pos[1] + this.radius];
	    let otherPos = [otherObject.pos[0] + otherObject.radius, otherObject.pos[1] + otherObject.radius];
	    const centerDist = Util.dist(newPos, otherPos);
	    return centerDist < (this.radius + otherObject.radius);
	  }
	
	  move(timeDelta) {
	    //timeDelta is number of milliseconds since last move
	    //if the computer is busy the time delta will be larger
	    //in this case the MovingObject should move farther in this frame
	    //velocity of object is how far it should move in 1/60th of a second
	    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	        offsetX = this.vel[0] * velocityScale,
	        offsetY = this.vel[1] * velocityScale;
	
	    this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
	
	    if (this.game.isOutOfBounds(this.pos)) {
	      if (this.isWrappable) {
	        this.pos = this.game.wrap(this.pos);
	      } else {
	        this.vel[0] = -this.vel[0];
	      }
	    }
	  }
	
	  remove() {
	    this.game.remove(this);
	  }
	}
	
	const NORMAL_FRAME_TIME_DELTA = 1000/60;
	
	module.exports = MovingObject;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Coin = __webpack_require__(2);
	const Util = __webpack_require__(3);
	
	function randomColor() {
	  const hexDigits = "0123456789ABCDEF";
	
	  let color = "#";
	  for (let i = 0; i < 3; i ++) {
	    color += hexDigits[Math.floor((Math.random() * 16))];
	  }
	
	  return color;
	}
	
	class Mario extends MovingObject {
	  constructor(options) {
	    options.img = new Image();
	    options.img.src = 'sprites/marior1.png';
	    options.radius = Mario.RADIUS;
	    options.vel = options.vel || [0, 0];
	    options.color = options.color || randomColor();
	    super(options);
	    this.coins = 0;
	    this.jumping = false;
	    this.facingRight = true;
	    this.bumped = false;
	    this.jumpAud = new Audio('sounds/jump-small.wav');
	  }
	
	  run(vel) {
	    this.vel[0] = vel;
	  }
	
	  noRun() {
	    if (this.vel[0] > 0) {
	      this.vel[0] -= 2;
	    } else if (this.vel[0] < 0) {
	      this.vel[0] += 2;
	    }
	  }
	  checkBumped() {
	    if (this.bumped) {
	      this.jumping = false;
	      this.vel[0] = 0;
	      if (this.pos[1] <= 280) {
	        this.vel[1] += 15;
	      } else if (this.pos[1] >= 450) {
	        this.vel[1] = 0;
	        this.pos[1] = 450;
	      }
	    }
	  }
	
	  jump() {
	    if (this.pos[1] === 450 && this.jumping === false && this.bumped === false) {
	      this.jumpAud.play();
	      this.vel[1] = -15;
	      this.jumping = true;
	    } else if (this.pos[1] <= 280) {
	      this.vel[1] += 15;
	    } else if (this.pos[1] >= 450) {
	      this.vel[1] = 0;
	      this.pos[1] = 450;
	    }
	  }
	
	  noJump() {
	    if(this.jumping === true) {
	        this.vel[1] = 15;
	        this.jumping = false;
	    } else if (this.pos[1] >= 450) {
	      this.vel[1] = 0;
	      this.pos[1] = 450;
	      this.jumping = false;
	    }
	  }
	
	  relocate() {
	    this.pos = [450,400];
	    this.vel = [0, 0];
	  }
	}
	
	Mario.RADIUS = 65;
	module.exports = Mario;


/***/ },
/* 6 */
/***/ function(module, exports) {

	class GameView {
	  constructor(game, ctx) {
	    this.ctx = ctx;
	    this.game = game;
	    this.time = 20;
	    this.pause = false;
	    this.mario = this.game.addMario();
	    this.lakitu = this.game.addLakitu();
	    this.wakeUpTime = 0;
	  }
	
	  bindKeyHandlers() {
	    const mario = this.mario;
	    $('#start').click(() => {
	      this.paused = !this.paused;
	      console.log(this.paused);
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
	    if (!this.paused) {
	      const timeDelta = time - this.lastTime;
	      this.marioAnime(time);
	      this.lakituAnime(time);
	      this.coinAnime(time);
	      this.createCoins(time);
	      this.wakeUpMario(timeDelta);
	      this.game.step(timeDelta);
	      this.game.draw(this.ctx, time);
	      this.lastTime = time;
	    } else {
	
	    }
	    //every call to animate requests causes another call to animate
	    // console.log(time);
	    if (time < 30000) {
	      requestAnimationFrame(this.animate.bind(this));
	    } else {
	      // this.gameOver();
	    }
	  }
	  gameOver() {
	    alert(this.mario.coins);
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


/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	
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


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	const Mario = __webpack_require__(5);
	const DEFAULTS = {
		COLOR: "#505050",
		RADIUS: 25,
		SPEED: 7
	};
	
	class PoisonMushroom extends MovingObject {
	    constructor(options = {}) {
				options.img = new Image();
		    options.img.src = 'sprites/pmushroom.png';
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
	        this.remove();
					otherObject.bumped = true;
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map