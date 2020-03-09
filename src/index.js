const OBJMTLLoader = require('obj-mtl-loader');
const objMtlLoader = new OBJMTLLoader();

const objPath = 'assets/sponza/sponza.obj';
const mtlPath = 'assets/sponza/sponza.mtl';

import {g_buffer_pass_frag} from './shaders/g_buffer_pass_frag';
import {g_buffer_pass_vert} from './shaders/g_buffer_pass_vert';
import {lighting_pass_frag} from './shaders/lighting_pass_frag';

const canvas = document.body.querySelector('canvas');
const gl = canvas.getContext('webgl2');
if(!gl){
    alert("Trouble loading WebGL 2.0. Try using a better browser.")
}


var g_vertex_shader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(g_vertex_shader, g_buffer_pass_vert);
gl.compileShader(g_vertex_shader);


var g_fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(gl_fragment_shader, g_buffer_pass_frag);
gl.compileShader(g_fragment_shader);

var g_program = gl.createProgram();
gl.attachShader(g_program, g_vertex_shader);
gl.attachShader(g_program, g_buffer_pass_frag);
gl.linkProgram(g_program);

var l_vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(l_vs, lighting_pass_vert);
gl.compileShader(l_vs);

var l_fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(l_fs, lighting_pass_frag);
gl.compileShader(l_fs);

var l_program = gl.createProgram();
gl.attachShader(l_program, l_fs);
gl.attachShader(l_program, l_vs);
gl.linkProgram(l_program);


objMtlLoader.load(objPath, mtlPath, function(error, result){
    if(error) {
        console.log(error);
        return;
    }

    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new ArrayBuffer(result.vertices), gl.STATIC_DRAW);

    var normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, norm)
    //create render targets
    var gBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, gBuffer);

    var gPosition = gl.createTexture(),
        gNormal = gl.createTexture(), 
        gColor = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, gPosition);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, gl.canvas.height, gl.canvas.width, 0, gl.RGB, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, gPosition, 0);

    gl.bindTexture(gl.TEXTURE_2D, gNormal);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, gl.canvas.height, gl.canvas.width, 0, gl.RGB, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, gNormal, 0);

    gl.bindTexture(gl.TEXTURE_2D, gColor);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, gl.canvas.height, gl.canvas.width, 0, gl.RGB, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, gColor, 0);

    gl.drawBuffers(3, [gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);

    gl.bindFramebuffer(gl.FRAMEBUFFER, 0);


    //init diffuse texture
    var diffuse_texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, diffuse_texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, gl.canvas.height, gl.canvas.width, 0, gl.RGB, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    function render(){

        //render to g buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, gBuffer);
        gl.useProgram(g_program);
        gl.drawElements();
        gl.bindFramebuffer(gl.FRAMEBUFFER, 0);

        //render final lighting pass
        gl.useProgram(l_program);
        gl.drawElements();

        requestAnimationFrame(render);
    }

    render();
    console.log(result);
})