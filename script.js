// 'use strict';

// // DOM elements
// const viz = document.querySelector('.bar-container');
// const generateArrayBtn = document.querySelector('.generateArrBtn');
// const sortBtn = document.querySelector('.sortBtn');
// const revBtn = document.querySelector('.revBtn');
// const animSpeedSlider = document.querySelector('.speedSlider');
// const animSpeedDisp = document.querySelector('.animSpeedTxt');
// var cssRoot = document.querySelector(':root');
// var strtColor = '#FFAF';

// // Variables
// let count = 1;
// let barArr = [],
//   arr = [];
// let barWidth = 40,
//   distBtwBars = 2;
// let origPosn = new Array();
// let sizeOfArr = 34; // size of the newly generated array

// // Bubble sort vars
// let i = 0,
//   j = 1;
// let intervalId,
//   // k increments everytime an element gets sorted in bubble sort so next time we dont have to check the whole array
//   k = 0,
//   swapped = false;

// // Insertion sort vars
// let key = 0,
//   iIns = 0,
//   jIns = 1,
//   inserted = false,
//   visited = false,
//   barKey,
//   tjIns;

// // Vars for Counting Sort
// let countArr = new Array();
// let tempBarHashArr = new Array();
// let countingBarArr = new Array();
// // Animation variables
// const timeline = gsap.timeline({ defaults: { duration: 2 } });
// let animDelay; // Controls the speed of animations
// let frequencyCount = 1;
// animSpeedDisp.innerText = `Animation Speed: ${animSpeedSlider.value / 1000}s`;

// animSpeedSlider.oninput = function () {
//   animSpeedDisp.innerText = 'Animation Speed: ';
//   animSpeedDisp.innerText += this.value / 1000 + 's';
//   animDelay = this.value / 1000;
// };
// if (!animDelay) animDelay = 0.5; // default delay

// // Generate an array of random integers of variable size
// function generateArr(size, from, to) {
//   let tempArr = new Array();
//   for (let i = 0; i < size; i++) {
//     let randInt = Math.trunc(Math.random() * to + from);
//     tempArr.push(randInt);
//   }
//   return tempArr;
// }

// // To reset the current state
// function reset(barArr) {
//   for (const bar of barArr) bar.remove();
//   count = 1;
//   arr.length = 0;
//   barArr.length = 0;
//   i = 0;
//   j = 1;
//   k = 0;
//   origPosn.length = 0;
//   (key = 0), (iIns = 0), (jIns = 1), (inserted = false), (visited = false);
//   swapped = false;
//   // countingBarArr.length = 0;
//   // Reset the Interval
//   clearInterval(intervalId);
// }

// // Bubble Sort
// function swapAnim(bar1, bar2) {
//   let style1 = window.getComputedStyle(bar1);
//   let style2 = window.getComputedStyle(bar2);
//   let mat1 = new WebKitCSSMatrix(style1.transform);
//   let mat2 = new WebKitCSSMatrix(style2.transform);
//   // To increase the animation speed without messing up calculations, this duration should be reduced
//   timeline.to(bar1, { x: `${mat2.m41}px`, duration: 0.1 });
//   timeline.to(bar2, { x: `${mat1.m41}px`, duration: 0.1 });
// }

// function swap(swpArr, i, j) {
//   let temp = swpArr[i];
//   swpArr[i] = swpArr[j];
//   swpArr[j] = temp;
// }

// // function bubbleSort() {
// //   // console.log(k);
// //   gsap.to(barArr[i], { backgroundColor: 'green', duration: 0.1 });
// //   gsap.to(barArr[j], { backgroundColor: 'green', duration: 0.1 });
// //   if (arr[i] > arr[j]) {
// //     swap(arr, i, j);
// //     swapAnim(barArr[i], barArr[j]);
// //     swap(barArr, i, j);
// //     swapped = true;
// //   } else swapped = swapped || false;
// //   // console.log(swapped);

// //   gsap.to(barArr[i], {
// //     backgroundColor: 'aqua',
// //     duration: 0.1,
// //     delay: animDelay,
// //   });
// //   gsap.to(barArr[j], {
// //     backgroundColor: 'aqua',
// //     duration: 0.1,
// //     delay: animDelay,
// //   });

// //   i++;
// //   j++;
// //   console.log(j, k);

