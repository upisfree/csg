/**
 * csg v2.0.0 build Fri, 12 Mar 2021 18:44:09 GMT
 * https://github.com/upisfree/csg
 * Copyright 2021 Senya Pugach
 * @license MIT
 */
class WebGLRenderer {
    constructor(gl, canvas) {
        this.programs = [];
        this.meshes = [];
        this.width = 1;
        this.height = 1;
        this.gl = gl;
        this.canvas = canvas;
    }
    render(camera) {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.meshes.forEach(mesh => {
            this.renderMesh(mesh, camera);
        });
    }
    renderMesh(mesh, camera) {
        this.gl.useProgram(mesh.program);
        this.gl.bindVertexArray(mesh.vao);
        mesh.matrix = camera.viewProjectionMatrix.clone();
        mesh.updateMatrix();
        mesh.updateUniforms();
        if (mesh.geometry.index) {
            this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.index.length, this.gl.UNSIGNED_SHORT, 0);
        }
        else {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, mesh.geometry.position.length / 3);
        }
    }
}

class WebGLProgram {
    constructor(renderer, vertexShader, fragmentShader) {
        const gl = renderer.gl;
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const status = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (status === true) {
            renderer.programs.push(program);
            return program;
        }
        const log = gl.getProgramInfoLog(program);
        console.error(log);
        gl.deleteProgram(program);
    }
}

function logWithLineNumbers(str) {
    let i = 1;
    const numbered = str.replace(/^/gm, () => `${i++}. `);
    console.log(numbered);
}

class WebGLShader {
    constructor(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (status === true) {
            return shader;
        }
        const log = gl.getShaderInfoLog(shader);
        const shaderSource = gl.getShaderSource(shader);
        console.error(log);
        logWithLineNumbers(shaderSource);
        gl.deleteShader(shader);
    }
}

class WebGLVertexShader extends WebGLShader {
    constructor(gl, source) {
        super(gl, gl.VERTEX_SHADER, source);
    }
}

class WebGLFragmentShader extends WebGLShader {
    constructor(gl, source) {
        super(gl, gl.FRAGMENT_SHADER, source);
    }
}

class Vector3 {
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

class Matrix4 {
    constructor() {
        this.elements = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }
    set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        const te = this.elements;
        te[0] = n11;
        te[4] = n12;
        te[8] = n13;
        te[12] = n14;
        te[1] = n21;
        te[5] = n22;
        te[9] = n23;
        te[13] = n24;
        te[2] = n31;
        te[6] = n32;
        te[10] = n33;
        te[14] = n34;
        te[3] = n41;
        te[7] = n42;
        te[11] = n43;
        te[15] = n44;
        return this;
    }
    clone() {
        return new Matrix4().fromArray(this.elements);
    }
    translate(x, y, z) {
        return this.multiply(Matrix4.getTranslation(x, y, z));
    }
    rotateX(angle) {
        return this.multiply(Matrix4.getRotationX(angle));
    }
    rotateY(angle) {
        return this.multiply(Matrix4.getRotationY(angle));
    }
    rotateZ(angle) {
        return this.multiply(Matrix4.getRotationZ(angle));
    }
    scale(x, y, z) {
        return this.multiply(Matrix4.getScale(x, y, z));
    }
    multiply(m) {
        return this.multiplyMatrices(this, m);
    }
    multiplyMatrices(a, b) {
        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;
        const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
        const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
    }
    invert() {
        const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3], n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7], n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11], n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15], t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44, t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44, t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44, t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
        const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
        if (det === 0)
            return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        const detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
        te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
        te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
        te[4] = t12 * detInv;
        te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
        te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
        te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
        te[8] = t13 * detInv;
        te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
        te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
        te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
        te[12] = t14 * detInv;
        te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
        te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
        te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
        return this;
    }
    transpose() {
        const te = this.elements;
        let tmp;
        tmp = te[1];
        te[1] = te[4];
        te[4] = tmp;
        tmp = te[2];
        te[2] = te[8];
        te[8] = tmp;
        tmp = te[6];
        te[6] = te[9];
        te[9] = tmp;
        tmp = te[3];
        te[3] = te[12];
        te[12] = tmp;
        tmp = te[7];
        te[7] = te[13];
        te[13] = tmp;
        tmp = te[11];
        te[11] = te[14];
        te[14] = tmp;
        return this;
    }
    lookAt(eye, target, up) {
        const te = this.elements;
        const x = new Vector3();
        const y = new Vector3();
        const z = new Vector3();
        z.subVectors(eye, target);
        if (z.lengthSquared() === 0) {
            z.z = 1;
        }
        z.normalize();
        x.crossVectors(up, z);
        if (x.lengthSquared() === 0) {
            if (Math.abs(up.z) === 1) {
                z.x += 0.0001;
            }
            else {
                z.z += 0.0001;
            }
            z.normalize();
            x.crossVectors(up, z);
        }
        x.normalize();
        y.crossVectors(z, x);
        te[0] = x.x;
        te[4] = y.x;
        te[8] = z.x;
        te[1] = x.y;
        te[5] = y.y;
        te[9] = z.y;
        te[2] = x.z;
        te[6] = y.z;
        te[10] = z.z;
        return this;
    }
    fromArray(array, offset = 0) {
        for (let i = 0; i < 16; i++) {
            this.elements[i] = array[i + offset];
        }
        return this;
    }
    static getTranslation(x, y, z) {
        const translation = new Matrix4();
        translation.elements = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ];
        return translation;
    }
    static getRotationX(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const rotation = new Matrix4();
        rotation.elements = [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
        return rotation;
    }
    static getRotationY(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const rotation = new Matrix4();
        rotation.elements = [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
        return rotation;
    }
    static getRotationZ(angle) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        const rotation = new Matrix4();
        rotation.elements = [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
        return rotation;
    }
    static getScale(x, y, z) {
        const scale = new Matrix4();
        scale.elements = [
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ];
        return scale;
    }
    static getOrthographic(left, right, bottom, top, near, far) {
        const orthographic = new Matrix4();
        orthographic.elements = [
            2 / (right - left), 0, 0, 0,
            0, 2 / (top - bottom), 0, 0,
            0, 0, 2 / (near - far), 0,
            (left + right) / (left - right),
            (bottom + top) / (bottom - top),
            (near + far) / (near - far),
            1
        ];
        return orthographic;
    }
    static getPerspective(fov, aspect, near, far) {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov);
        const range = 1.0 / (near - far);
        const perspective = new Matrix4();
        perspective.elements = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * range, -1,
            0, 0, near * far * range * 2, 0
        ];
        return perspective;
    }
}

