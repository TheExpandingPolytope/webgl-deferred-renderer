var g_buffer_pass_frag = `
    layout(location = 0) out vec3 g_pos;
    layout(location = 1) out vec3 g_norm;
    layout(location = 2) out vec3 g_col;

    in vec2 tex_coords;
    in vec3 frag_pos;
    in vec3 norm;

    
`