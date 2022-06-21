const fragmentShader2 = `

// Set the precision for data types used in this shader
precision highp float;
precision highp int;

// Default uniforms provided by ShaderFrog.
uniform vec3 cameraPosition;
uniform float time;

// A uniform unique to this shader. You can modify it to the using the form
// below the shader preview. Any uniform you add is automatically given a form
uniform vec3 color;
uniform vec3 lightPosition;

uniform float borderWidth;
uniform sampler2D toonNoise1;
uniform sampler2D toonNoise2;

// Example varyings passed from the vertex shader
varying vec3 vPosition;
varying vec3 vViewPos;
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vUv2;
varying vec3 vScreenPos;

void main() {

    vec3 sinLightPos = vec3(cos(time), 0, sin(time)) * 100.0;
    
    // Calculate the real position of this pixel in 3d space, taking into account
    // the rotation and scale of the model. It's a useful formula for some effects.
    // This could also be done in the vertex shader
    vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0 )).xyz;

    // Calculate the normal including the model rotation and scale
    vec3 worldNormal = normalize( vec3( modelMatrix * vec4( vNormal, 0.0 ) ) );

    // vector from position to light
    vec3 lightVector = normalize( sinLightPos - worldPosition );

    // An example simple lighting effect, taking the dot product of the normal
    // (which way this pixel is pointing) and a user generated light position
    float brightness = dot( worldNormal, lightVector );
    
    // calculating the angle for the "edge"
    vec3 cam2pixel = normalize(cameraPosition - worldPosition);
    float borderScalar = (dot(cam2pixel, worldNormal));
    
    // if dotp is within the range black it out. else, set it to 1
    if(borderScalar < borderWidth) borderScalar = 0.0; else borderScalar = 1.0;
    
    // sample from the noise texture, tipping it up so it's within the range of 0.8 to 1
    float noiseValue = texture2D( toonNoise1, vec2(vScreenPos.xy *  6.0) ).x * 0.3 + 0.8;
    noiseValue      *= texture2D( toonNoise2, vec2(vScreenPos.xy * 10.0) ).x * 0.3 + 0.8;

    // calculate final scalar for 
    float finalScalar = noiseValue * borderScalar;
    
    // downsample light value to index between 0 and 10, inclusive
    int responseIndex = int((brightness) * 5.0);
    
    // translate this back to a float for light calculation
    // response value is 0 to 1 on 0.1 increments
    float floatIndex = float(responseIndex) * 0.3;
    
    // log(x^2 + 1) falloff
    float falloffValue = log(floatIndex * floatIndex * floatIndex  + 1.0);
    
    
    vec3 bisector = normalize(normalize(-vec3(vPosition)) + normalize(sinLightPos - vPosition));
    float cosAngle = max(dot(bisector, normalize(vNormal)), 0.0);
    float specularMaterial = 1.0;
    vec3 specularTerm = specularMaterial * color * max( pow(cosAngle, 2.0), 0.0 );

    // apply color, falloff, and the border/noise scalar. also clamps the index to 0
    gl_FragColor = vec4( color * falloffValue * finalScalar * float(responseIndex > 0), 1.0 );
}
`;

export default fragmentShader2