// //   // if array is sorted i.e: no swaps occur for an iteration
// //   if (!swapped && j == arr.length - k) {
// //     for (let p = 0; p < arr.length - k; p++) {
// //       timeline.to(barArr[p], {
// //         backgroundColor: 'yellow',
// //         duration: 0.1,
// //         delay: animDelay * 0.01,
// //       });
// //     }
// //     clearInterval(intervalId);
// //     i = 0;
// //     j = 1;
// //     k = 0;
// //   }
// //   if (j == arr.length - k) {
// //     k++;
// //     gsap.to(barArr[j - 1], {
// //       backgroundColor: 'yellow',
// //       duration: 0.1,
// //       delay: animDelay,
// //     });

// //     i = 0;
// //     j = 1;
// //     swapped = false;
// //   }
// // }

// function bubbleSort() {
//   // console.log(arr);
//   console.log(animDelay);
//   let i, j;
//   let swapped = false;
//   for (i = 0; i < arr.length; i++) {
//     swapped = false;
//     for (j = 0; j < arr.length - 1 - i; j++) {
//       timeline
//         .to(barArr[j], {
//           backgroundColor: 'green',
//           duration: animDelay,
//           delay: animDelay,
//         })
//         .to(
//           barArr[j + 1],
//           {
//             backgroundColor: 'green',
//             duration: animDelay,
//           },
//           `-=${animDelay}`
//         );
//       if (arr[j] > arr[j + 1]) {
//         let t = arr[j];
//         arr[j] = arr[j + 1];
//         arr[j + 1] = t;
//         timeline
//           .to(barArr[j], {
//             x: origPosn[j + 1],
//             backgroundColor: 'green',
//             duration: animDelay,
//           })
//           .to(
//             barArr[j + 1],
//             { x: origPosn[j], duration: animDelay },
//             `-=${animDelay}`
//           );
//         let bT = barArr[j];
//         barArr[j] = barArr[j + 1];
//         barArr[j + 1] = bT;
//         swapped = true;
//       }
//       timeline
//         .to(barArr[j], {
//           backgroundColor: 'aqua',
//           duration: animDelay,
//           delay: animDelay,
//         })
//         .to(
//           barArr[j + 1],
//           {
//             backgroundColor: 'aqua',
//             duration: animDelay,
//           },
//           `-=${animDelay}`
//         );
//     }

//     if (!swapped) break;
//     timeline.to(
//       barArr[j],
//       {
//         backgroundColor: 'orange',
//         duration: animDelay,
//       },
//       `-=${animDelay}`
//     );
//     // console.log(barArr[j - k]);
//   }
//   let k = i;
//   for (i = 0; i < arr.length - k; i++) {
//     timeline.to(barArr[i], {
//       backgroundColor: 'orange',
//       duration: animDelay,
//     });
//   }

//   // console.log(arr);
// }

// //Insetion Sort
// // function insertionSort() {
// //   // console.log(visited, inserted);
// //   // 5
// //   if (inserted) {
// //     timeline.to(barKey, { y: '0px', duration: 0.1 });
// //     barKey.classList.remove('key');
// //     barKey.classList.add('sorted');
// //     if (jIns == barArr.length - 1) clearInterval(intervalId);
// //     inserted = false;
// //     visited = false;
// //     jIns++;
// //   }
// //   // 1
// //   if (!visited) {
// //     tjIns = jIns;
// //     barKey = barArr[jIns];
// //     key = arr[jIns];
// //     iIns = jIns - 1;
// //     visited = true;
// //     barKey.classList.add('key');
// //   }
// //   console.log(iIns, jIns);
// //   // 2
// //   timeline.to(barArr[tjIns], { y: '-275px', duration: 0.1 });
// //   // 3
// //   if (arr[iIns] >= key) {
// //     swapAnim(barArr[iIns], barArr[tjIns]);
// //     swap(arr, iIns, tjIns);
// //     swap(barArr, iIns, tjIns);
// //     iIns--;
// //     tjIns--; // temp jIns is used to preserve the value of jIns while decreasing the value of jIns
// //     console.log(iIns, tjIns);
// //   }
// //   // 4
// //   if (arr[iIns] < key || iIns < 0) inserted = true;
// // }

