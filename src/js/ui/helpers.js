function changeCssState(state) {
  let currentState = document.body.className
  document.body.classList.remove(currentState)

  document.body.classList.add(state)
}

export { changeCssState }
