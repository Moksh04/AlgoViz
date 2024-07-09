'use strict';

const canvasG = document.querySelector('.canvasG');
const startBtn = document.querySelector('.startBtn');
const userInput = document.querySelector('.userInput');
const obsInput = document.querySelector('.userObs');
const resetBtn = document.querySelector('.reset');
const ctxG = canvasG.getContext('2d');

let dimensions = 20;
canvasG.height = 600;
canvasG.width = 600;

let rows = dimensions,
  cols = dimensions;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.color = 'white';
    this.isWall = false;
    this.parent = undefined;
    this.isDiagNb = false;
  }

  drawCell() {
    ctxG.fillStyle = this.color;
    ctxG.strokeStyle = 'black';
    ctxG.lineWidth = 1;
    let ht = canvasG.height / rows;
    let wdt = canvasG.width / cols;
    ctxG.fillRect(this.x * wdt, this.y * ht, wdt, ht);
    ctxG.strokeRect(this.x * wdt, this.y * ht, wdt, ht);
    ctxG.stroke();
  }

  neighbours(grid) {
    let tempNbrs = [];

    // Top
    if (this.x > 0 && !grid[this.x - 1][this.y].isWall) {
      tempNbrs.push(grid[this.x - 1][this.y]);
    }

    // Left
    if (this.y > 0 && !grid[this.x][this.y - 1].isWall) {
      tempNbrs.push(grid[this.x][this.y - 1]);
    }

    // Bottom
    if (this.x + 1 < rows && !grid[this.x + 1][this.y].isWall) {
      tempNbrs.push(grid[this.x + 1][this.y]);
    }

    // Right
    if (this.y + 1 < cols && !grid[this.x][this.y + 1].isWall) {
      tempNbrs.push(grid[this.x][this.y + 1]);
    }

    // Top Left
    if (this.x > 0 && this.y > 0 && !grid[this.x - 1][this.y - 1].isWall) {
      tempNbrs.push(grid[this.x - 1][this.y - 1]);
      grid[this.x - 1][this.y - 1].isDiagNb = true;
    }

    // Top Right
    if (
      this.x > 0 &&
      this.y + 1 < cols &&
      !grid[this.x - 1][this.y + 1].isWall
    ) {
      tempNbrs.push(grid[this.x - 1][this.y + 1]);
      grid[this.x - 1][this.y + 1].isDiagNb = true;
    }

    // Bottom Left
    if (
      this.x + 1 < rows &&
      this.y > 0 &&
      !grid[this.x + 1][this.y - 1].isWall
    ) {
      tempNbrs.push(grid[this.x + 1][this.y - 1]);
      grid[this.x + 1][this.y - 1].isDiagNb = true;
    }

    // Bottom Right
    if (
      this.x + 1 < rows &&
      this.y + 1 < cols &&
      !grid[this.x + 1][this.y + 1].isWall
    ) {
      tempNbrs.push(grid[this.x + 1][this.y + 1]);
      grid[this.x + 1][this.y + 1].isDiagNb = true;
    }

    return tempNbrs;
  }
}

class Grid {
  constructor(r, c) {
    this.r = r;
    this.c = c;
    this.grid = new Array();
  }

  generateGrid() {
    for (let i = 0; i < this.r; i++) {
      this.grid[i] = new Array();
      for (let j = 0; j < this.c; j++) {
        this.grid[i][j] = new Cell(i, j);
      }
    }
    return this.grid;
  }

  drawGrid() {
    for (let i = 0; i < this.r; i++) {
      for (let j = 0; j < this.c; j++) {
        this.grid[i][j].drawCell();
      }
    }
  }
}

class priorityQueue {
  constructor(arr) {
    this.arr = arr;
  }

  minHeapify(arr, i) {
    let l = 2 * i + 1,
      r = 2 * i + 2;
    let smallest = i;

    if (l < this.arr.length && this.arr[l].f < this.arr[i].f) smallest = l;
    if (r < this.arr.length && this.arr[r].f < this.arr[smallest].f)
      smallest = r;

    if (smallest != i) {
      let temp = arr[i];
      arr[i] = arr[smallest];
      arr[smallest] = temp;
      this.minHeapify(arr, smallest);
    }
  }

  getMin() {
    return this.arr[0];
  }