// function insertionSort() {
//   let n = arr.length;
//   timeline.to(barArr[0], { backgroundColor: 'orange', duration: 0.1 });
//   for (let i = 1; i < n; i++) {
//     let key = arr[i];
//     let barKey = barArr[i];
//     let j = i - 1;
//     timeline.to(barKey, {
//       y: '-275px',
//       backgroundColor: 'green',
//       duration: animDelay,
//     });
//     while (key < arr[j] && j >= 0) {
//       arr[j + 1] = arr[j];
//       timeline
//         .to(barKey, { x: origPosn[j], duration: animDelay })
//         .to(
//           barArr[j],
//           { x: origPosn[j + 1], duration: animDelay },
//           `-=${animDelay}`
//         );
//       barArr[j + 1] = barArr[j];
//       j--;
//     }
//     arr[j + 1] = key;
//     barArr[j + 1] = barKey;
//     timeline.to(barKey, {
//       y: '0px',
//       backgroundColor: 'orange',
//       duration: animDelay,
//     });
//   }
// }

// // Iterative Merge Sort
// function mergeSort(arr) {
//   let n = arr.length;

//   for (let iM = 1; iM <= n - 1; iM *= 2) {
//     let tempBarArr = Array(iM * 2).fill(0);
//     for (let jM = 0; n % 2 == 0 ? jM < n - 1 : jM <= n - 1; jM += 2 * iM) {
//       var i, j, k;
//       let l = jM;
//       let mid = Math.min(l + iM - 1, n - 1);
//       let h = Math.min(l + 2 * iM - 1, n - 1);

//       // Merge Procedure
//       let nL = mid - l + 1;
//       let nR = h - mid;
//       let L = Array(nL).fill(0);
//       let R = Array(nR).fill(0);
//       let barArrL = Array(nL).fill(0);
//       let barArrR = Array(nR).fill(0);
//       for (i = 0; i < nL; i++) {
//         L[i] = arr[l + i];
//         barArrL[i] = barArr[l + i];
//       }
//       for (j = 0; j < nR; j++) {
//         R[j] = arr[mid + j + 1];
//         barArrR[j] = barArr[mid + j + 1];
//       }

//       (i = 0), (j = 0), (k = l);
//       while (i < nL && j < nR) {
//         if (L[i] >= R[j]) {
//           timeline.to(barArr[mid + j + 1], {
//             x: origPosn[k],
//             y: '-275px',
//             duration: animDelay,
//           });
//           arr[k] = R[j];
//           tempBarArr[k] = barArrR[j];
//           j++;
//         } else {
//           timeline.to(barArr[l + i], {
//             x: origPosn[k],
//             y: '-275px',
//             duration: animDelay,
//           });
//           arr[k] = L[i];
//           tempBarArr[k] = barArrL[i];
//           i++;
//         }
//         k++;
//       }
//       while (i < nL) {
//         timeline.to(barArr[i + l], {
//           x: origPosn[k],
//           y: '-275px',
//           duration: animDelay,
//         });
//         arr[k] = L[i];
//         tempBarArr[k] = barArrL[i];
//         k++;
//         i++;
//       }
//       while (j < nR) {
//         timeline.to(barArr[mid + j + 1], {
//           x: origPosn[k],
//           y: '-275px',
//           duration: animDelay,
//         });
//         arr[k] = R[j];
//         tempBarArr[k] = barArrR[j];
//         k++;
//         j++;
//       }
//       for (let i = 0; i < nL; i++) {
//         timeline.to(tempBarArr[i + l], { y: '0px', duration: animDelay });
//       }
//       for (let j = 0; j < nR; j++) {
//         timeline.to(tempBarArr[mid + 1 + j], { y: '0px', duration: animDelay });
//       }
//     }
//     for (let i = 0; i < barArr.length; i++) {
//       barArr[i] = tempBarArr[i];
//     }
//   }
// }

// // Counting sort
// function countingSort() {
//   if (countingBarArr[0]) reset(countingBarArr);
//   function genHashArr(direction = 1) {
//     return direction > 0
//       ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
//       : [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
//   }
//   tempBarHashArr = genHashArr();
//   generateBars(tempBarHashArr, 20, 'counting-bar-cls', countingBarArr);

//   let k = Math.max(...arr);
//   let newArr = new Array(k + 1).fill(0);
//   let newBarHashArr = new Array(sizeOfArr).fill(0);
//   let newHashArr = new Array(sizeOfArr).fill(0);
//   let tempCnt = new Array();
//   for (let ic = 0; ic < sizeOfArr; ic++) {
//     newArr[arr[ic]]++;

