const vertexShader2 = `
// Set the precision for data types used in this shader
precision highp float;
precision highp int;

// Examples of variables passed from vertex to fragment shader
varying vec3 vPosition;
varying vec3 vViewPos;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vScreenPos;

void main() {

    // To pass variables to the fragment shader, you assign them here in the
    // main function. Traditionally you name the varying with vAttributeName
    vNormal = normal;
    vUv = uv;
    vUv2 = uv2;
    vPosition = position;

    vViewPos = (modelMatrix * vec4( position, 1.0 )).xyz;

    // This sets the position of the vertex in 3d space. The correct math is
    // provided below to take into account camera and object data.
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vScreenPos = gl_Position.xyz / gl_Position.w;
}
`;

export default vertexShader2