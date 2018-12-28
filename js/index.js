var DROP = 'drop'
var dragged = false
var startPos = false
var currentZIndex = 1
var draggableContainer = document.getElementsByClassName('draggables')[0]
var draggables = document.getElementsByClassName('drag')
var maxZIndex = draggables.length * 5

function forEach(items, fn) {
  for (var i = 0; i < items.length; i++) {
    if (items.hasOwnProperty(i)) {
      fn(items[i])
    }
  }
}

function hasCl(e, cl) {
  return e.className.indexOf(cl) > -1
}

function addCl(e, cl) {
  if (!hasCl(e, cl)) {
    e.className = e.className ? e.className + ' ' + cl : cl
  }
}

function rmCl(e, cl) {
  if (hasCl(e, cl)) {
    if (e.className.indexOf(' ' + cl) > -1) {
      cl = ' ' + cl
    }
    e.className = e.className.replace(cl, '')
  }
}

function toggleCl(e, cl) {
  if (hasCl(e, cl)) {
    rmCl(e, cl)
  } else {
    addCl(e, cl)
  }
}

function doNothing(e) {
  e.preventDefault()
  return false
}

function $(str) {
  return document.getElementById(str)
}

function getPos(e) {
  return parseInt(e.replace('px', ''))
}

function isOutOfBounds(e) {
  return (
    e.clientX >= window.innerWidth ||
    e.clientX <= 0 ||
    e.clientY >= window.innerHeight ||
    e.clientY <= 0
  )
}

function drag(ev) {
  dragged = ev.currentTarget
  startPos = {
    left: getPos(dragged.style.left),
    top: getPos(dragged.style.top),
  }
  currentZIndex += 1
  dragged.style.zIndex = currentZIndex
  dragged.offset = {
    left: ev.clientX - getPos(dragged.style.left),
    top: ev.clientY - getPos(dragged.style.top),
  }
  dragged.style.opacity = 0.8

  draggableContainer.addEventListener('mousemove', mousemove)
  draggableContainer.addEventListener('touchmove', mousemove)
  draggableContainer.addEventListener('mouseup', drop)
  draggableContainer.addEventListener('touchend', drop)
  draggableContainer.addEventListener('mouseout', function(e) {
    if (isOutOfBounds(e)) {
      drop(e)
    }
  })
}

function drop(ev) {
  if (!dragged) {
    return
  }

  if (startPos) {
    var endPos = {
      left: getPos(dragged.style.left),
      top: getPos(dragged.style.top),
    }

    if (startPos.left === endPos.left && startPos.top === endPos.top) {
      // console.log('click')
    } else {
      // console.log('drop')
    }

    forEach(draggables, function(ele) {
      rmCl(ele, 'dropped')
    })
    addCl(dragged, 'dropped')
  }

  dragged.style.opacity = 1

  dragged = false
  startPos = false

  document.onmousemove = function() {}
  document.onmouseup = function() {}
  document.onmouseout = function() {}
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

function makeDraggable(ele) {
  ele.addEventListener('dragstart', doNothing)
  ele.addEventListener('mousedown', drag)
  ele.addEventListener('touchstart', function(e) {
    e.stopPropagation()
    drag(e)
  })
}

forEach(draggables, makeDraggable)

// Menu
var menuContainer = document.getElementsByClassName('nav')[0]
var active = menuContainer.getElementsByClassName('active')[0]

function toggleMenu(e) {
  e.preventDefault()
  toggleCl(menuContainer, 'show')
  return false
}

if (active) {
  active.addEventListener('click', toggleMenu)
  active.addEventListener('touchstart', function(e) {
    e.stopPropagation()
    toggleMenu(e)
  })
}
