var g_buffer_pass_vert = `
    layout(location = 0) in vec3 pos;
    layout(location = 1) in vec3 normal;
    layout(location = 2) in vec2 tex_coord;

    uniform mat4 perspective;
    uniform mat4 view;

    out frag_pos;
    out vec2 tex_coords;
    out vec3 norm;

    void main(){
        gl_Position = vec4(pos, 1.0);

        frag_pos = pos;
        tex_coords = tex_coord;
        norm = normal;
    }
`;

export {g_buffer_pass_vert};