//     timeline
//       .to(barArr[ic], {
//         left: `${Math.trunc(
//           countingBarArr[arr[ic] - 1].getBoundingClientRect().left -
//             (barWidth + distBtwBars) * (ic + 1)
//         )}px`,
//         y: '-275px',
//         duration: animDelay,
//       })
//       .set(countingBarArr[arr[ic] - 1].childNodes[1], {
//         text: newArr[arr[ic]],
//         duration: animDelay,
//       });
//     tempCnt[arr[ic] - 1] = newArr[arr[ic]] - 1;
//   }
//   if (newArr[0] == 0) newArr[0] = -1;
//   for (let i = 1; i <= k; i++) {
//     newArr[i] += newArr[i - 1];
//   }
//   for (let j = sizeOfArr - 1; j >= 0; j--) {
//     newBarHashArr[newArr[arr[j]]] = barArr[j];
//     newHashArr[newArr[arr[j]]] = arr[j];
//     newArr[arr[j]]--;
//   }
//   let tempIdxArr = new Array(...arr);
//   for (let i = 0; i < sizeOfArr; i++) {
//     barArr[i] = newBarHashArr[i];
//     arr[i] = newHashArr[i];
//   }
//   for (let i = 0; i < sizeOfArr; i++) {
//     let offSetIdx = tempIdxArr.indexOf(arr[i]);
//     timeline
//       .to(barArr[i], {
//         left: `${(barWidth + distBtwBars) * (i - offSetIdx)}px`,
//         y: 0,
//         duration: animDelay,
//       })
//       .set(countingBarArr[arr[i] - 1].childNodes[1], {
//         text: tempCnt[arr[i] - 1]--,
//         duration: animDelay,
//       });
//     tempIdxArr[offSetIdx] = -1;
//   }
// }

// // Quick sort
// function partition(arr, left, right) {
//   let i, j;
//   let piv = arr[right];
//   timeline.to(
//     barArr[right],
//     { backgroundColor: 'green', duration: animDelay },
//     `-=${animDelay}`
//   );
//   for (i = left - 1, j = left; j <= right - 1; j++) {
//     timeline.to(barArr[j], { backgroundColor: 'yellow', duration: animDelay });
//     if (arr[j] < piv) {
//       i++;
//       let t = arr[i];
//       arr[i] = arr[j];
//       arr[j] = t;
//       timeline
//         .to(barArr[i], {
//           backgroundColor: 'yellow',
//           duration: animDelay,
//         })
//         .to(barArr[j], { backgroundColor: 'yellow', duration: animDelay })
//         .to(
//           barArr[i],
//           { x: origPosn[j], duration: animDelay },
//           `-=${animDelay}`
//         )
//         .to(
//           barArr[j],
//           { x: origPosn[i], duration: animDelay },
//           `-=${animDelay}`
//         );
//       t = barArr[i];
//       barArr[i] = barArr[j];
//       barArr[j] = t;
//     }
//     timeline.to(barArr[i], {
//       backgroundColor: 'aqua',
//       duration: animDelay,
//     });
//     timeline.to(barArr[j], { backgroundColor: 'aqua', duration: animDelay });
//   }
//   let t = arr[i + 1];
//   arr[i + 1] = arr[right];
//   arr[right] = t;
//   timeline
//     .to(barArr[i + 1], { x: origPosn[right], duration: animDelay })
//     .to(barArr[right], { x: origPosn[i + 1], duration: animDelay });
//   timeline.to(barArr[right], { backgroundColor: 'aqua', duration: animDelay });
//   t = barArr[i + 1];
//   barArr[i + 1] = barArr[right];
//   barArr[right] = t;
//   return i + 1;
// }

// function quickSort(arr, left, right) {
//   if (left < right) {
//     let piv = partition(arr, left, right);
//     quickSort(arr, left, piv - 1);
//     quickSort(arr, piv + 1, right);
//   }
// }

// function partitionMid(arr, left, right) {
//   let i = left,
//     j = right;
//   let mid = Math.floor((left + right) / 2);
//   let piv = arr[mid];
//   let barPiv = barArr[mid];

