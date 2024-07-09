'use strict';

let canvas = document.querySelector('.canvas1');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let selectBtn = document.querySelector('.selectBtn');
let menu = document.querySelector('.selMenu');
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Initial position of particle when it is instantiated
    this.baseX = this.x;
    this.baseY = this.y;
    // density determines how fast a particle is and its other physical properties
    this.density = Math.random() * 1;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
  }

  draw() {
    ctx.fillStyle = `rgba(255,255,255,1)`;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    this.x += this.speedX * this.density;
    this.y += this.speedY * this.density;
    if (this.x < 0 || this.x > canvas.width) {
      this.speedX *= -1;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.speedY *= -1;
    }
  }
}

function init() {
  particleArray = [];
  for (let i = 0; i < 200; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    particleArray.push(new Particle(x, y));
  }
}

init();

function animate1() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particleArray.length; i++) {
    for (let j = i; j < particleArray.length; j++) {
      let dx = particleArray[i].x - particleArray[j].x;
      let dy = particleArray[i].y - particleArray[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 80) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.moveTo(particleArray[j].x, particleArray[j].y);
        ctx.lineTo(particleArray[i].x, particleArray[i].y);
        ctx.stroke();
      }
    }
    particleArray[i].draw();
    particleArray[i].update();
  }
  requestAnimationFrame(animate1);
}

animate1();

function closeNav() {
  menu.style.width = '0';
}

function openNav() {
  menu.style.width = '20%';
}
