var a = document.getElementsByClassName('draggables')[0];
var b = document.getElementsByClassName('drag');
var c = b.length * 5;
var d = false;
var e = false;
var f = 1;

var g = function (a, b) {
  for (var d = 0; d < a.length; d++) {
    if (a.hasOwnProperty(d)) {
      b(a[d]);
    }
  }
};

var h = {
  has: function (a, b) {
    return a.className && a.className.indexOf(b) > -1;
  },
  add: function (a, b) {
    if (!h.has(a, b)) {
      a.className = a.className ? a.className + ' ' + b : b;
    }
  },
  rm: function (a, b) {
    if (h.has(a, b)) {
      a.className = a.className.replace(b, '').trim();
    }
  },
  toggle: function (a, b) {
    if (h.has(a, b)) {
      h.rm(a, b);
    } else {
      h.add(a, b);
    }
  }
};

var i = function (a) {
  return function (b) {
    if (h.has(b.target, 'bg')) {
      var c = b.target;
      var d = c.naturalWidth;
      var e = c.naturalHeight;
      var f = 0;
      var g = 0;
      var i = window.innerWidth * .7;

      if (d > i) {
        var j = d / i + .1;
        d /= j;
        e /= j;
      }

      var k = window.innerHeight * .7;

      if (e > k) {
        var l = e / k + .1;
        e /= l;
        d /= l;
      }

      var m = window.innerWidth - d;
      var o = window.innerHeight - e;
      f = Math.random() * m;
      g = Math.random() * o;
      f = "".concat(Math.floor(n('Width', f)), "%");
      g = "".concat(Math.floor(n('Height', g)), "%");
      a.style.left = f;
      a.style.top = g;
    }
  };
};

g(b, function (a) {
  var b = Math.random();
  var c = {
    left: '100%',
    top: '100%'
  };

  if (b > 0.7) {
    c.left = "-".concat(c.left);
  } else if (b < 0.3) {
    c.top = "-".concat(c.top);
  }

  a.style.left = c.left;
  a.style.top = c.top;
  var d = a.getElementsByClassName('bg')[0];

  if (d) {
    d.addEventListener('load', i(a));
    setTimeout(function () {
      d.src = d.src;
    }, 1);
  }
});

var j = function (a) {
  var b = a.changedTouches[0];
  var c = document.createEvent("MouseEvent");
  c.initMouseEvent({
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup"
  }[a.type], true, true, window, 1, b.screenX, b.screenY, b.clientX, b.clientY, false, false, false, false, 0, null);

  if (h.has(b.target, 'bg')) {
    if (b.target === b.currentTarget) {
      return true;
    }
  }

  b.target.dispatchEvent(c);
  a.preventDefault();
  a.stopPropagation();
  return false;
};

var k = function (a) {
  a.preventDefault();
  return false;
};

var l = function (a) {
  return document.getElementById(a);
};

var m = function (a) {
  return parseInt(a.replace('%', ''));
};

var n = function (a, b) {
  return b / window["inner".concat(a)] * 100;
};

var o = function (a, b) {
  return b * window["inner".concat(a)] / 100;
};

var p = function (a) {
  return a.clientX >= window.innerWidth || a.clientX <= 0 || a.clientY >= window.innerHeight || a.clientY <= 0;
};

var q = function (a) {
  d = a.currentTarget;
  h.add(d, 'dragged');
  e = {
    left: o('Width', m(d.style.left)),
    top: o('Height', m(d.style.top))
  };
  f += 1;
  d.style.zIndex = f;
  d.offset = {
    left: a.clientX - o('Width', m(d.style.left)),
    top: a.clientY - o('Height', m(d.style.top))
  };
  d.style.opacity = 0.8;
  document.addEventListener('mousemove', t);
  document.addEventListener('mouseup', r);
  document.addEventListener('mouseout', s);
};

var r = function () {
  if (!d) {
    return;
  }

  g(b, function (a) {
    h.rm(a, 'dropped');
    h.rm(a, 'dragged');
  });
  h.add(d, 'dropped');
  d.style.opacity = 1;
  document.removeEventListener('mousemove', t);
  document.removeEventListener('mouseup', r);
  document.removeEventListener('mouseout', s);
  d = false;
  e = false;
};

var s = function (a) {
  if (p(a)) {
    r(a);
  }
};

var t = function (a) {
  if (d) {
    var c = {
      left: window.innerWidth - d.clientWidth,
      top: window.innerHeight - d.clientHeight
    };
    var e = a.clientX - d.offset.left;

    if (e < 0) {
      e = 0;
    } else if (e > c.left) {
      e = c.left;
    }

    d.style.left = "".concat(n('Width', e), "%");
    var f = a.clientY - d.offset.top;

    if (f < 0) {
      f = 0;
    } else if (f > c.top) {
      f = c.top;
    }

    d.style.top = "".concat(n('Height', f), "%");
  }
};

window.onload = function () {
  g(b, function (b) {
    b.addEventListener('dragstart', k);
    b.addEventListener('mousedown', q);
    b.addEventListener("touchstart", j, true);
    b.addEventListener("touchmove", j, true);
    b.addEventListener("touchend", j, true);
    b.addEventListener("touchcancel", j, true);
    var c = b.getElementsByTagName('a')[0];

    if (c) {
      c.addEventListener('touchend', function (a) {
        a.stopPropagation();
        return false;
      });
    }
  });
};

var u = document.getElementsByClassName('nav')[0];

if (u) {
  var v = u.getElementsByClassName('active')[0];

  var w = function (a) {
    a.preventDefault();
    h.toggle(u, 'show');
    return false;
  };

  if (v) {
    v.addEventListener('click', w);
  }
}