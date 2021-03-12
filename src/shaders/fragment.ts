// language=GLSL
export default `#version 300 es

precision highp float;

uniform vec4 u_color;

in vec4 v_position;
in vec3 v_normal;

out vec4 outColor;

void main() {
  outColor = vec4(v_normal, 1.0);
}
`;