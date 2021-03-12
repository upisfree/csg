import { Vector2 } from '../math/vector2';
import { WebGLRenderer } from '../renderer/renderer';

const POINTER_EVENT = {
  ENTER: 'pointerenter',
  LEAVE: 'pointerleave',
  DOWN: 'pointerdown',
  UP: 'pointerup',
  MOVE: 'pointermove'
};

const POINTER_BUTTON = {
  NONE: -1,
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2
};

class PointerManager {
  container: HTMLElement;
  renderer: WebGLRenderer;
  
  screenPosition = new Vector2(0, 0);
  scenePosition = new Vector2(0, 0);
  
  sceneDiff = new Vector2(0, 0);

  buttonPressed = POINTER_BUTTON.NONE;
  
  constructor(container, renderer) {
    this.container = container;
    this.renderer = renderer;
  
    this.initListeners();
  }
  
  initListeners() {
    this.container.addEventListener(POINTER_EVENT.DOWN, this.onPointerDown.bind(this), false);
    this.container.addEventListener(POINTER_EVENT.UP, this.onPointerUp.bind(this), false);
    this.container.addEventListener(POINTER_EVENT.MOVE, this.onPointerMove.bind(this), false);
    
    this.container.oncontextmenu = () => false;
  }
  
  updateScreenPosition(x, y) {
    this.screenPosition.x = x;
    this.screenPosition.y = y;
    
    // 0, 0 по центру
    // -1, -1 в нижнем левом углу
    // 1, 1 в верхнем правом углу
    const sx = (x / this.renderer.width) * 2 - 1;
    const sy = -(y / this.renderer.height) * 2 + 1;
  
    this.sceneDiff.x = this.scenePosition.x - sx;
    this.sceneDiff.y = this.scenePosition.y - sy;
  
    this.scenePosition.x = sx;
    this.scenePosition.y = sy;
  }
  
  onPointerMove(event: PointerEvent) {
    if (!event.isPrimary) {
      return;
    }
    
    this.updateScreenPosition(event.clientX, event.clientY);
  }
  
  onPointerDown(event: PointerEvent) {
    event.preventDefault();
    
    this.updateScreenPosition(event.clientX, event.clientY);
    
    this.buttonPressed = event.button;
  
    (event.currentTarget as HTMLElement).classList.add('grabbing');
  }
  
  onPointerUp(event: PointerEvent) {
    this.updateScreenPosition(0, 0);
  
    this.buttonPressed = POINTER_BUTTON.NONE;
  
    (event.currentTarget as HTMLElement).classList.remove('grabbing');
  
    this.sceneDiff.x = 0;
    this.sceneDiff.y = 0;
  }
}

export {
  PointerManager,
  POINTER_BUTTON
};