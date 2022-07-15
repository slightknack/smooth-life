#version 140

in vec2 coords;
out vec4 color;

uniform sampler2D u_previous;
uniform vec2 u_resolution;
uniform float u_time;

#define PIXEL (1.0 / u_resolution)

float is_alive(vec2 st) {
    st = mod(st, 1.0);
    return texture(u_previous, st, 0.).r;
}

float count_neighbors(vec2 st) {
    float alive = 0 - is_alive(st);

    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec2 stn = vec2(st.x + PIXEL.x * i, st.y + PIXEL.y * j);
            alive += is_alive(stn);
        }
    }

    return alive;
}

float cont_and(float x, float y) {
    return x * y;
}

float cont_or(float x, float y) {
    return x - x * y + y;
}

float step_gol(vec2 st) {
    float neighbors = count_neighbors(st);

    float three = min(smoothstep(2, 3, neighbors), smoothstep(4, 3, neighbors));
    float two = min(smoothstep(1, 2, neighbors), smoothstep(3, 2, neighbors));

    return cont_or(three, cont_and(is_alive(st), two));
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
        vec2(12.9898,78.233)))*43758.5453123);
}

void main() {
    if (u_time < 0.5) {
        color = vec4(vec3(random(coords)), 1.);
        return;
    }

    float w = 0.98;

    float update = step_gol(coords);
    float old = is_alive(coords);
    float new = old * (1-w) + update * w;
    // float new = update;

    // new = old * 0.6 + update * 0.4;

    // if (abs(w - 0.5) < 0.05) {
    //     color = vec4(vec3(old > 0.5), 1.);
    //     return;
    // }

    color = vec4(vec3(new), 1.);
}