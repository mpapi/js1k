var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var w = 10; var h = 10; var colors = ['#ddd','#d0d','#dd0','#0dd'];
canvas.width = 500;
canvas.height = 500;
var ww = 500;
var hh = 500;
var pad = 0;
var slice = ww / w;
function rand(i) { return Math.floor(Math.random()*i); }
function sq() { return colors[rand(colors.length)]; }
var squares = {};
for (var i = 0; i < w; i++) {
  for (var j = 0; j < h; j++) {
    squares[[i,j]] = sq();
  }
}
function draw() {
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      //ctx.fillRect(i * slice + pad, j * slice + pad, i * slice + pad + slice, j * slice + pad + slice);
      var color = squares[[i,j]];
      if (!color) color = '#000';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc((i + 0.5) * slice + pad, (j + 0.5) * slice + pad, slice/2, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  }
}
var sel = null;
canvas.onclick = function(e) {
  var lsel = [[Math.floor(e.offsetX / slice), Math.floor(e.offsetY / slice)]];
  if (sel) {
    var d = squares[lsel];
    squares[lsel] = squares[sel];
    squares[sel] = d;
    sel = null;
    refresh();
  } else {
    sel = lsel;
  }
}
function collapse() {
  var matches = [];
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      var parts = [[i - 1, j], [i, j], [i + 1, j]];
      if (squares[parts[1]] && squares[parts[0]] == squares[parts[1]] && squares[parts[1]] == squares[parts[2]]) {
        matches = matches.concat(parts);
      }
      var parts = [[i, j - 1], [i, j], [i, j + 1]];
      if (squares[parts[1]] && squares[parts[0]] == squares[parts[1]] && squares[parts[1]] == squares[parts[2]]) {
        matches = matches.concat(parts);
      }
    }
  }
  for (var i = 0; i < matches.length; i++) {
    squares[matches[i]] = null;
  }
  while (settle() > 0);
  draw()
  return matches.length;
}
function settle() {
  var count = 0;
  for (var j = h - 1; j >= 0; j--) {
    for (var i = 0; i < w; i++) {
      if (!squares[[i, j]]) {
        var d = squares[[i, j - 1]];
        squares[[i, j]] = d;
        squares[[i, j - 1]] = null;
        if (d) count++;
      }
    }
  }
  return count;
}
function fill() {
  var count = 0;
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      if (!squares[[i, j]]) {
        squares[[i, j]] = sq();
        count++;
      }
    }
  }
  while (collapse() > 0);
  return count;
}
function refresh() {
  draw()
  while (collapse() > 0);
  while (fill() > 0);
}
refresh();
//while (fill() > 0);
