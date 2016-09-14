## Coin Rush

### Background

Classic Mario is back! Mario has 30 seconds to collect as many coins as possible.
Lakitu would throw out hundreds of coins during the 30 second period, as well as some poison mushrooms!
The general rule is to collect coins and avoid poison mushrooms.
The game will end when :

1) Mario eats a poison mushroom,
2) Times up.

### Functionality & MVP  

Users will be able to:

- [ ] Start, pause, and reset the game board
- [ ] Mario would move right, left, or jump.
- [ ] Collect coins.
- [ ] Avoid the poison mushrooms.

In addition, this project will include:

- [ ] A production Readme

### Wireframes

![wireframe](wireframes/wireframe.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jquery` for overall structure and game logic,
- `HTML5 Canvas` for DOM manipulation and rendering.

In addition to the webpack entry file, there will be three scripts involved in this project:

`coin_rush.js`: this script will handle the logic for creating and updating the necessary background elements and rendering them to the DOM.

`mario.js`: this script will handle the logic of the behavior of Mario. i.e., move left, move right, jump, get a coin, eat a mushroom ...etc.

`lakitu.js`: this script will handle the logic of the behavior of Lakitu.

`gift.js`: this script will handle the logic of the behavior of a 'gift' from Lakitu. The 'gift' type will be either a coin or a poison mushroom.

`mushroom.js`: extends gift.js

`coin.js`: extends gift.js.

### Implementation Timeline

**Day 1**: Setup all necessary Node modules, including getting webpack up and running.  Create `webpack.config.js` as well as `package.json`.  Write a basic entry file and the bare bones of all scripts outlined above. Do some researches how to create animation with sprites. Build out the `Lakitu` object. Goals for the day:

- Get a green bundle with `webpack`
- Learn enough animation with sprites and render an object to the `Canvas` element
- Complete the `laketu.js` and make sure it will move right and left in a random speed on the sky.

**Day 2**: Build out the `Mario` object and connect to the `Board` object. Goals for the day:

- Complete the `mario.js` module (constructor, update functions)
- Render a square grid to the `Canvas`.
- Make sure Mario can move left, right, and jump.

**Day 3**: Create `gift` object and its logie. Extend `mushroom` and `coin` from `gift`. Goals for the day:

- Complete the `gift.js` and make sure the mushroom and coin would fall with Parabolic Motion.
- Update game logic when the collision happens.

**Day 4**: Install the controls for the user to interact with the game.  Style the frontend, making it polished and professional.  Goals for the day:

- Create controls for game speed, stop, start, reset, and shape type
- Have a styled `Canvas`, nice looking controls and title
- Polish the game with better background images and CSS effects.


### Bonus features

 Some anticipated updates are:

- [ ] Different type of gifts such as a superstar for Mario immune from the poison mushrooms.
- [ ] A normal mushroom for Mario to grow up and collect more coins.
# js-game-coinRush
