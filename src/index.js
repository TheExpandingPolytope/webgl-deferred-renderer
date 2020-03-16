const OBJ = require('webgl-obj-loader');

const objPath = 'assets/sponza/sponza.obj';
const mtlPath = 'assets/sponza/sponza.mtl';

import {g_buffer_pass_frag} from './shaders/g_buffer_pass_frag';
import {g_buffer_pass_vert} from './shaders/g_buffer_pass_vert';
import {lighting_pass_frag} from './shaders/lighting_pass_frag';
import {lighting_pass_vert} from './shaders/lighting_pass_vert';

const canvas = document.body.querySelector('canvas');
const gl = canvas.getContext('webgl2');
if(!gl){
    alert("Trouble loading WebGL 2.0. Try using a better browser.")
}


var g_vertex_shader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(g_vertex_shader, g_buffer_pass_vert);
gl.compileShader(g_vertex_shader);


var g_fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(g_fragment_shader, g_buffer_pass_frag);
gl.compileShader(g_fragment_shader);

var g_program = gl.createProgram();
gl.attachShader(g_program, g_vertex_shader);
gl.attachShader(g_program, g_fragment_shader);
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

gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);

OBJ.downloadModels([{obj:objPath,mtl:mtlPath,downloadMtlTextures:true}])
.then((meshes)=>{
    for(var mesh in meshes){
        var meshVal = meshes[mesh];
        console.log(meshVal);
    
    //set model buffer data
    var g_vao = gl.createVertexArray();
    gl.bindVertexArray(g_vao);
    
    OBJ.initMeshBuffers(gl, meshVal);

    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, meshVal.vertexBuffer);
    gl.vertexAttribPointer(0, meshVal.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(1);
    gl.bindBuffer(gl.ARRAY_BUFFER, meshVal.normalBuffer);
    gl.vertexAttribPointer(1, meshVal.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(2);
    gl.bindBuffer(gl.ARRAY_BUFFER, meshVal.textureBuffer);
    gl.vertexAttribPointer(2, meshVal.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshVal.indexBuffer);
    
    gl.bindVertexArray(0);


    //set quad buffer data
    var vertices = [
        -0.5,0.5,0.0,
        -0.5,-0.5,0.0,
        0.5,-0.5,0.0,
        0.5,0.5,0.0 
    ];
     
    var indices = [3,2,1,3,1,0]; 

    

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
        gl.bindVertexArray(g_vao);
        gl.drawElements(gl.TRIANGLES, model.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, 0);

        //render final lighting pass
        gl.useProgram(l_program);
        gl.drawElements();

        requestAnimationFrame(render);
    }

    render();
    console.log(result);
    }
})