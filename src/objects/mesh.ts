import { WebGLUniform } from '../renderer/uniform';
import { WebGLRenderer } from '../renderer/renderer';
import { Object3D } from './object3d';
import { Geometry } from '../geometries/geometry';
// import { CSGGeometry } from '../geometries/csg';

class Mesh extends Object3D {
  gl: WebGL2RenderingContext;
  vao: WebGLVertexArrayObject;
  
  geometry: Geometry;
  program: WebGLProgram; // TODO: material instead
  
  uniforms = {};
  attributes = {};
  
  constructor(renderer, program) {
    super(renderer);
    
    this.gl = this.renderer.gl;
    this.program = program;
    
    this.renderer.meshes.push(this);
  }
  
  // I don't do this in constructor because I need to set various meshes parameters as this.* first
  initGLData() {
    this.vao = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);
  
    this.initGeometry();
    this.initAttributes();
    this.initUniforms();
  
    this.gl.bindVertexArray(null);
  }
  
  initGeometry() {
  
  }
  
  initAttributes() {
  
  }
  
  initUniforms() {
    this.uniforms['u_worldViewProjection'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldViewProjection');
    this.uniforms['u_worldInverseTranspose'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldInverseTranspose');
  }
  
  updateUniforms() {
    this.uniforms['u_worldViewProjection'].set(this.matrix);
    this.uniforms['u_worldInverseTranspose'].set(this.worldInverseTransposeMatrix);
    
    // console.log(this.worldMatrix.elements);
  }
}

export { Mesh };