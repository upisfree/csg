import { logWithLineNumbers } from '../utils/log-with-line-numbers';

class WebGLShader {
  constructor(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    
    if (status === true) {
      return shader;
    }
  
    const log = gl.getShaderInfoLog(shader);
    const shaderSource = gl.getShaderSource(shader);
    console.error(log);
    logWithLineNumbers(shaderSource);
    
    gl.deleteShader(shader);
  }
}

export {
  WebGLShader
};