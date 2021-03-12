import { WebGLAttribute } from '../renderer/attribute';
import { WebGLUniform } from '../renderer/uniform';
import { Mesh } from './mesh';
import { SphereGeometry } from '../geometries/sphere';

class SphereMesh extends Mesh {
  radius: number;
  widthSegments: number;
  heightSegments: number;
  
  constructor(renderer, program, radius, widthSegments, heightSegments) {
    super(renderer, program);
  
    this.radius = radius;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
    
    this.initGLData();
  }
  
  initGeometry() {
    this.geometry = new SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
  }
  
  initAttributes() {
    this.attributes['a_position'] = new WebGLAttribute(
      this.gl,
      this.program,
    'a_position',
      this.geometry.position,
      this.gl.ARRAY_BUFFER,
      3,
      this.gl.FLOAT
    );
  
    this.attributes['a_normal'] = new WebGLAttribute(
      this.gl,
      this.program,
      'a_normal',
      this.geometry.normal,
      this.gl.ARRAY_BUFFER,
      3,
      this.gl.FLOAT
    );
  
    if (this.geometry.index) {
      this.attributes['a_index'] = new WebGLAttribute(
        this.gl,
        this.program,
        'a_index',
        this.geometry.index,
        this.gl.ELEMENT_ARRAY_BUFFER
      );
    }
  }
  
  initUniforms() {
    this.uniforms['u_worldViewProjection'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldViewProjection');
    this.uniforms['u_worldInverseTranspose'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldInverseTranspose');
  }
  
  updateUniforms() {
    super.updateUniforms();
  }
}

export {
  SphereMesh
};