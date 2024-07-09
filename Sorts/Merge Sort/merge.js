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

// Iterative Merge Sort
function mergeSort(arr) {
  let n = arr.length;

  for (let iM = 1; iM <= n - 1; iM *= 2) {
    let tempBarArr = Array(iM * 2).fill(0);
    for (let jM = 0; n % 2 == 0 ? jM < n - 1 : jM <= n - 1; jM += 2 * iM) {
      var i, j, k;
      let l = jM;
      let mid = Math.min(l + iM - 1, n - 1);
      let h = Math.min(l + 2 * iM - 1, n - 1);

      // Merge Procedure
      let nL = mid - l + 1;
      let nR = h - mid;
      let L = Array(nL).fill(0);
      let R = Array(nR).fill(0);
      let barArrL = Array(nL).fill(0);
      let barArrR = Array(nR).fill(0);
      for (i = 0; i < nL; i++) {
        L[i] = arr[l + i];
        barArrL[i] = barArr[l + i];
      }
      for (j = 0; j < nR; j++) {
        R[j] = arr[mid + j + 1];
        barArrR[j] = barArr[mid + j + 1];
      }

      (i = 0), (j = 0), (k = l);
      while (i < nL && j < nR) {
        if (L[i] >= R[j]) {
          timeline.to(barArr[mid + j + 1], {
            x: origPosn[k],
            y: '-275px',
            duration: animDelay,
          });
          arr[k] = R[j];
          tempBarArr[k] = barArrR[j];
          j++;
        } else {
          timeline.to(barArr[l + i], {
            x: origPosn[k],
            y: '-275px',
            duration: animDelay,
          });
          arr[k] = L[i];
          tempBarArr[k] = barArrL[i];
          i++;
        }
        k++;
      }
      while (i < nL) {
        timeline.to(barArr[i + l], {
          x: origPosn[k],
          y: '-275px',
          duration: animDelay,
        });
        arr[k] = L[i];
        tempBarArr[k] = barArrL[i];
        k++;
        i++;
      }
      while (j < nR) {
        timeline.to(barArr[mid + j + 1], {
          x: origPosn[k],
          y: '-275px',
          duration: animDelay,
        });
        arr[k] = R[j];
        tempBarArr[k] = barArrR[j];
        k++;
        j++;
      }
      for (let i = 0; i < nL; i++) {
        timeline.to(tempBarArr[i + l], { y: '0px', duration: animDelay });
      }
      for (let j = 0; j < nR; j++) {
        timeline.to(tempBarArr[mid + 1 + j], { y: '0px', duration: animDelay });
      }
    }
    for (let i = 0; i < barArr.length; i++) {
      barArr[i] = tempBarArr[i];
    }
  }
}

function recMerge(arr, l, m, r) {
  let nl = m - l + 1;
  let nr = r - m;
  let L = new Array(nl);
  let R = new Array(nr);
  let barL = new Array(nl);
  let barR = new Array(nr);
  let tempBarArr = new Array(nl + nr).fill(0);

  for (let i = 0; i < nl; i++) {
    L[i] = arr[l + i];
    barL[i] = barArr[l + i];
  }
  for (let j = 0; j < nr; j++) {
    R[j] = arr[m + j + 1];
    barR[j] = barArr[m + j + 1];
  }

  let i, j, k;
  i = j = 0;
  k = l;

  while (i < nl && j < nr) {
    if (L[i] >= R[j]) {
      timeline.to(barArr[m + j + 1], {
        x: origPosn[k],
        y: '-275px',
        duration: animDelay,
      });
      arr[k] = R[j];
      tempBarArr[k] = barR[j];
      j++;
    } else {
      timeline.to(barArr[l + i], {
        x: origPosn[k],
        y: '-275px',
        duration: animDelay,
      });
      arr[k] = L[i];
      tempBarArr[k] = barL[i];
      i++;
    }
    k++;
  }
  while (i < nl) {
    timeline.to(barArr[i + l], {
      x: origPosn[k],
      y: '-275px',
      duration: animDelay,
    });
    arr[k] = L[i];
    tempBarArr[k] = barL[i];
    k++;
    i++;
  }

  while (j < nr) {
    timeline.to(barArr[m + j + 1], {
      x: origPosn[k],
      y: '-275px',
      duration: animDelay,
    });
    arr[k] = R[j];
    tempBarArr[k] = barR[j];
    k++;
    j++;
  }
  for (let i = 0; i < nl; i++) {
    timeline.to(tempBarArr[i + l], { y: '0px', duration: animDelay });
  }
  for (let j = 0; j < nr; j++) {
    timeline.to(tempBarArr[m + 1 + j], { y: '0px', duration: animDelay });
  }
  for (let i = 0; i < tempBarArr.length; i++) {
    if (tempBarArr[i] != 0 && tempBarArr[i]) barArr[i] = tempBarArr[i];
  }
}

function recMergeSort(arr, l, r) {
  if (l >= r) return;
  // let m = l + parseInt((r - l) / 2);
  let m = Math.floor((l + r) / 2);
  recMergeSort(arr, l, m);
  recMergeSort(arr, m + 1, r);
  recMerge(arr, l, m, r);
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
  generateBars(arr, 0.4, 'bar-cls', barArr);

  for (let bar of barArr) {
    let barSt = getComputedStyle(bar);
    let barMat = new WebKitCSSMatrix(barSt.transform);
    origPosn.push(barMat.m41);
  }
  console.log(arr);
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
  if (selVer) mergeSort(arr);
  else recMergeSort(arr, 0, arr.length - 1);
  colAll();
});
