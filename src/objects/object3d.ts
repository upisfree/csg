import { Matrix4 } from '../math/matrix4';
import { Vector3 } from '../math/vector3';
import { WebGLRenderer } from '../renderer/renderer';

class Object3D {
  renderer: WebGLRenderer;
  
  position = new Vector3();
  rotation = new Vector3();
  scale = new Vector3(1, 1, 1);
  matrix = new Matrix4();
  worldInverseTransposeMatrix = new Matrix4();
  
  constructor(renderer) {
    this.renderer = renderer;
  }
  
  update() {
    this.updateMatrix();
  }
  
  updateMatrix() {
    this.matrix = this.matrix.translate(this.position.x, this.position.y, this.position.z);
    this.matrix = this.matrix.rotateX(this.rotation.x);
    this.matrix = this.matrix.rotateY(this.rotation.y);
    this.matrix = this.matrix.rotateZ(this.rotation.z);
    this.matrix = this.matrix.scale(this.scale.x, this.scale.y, this.scale.z);
  }
}

export {
  Object3D
};