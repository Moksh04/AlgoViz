'use strict';

const generateBtn = document.querySelector('.generateMz');
const solveBtn = document.querySelector('.solveMz');
const resetBtn = document.querySelector('.reset');
const userInput = document.querySelector('.userInput');

let mazeDimensions = 10;
let mazeViz = document.querySelector('.mazeCanvas');
let cntx = mazeViz.getContext('2d');
let current;
let start;
cntx.lineWidth = 2;
let color = 'green';
let target;
let once = false;

class Maze {
  constructor(size, rows, cols) {
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.stack = [];
    this.pathStack = [];
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.cols; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    start = this.grid[0][0];
    current = start;
    target = this.grid[this.rows - 1][this.cols - 1];
  }

  draw() {
    mazeViz.width = this.size;
    mazeViz.height = this.size;
    mazeViz.style.background = 'black';
    current.visited = true;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.cols);
      }
    }
  }

  generateMaze() {
    // array of neighbours
    let nb = this.grid[current.rowNum][current.colNum].getNeighbours(
      this.grid,
      current.rowNum,
      current.colNum
    );
    if (nb.length != 0) {
      // choosing a random unvisited neighbour
      let rndNbr = Math.trunc(Math.random() * nb.length);
      color = 'green';
      // if right nbr is chosen
      if (current.colNum < nb[rndNbr].colNum) {
        current.walls.rightWall = false;
        nb[rndNbr].walls.leftWall = false;
      }
      // if bottom nbr is chosen
      else if (current.rowNum < nb[rndNbr].rowNum) {
        current.walls.bottomWall = false;
        nb[rndNbr].walls.topWall = false;
      }
      // if top nbr is selected
      else if (current.rowNum > nb[rndNbr].rowNum) {
        current.walls.topWall = false;
        nb[rndNbr].walls.bottomWall = false;
      }
      // if left nbr is chosen
      else if (current.colNum > nb[rndNbr].colNum) {
        current.walls.leftWall = false;
        nb[rndNbr].walls.rightWall = false;
      }
      nb[rndNbr].visited = true;
      maze.stack.push(current);
      current = nb[rndNbr];
      current.highlight(
        current.colNum,
        current.rowNum,
        maze.size,
        maze.cols,
        maze.rows,
        color
      );
    }
    // backtracking
    else if (this.stack.length > 1) {
      current = this.stack.pop();
    } else current = this.stack.pop(); // removing the last element
  }

  solveMaze() {
    let vNb = this.grid[current.rowNum][current.colNum].getValidNbrs(
      this.grid,
      current.rowNum,
      current.colNum
    );
    if (vNb.length != 0 && current != target) {
      let rndVNbr = Math.trunc(Math.random() * vNb.length);
      vNb[rndVNbr].solveVisited = true;
      current = vNb[rndVNbr];
      current.drawPath(
        2 * current.rowNum,
        2 * current.colNum,
        this.size,
        this.rows,
        this.cols,
        'red'
      );
      this.pathStack.push(vNb[rndVNbr]);
    } else {
      current = this.pathStack.pop();
      let nbCheck = this.grid[current.rowNum][current.colNum].getValidNbrs(
        this.grid,
        current.rowNum,
        current.colNum
      );
      if (nbCheck.length != 0) {
        this.pathStack.push(current);
      } else {
        current.drawPath(
          2 * current.rowNum,
          2 * current.colNum,
          this.size,
          this.rows,
          this.cols,
          'black'
        );
      }
    }
  }
}

