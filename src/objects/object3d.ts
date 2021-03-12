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
  
  // _updateMatrix() {
  //   const fov = 60 * Math.PI / 180;
  //   const aspect = this.renderer.width / this.renderer.height;
  //   const near = 1;
  //   const far = 2000;
  //
  //   // let matrix = new Matrix4();
  //
  //   const projectionMatrix = Matrix4.getPerspective(fov, aspect, near, far);
  //   const cameraMatrix = new Matrix4().lookAt(new Vector3(0, 0, 2000), new Vector3(0, 0, 0), new Vector3(0, -1, 0));
  //   const viewMatrix = cameraMatrix.clone().invert();
  //   const viewProjectionMatrix = projectionMatrix.clone().multiply(viewMatrix);
  //
  //   let matrix = viewProjectionMatrix.clone();
  //   // matrix = matrix.translate(this.position.x, this.position.y, this.position.z);
  //
  //   // let matrix = Matrix4.getPerspective(-fov, -aspect, near, far);
  //   // matrix = matrix.multiply(Matrix4.getOrthographic(0, this.renderer.width, this.renderer.height, 0, 400, -400));
  //   matrix = matrix.translate(this.position.x, this.position.y, this.position.z);
  //   matrix = matrix.rotateX(this.rotation.x);
  //   matrix = matrix.rotateY(this.rotation.y);
  //   matrix = matrix.rotateZ(this.rotation.z);
  //   matrix = matrix.scale(this.scale.x, this.scale.y, this.scale.z);
  //
  //   this.matrix = matrix;
  // }
}

export { Object3D };