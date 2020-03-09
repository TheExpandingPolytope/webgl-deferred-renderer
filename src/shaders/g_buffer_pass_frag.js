var g_buffer_pass_frag = `
    layout(location = 0) out vec3 g_pos;
    layout(location = 1) out vec3 g_norm;
    layout(location = 2) out vec3 g_col;

    in vec2 tex_coords;
    in vec3 frag_pos;
    in vec3 norm;

    uniform sampler2D diffuse;
    
    void main()
    {
        g_pos = frag_pos;

        g_norm = normalize(norm);

        g_col = texture(diffuse, tex_coords);
    }
`;
export  { g_buffer_pass_frag };