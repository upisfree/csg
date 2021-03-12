import { WebGLRenderer } from './renderer';

class WebGLProgram {
  constructor(
    renderer: WebGLRenderer,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    const gl = renderer.gl;
    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    const status = gl.getProgramParameter(program, gl.LINK_STATUS);
    
    if (status === true) {
      renderer.programs.push(program);
      
      return program;
    }
   
    const log = gl.getProgramInfoLog(program);
    console.error(log);

    gl.deleteProgram(program);
  }
}

export {
  WebGLProgram
};