class Object3D {
    constructor(renderer) {
        this.position = new Vector3();
        this.rotation = new Vector3();
        this.scale = new Vector3(1, 1, 1);
        this.matrix = new Matrix4();
        this.worldInverseTransposeMatrix = new Matrix4();
        this.renderer = renderer;
    }
    update() {
        this.updateMatrix();
    }
    updateMatrix() {
        this.matrix = this.matrix.translate(this.position.x, this.position.y, this.position.z);
        this.matrix = this.matrix.rotateX(this.rotation.x);
        this.matrix = this.matrix.rotateY(this.rotation.y);
        this.matrix = this.matrix.rotateZ(this.rotation.z);
        this.matrix = this.matrix.scale(this.scale.x, this.scale.y, this.scale.z);
    }
}

class Camera extends Object3D {
    constructor(renderer) {
        super(renderer);
        this.aspect = 1;
        this.fov = 60 * Math.PI / 180;
        this.near = 1;
        this.far = 20000;
        this.target = new Vector3(0, 0, 0);
        this.up = new Vector3(0, 1, 0);
        this.update();
    }
    update() {
        this.aspect = this.renderer.width / this.renderer.height;
        this.matrix = new Matrix4();
        this.updateMatrix();
        this.updateCameraMatrices();
    }
    updateCameraMatrices() {
        this.projectionMatrix = Matrix4.getPerspective(this.fov, this.aspect, this.near, this.far);
        this.matrix = this.matrix.lookAt(this.position, this.target, this.up);
        this.viewMatrix = this.matrix.clone().invert();
        this.viewProjectionMatrix = this.projectionMatrix.clone().multiply(this.viewMatrix);
    }
}

class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

