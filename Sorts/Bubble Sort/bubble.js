'use strict';

const viz = document.querySelector('.bar-container');
const generateArrayBtn = document.querySelector('.generateArrBtn');
const sortBtn = document.querySelector('.sortBtn');
const revBtn = document.querySelector('.revBtn');
const animSpeedSlider = document.querySelector('.speedSlider');
const animSpeedDisp = document.querySelector('.animSpeedTxt');
const userInput = document.querySelector('.userInput');
var cssRoot = document.querySelector(':root');
var strtColor = '#FFAF';

// Variables
let count = 1;
let barArr = [],
  arr = [];
let barWidth = 40,
  distBtwBars = 2;
let origPosn = new Array();
let sizeOfArr = 34; // size of the newly generated array

let i = 0,
  j = 1,
  swapped = false;

// Animation variables
let timeline = new TimelineMax({ defaults: { duration: 0.1 } });
let animDelay; // Controls the speed of animations
animSpeedDisp.innerText = `Animation Speed: ${animSpeedSlider.value / 1000}s`;

animSpeedSlider.oninput = function () {
  animSpeedDisp.innerText = 'Animation Speed: ';
  animSpeedDisp.innerText += this.value / 1000 + 's';
  animDelay = this.value / 1000;
};
if (!animDelay) animDelay = 0.1; // default delay

// Generate an array of random integers of variable size
function generateArr(size, from, to, userIn = false) {
  let tempArr = new Array();
  for (let i = 0; i < size; i++) {
    let randInt = Math.trunc(Math.random() * to + from);
    tempArr.push(randInt);
  }
  return tempArr;
}

// To reset the current state
function killTl() {
  timeline.pause();
  TweenMax.to(timeline, timeline.duration() - timeline.time(), {
    progress: 1,
    onComplete: function () {
      timeline.kill();
    },
  });
  timeline = new TimelineMax({ defaults: { duration: 0.1 } });
}

function reset(barArr) {
  for (const bar of barArr) bar.remove();
  count = 1;
  arr.length = 0;
  barArr.length = 0;
  origPosn.length = 0;
  swapped = false;
}

// Bubble Sort
function bubbleSort() {
  let i, j;
  let swapped = false;
  for (i = 0; i < arr.length; i++) {
    swapped = false;
    for (j = 0; j < arr.length - 1 - i; j++) {
      timeline
        .to(barArr[j], {
          backgroundColor: 'green',
          duration: animDelay,
          delay: animDelay,
        })
        .to(
          barArr[j + 1],
          {
            backgroundColor: 'green',
            duration: animDelay,
          },
          `-=${animDelay}`
        );
      if (arr[j] > arr[j + 1]) {
        let t = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = t;
        timeline
          .to(barArr[j], {
            x: origPosn[j + 1],
            backgroundColor: 'green',
            duration: animDelay,
          })
          .to(
            barArr[j + 1],
            { x: origPosn[j], duration: animDelay },
            `-=${animDelay}`
          );
        let bT = barArr[j];
        barArr[j] = barArr[j + 1];
        barArr[j + 1] = bT;
        swapped = true;
      }
      timeline
        .to(barArr[j], {
          backgroundColor: 'aqua',
          duration: animDelay,
          delay: animDelay,
        })
        .to(
          barArr[j + 1],
          {
            backgroundColor: 'aqua',
            duration: animDelay,
          },
          `-=${animDelay}`
        );
    }

    if (!swapped) break;
    timeline.to(
      barArr[j],
      {
        backgroundColor: '#ea5eff',
        duration: animDelay,
      },
      `-=${animDelay}`
    );
  }
  let k = i;
  for (i = 0; i < arr.length - k; i++) {
    timeline.to(barArr[i], {
      backgroundColor: '#ea5eff',
      duration: animDelay,
    });
  }
}

function generateBars(arr, factor, barClass, barArr) {
  if (barArr[0]) reset(barArr);
  count = 1;
  for (const height of arr) {
    const bar = document.createElement('div');
    const val = document.createElement('p');
    val.innerText = height;
    val.classList.add('bar-value');
    bar.classList.add(barClass);
    bar.appendChild(val);
    gsap.from(bar, { height: 0, delay: 0 });
    bar.style.height = `${height * factor}px`; // change the factor to 0.4 for sorts other than Counting Sort
    bar.style.width = `${barWidth}px`;
    bar.style.transform = `translateX(${(barWidth + distBtwBars) * count}px)`;
    gsap.to(bar, { height: `${height * factor}px`, delay: 0 });
    viz.appendChild(bar);
    count++;
    barArr.push(bar);
  }
}

function getUserInput() {
  let str = userInput.value;
  let tArr = str.split(',');
  tArr = tArr.filter((el) => {
    if (el >= 1) return el;
  });
  return tArr;
}

// Generating bars
generateArrayBtn.addEventListener('click', () => {
  if (barArr[0]) {
    reset(barArr);
    killTl();
  }
  if (userInput.value == '') arr = generateArr(sizeOfArr, 50, 500);
  // generateArr(no. of elements, min, max);
  else arr = getUserInput();

  generateBars(arr, 0.6, 'bar-cls', barArr);

  for (let bar of barArr) {
    let barSt = getComputedStyle(bar);
    let barMat = new WebKitCSSMatrix(barSt.transform);
    origPosn.push(barMat.m41);
  }
});

userInput.addEventListener('focus', () => {
  generateArrayBtn.innerText = 'GENERATE YOUR ARRAY';
});

userInput.addEventListener('focusout', () => {
  if (userInput.value == '')
    generateArrayBtn.innerText = 'GENERATE A RANDOM ARRAY';
});

sortBtn.addEventListener('click', () => {
  if (arr[0]) bubbleSort();
});
