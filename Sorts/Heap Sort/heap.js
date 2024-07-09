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
if (!animDelay) animDelay = 0.5; // default delay

// Generate an array of random integers of variable size
function generateArr(size, from, to) {
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
  killTl();
}

function heapify(arr, size, i) {
  let max = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < size && arr[left] > arr[max]) max = left;
  if (right < size && arr[right] > arr[max]) max = right;

  if (max != i) {
    let t = arr[i];
    arr[i] = arr[max];
    arr[max] = t;
    timeline
      .to(barArr[i], { x: origPosn[max], duration: animDelay })
      .to(
        barArr[max],
        { x: origPosn[i], duration: animDelay },
        `-=${animDelay}`
      );
    let tbar = barArr[i];
    barArr[i] = barArr[max];
    barArr[max] = tbar;
    heapify(arr, size, max);
  }
}

function heapSort(arr) {
  let size = arr.length;
  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) heapify(arr, size, i);
  for (let i = 0; i < barArr.length; i++)
    timeline.to(barArr[i], {
      backgroundColor: 'lightgreen',
      duration: 0.05,
    });
  for (let i = size - 1; i >= 0; i--) {
    let t = arr[0];
    arr[0] = arr[i];
    arr[i] = t;
    timeline
      .to(barArr[0], { x: origPosn[i], duration: animDelay })
      .to(barArr[i], { x: origPosn[0], duration: animDelay }, `-=${animDelay}`);
    timeline.to(barArr[0], {
      backgroundColor: '#ea5eff',
      duration: 0.05,
    });
    let tbar = barArr[0];
    barArr[0] = barArr[i];
    barArr[i] = tbar;
    heapify(arr, i, 0);
  }
}

// Generate Random Bars
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
  tArr = tArr.map(Number).filter((el) => {
    if (el >= 1) return el;
  });
  return tArr;
}

// Generating bars
generateArrayBtn.addEventListener('click', () => {
  if (barArr[0]) {
    reset(barArr);
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
  console.log(arr);
});

userInput.addEventListener('focus', () => {
  generateArrayBtn.innerText = 'GENERATE YOUR ARRAY';
});

userInput.addEventListener('focusout', () => {
  if (userInput.value == '')
    generateArrayBtn.innerText = 'GENERATE A RANDOM ARRAY';
});

sortBtn.addEventListener('click', () => {
  heapSort(arr);
});