//   for (let k = left; k <= right; k++) {
//     timeline.to(barArr[k], { backgroundColor: 'blue', duration: 0.05 });
//     timeline.to(barPiv, { backgroundColor: 'green', duration: 0 });
//   }

//   while (i <= j) {
//     timeline.to(barPiv, { backgroundColor: 'green', duration: 0.05 });
//     while (arr[i] < piv) {
//       i++;
//     }
//     while (arr[j] > piv) {
//       j--;
//     }
//     if (i <= j) {
//       let t = arr[i];
//       arr[i] = arr[j];
//       arr[j] = t;
//       timeline
//         .to(barArr[i], { x: origPosn[j], duration: animDelay })
//         .to(
//           barArr[j],
//           { x: origPosn[i], duration: animDelay },
//           `-=${animDelay}`
//         );
//       let tbr = barArr[i];
//       barArr[i] = barArr[j];
//       barArr[j] = tbr;
//       i++;
//       j--;
//     }
//   }
//   for (let k = left; k <= right; k++) {
//     timeline.to(barArr[k], { backgroundColor: 'aqua', duration: 0.05 });
//   }
//   timeline.to(barPiv, { backgroundColor: 'aqua', duration: 0.05 });
//   return i;
// }

// function midQuickSort(arr, left, right) {
//   let index;
//   if (arr.length > 1) {
//     index = partitionMid(arr, left, right);
//     if (left < index - 1) midQuickSort(arr, left, index - 1);
//     if (index < right) midQuickSort(arr, index, right);
//   }
// }

// function recMerge(arr, l, m, r) {
//   let nl = m - l + 1;
//   let nr = r - m;
//   let L = new Array(nl);
//   let R = new Array(nr);
//   let barL = new Array(nl);
//   let barR = new Array(nr);
//   let tempBarArr = new Array(nl + nr).fill(0);

//   for (let i = 0; i < nl; i++) {
//     L[i] = arr[l + i];
//     barL[i] = barArr[l + i];
//   }
//   for (let j = 0; j < nr; j++) {
//     R[j] = arr[m + j + 1];
//     barR[j] = barArr[m + j + 1];
//   }

//   let i, j, k;
//   i = j = 0;
//   k = l;

//   while (i < nl && j < nr) {
//     if (L[i] >= R[j]) {
//       timeline.to(barArr[m + j + 1], {
//         x: origPosn[k],
//         y: '-275px',
//         duration: animDelay,
//       });
//       arr[k] = R[j];
//       tempBarArr[k] = barR[j];
//       j++;
//     } else {
//       timeline.to(barArr[l + i], {
//         x: origPosn[k],
//         y: '-275px',
//         duration: animDelay,
//       });
//       arr[k] = L[i];
//       tempBarArr[k] = barL[i];
//       i++;
//     }
//     k++;
//   }
//   while (i < nl) {
//     timeline.to(barArr[i + l], {
//       x: origPosn[k],
//       y: '-275px',
//       duration: animDelay,
//     });
//     arr[k] = L[i];
//     tempBarArr[k] = barL[i];
//     k++;
//     i++;
//   }

//   while (j < nr) {
//     timeline.to(barArr[m + j + 1], {
//       x: origPosn[k],
//       y: '-275px',
//       duration: animDelay,
//     });
//     arr[k] = R[j];
//     tempBarArr[k] = barR[j];
//     k++;
//     j++;
//   }
//   for (let i = 0; i < nl; i++) {
//     timeline.to(tempBarArr[i + l], { y: '0px', duration: animDelay });
//   }
//   for (let j = 0; j < nr; j++) {
//     timeline.to(tempBarArr[m + 1 + j], { y: '0px', duration: animDelay });
//   }
//   for (let i = 0; i < tempBarArr.length; i++) {
//     if (tempBarArr[i] != 0 && tempBarArr[i]) barArr[i] = tempBarArr[i];
//   }
// }

// function recMergeSort(arr, l, r) {
//   if (l >= r) return;
//   // let m = l + parseInt((r - l) / 2);
//   let m = Math.floor((l + r) / 2);
//   recMergeSort(arr, l, m);
//   recMergeSort(arr, m + 1, r);
//   recMerge(arr, l, m, r);
// }

// function heapify(arr, size, i) {
//   let max = i;
//   let left = 2 * i + 1;
//   let right = 2 * i + 2;

