const D = document
const M = Math
const W = window

const $ = (str, par = D) => {
  const isCl = str.indexOf('.') === 0
  const isId = str.indexOf('#') === 0

  if (isCl) {
    return par.getElementsByClassName(str.substr(1, str.length))
  } else if (isId) {
    return par.getElementById(str.substr(1, str.length))
  } else {
    return par.getElementsByTagName(str)
  }
}

// global dom elements
const draggableContainer = $('.draggables')[0]
const draggables = $('.drag')
const maxZIndex = draggables.length * 5

// global app state
let dragged = false
let startPos = false
let currentZIndex = 1

// loop over each item and call fn(item)
const forEach = (items, fn) => {
  for (let i = 0; i < items.length; i++) {
    if (items.hasOwnProperty(i)) {
      fn(items[i])
    }
  }
}

const cl = {
  has(e, c) {
    return e.className && e.className.indexOf(c) > -1
  },
  add(e, c) {
    if (!cl.has(e, c)) {
      if (e.className) {
        c = e.className + ' ' + c
      }
      e.className = c
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

const getPos = e => parseInt(e.replace('%', ''))

const percentFromPixels = (direction, px) => (px / W[`inner${direction}`]) * 100
const pixelsFromPercent = (direction, pc) => (pc * W[`inner${direction}`]) / 100

const isOutOfBounds = e => (
  e.clientX >= W.innerWidth ||
  e.clientX <= 0 ||
  e.clientY >= W.innerHeight ||
  e.clientY <= 0
)

// resize and reposition after load of images
const onload = par => e => {
  if (cl.has(e.target, 'bg')) {
    const tar = e.target
    let width = tar.naturalWidth
    let height = tar.naturalHeight
    let left = 0
    let top = 0

    // resize if too wide
    const maxWidth = W.innerWidth * .7
    if (width > maxWidth) {
      const widthPercent = (width / maxWidth) + .1
      width /= widthPercent
      height /= widthPercent
    }

    // resize if too high
    const maxHeight = W.innerHeight * .7
    if (height > maxHeight) {
      const heightPercent = (height / maxHeight) + .1
      height /= heightPercent
      width /= heightPercent
    }

    const maxLeft = W.innerWidth - width
    const maxTop = W.innerHeight - height
    left = M.random() * maxLeft
    top = M.random() * maxTop
    left = `${M.floor(percentFromPixels('Width', left))}%`
    top = `${M.floor(percentFromPixels('Height', top))}%`

    par.style.left = left
    par.style.top = top
    par.style.transition = 'left 500ms, top 500ms'
  }
}

forEach(draggables, draggable => {
  const ran = M.random()
  const pos = {
    left: '100%',
    top: '100%',
  }

  if (ran > 0.7) {
    pos.left = `-${pos.left}`
  } else if (ran < 0.3) {
    pos.top = `-${pos.top}`
  }

  draggable.style.left = pos.left
  draggable.style.top = pos.top

  const img = $('.bg', draggable)[0]
  if (img) {
    onload(draggable)({ target: img })
    // make sure the load event fires
    // setTimeout(() => {
    //   img.src = img.src
    // }, 1)
  }
})

const touchHandler = function(evt) {
  // how does this make it work???
  if (!evt.changedTouches[0]) {
    if (console && typeof console.log === 'function') {
      console.log(evt)
    }
  }

  const touch = evt.changedTouches[0]

  const simulatedEvent = D.createEvent("MouseEvent")

  const eventNames = {
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup",
  }

  const eventName = eventNames[evt.type]

  simulatedEvent.initMouseEvent(
    eventName, true, true, W, 1,
    touch.screenX, touch.screenY,
    touch.clientX, touch.clientY,
    false, false, false, false, 0, null
  )

  touch.target.dispatchEvent(simulatedEvent)
  evt.preventDefault()
  evt.stopPropagation()
  return false
}

const drag = evt => {
  dragged = evt.currentTarget


  cl.add(dragged, 'dragged')

  startPos = {
    left: pixelsFromPercent('Width', getPos(dragged.parentNode.style.left)),
    top: pixelsFromPercent('Height', getPos(dragged.parentNode.style.top)),
  }

  currentZIndex += 1
  dragged.parentNode.style.zIndex = currentZIndex
  dragged.parentNode.offset = {
    left: evt.clientX - pixelsFromPercent('Width', getPos(dragged.parentNode.style.left)),
    top: evt.clientY - pixelsFromPercent('Height', getPos(dragged.parentNode.style.top)),
  }
  dragged.parentNode.style.opacity = 0.8

  dragged.parentNode.style.transition = null

  D.addEventListener('mousemove', mousemove)
  D.addEventListener('mouseup', drop)
  D.addEventListener('mouseout', dropIfOutOfBounds)
}

const drop = () => {
  if (!dragged) {
    return
  }

  forEach(draggables, draggable => {
    cl.rm(draggable, 'dragged')

    if (draggable === dragged.parentNode) {
      cl.add(dragged.parentNode, 'dropped')
    } else {
      cl.rm(draggable, 'dropped')
    }
  })

  dragged.parentNode.style.opacity = 1
  dragged.parentNode.style.transition = 'left 500ms, top 500ms'

  D.removeEventListener('mousemove', mousemove)
  D.removeEventListener('mouseup', drop)
  D.removeEventListener('mouseout', dropIfOutOfBounds)

  dragged = false
  startPos = false
}

const dropIfOutOfBounds = e => {
  if (isOutOfBounds(e)) {
    drop(e)
  }
}

const mousemove = evt => {
  if (dragged) {
    const max = {
      left: W.innerWidth - dragged.parentNode.clientWidth,
      top: W.innerHeight - dragged.parentNode.clientHeight,
    }

    let newLeft = evt.clientX - dragged.parentNode.offset.left
    if (newLeft < 0) {
      newLeft = 0
    } else if (newLeft > max.left) {
      newLeft = max.left
    }

    dragged.parentNode.style.left = `${percentFromPixels('Width', newLeft)}%`

    let newTop = evt.clientY - dragged.parentNode.offset.top
    if (newTop < 0) {
      newTop = 0
    } else if (newTop > max.top) {
      newTop = max.top
    }
    dragged.parentNode.style.top = `${percentFromPixels('Height', newTop)}%`
  }
}

W.onload = () => {
  forEach(draggables, draggable => {
    const img = $('.bg', draggable)[0]
    img.addEventListener('dragstart', doNothing)
    img.addEventListener('mousedown', drag)

    img.addEventListener("touchstart", touchHandler, true)
    img.addEventListener("touchmove", touchHandler, true)
    img.addEventListener("touchend", touchHandler, true)
    // img.addEventListener("touchcancel", touchHandler, true)

    const a = $('a', draggable)[0]
    if (a) {
      a.addEventListener('touchstart', e => {
        e.stopPropagation()
      })
      a.addEventListener('touchmove', e => {
        e.stopPropagation()
      })
      a.addEventListener('touchend', e => {
        e.stopPropagation()
      })
    }
  })
}

// Menu
const menuContainer = $('.nav')[0]
if (menuContainer) {
  const active = $('.active', menuContainer)[0]

  const toggleMenu = e => {
    e.preventDefault()
    cl.toggle(menuContainer, 'show')
    return false
  }

  if (active) {
    active.addEventListener('click', toggleMenu)
  }
}