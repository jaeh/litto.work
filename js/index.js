var DROP = 'drop'

var dragged = false
var startPos = false
var currentZIndex = 1
var images = document.getElementsByTagName('img')
var draggables = document.getElementsByClassName('drag')
var maxZIndex = draggables.length * 5

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

function drag(ev) {
  console.log('drag')
  dragged = ev.target
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

  document.onmousemove = mousemove
  document.onmouseup = drop
  document.onmouseout = drop
}

function drop(ev) {
  if (startPos) {
    var endPos = {
      left: getPos(ev.target.style.left),
      top: getPos(ev.target.style.top),
    }
    
    if (startPos.left === endPos.left && startPos.top === endPos.top) {
      console.log('click')
    } else {
      console.log('drop')
    }
  }
  dragged.style.opacity = 1

  dragged = false
  startPos = false

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

for(var i = 0; i < images.length; i++) {
  if (images.hasOwnProperty(i)) {
    var img = images[i]
    img.addEventListener('dragstart', doNothing)
    
    if (hasCl(img, 'drag')) {
      img.addEventListener('mousedown', drag)
      img.addEventListener('touchstart', function(e) {
        e.stopPropagation()
        drag(e)
      })
    }
  }
}


// Menu
var menuContainer = document.getElementsByClassName('nav')[0]
var active = menuContainer.getElementsByClassName('active')[0]

console.log(active)
active.addEventListener('click', function(e) {
  e.preventDefault()
  console.log('click')
  toggleCl(menuContainer, 'show')
})