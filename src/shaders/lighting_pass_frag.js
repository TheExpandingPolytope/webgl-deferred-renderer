var lighting_pass_frag = `
    out vec4 col;

    in vec2 tex_coords;

    uniform sampler2D g_pos;
    uniform sampler2D g_norm;
    uniform sampler2D g_col;

    struct Light {
        vec3 pos;
        vec3 col;
    };

    uniform Light lights[10];

    uniform vec3 view;
    
    void main()
    {
        vec3 position = texture(g_pos, tex_coords);
        vec3 normal = texture(g_norm, tex_coords);
        vec3 color = texture(g_col, tex_coords);

        vec3 view_dir = normalize(pos - view);
        vec3 lighting = color * 0.1;
        for(int i = 0; i < 10; i++){
            vec3 light_dir = normalize(lights[i].pos - position);
            vec3 diffuse = max(dot(normal, light_dir), 0.0) * color * lights[i].col;
            lighting += diffuse;
        }

        col = vec4(lighting, 1.0);
    }
`;

export {lighting_pass_frag};