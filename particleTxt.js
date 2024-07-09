'use strict';
console.log('txt');
let canvas1 = document.querySelector('.canvas2');
let ctx1 = canvas1.getContext('2d');
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
let particleArray1 = [];
let adjustX = 45;
let adjustY = 5;
let txt = `AV`;
let hW = 10;
let particleSize = 3;
let minConnectDist = 14;
let fill = 'white';
let heroTxt = document.querySelector('.heroText');
let sp1 = document.querySelector('#sp1');
let sp2 = document.querySelector('#sp2');
let container = document.querySelector('.container');
// handle mouse
const mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

ctx1.fillStyle = fill;
ctx1.font = '50px Verdana';
ctx1.fillText(txt, 0, 50);
const textCoordinates = ctx1.getImageData(0, 0, 100, 100);

class Particle1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = particleSize;
    // Initial position of particle when it is instantiated
    this.baseX = this.x;
    this.baseY = this.y;
    // density determines how fast a particle is based on its mass
    this.density = Math.random() * 40 + 5;
  }

  draw() {
    ctx1.fillStyle = fill;
    ctx1.beginPath();
    ctx1.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx1.closePath();
    ctx1.fill();
  }

  // we wnt the particles to be pushed away if our mouse touches them
  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / dist;
    let forceDirectionY = dy / dist;
    let maxDist = mouse.radius;
    let force = (maxDist - dist) / maxDist; // gradually slows particles down by this amount as they move away from the mouse
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;
    if (dist < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
      // ctx1.fillStyle = 'red';
      ctx1.fill();
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 5;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 5;
      }
      ctx1.fillStyle = fill;
      ctx1.fill();
    }
  }
}

// function init() {
//   particleArray1 = [];
//   for (let i = 0; i < 5000; i++) {
//     let x = Math.random() * canvas1.width;
//     let y = Math.random() * canvas1.height;
//     particleArray1.push(new Particle1(x, y));
//   }
// }

// Note: The textCoordinates array is a clamped array which contains 4 values for each pixel i.e. r,g,b, and a

function init() {
  particleArray1 = [];
  for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
      if (
        textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 128
      ) {
        let posX = x + adjustX;
        let posY = y + adjustY;
        particleArray1.push(new Particle1(posX * hW, posY * hW));
      }
    }
  }
}
init();

function animate() {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  for (let i = 0; i < particleArray1.length; i++) {
    particleArray1[i].draw();
    particleArray1[i].update();
  }
  connect();
  requestAnimationFrame(animate);
}

animate();

function connect() {
  let opacityVal = 1;
  for (let a = 0; a < particleArray1.length; a++) {
    for (let b = a; b < particleArray1.length; b++) {
      let dx = particleArray1[a].x - particleArray1[b].x;
      let dy = particleArray1[a].y - particleArray1[b].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minConnectDist) {
        ctx1.beginPath();
        opacityVal = 1 - dist / minConnectDist;
        ctx1.strokeStyle = `rgba(255,255,255,${opacityVal})`;
        ctx1.lineWidth = 2;
        ctx1.moveTo(particleArray1[a].x, particleArray1[a].y);
        ctx1.lineTo(particleArray1[b].x, particleArray1[b].y);
        ctx1.stroke();
      }
    }
  }
}
let once = true;

function cancelStuff() {
  if (once) {
    mouse.radius = 1000;
    for (let particle of particleArray1) {
      particle.baseX = particle.baseX / hW - 15;
      particle.baseY = particle.baseY / hW;
    }
  } else mouse.radius = 20;

  minConnectDist = 0;
  gsap.to(canvas1, { opacity: 0, duration: 0.8, ease: 'power3.out' });
  setTimeout(function () {
    mouse.radius = 20;
    for (let particle of particleArray1) {
      particle.size = 1;
    }
  }, 2000);
  setTimeout(function () {
    canvas1.style.opacity = '1';
    canvas1.style.background = 'transparent';
    container.classList.remove('open');
  }, 2100);

  window.removeEventListener('click', cancelStuff);
  once = false;
  heroTxt.style.opacity = '1';

  gsap.from(heroTxt, {
    scaleY: 0,
    duration: 0.5,
    ease: 'power3.out',
    delay: 2.5,
  });
  gsap.from(sp1, {
    opacity: 0,
    x: 500,
    duration: 0.5,
    ease: 'power3.out',
    delay: 3,
  });
  gsap.from(sp2, {
    opacity: 0,
    x: 500,
    duration: 0.5,
    ease: 'power3.out',
    delay: 3.2,
  });
}

window.addEventListener('click', cancelStuff);
