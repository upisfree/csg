import { PointerManager, POINTER_BUTTON } from '../platform/pointer';
import { Camera } from '../cameras/camera';

class PointerControls {
  camera: Camera;
  pointer: PointerManager;
  
  dragSensitivity = 1000;
  fovSensitivity = 10;
  
  constructor(camera, pointer) {
    this.camera = camera;
    this.pointer = pointer;
  }
  
  update() {
    switch (this.pointer.buttonPressed) {
      // case POINTER_BUTTON.LEFT:
      //   this.camera.target.x += this.pointer.sceneDiff.x * this.dragSensitivity;
      //   this.camera.target.y += this.pointer.sceneDiff.y * this.dragSensitivity;
      //
      //   break;
  
      case POINTER_BUTTON.LEFT:
      // case POINTER_BUTTON.RIGHT:
        this.camera.position.x += this.pointer.sceneDiff.x * this.dragSensitivity;
        this.camera.position.y += this.pointer.sceneDiff.y * this.dragSensitivity;
        
        break;
  
      case POINTER_BUTTON.WHEEL:
        this.camera.fov += this.pointer.sceneDiff.y * this.fovSensitivity;

        break;
    }
  }
}

export { PointerControls };