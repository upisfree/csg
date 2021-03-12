function resize(renderer, container) {
  const bounds = container.getBoundingClientRect();
  
  renderer.width = renderer.canvas.width =  bounds.width;
  renderer.height = renderer.canvas.height = bounds.height;
}

export {
  resize
};