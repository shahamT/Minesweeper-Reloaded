'use strict'

// get Random integer variations

function getRndIntExcMax(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRndIntIncMax(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//colors

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  var color = '#'

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}


//neighbours loop

// // pos = {i,j}
// //change the matrix name from matrix to your oun name

// for (let i = pos.i - 1; i <= pos.i + 1; i++) {
//   for (let j = pos.j - 1; j <= pos.j + 1; j++) {

//       if (i < 0 || j < 0 ||
//           i > matrix.length - 1 ||
//           j > matrix[i].length - 1 ||
//           (i === pos.i && j === pos.j)) {
//           continue
//           //insert here what to do each itteration
//        }
//     }
// }