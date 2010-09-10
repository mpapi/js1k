var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var w = 9;
var z = w*w;
var colors = ['aaa','d0d','dd0','0dd'];
var M = Math;
var ww = canvas.width = canvas.height = 500;
var pad = 7;
var slice = ww / w;
var score = 0;
var g = {};
var p = {1:0}; p[z] = p[-1] = p[-z] = 0;
function sq() { return '#'+colors[M.floor(M.random()*4)]; }
function loop(fn) {
  var j = w - 1; while (j--) {
    var i = w - 1; while (i--) fn(j * z + i + 1, i, j);
  }
}
var squares = {};
loop(function(n) { g[n] = n; squares[n] = sq() });
var sel = 0;
var lsel = 0;
canvas.onclick = function(e) {
  lsel = M.floor(e.offsetX / slice) + M.floor(e.offsetY / slice) * z + 1;
  swap(1);
}
function swap(chk) {
  if (sel) {
    if (M.abs(lsel - sel) in p) {
      var d = squares[lsel];
      squares[lsel] = squares[sel];
      squares[sel] = d;
      if (chk && !collapse()) { var d = lsel; lsel = sel; sel = d; swap(0); }
    }
    sel = 0; refresh();
  } else sel = lsel;
}
function check(matches, parts) {
    return squares[parts[1]] && squares[parts[0]] == squares[parts[1]] && squares[parts[1]] == squares[parts[2]] ? matches.concat(parts) : matches;
}
function collapse() {
  var matches = [];
  for (var n in g) { n = g[n]; matches = check(check(matches, [n - 1, n, n + 1]), [n + z, n, n - z]); }
  for (var i in matches) squares[matches[i]] = 0;
  do {
    var s = 0;
    for (var n in g) {
      if (!squares[n]) {
        var d = squares[n - z];
        squares[n] = d;
        squares[n - z] = 0;
        if (d) s++;
      }
    }
  } while (s > 0);
  var k = matches.length;
  score += k;
  return k;
}
function refresh(s) {
  while (collapse() > 0);
  do {
    var c = 0;
    for (var n in g) {
      if (!squares[n]) {
        squares[n] = sq();
        count++;
      }
    }
  } while (c > 0);
  ctx.clearRect(0, 0, ww, ww);
  loop(function(n, i, j) {
    var color = squares[n];
    ctx.fillStyle = color;
    ctx.fillRect(i * slice + pad, j * slice + pad, slice - pad, slice - pad);
  });
  ctx.fillStyle = '#000';
  ctx.font = '32px mono';
  ctx.fillText(s?0:score * 10, ww - 200, 40);
}
refresh(1);
