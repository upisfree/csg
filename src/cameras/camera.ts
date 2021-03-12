import { Matrix4 } from '../math/matrix4';
import { Object3D } from '../objects/object3d';
import { Vector3 } from '../math/vector3';

class Camera extends Object3D {
  aspect = 1;
  fov = 60 * Math.PI / 180; // 60 deg

  near = 1;
  far = 20000;
  
  target = new Vector3(0, 0, 0);
  up = new Vector3(0, 1, 0);
  
  projectionMatrix: Matrix4;
  viewMatrix: Matrix4;
  viewProjectionMatrix: Matrix4;
  
  constructor(renderer) {
    super(renderer);
  
    this.update();
  }
  
  update() {
    this.aspect = this.renderer.width / this.renderer.height;
  
    this.matrix = new Matrix4();
    this.updateMatrix();
    this.updateCameraMatrices();
  }
  
  updateCameraMatrices() {
    this.projectionMatrix = Matrix4.getPerspective(this.fov, this.aspect, this.near, this.far);
    
    this.matrix = this.matrix.lookAt(this.position, this.target, this.up);
    this.viewMatrix = this.matrix.clone().invert();
    this.viewProjectionMatrix = this.projectionMatrix.clone().multiply(this.viewMatrix);
  }
}

export {
  Camera
};