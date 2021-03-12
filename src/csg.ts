import { WebGLRenderer } from './renderer/renderer';

import { WebGLProgram } from './renderer/program';
import { WebGLVertexShader } from './renderer/vertex';
import { WebGLFragmentShader } from './renderer/fragment';

import vertexShader from './shaders/vert';
import fragmentShader from './shaders/frag';
import { LetterF } from './objects/letter-f';
import { resize } from './platform/resize';
import { Vector3 } from './math/vector3';
import { Camera } from './cameras/camera';
import { PointerManager } from './platform/pointer';
import { PointerControls } from './controls/pointer';
import { Sphere } from './objects/sphere';
import { CSGMesh, OPERATIONS } from './objects/csg-mesh';
// import { CSGSphere } from './objects/csg-sphere';

class TestTask {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  renderer: WebGLRenderer;
  camera: Camera;
  pointer: PointerManager;
  controls: PointerControls;
  
  resolution;
  letters;
  
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl2');

    if (!this.gl) {
      alert('Sorry, your browser doesn\'t support WebGL2. Please, use another browser.')

      throw new Error('Can\'t create WebGL2 context.');
    }

    this.renderer = new WebGLRenderer(this.gl, this.canvas);
    window.addEventListener('resize', resize.bind(this, this.renderer, this.container), false); // можно сделать через ResizeObserver
  
    this.container.append(this.canvas);
    
    resize(this.renderer, this.container);
    
    this.camera = new Camera(this.renderer);
    this.camera.position.z = 100;
    // this.camera.scale.x *= -1; // скорее всего, где-то в вычислениях камеры ошибка
    // this.camera.scale.y *= -1; // скорее всего, где-то в вычислениях камеры ошибка
  
    this.pointer = new PointerManager(this.container, this.renderer);
  
    this.controls = new PointerControls(this.camera, this.pointer);
    
    
    // an app
    const vertex = new WebGLVertexShader(this.gl, vertexShader);
    const fragment = new WebGLFragmentShader(this.gl, fragmentShader);
    const program = new WebGLProgram(this.renderer, vertex, fragment);
    
    this.renderer.render(this.camera);
    this.update();
  
    const base = new Vector3(0, 0, 0);
    
    this.letters = [];
    const lettersCount = 10;
    const radius = 400;
  
    // TODO: тонировка фонга
    //       геометрия сфера — done
    //       булева геометрия (шейдер? буфер?)
    //       направленное освещение — забаговано

    // const csgSphere = new CSGSphere(
    //   this.renderer,
    //   program,
    //   [
    //     {
    //       radius: 20,
    //       widthSegments: 64,
    //       heightSegments: 64
    //     },
    //     {
    //       radius: 20,
    //       widthSegments: 64,
    //       heightSegments: 64
    //     }
    //   ]
    // );
    
    const sphere1 = new Sphere(this.renderer, program, 20, 64, 64);
    sphere1.position.set(base.x, base.y, base.z);
    sphere1.scale.set(100, 100, 100);

    const sphere2 = new Sphere(this.renderer, program, 10, 64, 64);
    sphere2.position.set(base.x + 15, base.y, base.z + 10);
    // sphere2.scale.set(5, 5, 5);
  
    // const csgSphere1 = CSG.sphere({
    //   center: [0, 0, 0],
    //   radius: 5
    // });
    //
    // const csgSphere2 = CSG.sphere({
    //   center: [3, 2, 0],
    //   radius: 2
    // });
    //
    // const polygons = csgSphere1.subtract(csgSphere2).toPolygons();
    //
    // console.log(sphere1, polygons);
    
    // const csgMesh = new CSGMesh(this.renderer, [sphere1, sphere2], [OPERATIONS.SUBSTRACT]);
    
    for (let i = 0; i < lettersCount; i++) {
      // const letter = new LetterF(this.renderer, program);
      // letter.position.set(base.x, base.y, base.z);
      //
      // const angle = i * Math.PI * 2 / lettersCount;
      // const x = Math.cos(angle) * radius;
      // const y = Math.sin(angle) * radius;
      //
      // letter.position.x += x;
      // letter.position.z += y;
      //
      // // letter.position.set(150 + i * 100, 200 + i * 100, -1000);
      // // letter.rotation.set(i * 10, i * 10, i * 10);
      //
      // this.letters.push(letter);
    }
 
    // this.shape.position.x += 1024 / 4;
    // this.shape.position.y += 768 / 5;
    
    // this.resolution = new WebGLUniform(this.renderer, program, '2f', 'u_resolution');
    // this.resolution.set(this.gl.canvas.width, this.gl.canvas.height);
    
    let time = 1;
  
    setInterval(() => {
      // time += 0.11;
      time += 0.001;
      
      // this.camera.rotation.y += 0.1;
  
      // sphere1.rotation.x += 0.002;
      // sphere1.rotation.y -= 0.01;
      //
      // sphere2.rotation.x -= 0.001;
      // sphere2.rotation.y += 0.02;
      
      this.letters.forEach(letter => {
        // letter.rotation.x -= 0.01;
        // letter.rotation.y += 0.01;
        // letter.rotation.z -= 0.01;
      });
    }, 10);
    
    console.log(this.renderer);
  }
  
  update() {
    requestAnimationFrame(this.update.bind(this));
    
    this.controls.update();
    
    this.camera.update();
    this.renderer.meshes.forEach(object => {
      // object.update();
    });
    
    this.renderer.render(this.camera);
  }
}

export {
  TestTask
};