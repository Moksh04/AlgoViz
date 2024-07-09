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

function insertionSort() {
  let n = arr.length;
  timeline.to(barArr[0], { backgroundColor: 'orange', duration: 0.1 });
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let barKey = barArr[i];
    let j = i - 1;
    timeline.to(barKey, {
      y: '-275px',
      backgroundColor: 'green',
      duration: animDelay,
    });
    while (key < arr[j] && j >= 0) {
      arr[j + 1] = arr[j];
      timeline
        .to(barKey, { x: origPosn[j], duration: animDelay })
        .to(
          barArr[j],
          { x: origPosn[j + 1], duration: animDelay },
          `-=${animDelay}`
        );
      barArr[j + 1] = barArr[j];
      j--;
    }
    arr[j + 1] = key;
    barArr[j + 1] = barKey;
    timeline.to(barKey, {
      y: '0px',
      backgroundColor: 'orange',
      duration: animDelay,
    });
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
  let tArr = str.split(',').map(Number);
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
  generateBars(arr, 0.4, 'bar-cls', barArr);

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
  if (arr[0]) insertionSort();
});
