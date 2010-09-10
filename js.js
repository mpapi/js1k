var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var w = 9;
var h = 9;
var colors = ['#aaa','#d0d','#dd0','#0dd'];
var M = Math;
var ww = 500;
var hh = 500;
canvas.width = ww;
canvas.height = ww;
var pad = 7;
var slice = ww / w;
var score = 0;
function rand(i) { return M.floor(M.random()*i); }
function sq() { return colors[rand(colors.length)]; }
function loop(fn) {
  for (var j = h - 1; j >= 0; j--) {
    for (var i = 0; i < w; i++) {
      fn(i, j);
    }
  }
}
var squares = {};
loop(function(i, j) { squares[[i,j]] = sq() });
function draw() {
  ctx.clearRect(0, 0, ww, hh);
  loop(function(i, j) {
    var color = squares[[i,j]];
    if (!color) color = '#000';
    ctx.fillStyle = color;
    var m = i * slice;
    var n = j * slice;
    ctx.fillRect(m + pad, n + pad, slice - pad, slice - pad);
  });
  ctx.fillStyle = '#000';
  ctx.font = 'bold 30px monospace';
  ctx.fillText(score * 10, ww - 100, 40);
}
var sel = null;
var lsel = null;
canvas.onclick = function(e) {
  lsel = [M.floor(e.offsetX / slice), M.floor(e.offsetY / slice)];
  swap(1);
}
function swap(chk) {
  if (sel) {
    var dx = M.abs(lsel[0] - sel[0]);
    var dy = M.abs(lsel[1] - sel[1]);
    if (dx + dy != 1) { sel = null; return; /* error */}
    var d = squares[lsel];
    squares[lsel] = squares[sel];
    squares[sel] = d;
    if (chk && collapse() == 0) { var d = lsel; lsel = sel; sel = d; swap(0); }
    else { sel = null; refresh(); }
  } else {
    sel = lsel;
  }
}
function collapse() {
  var matches = [];
  loop(function(i, j) {
    var parts = [[i - 1, j], [i, j], [i + 1, j]];
    if (squares[parts[1]] && squares[parts[0]] == squares[parts[1]] && squares[parts[1]] == squares[parts[2]]) {
      matches = matches.concat(parts);
    }
    var parts = [[i, j - 1], [i, j], [i, j + 1]];
    if (squares[parts[1]] && squares[parts[0]] == squares[parts[1]] && squares[parts[1]] == squares[parts[2]]) {
      matches = matches.concat(parts);
    }
  });
  for (var i = 0; i < matches.length; i++) {
    squares[matches[i]] = null;
  }
  while (settle() > 0);
  draw()
  score += matches.length;
  return matches.length;
}
function settle() {
  var count = 0;
  loop(function(i, j) {
    if (!squares[[i, j]]) {
      var d = squares[[i, j - 1]];
      squares[[i, j]] = d;
      squares[[i, j - 1]] = null;
      if (d) count++;
    }
  });
  return count;
}
function fill() {
  var count = 0;
  loop(function(i, j) {
    if (!squares[[i, j]]) {
      squares[[i, j]] = sq();
      count++;
    }
  });
  while (collapse() > 0);
  return count;
}
function refresh() {
  draw()
  while (collapse() > 0);
  while (fill() > 0);
}
refresh();
score = 0;
refresh();
