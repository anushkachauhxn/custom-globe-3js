## 🌐 Vertex Shader

- It is basically a program that will run for every vertex throughout our geometry.
- Responsible for placing all the vertices in the correct position to create all objects.

<hr>

Note that you can calculate the position of a vertex in the vertex shader by:

`gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`

or alternatively,

`gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );`

<br>

## 🏳️‍🌈 Fragment Shader

- It is basically a program that will loop over every pixel in between the vertices and set its color to some value.
- Responsible for filling in the space in between the vertices.

<hr>

Note that you can assign a color (red in this case) to all the pixels by:

`gl_FragColor = vec4(1, 0, 0, 1);`

<br>

## 🌍 Adding a texture to a geometry

### 1. Getting a texture from an image to fragment shader:

- We can get the texture for the globe by passing the image through **uniforms** (similar to props from react).

_app.js_

```js
const sphereMat = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    globeTexture: { value: loader.load(globeTexture) },
  },
});
```

_fragment.glsl_

```
uniform sampler2D globeTexture;
```

### 2. Getting the uv value from vertex shader to fragment shader:

#### What is a uv?

- A uv is an x and y coordinate. Eg: [0, 0]
- u and v are texture coordinates. They represent the axes of the 2d texture.
- uv mapping is the process of mapping a 2d image onto a 3d object

<hr>

_vertex.glsl_

```
varying vec2 vertexUV; // vUV

void main() {
    vertexUV = uv;
}
```

_fragment.glsl_

```
varying vec2 vertexUV;
```

### 3. Adding texture to fragment shader:

Use the image texture and uv value from above steps.

_fragment.glsl_

```
uniform sampler2D globeTexture;
varying vec2 vertexUV; // vUV

void main() {
    gl_FragColor = texture2D(globeTexture, vertexUV);
}
```

## ☀️ Adding an Atmospheric/ Glow Effect on a geometry

### 1. Getting the normal value from vertex shader to fragment shader:

#### What is a normal?

- A normal is data that represents the direction a vertex is facing.
- Eg: [1, 0, 0] means the vertex is pointing to the right.

> Different kinds of vertex data:
>
> - 📍 position (where on the screen it is)
> - ↘️ normal (direction it is facing)
> - 🗺️ uv (position if unwrapped onto a 2D surface)

<hr>

_vertex.glsl_

```
varying vec3 vertexNormal;

void main() {
    vertexNormal = normal;
}
```

_fragment.glsl_

```
varying vec3 vertexNormal;
```

## 2. Calculating and adding the `atmoshpere` value to fragment shader

_fragment.glsl_

```
void main() {
    float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)); // different for each vertex => gives the edge effect
    vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);

    gl_FragColor = vec4(atmosphere + texture2D(globeTexture, vertexUV).xyz, 1.0);
}
```
