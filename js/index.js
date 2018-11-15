var DROP = 'drop'

var dragged = false
var currentZIndex = 1

function $(str) {
  return document.getElementById(str)
}

function getPos(e) {
  return parseInt(e.replace('px', ''))
}

function drag(ev) {
  dragged = ev.target,
  console.log('drag', dragged)
  dragged.offset = {
    left: ev.clientX - getPos(dragged.style.left),
    top: ev.clientY - getPos(dragged.style.top),
  }
  currentZIndex += 1
  dragged.style.zIndex = currentZIndex

  document.onmousemove = mousemove
  document.onmouseup = drop
}

function drop(ev) {
  console.log('drop')
  dragged = false

  document.onmousemove = null
  document.onmouseup = null
}

function mousemove(ev) {
  if (dragged) {
    var max = {
      left: window.innerWidth - dragged.clientWidth,
      top: window.innerHeight - dragged.clientHeight,
    }

    var newLeft = ev.clientX - dragged.offset.left
    if (newLeft < 0) {
      newLeft = 0
    } else if (newLeft > max.left) {
      newLeft = max.left
    }

    dragged.style.left = newLeft + 'px'
    
    var newTop = ev.clientY - dragged.offset.top
    if (newTop < 0) {
      newTop = 0
    } else if (newTop > max.top) {
      newTop = max.top
    }
    dragged.style.top = newTop + 'px'
  }
}

var images = document.getElementsByTagName('img')

function hasCl(e, cl) { 
  return e.className.indexOf(cl) > -1
}

for(var i = 0; i < images.length; i++) {
  if (images.hasOwnProperty(i)) {
    var img = images[i]
    img.addEventListener('dragstart', function (evt) {
      evt.preventDefault()
    })
    if (hasCl(img, 'drag')) {
      img.addEventListener('mousedown', drag)
    }
  }
}
