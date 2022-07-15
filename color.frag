#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_previous;
uniform sampler2D u_texture_0;
uniform vec2 u_resolution;
uniform float u_time;

#define PIXEL (1.0 / u_resolution)

float is_alive(vec2 st) {
    st = mod(st, 1.0);
    return texture(u_texture_0, st, 0.).r;
}

vec3 old_color(vec2 st) {
    st = mod(st, 1.0);
    return texture(u_previous, st, 0.).rgb;
}

vec2 vert(vec2 st) {
    float p00 = is_alive(st - vec2(0, 0));
    float p10 = is_alive(st - vec2(PIXEL.x, 0));
    float p01 = is_alive(st - vec2(0, PIXEL.y));
    float p11 = is_alive(st - vec2(PIXEL.x, PIXEL.y));

    float bright_x0 = max(p00, p01);
    float bright_x1 = max(p10, p11);
    float bright_y0 = max(p00, p10);
    float bright_y1 = max(p01, p11);

    float diff_x = abs(bright_x0 - bright_x1);
    float diff_y = abs(bright_y0 - bright_y1);
    return vec2(diff_x, diff_y);
}

void main() {
    // vec3 color_x = vec3(1.000,0.235,0.458) * 1.0;
    // vec3 color_y = vec3(0.248,1.000,0.586) * 1.0;
    vec3 color_x = vec3(1.) * 1.0;
    vec3 color_y = vec3(0.) * 1.0;
    vec2 r = vert(coords);
    vec3 color_new = color_x * r.x + color_y * r.y;
    vec3 color_old = old_color(coords);
    vec3 color_mix = 0.95 * color_old + 0.05 * color_new;

    if (u_time < 0.5) {
        color = vec4(color_new, 1.);
        return;
    }

    color = vec4(color_mix, 1.);
}