import { WebGLShader } from './shader';

class WebGLFragmentShader extends WebGLShader {
  constructor(gl: WebGL2RenderingContext, source: string) {
    super(gl, gl.FRAGMENT_SHADER, source);
  }
}

export {
  WebGLFragmentShader
};