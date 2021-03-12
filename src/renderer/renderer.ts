import { WebGLProgram } from './program';
import { Camera } from '../cameras/camera';
import { Geometry } from '../geometries/geometry';
import { Mesh } from '../objects/mesh';
import { CSGMesh } from '../objects/csg-mesh';
// import { CSGGeometry } from '../geometries/csg';

class WebGLRenderer {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  programs: WebGLProgram[] = [];
  meshes: Mesh[] = [];
  csgMeshes: CSGMesh[] = [];
  width = 1;
  height = 1;
  
  constructor(gl, canvas) {
    this.gl = gl;
    this.canvas = canvas;
  }
  
  render(camera: Camera) {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height); // TODO: screen size somewhere
  
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
  
    this.meshes.forEach(mesh => {
      this.renderMesh(mesh, camera);
    });
  
    // this.csgMeshes.forEach(mesh => {
    //   this.renderCSGMesh(mesh, camera);
    // });
  }
  
  drawFirstInSecond(drawFirst, drawSecond, face, test) {
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.colorMask(false, false, false, false);
    this.gl.cullFace(face);
  
    drawFirst();
    
    this.gl.depthMask(false);
    this.gl.disable(this.gl.STENCIL_TEST);
    this.gl.stencilOp(this.gl.KEEP, this.gl.KEEP, this.gl.INCR);
    this.gl.stencilFunc(this.gl.ALWAYS, 0, 0);
    this.gl.cullFace(this.gl.BACK);
  
    drawSecond();
    
    this.gl.stencilOp(this.gl.KEEP, this.gl.KEEP, this.gl.DECR);
    this.gl.cullFace(this.gl.FRONT);
    
    drawSecond();
  
    this.gl.depthMask(true);
    this.gl.colorMask(true, true, true, true);
    this.gl.stencilFunc(test, 0, 1);
    this.gl.disable(this.gl.DEPTH_TEST);
    this.gl.cullFace(face);
    
    drawFirst();
    
    this.gl.disable(this.gl.STENCIL_TEST);
  }
  
  fixDepth(draw) {
    this.gl.colorMask(false, false, false, false);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.disable(this.gl.STENCIL_TEST);
    this.gl.depthFunc(this.gl.ALWAYS);
    
    draw();
  
    this.gl.depthFunc(this.gl.LESS);
  }
  
  renderCSGMesh(csgMesh: CSGMesh, camera: Camera) {
    // csgMesh.meshes.forEach((mesh, i) => {
    //   this.gl.useProgram(mesh.program);
    //
    //   this.gl.bindVertexArray(mesh.vao);
    //
    //   mesh.matrix = camera.viewProjectionMatrix.clone(); // I'm updating this martix inside .updateMatrix()
    //   mesh.updateMatrix();
    //   mesh.updateUniforms();
    //
    //   this.drawMesh(mesh);
    // });
  
    // update meshes data
    csgMesh.meshes.forEach((mesh, i) => {
      this.gl.useProgram(mesh.program);

      this.gl.bindVertexArray(mesh.vao);

      mesh.matrix = camera.viewProjectionMatrix.clone();
      mesh.updateMatrix();
      mesh.updateUniforms();
    });
  
    const mesh1 = csgMesh.meshes[0];
    const mesh2 = csgMesh.meshes[1];
  
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.cullFace(this.gl.BACK);
    this.gl.depthFunc(this.gl.LESS);
  
    this.drawFirstInSecond(
      () => { this.drawMesh(mesh1) },
      () => { this.drawMesh(mesh2) },
      this.gl.FRONT,
      this.gl.NOTEQUAL
    );
    
    this.fixDepth(() => { this.drawMesh(mesh2) });
    
    this.drawFirstInSecond(
      () => { this.drawMesh(mesh2) },
      () => { this.drawMesh(mesh1) },
      this.gl.BACK,
      this.gl.EQUAL
    );
  }
  
  drawMesh(mesh: Mesh) {
    this.gl.useProgram(mesh.program);
  
    this.gl.bindVertexArray(mesh.vao);
    
    if (mesh.geometry.index) {
      this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.index.length, this.gl.UNSIGNED_SHORT, 0);
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.geometry.position.length / 3);
    }
  }
  
  // TODO: rename
  renderMesh(mesh: Mesh, camera: Camera) {
    this.gl.useProgram(mesh.program);
  
    this.gl.bindVertexArray(mesh.vao);
  
    // test lighting — пока тут хз
    // let worldMatrix = camera.matrix.clone();
    // let worldViewProjectionMatrix = camera.viewProjectionMatrix.clone().multiply(worldMatrix);
    // let worldInverseMatrix = worldMatrix.clone().invert();
    // let worldInverseTransposeMatrix = worldInverseMatrix.transpose();
  
    // keep js data and videocard info updated
    mesh.matrix = camera.viewProjectionMatrix.clone(); // I'm updating this martix inside .updateMatrix()
    // mesh.worldInverseTransposeMatrix = worldInverseTransposeMatrix;
    mesh.updateMatrix();
    mesh.updateUniforms();
  
    // console.log(mesh.matrix.elements)
  
    if (mesh.geometry.index) {
      this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.index.length, this.gl.UNSIGNED_SHORT, 0);
    } else {
      this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.geometry.position.length / 3);
    }
  }
}

export { WebGLRenderer };