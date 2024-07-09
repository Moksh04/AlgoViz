'use strict';

const viz = document.querySelector('.bar-container');
const generateArrayBtn = document.querySelector('.generateArrBtn');
const sortBtn = document.querySelector('.sortBtn');
const revBtn = document.querySelector('.revBtn');
const animSpeedSlider = document.querySelector('.speedSlider');
const animSpeedDisp = document.querySelector('.animSpeedTxt');
var cssRoot = document.querySelector(':root');
var strtColor = '#FFAF';
const userInput = document.querySelector('.userInput');
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

// Vars for Counting Sort
let countArr = new Array();
let tempBarHashArr = new Array();
let countingBarArr = new Array();
let newArr = new Array();
let newBarHashArr = new Array();
let newHashArr = new Array();
let tempCnt = new Array();
let tempIdxArr = new Array();

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
  countArr.length = 0;
  tempBarHashArr.length = 0;
  countingBarArr.length = 0;
  newArr.length = 0;
  newBarHashArr.length = 0;
  newHashArr.length = 0;
  tempCnt.length = 0;
  tempIdxArr.length = 0;
  killTl();
  location.reload();
}

function countingSort() {
  if (countingBarArr[0]) reset(countingBarArr);
  function genHashArr(direction = 1) {
    return direction > 0
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      : [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  }
  tempBarHashArr = genHashArr();
  generateBars(tempBarHashArr, 20, 'counting-bar-cls', countingBarArr);
  sizeOfArr = arr.length;
  let k = Math.max(...arr);
  newArr = new Array(k + 1).fill(0);
  newBarHashArr = new Array(sizeOfArr).fill(0);
  newHashArr = new Array(sizeOfArr).fill(0);
  tempCnt = new Array();
  for (let ic = 0; ic < sizeOfArr; ic++) {
    newArr[arr[ic]]++;

    timeline
      .to(barArr[ic], {
        left: `${Math.trunc(
          countingBarArr[arr[ic] - 1].getBoundingClientRect().left -
            (barWidth + distBtwBars) * (ic + 1)
        )}px`,
        y: '-275px',
        duration: animDelay,
      })
      .set(countingBarArr[arr[ic] - 1].childNodes[1], {
        text: newArr[arr[ic]],
        duration: animDelay,
      });
    tempCnt[arr[ic] - 1] = newArr[arr[ic]] - 1;
  }
  if (newArr[0] == 0) newArr[0] = -1;
  for (let i = 1; i <= k; i++) {
    newArr[i] += newArr[i - 1];
  }
  for (let j = sizeOfArr - 1; j >= 0; j--) {
    newBarHashArr[newArr[arr[j]]] = barArr[j];
    newHashArr[newArr[arr[j]]] = arr[j];
    newArr[arr[j]]--;
  }
  tempIdxArr = new Array(...arr);
  for (let i = 0; i < sizeOfArr; i++) {
    barArr[i] = newBarHashArr[i];
    arr[i] = newHashArr[i];
  }
  for (let i = 0; i < sizeOfArr; i++) {
    let offSetIdx = tempIdxArr.indexOf(arr[i]);
    timeline
      .to(barArr[i], {
        left: `${(barWidth + distBtwBars) * (i - offSetIdx)}px`,
        y: 0,
        duration: animDelay,
      })
      .set(countingBarArr[arr[i] - 1].childNodes[1], {
        text: tempCnt[arr[i] - 1]--,
        duration: animDelay,
      });
    tempIdxArr[offSetIdx] = -1;
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
    if (barClass == 'counting-bar-cls') {
      let idxCnt = document.createElement('p');
      idxCnt.innerText = 0;
      idxCnt.classList.add('count-cls');
      bar.appendChild(idxCnt);
    }
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
  let tArr = str
    .split(',')
    .map(Number)
    .filter((el) => {
      if (el >= 1) return el;
    });
  return tArr;
}

// Generating bars
generateArrayBtn.addEventListener('click', () => {
  if (barArr[0]) reset(barArr);

  if (userInput.value == '') arr = generateArr(sizeOfArr, 1, 10);
  // generateArr(no. of elements, min, max);
  else arr = getUserInput();
  console.log(arr);
  generateBars(arr, 20, 'bar-cls', barArr);

  for (let bar of barArr) {
    let barSt = getComputedStyle(bar);
    let barMat = new WebKitCSSMatrix(barSt.transform);
    origPosn.push(barMat.m41);
  }
});

function colAll() {
  for (let i = 0; i < barArr.length; i++)
    timeline.to(barArr[i], {
      backgroundColor: '#ea5eff',
      duration: 0.05,
    });
}

userInput.addEventListener('focus', () => {
  generateArrayBtn.innerText = 'GENERATE YOUR ARRAY';
});

userInput.addEventListener('focusout', () => {
  if (userInput.value == '')
    generateArrayBtn.innerText = 'GENERATE A RANDOM ARRAY';
});

sortBtn.addEventListener('click', () => {
  if (arr[0]) {
    countingSort();
    colAll();
  }
});