class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
    this.visited = false;
    this.walls = {
      topWall: true,
      bottomWall: true,
      leftWall: true,
      rightWall: true,
    };
    this.solveVisited = false;
  }
  drawTop(x, y, size, cols, rows) {
    cntx.beginPath();
    cntx.moveTo(x, y);
    cntx.lineTo(x + size / cols, y);
    cntx.stroke();
  }

  drawRight(x, y, size, cols, rows) {
    cntx.beginPath();
    cntx.moveTo(x + size / cols, y);
    cntx.lineTo(x + size / cols, y + size / rows);
    cntx.stroke();
  }

  drawBottom(x, y, size, cols, rows) {
    cntx.beginPath();
    cntx.moveTo(x, y + size / rows);
    cntx.lineTo(x + size / cols, y + size / rows);
    cntx.stroke();
  }

  drawLeft(x, y, size, cols, rows) {
    cntx.beginPath();
    cntx.moveTo(x, y);
    cntx.lineTo(x, y + size / rows);
    cntx.stroke();
  }

  show(size, rows, cols) {
    let x = (this.colNum * size) / cols;
    let y = (this.rowNum * size) / rows;
    cntx.strokeStyle = 'white';

    if (this.walls.topWall) this.drawTop(x, y, size, cols, rows);
    if (this.walls.rightWall) this.drawRight(x, y, size, cols, rows);
    if (this.walls.leftWall) this.drawLeft(x, y, size, cols, rows);
    if (this.walls.bottomWall) this.drawBottom(x, y, size, cols, rows);

    current.highlight(
      current.colNum,
      current.rowNum,
      maze.size,
      maze.cols,
      maze.rows,
      'purple'
    );
    target.highlight(
      target.colNum,
      target.rowNum,
      maze.size,
      maze.cols,
      maze.rows,
      'green'
    );
  }

  getNeighbours(grid, i, j) {
    let nbrs = [];

    if (i - 1 >= 0 && grid[i - 1][j] && !grid[i - 1][j].visited) {
      // top
      nbrs.push(grid[i - 1][j]);
    }
    if (j - 1 >= 0 && grid[i][j - 1] && !grid[i][j - 1].visited) {
      // left
      nbrs.push(grid[i][j - 1]);
    }
    if (i + 1 <= maze.rows - 1 && grid[i + 1][j] && !grid[i + 1][j].visited) {
      // bottom
      nbrs.push(grid[i + 1][j]);
    }
    if (j + 1 <= maze.cols - 1 && grid[i][j + 1] && !grid[i][j + 1].visited) {
      // right
      nbrs.push(grid[i][j + 1]);
    }
    return nbrs;
  }

  // getting valid neighbours for path array
  getValidNbrs(grid, i, j) {
    let validNbrs = [];

    // top
    if (
      i - 1 >= 0 &&
      !grid[i][j].walls.topWall &&
      !grid[i - 1][j].solveVisited
    ) {
      validNbrs.push(grid[i - 1][j]);
    }
    // left
    if (
      j - 1 >= 0 &&
      !grid[i][j].walls.leftWall &&
      !grid[i][j - 1].solveVisited
    ) {
      validNbrs.push(grid[i][j - 1]);
    }
    // bottom
    if (
      i + 1 <= maze.rows - 1 &&
      !grid[i][j].walls.bottomWall &&
      !grid[i + 1][j].solveVisited
    ) {
      validNbrs.push(grid[i + 1][j]);
    }
    // right
    if (
      j + 1 <= maze.cols - 1 &&
      !grid[i][j].walls.rightWall &&
      !grid[i][j + 1].solveVisited
    ) {
      validNbrs.push(grid[i][j + 1]);
    }

    return validNbrs;
  }

  highlight(x, y, size, cols, rows, color) {
    cntx.fillStyle = color;
    cntx.fillRect(
      (x * size + cntx.lineWidth + 3) / cols,
      (y * size + cntx.lineWidth + 3) / rows,
      size / cols - (cntx.lineWidth + 1),
      size / rows - (cntx.lineWidth + 1)
    );
  }

  drawPath(x, y, size, cols, rows, color) {
    cntx.beginPath();
    cntx.fillStyle = color;
    cntx.strokeStyle = 'black';
    cntx.arc(
      ((y + 1) * size) / rows / 2,
      ((x + 1) * size) / cols / 2,
      5,
      0,
      Math.PI * 2
    );
    cntx.fill();
    cntx.stroke();
  }
}

let maze = new Maze(600, mazeDimensions, mazeDimensions);
let fps = 60;
maze.setup();
maze.draw();
maze.stack.push(current);

function reset() {
  if (userInput.value != '') mazeDimensions = parseInt(userInput.value);
  console.log(mazeDimensions);
  maze = new Maze(600, mazeDimensions, mazeDimensions);
  maze.setup();
  maze.draw();
  maze.stack.push(current);
}

function animateGen() {
  if (maze.stack.length >= 1) {
    setTimeout(function () {
      maze.generateMaze();
      maze.draw();
      requestAnimationFrame(animateGen);
    }, 1000 / fps);
  } else {
    console.log('complete!');
  }
}

function animateSolve() {
  if (current != target) {
    setTimeout(function () {
      maze.solveMaze();
      requestAnimationFrame(animateSolve);
    }, 1000 / fps);
  } else {
    console.log('solved!');
  }
}

generateBtn.addEventListener('click', () => {
  animateGen();
  once = true;
});

resetBtn.addEventListener('click', () => {
  reset();
});

solveBtn.addEventListener('click', () => {
  if (once) {
    current.solveVisited = true;
    maze.pathStack.push(current);
    animateSolve();
  }
});
