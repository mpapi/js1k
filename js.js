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
var squares = [];
for (var i = 0; i < w; i++) {
  var buf = [];
  for (var j = 0; j < h; j++) {
    buf.push(sq());
  }
  squares.push(buf);
}
function draw() {
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      //ctx.fillRect(i * slice + pad, j * slice + pad, i * slice + pad + slice, j * slice + pad + slice);
      ctx.fillStyle = squares[i][j];
      ctx.beginPath();
      ctx.arc((i + 0.5) * slice + pad, (j + 0.5) * slice + pad, slice/2, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  }
}
canvas.onclick = function(e) {
  console.debug(e);
}
draw()