const POINTER_EVENT = {
    ENTER: 'pointerenter',
    LEAVE: 'pointerleave',
    DOWN: 'pointerdown',
    UP: 'pointerup',
    MOVE: 'pointermove'
};
const POINTER_BUTTON = {
    NONE: -1,
    LEFT: 0,
    WHEEL: 1,
    RIGHT: 2
};
class PointerManager {
    constructor(container, renderer) {
        this.screenPosition = new Vector2(0, 0);
        this.scenePosition = new Vector2(0, 0);
        this.sceneDiff = new Vector2(0, 0);
        this.buttonPressed = POINTER_BUTTON.NONE;
        this.container = container;
        this.renderer = renderer;
        this.initListeners();
    }
    initListeners() {
        this.container.addEventListener(POINTER_EVENT.DOWN, this.onPointerDown.bind(this), false);
        this.container.addEventListener(POINTER_EVENT.UP, this.onPointerUp.bind(this), false);
        this.container.addEventListener(POINTER_EVENT.MOVE, this.onPointerMove.bind(this), false);
        this.container.oncontextmenu = () => false;
    }
    updateScreenPosition(x, y) {
        this.screenPosition.x = x;
        this.screenPosition.y = y;
        const sx = (x / this.renderer.width) * 2 - 1;
        const sy = -(y / this.renderer.height) * 2 + 1;
        this.sceneDiff.x = this.scenePosition.x - sx;
        this.sceneDiff.y = this.scenePosition.y - sy;
        this.scenePosition.x = sx;
        this.scenePosition.y = sy;
    }
    onPointerMove(event) {
        if (!event.isPrimary) {
            return;
        }
        this.updateScreenPosition(event.clientX, event.clientY);
    }
    onPointerDown(event) {
        event.preventDefault();
        this.updateScreenPosition(event.clientX, event.clientY);
        this.buttonPressed = event.button;
        event.currentTarget.classList.add('grabbing');
    }
    onPointerUp(event) {
        this.updateScreenPosition(0, 0);
        this.buttonPressed = POINTER_BUTTON.NONE;
        event.currentTarget.classList.remove('grabbing');
        this.sceneDiff.x = 0;
        this.sceneDiff.y = 0;
    }
}

class PointerControls {
    constructor(camera, pointer) {
        this.dragSensitivity = 1000;
        this.fovSensitivity = 10;
        this.camera = camera;
        this.pointer = pointer;
    }
    update() {
        switch (this.pointer.buttonPressed) {
            case POINTER_BUTTON.LEFT:
                this.camera.position.x += this.pointer.sceneDiff.x * this.dragSensitivity;
                this.camera.position.y += this.pointer.sceneDiff.y * this.dragSensitivity;
                break;
            case POINTER_BUTTON.RIGHT:
                this.camera.fov += this.pointer.sceneDiff.y * this.fovSensitivity;
                break;
        }
    }
}

class WebGLAttribute {
    constructor(gl, program, name, data, bufferType, size = 1, type = gl.FLOAT, normalize = false, stride = 0, offset = 0) {
        this.gl = gl;
        this.program = program;
        this.buffer = this.gl.createBuffer();
        this.gl.bindBuffer(bufferType, this.buffer);
        this.gl.bufferData(bufferType, data, this.gl.STATIC_DRAW);
        this.location = this.gl.getAttribLocation(program, name);
        if (bufferType === this.gl.ARRAY_BUFFER) {
            this.gl.enableVertexAttribArray(this.location);
            this.gl.vertexAttribPointer(this.location, size, type, normalize, stride, offset);
        }
    }
}

class WebGLUniform {
    constructor(renderer, program, type, name) {
        this.gl = renderer.gl;
        this.program = program;
        this.name = name;
        this.type = type;
        this.location = this.gl.getUniformLocation(this.program, this.name);
    }
    set(...args) {
        switch (this.type) {
            case '1f':
                this.gl.uniform1f(this.location, args[0]);
                break;
            case '2f':
                this.gl.uniform2f(this.location, args[0], args[1]);
                break;
            case '2fv':
                this.gl.uniform2fv(this.location, args[0]);
                break;
            case '3f':
                this.gl.uniform3f(this.location, args[0], args[1], args[2]);
                break;
            case '3fv':
                this.gl.uniform3fv(this.location, args[0]);
                break;
            case '4f':
                this.gl.uniform4f(this.location, args[0], args[1], args[2], args[3]);
                break;
            case '4fv':
                this.gl.uniform4fv(this.location, args[0]);
                break;
            case 'matrix3fv':
                this.gl.uniformMatrix3fv(this.location, false, args[0].elements);
                break;
            case 'matrix4fv':
                this.gl.uniformMatrix4fv(this.location, false, args[0].elements);
                break;
        }
    }
}

