const vertexShader = `
// Set the precision for data types used in this shader
precision highp float;
precision highp int;

varying vec2 vUv;

void main() {

    vUv = uv;

    // This sets the position of the vertex in 3d space. The correct math is
    // provided below to take into account camera and object data.
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`

export default vertexShader;



// precision highp float;
// precision highp int;
// uniform mat3 normalMatrix;
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;
// attribute vec2 uv2;
// varying vec3 fNormal;
// varying vec3 fPosition;
// varying vec2 Death_Triangles_Taxes1457121973826_264_vUv;
// varying vec2 Vertical_2_Color_Graident1457122009455_304_vUv;
// vec4 Glow_Effect1457121674449_169_main(){
//     vec4 Glow_Effect1457121674449_169_gl_Position = vec4(0.0);
//     fNormal = normalize(normalMatrix * normal);
//     vec4 pos = modelViewMatrix * vec4(position, 1.0); 
//     fPosition = pos.xyz;
//     Glow_Effect1457121674449_169_gl_Position = projectionMatrix * pos;
//     return Glow_Effect1457121674449_169_gl_Position *= 0.6;

// }
// vec4 Death_Triangles_Taxes1457121973826_264_main(){
//     vec4 Death_Triangles_Taxes1457121973826_264_gl_Position = vec4(0.0);
//     Death_Triangles_Taxes1457121973826_264_vUv = uv;
//     Death_Triangles_Taxes1457121973826_264_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     return Death_Triangles_Taxes1457121973826_264_gl_Position *= 0.2;
// }
// vec4 Vertical_2_Color_Graident1457122009455_304_main(){
//     vec4 Vertical_2_Color_Graident1457122009455_304_gl_Position = vec4(0.0);
//     Vertical_2_Color_Graident1457122009455_304_vUv = uv;
//     Vertical_2_Color_Graident1457122009455_304_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     return Vertical_2_Color_Graident1457122009455_304_gl_Position *= 0.7;
// }
// vec4 Soild_Color1457131842069_103_main(){
//     vec4 Soild_Color1457131842069_103_gl_Position = vec4(0.0);
//     Soild_Color1457131842069_103_gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     return Soild_Color1457131842069_103_gl_Position *= 0.2;
// }
// void main(){
//     gl_Position = Glow_Effect1457121674449_169_main() + Death_Triangles_Taxes1457121973826_264_main() + Vertical_2_Color_Graident1457122009455_304_main() + Soild_Color1457131842069_103_main();
// }