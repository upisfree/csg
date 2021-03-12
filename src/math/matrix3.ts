class Matrix3 {
  elements = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ];
  
  translate(x, y) {
    return this.multiply(Matrix3.getTranslation(x, y));
  }
  
  // in radians
  rotate(angle) {
    return this.multiply(Matrix3.getRotation(angle));
  }
  
  scale(x, y) {
    return this.multiply(Matrix3.getScale(x, y));
  }
  
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  
  multiplyMatrices(a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;
    
    const a11 = ae[0], a12 = ae[3], a13 = ae[6];
    const a21 = ae[1], a22 = ae[4], a23 = ae[7];
    const a31 = ae[2], a32 = ae[5], a33 = ae[8];
    
    const b11 = be[0], b12 = be[3], b13 = be[6];
    const b21 = be[1], b22 = be[4], b23 = be[7];
    const b31 = be[2], b32 = be[5], b33 = be[8];
    
    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;
    
    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;
    
    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;
    
    return this;
  }
  
  
  
  static getTranslation(x, y) {
    const translation = new Matrix3();
    translation.elements = [
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    ];
    
    return translation;
  }
  
  static getRotation(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    
    const rotation = new Matrix3();
    rotation.elements = [
      c, -s, 0,
      s, c, 0,
      0, 0, 1
    ];
    
    return rotation;
  }
  
  static getScale(x, y) {
    const scale = new Matrix3();
    scale.elements = [
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    ];
    
    return scale;
  }
  
  // матрица, переворачивающая Y, чтобы 0 был наверху
  static getProjection(width, height) {
    const projection = new Matrix3();
    projection.elements = [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ];
    
    return projection;
  }
}

export { Matrix3 };