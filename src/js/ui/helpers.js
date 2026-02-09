function changeCssStyle(style) {
  let currentStyle = document.body.className
  document.body.classList.remove(currentStyle)
  document.body.classList.add(style)
}

export { changeCssStyle }
