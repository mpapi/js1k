var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');
var w = 9;
var z = w*w;
var q = z * w + 1;
var colors = ['aaa','d0d','dd0','0dd'];
var M = Math;
var ww = canvas.width = canvas.height = 500;
var pad = 5;
var slice = ww / w;
var score = 0;
var p = {1:0}; p[z] = p[-1] = p[-z] = 0;
function sq() { return '#'+colors[M.floor(M.random()*4)]; }
function loop(fn) {
  J = w - 1; while (J--) {
    I = w - 1; while (I--) fn(J * z + I + 1, I, J);
  }
}
var squares = {};
loop(function(n) { squares[n] = sq() });
var sel = 0;
var lsel = 0;
canvas.onclick = function(e) {
  lsel = M.floor(e.pageX / slice) + M.floor(e.pageY / slice) * z + 1;
  swap(1);
}
function swap(chk) {
  if (sel) {
    if (M.abs(lsel - sel) in p) {
      D = squares[lsel];
      squares[lsel] = squares[sel];
      squares[sel] = D;
      if (chk && !collapse()) { D = lsel; lsel = sel; sel = D; swap(0); }
    }
    sel = 0; refresh();
  } else sel = lsel;
}
var matches = [];
function check(parts) {
    matches.push.apply(matches, squares[parts[1]] && squares[parts[0]] == squares[parts[1]] && squares[parts[1]] == squares[parts[2]] ? parts : []);
}
function collapse(sc) {
  matches = [];
  n = q; while(n--) { check([n - 1, n, n + 1]); check([n + z, n, n - z]); }
  for (n in matches) squares[matches[n]] = 0;
  do {
    var s = 0;
    n = q; while(n--) {
      if (!squares[n]) {
        D = squares[n - z];
        squares[n] = D;
        squares[n - z] = 0;
        if (D) s++;
      }
    }
  } while (s > 0);
  var k = matches.length;
  if (!sc) score += k;
  return k;
}
function refresh(s) {
  while (collapse(s) > 0);
  do {
    var c = 0;
    n = q; while(n--) {
      if (!squares[n]) {
        squares[n] = sq();
        c++;
      }
    }
    while (collapse(s) > 0);
  } while (c > 0);
  ctx.clearRect(0, 0, ww, ww);
  loop(function(n, i, j) {
    var color = squares[n];
    ctx.fillStyle = color;
    ctx.fillRect(i * slice + pad, j * slice + pad, slice - pad, slice - pad);
  });
  ctx.fillStyle = '#000';
  ctx.fillText(score, 10, 10);
}
refresh(1);
