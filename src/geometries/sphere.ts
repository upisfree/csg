import { Geometry } from './geometry';

class SphereGeometry extends Geometry {
  constructor(
    radius,
    widthSegments,
    heightSegments,
    thetaStart = 0,
    thetaLength = Math.PI,
    phiStart = 0,
    phiLength = Math.PI * 2
  ) {
    super();
  
    if (widthSegments <= 0 || heightSegments <= 0) {
      throw Error('SphereGeometry: widthSegments and heightSegments must be > 0');
    }
  
    const thetaRange = thetaLength - thetaStart;
    const phiRange = phiLength - phiStart;
  
    const vertsAroundCount = widthSegments + 1;
  
    const positions = [];
    const normals = [];
    const indices = [];
    
    for (let y = 0; y <= heightSegments; y++) {
      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments;
        const v = y / heightSegments;
        
        const theta = phiRange * u;
        const phi = thetaRange * v;

        const thetaSin = Math.sin(theta);
        const thetaCos = Math.cos(theta);

        const phiSin = Math.sin(phi);
        const phiCos = Math.cos(phi);

        const ux = thetaCos * phiSin;
        const uy = phiCos;
        const uz = thetaSin * phiSin;
        
        positions.push(radius * ux, radius * uy, radius * uz);
        normals.push(ux, uy, uz);
      }
    }
  
    for (let x = 0; x < widthSegments; x++) {
      for (let y = 0; y < heightSegments; y++) {
        indices.push(
          (y + 0) * vertsAroundCount + x,
          (y + 0) * vertsAroundCount + x + 1,
          (y + 1) * vertsAroundCount + x
        );
      
        indices.push(
          (y + 1) * vertsAroundCount + x,
          (y + 0) * vertsAroundCount + x + 1,
          (y + 1) * vertsAroundCount + x + 1
        );
      }
    }
  
    this.position = new Float32Array(positions);
    this.index = new Uint16Array(indices);
    this.normal = new Float32Array(normals);
  }
}

export {
  SphereGeometry
};