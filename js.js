var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var w = 9;
var h = 9;
var colors = ['#aaa','#d0d','#dd0','#0dd'];
var blk = '#000';
var M = Math;
var ww = 500;
var hh = 500;
canvas.width = ww;
canvas.height = ww;
var pad = 7;
var slice = ww / w;
var score = 0;
function sq() { return colors[M.floor(M.random()*colors.length)]; }
function loop(fn) {
  var j = h - 1; while (j--) {
    var i = w - 1; while (i--) fn(i, j);
  }
}
var squares = {};
loop(function(i, j) { squares[[i,j]] = sq() });
function draw() {
  ctx.clearRect(0, 0, ww, hh);
  loop(function(i, j) {
    var color = squares[[i,j]];
    if (!color) color = blk;
    ctx.fillStyle = color;
    var m = i * slice;
    var n = j * slice;
    ctx.fillRect(m + pad, n + pad, slice - pad, slice - pad);
  });
  ctx.fillStyle = blk;
  ctx.font = 'bold 32px monospace';
  ctx.fillText(score * 10, ww - 100, 40);
}
var sel = 0;
var lsel = 0;
canvas.onclick = function(e) {
  lsel = [M.floor(e.offsetX / slice), M.floor(e.offsetY / slice)];
  swap(1);
}
function swap(chk) {
  if (sel) {
    var dx = M.abs(lsel[0] - sel[0]);
    var dy = M.abs(lsel[1] - sel[1]);
    if (dx + dy != 1) { sel = 0; return; /* error */}
    var d = squares[lsel];
    squares[lsel] = squares[sel];
    squares[sel] = d;
    if (chk && collapse() == 0) { var d = lsel; lsel = sel; sel = d; swap(0); }
    else { sel = 0; refresh(); }
  } else {
    sel = lsel;
  }
}
function check(matches, parts) {
    return squares[parts[1]] && squares[parts[0]] == squares[parts[1]] && squares[parts[1]] == squares[parts[2]] ? matches.concat(parts) : matches;
}
function collapse() {
  var matches = [];
  loop(function(i, j) {
    matches = check(matches, [[i - 1, j], [i, j], [i + 1, j]]);
    matches = check(matches, [[i, j - 1], [i, j], [i, j + 1]]);
  });
  for (var i = 0; i < matches.length; i++) {
    squares[matches[i]] = 0;
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
      squares[[i, j - 1]] = 0;
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
