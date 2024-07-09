'use strict';

const canvas = document.querySelector('.canvas1');
const ctx = canvas.getContext('2d');
let points = new Array();
let leftMost;
let hull = new Array();
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;
const noOfPoints = 20;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 2;
    this.color = 'white';
  }

  drawPoint() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function drawLine(p1, p2, color = 'white') {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function generatePoints() {
  for (let i = 0; i < noOfPoints; i++) {
    let rndX = Math.random() * canvas.width;
    let rndY = Math.random() * canvas.height;
    points[i] = new Point(rndX, rndY);
    points[i].drawPoint('white');
  }
}

function findLeftMost() {
  let left = 10000;

  for (let i = 0; i < points.length; i++) {
    if (points[i].x < left) {
      left = points[i].x;
      leftMost = points[i];
    }
  }
  leftMost.color = 'green';
  leftMost.drawPoint();
}

function getOrientation(f, s, t) {
  let ori = (t.y - s.y) * (s.x - f.x) - (s.y - f.y) * (t.x - s.x);

  if (ori > 0) return 1; // ccw
  else if (ori < 0) return 2; // cw
  else return ori; // if ori = 0
}

generatePoints();
findLeftMost();

let fps = 10;
let j = 0;
let once = true;
let animationPlaying = true;
let onHull = leftMost;
hull.push(leftMost);
let point;
let next;
let arr = points;
next = arr[0];

// Jarvis March
function animateJarvisMarch() {
  setTimeout(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let point of points) point.drawPoint();

    if (!once) {
      for (let i = 0; i < hull.length - 1; i++) drawLine(hull[i], hull[i + 1]);
    }

    point = arr[j];
    drawLine(onHull, next);
    drawLine(next, arr[j]);
    j++;

    if (getOrientation(onHull, next, point) == 1 || next == onHull) {
      next = point;
    }
    if (j == arr.length) {
      j = 0;
      hull.push(next);
      onHull = next;
      next = arr[0];
      once = false;

      if (onHull == hull[0]) animationPlaying = false;
    }
    if (animationPlaying) requestAnimationFrame(animateJarvisMarch);
    else {
      cancelAnimationFrame(animateJarvisMarch);
    }
  }, 1000 / fps);
}

animateJarvisMarch();


// Graham Scan