//   if (left < size && arr[left] > arr[max]) max = left;
//   if (right < size && arr[right] > arr[max]) max = right;

//   if (max != i) {
//     let t = arr[i];
//     arr[i] = arr[max];
//     arr[max] = t;
//     timeline
//       .to(barArr[i], { x: origPosn[max], duration: animDelay })
//       .to(
//         barArr[max],
//         { x: origPosn[i], duration: animDelay },
//         `-=${animDelay}`
//       );
//     let tbar = barArr[i];
//     barArr[i] = barArr[max];
//     barArr[max] = tbar;
//     heapify(arr, size, max);
//   }
// }

// function heapSort(arr) {
//   let size = arr.length;
//   for (let i = Math.floor(size / 2 - 1); i >= 0; i--) heapify(arr, size, i);
//   for (let i = size - 1; i >= 0; i--) {
//     let t = arr[0];
//     arr[0] = arr[i];
//     arr[i] = t;
//     timeline
//       .to(barArr[0], { x: origPosn[i], duration: animDelay })
//       .to(barArr[i], { x: origPosn[0], duration: animDelay }, `-=${animDelay}`);
//     let tbar = barArr[0];
//     barArr[0] = barArr[i];
//     barArr[i] = tbar;
//     heapify(arr, i, 0);
//   }
// }

// function generateBars(arr, factor, barClass, barArr) {
//   if (barArr[0]) reset(barArr);
//   count = 1;
//   for (const height of arr) {
//     const bar = document.createElement('div');
//     const val = document.createElement('p');
//     val.innerText = height;
//     val.classList.add('bar-value');
//     bar.classList.add(barClass);
//     bar.appendChild(val);
//     if (barClass == 'counting-bar-cls') {
//       let idxCnt = document.createElement('p');
//       idxCnt.innerText = 0;
//       idxCnt.classList.add('count-cls');
//       bar.appendChild(idxCnt);
//     }
//     gsap.from(bar, { height: 0, delay: 0 });
//     bar.style.height = `${height * factor}px`; // change the factor to 0.4 for sorts other than Counting Sort
//     bar.style.width = `${barWidth}px`;
//     bar.style.transform = `translateX(${(barWidth + distBtwBars) * count}px)`;
//     gsap.to(bar, { height: `${height * factor}px`, delay: 0 });
//     viz.appendChild(bar);
//     count++;
//     barArr.push(bar);
//   }
// }

// // Generating bars
// generateArrayBtn.addEventListener('click', () => {
//   if (barArr[0]) reset(barArr);

//   // arr = [500, 400, 300, 200, 100, 600, 700];
//   /* For other sorts */
//   arr = generateArr(sizeOfArr, 50, 500); // generateArr(no. of elements, min, max);
//   generateBars(arr, 0.4, 'bar-cls', barArr);
//   /* For counting sort */
//   // arr = generateArr(sizeOfArr, 1, 10);
//   // generateBars(arr, 20, 'bar-cls', barArr);

//   for (let bar of barArr) {
//     let barSt = getComputedStyle(bar);
//     let barMat = new WebKitCSSMatrix(barSt.transform);
//     origPosn.push(barMat.m41);
//   }
//   console.log(arr);
// });

// sortBtn.addEventListener('click', () => {
//   // Calls the sorting functions at specified intervals
//   // animation speed will range from 100ms - 1000ms
//   // intervalId = setInterval(insertionSort, animDelay * 1000);
//   // barArr[0].style.backgroundColor = strtColor;
//   // bubbleSort();
//   // insertionSort();
//   // for (let i = 0; i < arr.length; i += 2) {
//   //   timeline.to(barArr[i], { backgroundColor: getCol(dec), duration: 0.1 });
//   //   console.log(dec);
//   //   timeline.to(
//   //     barArr[(i + 1) % arr.length],
//   //     {
//   //       backgroundColor: getCol(dec),
//   //       duration: 0.1,
//   //     },
//   //     '-=0.1'
//   //   );
//   //   dec += 2 ** 2;
//   // }
//   // mergeSort(arr);
//   // countingSort();
//   // quickSort(arr, 0, arr.length - 1);
//   // recMergeSort(arr, 0, arr.length - 1);
//   // midQuickSort(arr, 0, arr.length - 1);
//   heapSort(arr);
//   console.log(arr);
// });