  enQ(elt) {
    this.arr.push(elt);
    for (let i = Math.floor(this.arr.length / 2) + 1; i >= 0; i--)
      this.minHeapify(this.arr, i);
  }

  deQ() {
    if (this.arr.length > 0) {
      let last = this.arr.length - 1;
      let x = this.arr[0];
      let tmp = this.arr[last];
      this.arr[last] = this.arr[0];
      this.arr[0] = tmp;

      this.arr.splice(last, 1);
      this.minHeapify(this.arr, 0);
      return x;
    }
    return -1;
  }
}

// Initialization
let gridObj = new Grid(rows, cols);

// NOTE: Grid is in column major format i.e: grid[col][row]
let grid = gridObj.generateGrid();
let start = grid[0][0];
let target = grid[rows - 1][cols - 1];
target.color = 'green';
start.color = 'red';

let openList = new priorityQueue(new Array());
let closedList = [];

// generating obstacles
function generateObstacles(perc = 0.1) {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.random() < perc && grid[i][j] != start && grid[i][j] != target) {
        grid[i][j].color = 'gray';
        grid[i][j].isWall = true;
      }
    }
  }
}

let path = [];

function minF(arr) {
  let minfCell = openList.getMin(arr);
  return minfCell;
}

function calcH(cell) {
  // Manhattan distance
  return (Math.abs(cell.x - target.x) + Math.abs(cell.y - target.y)) * 10;
}

function removeFrom(arr, elt) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] === elt) {
      arr.splice(i, 1);
    }
  }
  openList.minHeapify(arr, 0);
}

let fps = 60;
let i = 0;
let j = 0;
let current;

start.h = calcH(start);
start.f = start.g + start.f;
openList.enQ(start);
let p = target;
let nbrs = [];
let tempG;

generateObstacles(0.1); // percentage of obstacles
gridObj.drawGrid();

function animateAStar() {
  setTimeout(function () {
    start.color = 'red';
    target.color = 'green';
    gridObj.drawGrid();

    if (openList.length != 0 && current != target) {
      if (i == 0) {
        tempG = undefined;
        current = minF(openList.arr);
        openList.enQ(current);
        if (!current.isWall) nbrs = current.neighbours(grid);
        closedList.push(current);
      }
      for (let i = 0; i < nbrs.length; i++) {
        if (!nbrs[i].isWall && !closedList.includes(nbrs[i])) {
          if (!nbrs[i].isDiagNb) tempG = 10 + current.g;
          // else tempG = 14 + current.g;

          if (!openList.arr.includes(nbrs[i])) {
            openList.enQ(nbrs[i]);
            nbrs[i].parent = current;
            nbrs[i].g = tempG;
            nbrs[i].h = calcH(nbrs[i]);
            nbrs[i].f = nbrs[i].g + nbrs[i].h;
          } else if (tempG < nbrs[i].g) {
            nbrs[i].parent = current;
            nbrs[i].g = tempG;
            nbrs[i].f = nbrs[i].g + nbrs[i].h;
          }
        }
      }

      for (let i = 0; i < closedList.length; i++) {
        closedList[i].color = 'skyblue';
      }
      for (let i = 0; i < openList.arr.length; i++) {
        openList.arr[i].color = 'lightgreen';
      }
      i = nbrs.length - 1;
    }
    // tracing back the generated path
    else {
      console.log('done');
      if (p.parent) {
        p.color = 'blue';
        p = p.parent;
      } else return;
    }
    if (i == nbrs.length - 1) {
      for (let nb of nbrs) nb.isDiagNb = false;
      i = 0;
      removeFrom(openList.arr, current);

      nbrs = [];
      tempG = undefined;
    }
    requestAnimationFrame(animateAStar);
  }, 1000 / fps);
}

// animateAStar();

let cvsLeft = canvasG.offsetLeft + canvasG.clientLeft;
let cvsTop = canvasG.offsetTop + canvasG.clientTop;
let ht = canvasG.height / rows;
let wdt = canvasG.width / cols;

canvasG.addEventListener('click', (e) => {
  var x = e.pageX - cvsLeft;
  var y = e.pageY - cvsTop;
  let i = Math.floor(x / ht);
  let j = Math.floor(y / wdt);

  grid[i][j].isWall = true;
  grid[i][j].color = 'gray';
  grid[i][j].drawCell();
});

startBtn.addEventListener('click', () => {
  animateAStar();
});
