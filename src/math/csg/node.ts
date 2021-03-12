const FRONT = 1;
const BACK = 2;

class Node {
  polygons = [];
  front = undefined;
  back = undefined;
  divider;
  
  constructor(polygons?) {
    let front = [],
        back = [];
    
    // build case, better to rewrite
    if (!(polygons instanceof Array) || polygons.length === 0) {
      return;
    }
    
    this.divider = polygons[0].clone();
    
    const polygonsCount = polygons.length;
    for (let i = 0; i < polygonsCount; i++) {
      this.divider.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
    }
    
    if (front.length > 0) {
      this.front = new Node(front);
    }
    
    if (back.length > 0) {
      this.back = new Node(back);
    }
  }
  
  isConvex(polygons) {
    for (let i = 0; i < polygons.length; i++) {
      for (let j = 0; j < polygons.length; j++) {
        if (i !== j && polygons[i].classifySide(polygons[j]) !== BACK) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  // TODO: combine with code from the constructor
  build(polygons) {
    let front = [],
        back = [];
    
    if (!this.divider) {
      this.divider = polygons[0].clone();
    }
  
    const polygonsCount = polygons.length;
    for (let i = 0; i < polygonsCount; i++) {
      this.divider.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
    }
    
    if (front.length > 0) {
      if (!this.front) {
        this.front = new Node();
      }
      
      this.front.build(front);
    }
    
    if (back.length > 0) {
      if (!this.back) {
        this.back = new Node();
      }
      
      this.back.build(back);
    }
  }
  
  allPolygons() {
    let polygons = this.polygons.slice();
    
    if (this.front) {
      polygons = polygons.concat(this.front.allPolygons());
    }
    
    if (this.back) {
      polygons = polygons.concat(this.back.allPolygons());
    }
    
    return polygons;
  }
  
  clone() {
    let node = new Node();
    
    node.divider = this.divider.clone();
    node.polygons = this.polygons.map((polygon) => {
      return polygon.clone();
    });
    
    node.front = this.front && this.front.clone();
    node.back = this.back && this.back.clone();
    
    return node;
  }
  
  invert() {
    const polygonsCount = this.polygons.length;
    for (let i = 0; i < polygonsCount; i++) {
      this.polygons[i].flip();
    }
    
    this.divider.flip();
    if (this.front) this.front.invert();
    if (this.back) this.back.invert();
    
    let temp = this.front;
    this.front = this.back;
    this.back = temp;
    
    return this;
  }
  
  clipPolygons(polygons) {
    if (!this.divider) {
      return polygons.slice();
    }
    
    let front = [],
        back = [];
  
    const polygonsCount = polygons.length;
    for (let i = 0; i < polygonsCount; i++) {
      this.divider.splitPolygon(polygons[i], front, back, front, back);
    }
    
    if (this.front) {
      front = this.front.clipPolygons(front);
    }
    
    if (this.back) {
      back = this.back.clipPolygons(back);
    } else {
      back = [];
    }
    
    return front.concat(back);
  }
  
  clipTo(node) {
    this.polygons = node.clipPolygons(this.polygons);
    
    if (this.front) {
      this.front.clipTo(node);
    }
    
    if (this.back) {
      this.back.clipTo(node);
    }
  }
}

export { Node };