import { WebGLRenderer } from './renderer/renderer';
import { WebGLProgram } from './renderer/program';
import { WebGLVertexShader } from './renderer/vertex';
import { WebGLFragmentShader } from './renderer/fragment';

import { Camera } from './cameras/camera';
import { PointerManager } from './platform/pointer';
import { PointerControls } from './controls/pointer';
import { SphereMesh } from './objects/sphere';
import { resize } from './platform/resize';

import vertexShader from './shaders/vertex';
import fragmentShader from './shaders/fragment';

class CSG {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  renderer: WebGLRenderer;
  camera: Camera;
  pointer: PointerManager;
  controls: PointerControls;
  
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl2');

    if (!this.gl) {
      alert('Sorry, your browser doesn\'t support WebGL2. Please, use another browser.')

      throw new Error('Can\'t create WebGL2 context.');
    }

    this.renderer = new WebGLRenderer(this.gl, this.canvas);
    
    // можно сделать через ResizeObserver
    window.addEventListener('resize', resize.bind(this, this.renderer, this.container), false);
  
    this.container.append(this.canvas);
    
    resize(this.renderer, this.container);
    
    this.camera = new Camera(this.renderer);
    this.camera.position.z = 100;
  
    this.pointer = new PointerManager(this.container, this.renderer);
  
    this.controls = new PointerControls(this.camera, this.pointer);
    

    // material
    const vertex = new WebGLVertexShader(this.gl, vertexShader);
    const fragment = new WebGLFragmentShader(this.gl, fragmentShader);
    const program = new WebGLProgram(this.renderer, vertex, fragment);
    
    this.renderer.render(this.camera);
    this.update();
  
    
    
    const sphere1 = new SphereMesh(this.renderer, program, 20, 64, 64);
    sphere1.position.set(0, 0, 0);
    // sphere1.scale.set(2, 2, 2);

    const sphere2 = new SphereMesh(this.renderer, program, 10, 6, 6);
    sphere2.position.set(15, 0, 10);
    // sphere2.scale.set(2, 2, 2);
  }
  
  update() {
    requestAnimationFrame(this.update.bind(this));
    
    this.controls.update();
    
    this.camera.update();
    
    this.renderer.render(this.camera);
  }
}

export {
  CSG
};