import { WebGLProgram } from './program';
import { Camera } from '../cameras/camera';
import { Mesh } from '../objects/mesh';

class WebGLRenderer {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  programs: WebGLProgram[] = [];
  meshes: Mesh[] = [];
  width = 1;
  height = 1;
  
  constructor(gl, canvas) {
    this.gl = gl;
    this.canvas = canvas;
  }
  
  render(camera: Camera) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
  
    this.meshes.forEach(mesh => {
      this.renderMesh(mesh, camera);
    });
  }
  
  renderMesh(mesh: Mesh, camera: Camera) {
    this.gl.useProgram(mesh.program);
  
    this.gl.bindVertexArray(mesh.vao);
  
    // keep js data and videocard info updated
    mesh.matrix = camera.viewProjectionMatrix.clone(); // I'm updating this martix inside .updateMatrix()
    mesh.updateMatrix();
    mesh.updateUniforms();
  
    if (mesh.geometry.index) {
      this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.index.length, this.gl.UNSIGNED_SHORT, 0);
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.geometry.position.length / 3);
    }
  }
}

export {
  WebGLRenderer
};