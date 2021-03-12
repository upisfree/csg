import { Geometry } from './geometry';

// @ts-ignore
const CSG = window.CSG;

class CSGSphereGeometry extends Geometry {
  constructor(
    radius
  ) {
    super();
  
    const sphere = CSG.sphere({
      center: [0, 0, 0],
      radius: radius
    });
    
    const polygons = sphere.toPolygons();
    let positions = [];
    let normals = [];
    let indexes = [];
    
    for (let i = 0; i < polygons.length; i++) {
      const polygon = polygons[i];
  
      polygon.vertices.forEach(v => {
        positions.push(v.pos.x, v.pos.y, v.pos.z);
      });
      
      normals.push(polygon.plane.normal.x, polygon.plane.normal.y, polygon.plane.normal.z);
    }
    
    console.log(positions);
  
    // this.position = new Float32Array(positions);
    // this.index = new Uint16Array(indices);
    // this.normal = new Float32Array(normals);
  
    this.position = new Float32Array(positions);
    // this.index = new Uint16Array(indices);
    this.normal = new Float32Array(normals);
  }
}

export { CSGSphereGeometry };