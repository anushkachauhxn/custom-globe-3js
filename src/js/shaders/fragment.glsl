uniform sampler2D globeTexture;
varying vec2 vertexUV; // vUV

void main() {
    gl_FragColor = texture2D(globeTexture, vertexUV);
}
