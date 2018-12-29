const draggableContainer = document.getElementsByClassName('draggables')[0]
const draggables = document.getElementsByClassName('drag')
const maxZIndex = draggables.length * 5

// global app state
let dragged = false
let startPos = false
let currentZIndex = 1

const forEach = (items, fn) => {
  for (let i = 0; i < items.length; i++) {
    if (items.hasOwnProperty(i)) {
      fn(items[i])
    }
  }
}

const cl = {
  has(e, cl) {
    return e.className.indexOf(cl) > -1
  },
  add(e, c) {
    if (!cl.has(e, c)) {
      e.className = e.className ? e.className + ' ' + c : c
    }
  },
  rm(e, c) {
    if (cl.has(e, c)) {
      e.className = e.className.replace(c, '').trim()
    }
  },
  toggle: (e, c) => {
    if (cl.has(e, c)) {
      cl.rm(e, c)
    } else {
      cl.add(e, c)
    }
  },
}

const doNothing = (e) => {
  e.preventDefault()
  return false
}

const $ = str => document.getElementById(str)

const getPos = e => parseInt(e.replace('px', ''))

const isOutOfBounds = e => (
  e.clientX >= window.innerWidth ||
  e.clientX <= 0 ||
  e.clientY >= window.innerHeight ||
  e.clientY <= 0
)

const drag = ev => {
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

  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', drop)
  document.addEventListener('mouseout', dropIfOutOfBounds)
}

const drop = () => {
  if (!dragged) {
    return
  }

  if (startPos) {
    forEach(draggables, function(ele) {
      cl.rm(ele, 'dropped')
    })
    cl.add(dragged, 'dropped')
  }

  dragged.style.opacity = 1


  document.removeEventListener('mousemove', mousemove)
  document.removeEventListener('mouseup', drop)
  document.removeEventListener('mouseout', dropIfOutOfBounds)

  dragged = false
  startPos = false
}

const dropIfOutOfBounds = e => {
  if (isOutOfBounds(e)) {
    drop(e)
  }
}

const mousemove = ev => {
  if (dragged) {
    const max = {
      left: window.innerWidth - dragged.clientWidth,
      top: window.innerHeight - dragged.clientHeight,
    }

    let newLeft = ev.clientX - dragged.offset.left
    if (newLeft < 0) {
      newLeft = 0
    } else if (newLeft > max.left) {
      newLeft = max.left
    }

    dragged.style.left = newLeft + 'px'

    let newTop = ev.clientY - dragged.offset.top
    if (newTop < 0) {
      newTop = 0
    } else if (newTop > max.top) {
      newTop = max.top
    }
    dragged.style.top = newTop + 'px'
  }
}

const makeDraggable = (ele) => {
  ele.addEventListener('dragstart', doNothing)
  ele.addEventListener('mousedown', drag)
  ele.addEventListener('touchstart', function(e) {
    e.stopPropagation()
    drag(e)
  })
}

forEach(draggables, makeDraggable)

// Menu
const menuContainer = document.getElementsByClassName('nav')[0]
const active = menuContainer.getElementsByClassName('active')[0]

const toggleMenu = e => {
  e.preventDefault()
  cl.toggle(menuContainer, 'show')
  return false
}

if (active) {
  active.addEventListener('click', toggleMenu)
  active.addEventListener('touchstart', function(e) {
    e.stopPropagation()
    toggleMenu(e)
  })
}
