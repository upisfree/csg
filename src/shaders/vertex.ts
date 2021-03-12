// language=GLSL
export default `#version 300 es

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