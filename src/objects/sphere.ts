import { WebGLAttribute } from '../renderer/attribute';
import { WebGLUniform } from '../renderer/uniform';
import { Mesh } from './mesh';
import { SphereGeometry } from '../geometries/sphere';
import { Vector3 } from '../math/vector3';
import { CSGSphereGeometry } from '../geometries/csg-sphere';

class Sphere extends Mesh {
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
    this.geometry = new CSGSphereGeometry(this.radius);
    // this.geometry = new SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
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
  
    // this.attributes['a_color'] = new WebGLAttribute(
    //   this.gl,
    //   this.program,
    //   'a_color',
    //   getColorData(),
    //   3,
    //   this.gl.UNSIGNED_BYTE,
    //   true
    // );
  }
  
  initUniforms() {
    // this.uniforms['u_color'] = new WebGLUniform(this.renderer, this.program, '4f', 'u_color');
    // this.uniforms['u_color'].set(Math.random(), Math.random(), Math.random(), 1);
  
    this.uniforms['u_worldViewProjection'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldViewProjection');
    this.uniforms['u_worldInverseTranspose'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldInverseTranspose');
    
    this.uniforms['u_reverseLightDirection'] = new WebGLUniform(this.renderer, this.program, '3f', 'u_reverseLightDirection');
    // this.uniforms['u_reverseLightDirection'].set(light.x, light.y, light.z);
  }
  
  updateUniforms() {
    super.updateUniforms();
  
    const light = new Vector3(0.5, 0.7, 1).normalize();
  
    this.uniforms['u_reverseLightDirection'].set(light.x, light.y, light.z);
  }
}

export { Sphere };