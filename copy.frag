#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_texture_0;
uniform vec2 u_resolution;

#define PIXEL (1.0 / u_resolution)

void main() {
    color = texture(u_texture_0, floor(coords * 64) / 64 - vec2(1./128.), 0.);
}