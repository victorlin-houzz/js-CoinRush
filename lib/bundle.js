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
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Coin = __webpack_require__(2);
	const Mario = __webpack_require__(5);
	const Util = __webpack_require__(3);
	
	class Game {
	  constructor() {
	    this.coins = [];
	    this.marios = [];
	
	    this.addCoins();
	  }
	
	  add(object) {
	    if (object instanceof Coin) {
	      this.coins.push(object);
	    } else if (object instanceof Mario) {
	      this.marios.push(object);
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
	
	  addMario() {
	    const mario = new Mario({
	      pos: [500,500],
	      game: this
	    });
	
	    this.add(mario);
	
	    return mario;
	  }
	
	  allObjects() {
	    return [].concat(this.marios, this.coins);
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
	
	  draw(ctx) {
	    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	    ctx.fillStyle = Game.BG_COLOR;
	    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	    this.allObjects().forEach((object) => {
	      object.draw(ctx, object.img);
	    });
	  }
	
	  isOutOfBounds(pos) {
	    return (pos[0] < 0) || (pos[1] < 0) ||
	      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
	  }
	
	  handleInput() {
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
	  moveObjects(delta) {
	    this.allObjects().forEach((object) => {
	      object.move(delta);
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
	Game.NUM_COINS = 10;
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
		RADIUS: 25,
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
	    return [vec[0] * m, vec[1] * m];
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
	    this.isWrappable = true;
	  }
	
	  collideWith(otherObject) {
	    // default do nothing
	  }
	
	  draw(ctx, img) {
	    ctx.drawImage(img,this.pos[0],this.pos[1]);
	  }
	
	  isCollidedWith(otherObject) {
	    const centerDist = Util.dist(this.pos, otherObject.pos);
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
	        this.remove();
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
	  jump() {
	    if (this.pos[1] === 500 && this.jumping === false) {
	      this.vel[1] = -10;
	      this.jumping = true;
	    } else if (this.pos[1] <= 350) {
	      this.vel[1] += 10;
	    } else if (this.pos[1] >= 500) {
	      this.vel[1] = 0;
	      this.pos[1] = 500;
	    }
	  }
	  noJump() {
	    if(this.jumping === true) {
	        this.vel[1] = 10;
	        this.jumping = false;
	    } else if (this.pos[1] >= 500) {
	      this.vel[1] = 0;
	      this.pos[1] = 500;
	      this.jumping = false;
	    }
	  }
	  relocate() {
	    this.pos = [500,500];
	    this.vel = [0, 0];
	  }
	}
	
	Mario.RADIUS = 15;
	module.exports = Mario;


/***/ },
/* 6 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map