class WebGLAttribute {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  location: number;

  constructor(
    gl: WebGL2RenderingContext,
    program: WebGLProgram,
    name: string,
    data: any, // TypedArray
    bufferType: number, // gl.ARRAY_BUFFER | gl.ELEMENT_ARRAY_BUFFER
    size: number = 1,
    type: number = gl.FLOAT,
    normalize: boolean = false,
    stride: number = 0,
    offset: number = 0
  ) {
    this.gl = gl;
    this.program = program;
    
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(bufferType, this.buffer);
    this.gl.bufferData(bufferType, data, this.gl.STATIC_DRAW);

    this.location = this.gl.getAttribLocation(program, name);
    
    if (bufferType === this.gl.ARRAY_BUFFER) {
      this.gl.enableVertexAttribArray(this.location);
  
      this.gl.vertexAttribPointer(
        this.location,
        size,
        type,
        normalize,
        stride,
        offset
      );
    }
  }
}

export {
  WebGLAttribute
};