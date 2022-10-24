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

## 🌍 Adding an Atmospheric Effect on a geometry

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

## ☀️ Adding a Glow Effect on a geometry

### 1. Create another mesh slightly larger than the main globe

_app.js_

```js
atmosphere.scale.set(1.1, 1.1, 1.1);
```

_atmosphereVertex.glsl_

```
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 0.9 );
}
```

### 2. Create a fragment shader that creates an uneven color effect

- Glow: starts out strong in the middle and then fades out at the edges

_atmosphereFragment.glsl_

```
void main() {
    float intensity = pow(0.65 - dot(vertexNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
}
```

### 3. Make the shader blend with the globe

_app.js_

```js
const atmosphereMat = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
});
```

## 🦠 Bug Fix: Shader Normal

<img height="148px" src="https://user-images.githubusercontent.com/59930625/197463795-1eb5f2ad-69eb-4464-a0d9-f57879ebd4d7.png">

- Problem: Backside is way more lit. Uneven coloring from fragment shader.
- Solution: **The vertexNormal should be _normalized_.**
- Background:
  - The attributes passed through three.js need to make sure they are translated correctly onto a 2D screen from a 3D space.
  - We need to make sure our normals are pointing in the right direction _within our 2D screen_ even though they're being passed from a 3D world.

_vertex.glsl + atmosphereVertex.glsl_

change

```
vertexNormal =  normal;
```

to

```
vertexNormal = normalize(normalMatrix * normal);
```
