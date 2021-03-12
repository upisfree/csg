import { WebGLShader } from './shader';

class WebGLVertexShader extends WebGLShader {
  constructor(gl: WebGL2RenderingContext, source: string) {
    super(gl, gl.VERTEX_SHADER, source);
  }
}

export {
  WebGLVertexShader
};