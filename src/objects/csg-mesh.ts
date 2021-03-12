import { Mesh } from './mesh';
import { WebGLRenderer } from '../renderer/renderer';

const OPERATIONS = {
  ADD: 'add',
  SUBSTRACT: 'substract'
};

// TODO: extends Mesh
class CSGMesh {
  renderer: WebGLRenderer;
  
  meshes: Mesh[];
  operations: string[];
  
  constructor(renderer: WebGLRenderer, meshes, operations) {
    this.renderer = renderer;
  
    this.renderer.csgMeshes.push(this);
  
    this.meshes = meshes;
    this.operations = operations;
  }
}

export {
  CSGMesh,
  OPERATIONS
};