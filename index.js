const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
const html = document.querySelector('html');
const replayBtn = document.querySelector('#replay');
const cellsHorizontal = 14;
const cellsVertical = 10;
const width = html.clientWidth;
const height = html.clientHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 2, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 2, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 2, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 2, height, { isStatic: true }),
];
World.add(world, walls);

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));
const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));
const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
  //If I have visited the cell at [row,column], then return
  if (grid[row][column]) return;

  //Mark this cell as being visited
  grid[row][column] = true;
  //Assemble randomly
  const neighbours = shuffle([
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left'],
  ]);

  //For each neighbor ....
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;

    //See if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue;
    }
    //If we have visited that neighbor continue to the next neigbour
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    //Remove the wall from horizontals or Verticals
    if (direction === 'left') {
      verticals[row][column - 1] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true;
    } else if (direction === 'up') {
      horizontals[row - 1][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    }
    stepThroughCell(nextRow, nextColumn);
  }
  //Visit that next cell
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      {
        label: 'wall',
        isStatic: true,
        render: {
          fillStyle: 'tomato',
        },
      }
    );
    World.add(world, wall);
  });
});
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      {
        label: 'wall',
        isStatic: true,
        render: {
          fillStyle: 'tomato',
        },
      }
    );
    World.add(world, wall);
  });
});

//Goal
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    label: 'goal',
    isStatic: true,
    render: {
      fillStyle: 'green',
    },
  }
);

World.add(world, goal);

//Drawing Ball
ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: 'ball',
  render: {
    fillStyle: 'yellow',
  },
});
World.add(world, ball);

// const debounce = (fn, delay) => {
//   let timeoutID;
//   return function (...args) {
//     timeoutID = setTimeout(() => {
//       if (timeoutID) {
//         clearTimeout(timeoutID);
//       }
//       fn(...args);
//     }, delay);
//   };
// };

const throttle = (fn, delay) => {
  let last = 0;
  return (...args) => {
    let now = new Date().getTime();
    if (now - last < delay) {
      return;
    }
    last = now;
    return fn(...args);
  };
};

//Adding event listeners
document.addEventListener(
  'keydown',
  throttle((event) => {
    const { x, y } = ball.velocity;
    if (event.keyCode === 87 || event.keyCode === 38) {
      //up
      Body.setVelocity(ball, { x, y: y - 5 });
    }
    if (event.keyCode === 68 || event.keyCode === 39) {
      //right
      Body.setVelocity(ball, { x: x + 5, y: y + 5 });
    }
    if (event.keyCode === 83 || event.keyCode === 40) {
      //down
      Body.setVelocity(ball, { x, y: y + 5 });
    }
    if (event.keyCode === 65 || event.keyCode === 37) {
      //left
      Body.setVelocity(ball, { x: x - 5, y });
    }
  }, 250)
);

//Win Conditions
Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((collision) => {
    const labels = ['goal', 'ball'];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector('.winner').classList.remove('hidden');
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === 'wall') {
          Body.setStatic(body, false);
        }
      });
    }
  });
});

replayBtn.addEventListener('click', (e) => {
  location.reload();
});