class Mesh extends Object3D {
    constructor(renderer, program) {
        super(renderer);
        this.uniforms = {};
        this.attributes = {};
        this.gl = this.renderer.gl;
        this.program = program;
        this.renderer.meshes.push(this);
    }
    initGLData() {
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);
        this.initGeometry();
        this.initAttributes();
        this.initUniforms();
        this.gl.bindVertexArray(null);
    }
    initGeometry() {
    }
    initAttributes() {
    }
    initUniforms() {
        this.uniforms['u_worldViewProjection'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldViewProjection');
        this.uniforms['u_worldInverseTranspose'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldInverseTranspose');
    }
    updateUniforms() {
        this.uniforms['u_worldViewProjection'].set(this.matrix);
        this.uniforms['u_worldInverseTranspose'].set(this.worldInverseTransposeMatrix);
    }
}

class Geometry {
    constructor() {
    }
}

class SphereGeometry extends Geometry {
    constructor(radius, widthSegments, heightSegments, thetaStart = 0, thetaLength = Math.PI, phiStart = 0, phiLength = Math.PI * 2) {
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
                indices.push((y + 0) * vertsAroundCount + x, (y + 0) * vertsAroundCount + x + 1, (y + 1) * vertsAroundCount + x);
                indices.push((y + 1) * vertsAroundCount + x, (y + 0) * vertsAroundCount + x + 1, (y + 1) * vertsAroundCount + x + 1);
            }
        }
        this.position = new Float32Array(positions);
        this.index = new Uint16Array(indices);
        this.normal = new Float32Array(normals);
    }
}

class SphereMesh extends Mesh {
    constructor(renderer, program, radius, widthSegments, heightSegments) {
        super(renderer, program);
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.initGLData();
    }
    initGeometry() {
        this.geometry = new SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
    }
    initAttributes() {
        this.attributes['a_position'] = new WebGLAttribute(this.gl, this.program, 'a_position', this.geometry.position, this.gl.ARRAY_BUFFER, 3, this.gl.FLOAT);
        this.attributes['a_normal'] = new WebGLAttribute(this.gl, this.program, 'a_normal', this.geometry.normal, this.gl.ARRAY_BUFFER, 3, this.gl.FLOAT);
        if (this.geometry.index) {
            this.attributes['a_index'] = new WebGLAttribute(this.gl, this.program, 'a_index', this.geometry.index, this.gl.ELEMENT_ARRAY_BUFFER);
        }
    }
    initUniforms() {
        this.uniforms['u_worldViewProjection'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldViewProjection');
        this.uniforms['u_worldInverseTranspose'] = new WebGLUniform(this.renderer, this.program, 'matrix4fv', 'u_worldInverseTranspose');
    }
    updateUniforms() {
        super.updateUniforms();
    }
}

function resize(renderer, container) {
    const bounds = container.getBoundingClientRect();
    renderer.width = renderer.canvas.width = bounds.width;
    renderer.height = renderer.canvas.height = bounds.height;
}

var vertexShader = `#version 300 es

uniform mat4 u_worldInverseTranspose;
uniform mat4 u_worldViewProjection;

in vec4 a_position;
in vec3 a_normal;

out vec4 v_position;
out vec3 v_normal;

void main() {
  vec4 position = u_worldViewProjection * a_position;
  
  gl_Position = position;

  v_position = a_position;
  v_normal = mat3(u_worldInverseTranspose) * a_normal;
}`;

var fragmentShader = `#version 300 es

precision highp float;

uniform vec4 u_color;

in vec4 v_position;
in vec3 v_normal;

out vec4 outColor;

void main() {
  outColor = vec4(v_normal, 1.0);
}
`;

class CSG {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.gl = this.canvas.getContext('webgl2');
        if (!this.gl) {
            alert('Sorry, your browser doesn\'t support WebGL2. Please, use another browser.');
            throw new Error('Can\'t create WebGL2 context.');
        }
        this.renderer = new WebGLRenderer(this.gl, this.canvas);
        window.addEventListener('resize', resize.bind(this, this.renderer, this.container), false);
        this.container.append(this.canvas);
        resize(this.renderer, this.container);
        this.camera = new Camera(this.renderer);
        this.camera.position.z = 100;
        this.pointer = new PointerManager(this.container, this.renderer);
        this.controls = new PointerControls(this.camera, this.pointer);
        const vertex = new WebGLVertexShader(this.gl, vertexShader);
        const fragment = new WebGLFragmentShader(this.gl, fragmentShader);
        const program = new WebGLProgram(this.renderer, vertex, fragment);
        this.renderer.render(this.camera);
        this.update();
        const sphere1 = new SphereMesh(this.renderer, program, 20, 64, 64);
        sphere1.position.set(0, 0, 0);
        const sphere2 = new SphereMesh(this.renderer, program, 10, 6, 6);
        sphere2.position.set(15, 0, 10);
    }
    update() {
        requestAnimationFrame(this.update.bind(this));
        this.controls.update();
        this.camera.update();
        this.renderer.render(this.camera);
    }
}

export { CSG };
//# sourceMappingURL=csg.esm.js.map
