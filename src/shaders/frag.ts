// language=GLSL
export default `#version 300 es

precision highp float;

uniform vec3 u_reverseLightDirection;
uniform vec4 u_color;

in vec4 v_position;
in vec3 v_normal;

out vec4 outColor;

void main() {
//  vec3 normal = normalize(v_normal);
//
//  // compute the light by taking the dot product
//  // of the normal to the light's reverse direction
//  float light = dot(normal, u_reverseLightDirection);
//
//  outColor = vec4(1.0, 0, 1.0, 1.0);
//
//  // Lets multiply just the color portion (not the alpha)
//  // by the light
//  outColor.rgb *= light;
  
  outColor = vec4(v_normal, 1.0);
//  float z = normalize(v_position.z);
//  float c = 1.0 - z;
//
//  outColor = vec4(c, c, c, 1.0);
}
`;