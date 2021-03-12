class Vector3 {
  x: number;
  y: number;
  z: number;
  
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  setFromSphericalCoords(radius, phi, theta) {
    const sinPhiRadius = Math.sin(phi) * radius;
    
    this.x = sinPhiRadius * Math.sin(theta);
    this.y = Math.cos(phi) * radius;
    this.z = sinPhiRadius * Math.cos(theta);
    
    return this;
  }
  
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    
    return this;
  }
  
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    
    return this;
  }
  
  cross(v) {
    return this.crossVectors(this, v);
  }
  
  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    
    return this;
  }
  
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  
  lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  
  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    
    return this;
  }
  
  divideScalar(scalar) {
    return this.multiplyScalar(1 / scalar);
  }
}

export { Vector3 };