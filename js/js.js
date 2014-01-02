var canvas = document.getElementById('canvas'),
  context = canvas.getContext('2d'),
  tcanvas = document.createElement('canvas'),
  tcontext = tcanvas.getContext('2d'),
  settings = {
    text: 'Luis page\'s comming soon...',
    font: 'bold 48px Peralta',
    force_size: 64,
    generate: init
  },
  gui = new dat.GUI(),
  height, width, data;
gui.add(settings, 'text');
gui.add(settings, 'font');
gui.add(settings, 'force_size',3,100).step(1);
gui.add(settings, 'generate');
setTimeout(function () {
  init();
  update();
  render();
}, 10);

function init() {
  height = canvas.height = tcanvas.height = document.body.offsetHeight,
  width = canvas.width = tcanvas.width = document.body.offsetWidth
  tcontext.clearRect(0, 0, width, height);
  data = [];
  tcontext.font = settings.font;
  var w = tcontext.measureText(settings.text).width;
  tcontext.fillText(settings.text, (width - w) / 2, height / 2);
  var idata = tcontext.getImageData(0, 0, width, height);
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var o = x * 4 + y * 4 * idata.width;
      if (idata.data[o + 3] > 0) {
        data.push({
          x: Math.random() * width,
          y: Math.random() * height,
          sx: x,
          sy: y
        });
      }
    }
  }
  window.addEventListener('mousemove', force, false);
}

function update() {
  for (var i = 0; i < data.length; i++) {
    data[i].x += (data[i].sx - data[i].x) / 10;
    data[i].y += (data[i].sy - data[i].y) / 10;
  }
  setTimeout(update, 1000 / 30);
}

function render() {
  context.clearRect(0, 0, width, height);
  for (var i = 0; i < data.length; i++) {
    context.beginPath();
    context.fillRect(data[i].x, data[i].y, 1, 1);
    context.closePath();
  }
  requestAnimationFrame(render);
}

function force(e) {
  for (var i = 0; i < data.length; i++) {
    var dx = data[i].x - e.clientX,
      dy = data[i].y - e.clientY,
      d = Math.sqrt(dx * dx + dy * dy),
      a = Math.atan2(dy, dx);
    if (d < settings.force_size) {
      var f = settings.force_size - settings.force_size / d;
      data[i].x += Math.cos(a) * f * Math.random();
      data[i].y += Math.sin(a) * f * Math.random();
    }
  }
}