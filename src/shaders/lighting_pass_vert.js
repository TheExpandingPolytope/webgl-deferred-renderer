var lighting_pass_vert = `
    layout(location = 0)in vec3 pos;
    layout(location = 1)in vec3 normal;

    out frag_pos;
    out vec2 tex_coords;
    out vec3 norm;

    void main(){
        gl_Position = vec4(pos, 1.0);

        frag_pos = pos;
        tex_coords = pos;
        norm = normal;
    }
`;

export {lighting_pass_vert};