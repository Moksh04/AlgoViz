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
let selVer = 1;
let selBtns = new Array(
  document.querySelector('.choose1'),
  document.querySelector('.choose2')
);

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

// Quick sort end pivot
function partition(arr, left, right) {
  let i, j;
  let piv = arr[right];
  timeline.to(
    barArr[right],
    { backgroundColor: 'green', duration: animDelay },
    `-=${animDelay}`
  );
  for (i = left - 1, j = left; j <= right - 1; j++) {
    timeline.to(barArr[j], { backgroundColor: 'yellow', duration: animDelay });
    if (arr[j] < piv) {
      i++;
      let t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
      timeline
        .to(barArr[i], {
          backgroundColor: 'yellow',
          duration: animDelay,
        })
        .to(barArr[j], { backgroundColor: 'yellow', duration: animDelay })
        .to(
          barArr[i],
          { x: origPosn[j], duration: animDelay },
          `-=${animDelay}`
        )
        .to(
          barArr[j],
          { x: origPosn[i], duration: animDelay },
          `-=${animDelay}`
        );
      t = barArr[i];
      barArr[i] = barArr[j];
      barArr[j] = t;
    }
    timeline.to(barArr[i], {
      backgroundColor: 'aqua',
      duration: animDelay,
    });
    timeline.to(barArr[j], { backgroundColor: 'aqua', duration: animDelay });
  }
  let t = arr[i + 1];
  arr[i + 1] = arr[right];
  arr[right] = t;
  timeline
    .to(barArr[i + 1], { x: origPosn[right], duration: animDelay })
    .to(barArr[right], { x: origPosn[i + 1], duration: animDelay });
  timeline.to(barArr[right], { backgroundColor: 'aqua', duration: animDelay });
  t = barArr[i + 1];
  barArr[i + 1] = barArr[right];
  barArr[right] = t;
  return i + 1;
}

function quickSort(arr, left, right) {
  if (left < right) {
    let piv = partition(arr, left, right);
    quickSort(arr, left, piv - 1);
    quickSort(arr, piv + 1, right);
  }
}

// Quick sort Mid pivot
function partitionMid(arr, left, right) {
  let i = left,
    j = right;
  let mid = Math.floor((left + right) / 2);
  let piv = arr[mid];
  let barPiv = barArr[mid];

  for (let k = left; k <= right; k++) {
    timeline.to(barArr[k], { backgroundColor: 'lightgreen', duration: 0.03 });
    timeline.to(barPiv, { backgroundColor: 'green', duration: 0 });
  }

  while (i <= j) {
    timeline.to(barPiv, { backgroundColor: 'green', duration: 0.05 });
    while (arr[i] < piv) {
      i++;
    }
    while (arr[j] > piv) {
      j--;
    }
    if (i <= j) {
      let t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
      timeline
        .to(barArr[i], { x: origPosn[j], duration: animDelay })
        .to(
          barArr[j],
          { x: origPosn[i], duration: animDelay },
          `-=${animDelay}`
        );
      let tbr = barArr[i];
      barArr[i] = barArr[j];
      barArr[j] = tbr;
      i++;
      j--;
    }
  }
  for (let k = left; k <= right; k++) {
    timeline.to(barArr[k], { backgroundColor: 'aqua', duration: 0.05 });
  }
  timeline.to(barPiv, { backgroundColor: 'aqua', duration: 0.05 });
  return i;
}

function midQuickSort(arr, left, right) {
  let index;
  if (arr.length > 1) {
    index = partitionMid(arr, left, right);
    if (left < index - 1) midQuickSort(arr, left, index - 1);
    if (index < right) midQuickSort(arr, index, right);
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

function colorAll() {
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

selBtns[0].addEventListener('click', () => {
  selVer = 1;
  selBtns[1].classList.remove('activeSort');
  selBtns[0].classList.add('activeSort');
});

selBtns[1].addEventListener('click', () => {
  selVer = 0;
  selBtns[0].classList.remove('activeSort');
  selBtns[1].classList.add('activeSort');
});

sortBtn.addEventListener('click', () => {
  if (!arr[0]) return;
  if (selVer) quickSort(arr, 0, arr.length - 1);
  else midQuickSort(arr, 0, arr.length - 1);
  colorAll();
});
