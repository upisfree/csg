import { WebGLRenderer } from './renderer';

class WebGLUniform {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  name: string;
  type: string;
  location: any;
  
  constructor(
    renderer: WebGLRenderer,
    program: WebGLProgram,
    type: string,
    name: string
  ) {
    this.gl = renderer.gl;
    this.program = program;
    this.name = name;
    this.type = type;
    
    this.location = this.gl.getUniformLocation(this.program, this.name);
  }
  
  set(...args) {
    switch (this.type) {
      case '1f':
        this.gl.uniform1f(this.location, args[0]);
        break;
        
      case '2f':
        this.gl.uniform2f(this.location, args[0], args[1]);
        break;
  
      case '2fv':
        this.gl.uniform2fv(this.location, args[0]);
        break;
        
      case '3f':
        this.gl.uniform3f(this.location, args[0], args[1], args[2]);
        break;
        
      case '3fv':
        this.gl.uniform3fv(this.location, args[0]);
        break;
        
      case '4f':
        this.gl.uniform4f(this.location, args[0], args[1], args[2], args[3]);
        break;
        
      case '4fv':
        this.gl.uniform4fv(this.location, args[0]);
        break;
        
      case 'matrix3fv':
        this.gl.uniformMatrix3fv(this.location, false, args[0].elements);
        break;
        
      case 'matrix4fv':
        this.gl.uniformMatrix4fv(this.location, false, args[0].elements);
        break;
    }
  }
}

export { WebGLUniform };