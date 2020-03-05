const OBJMTLLoader = require('obj-mtl-loader');
const objMtlLoader = new OBJMTLLoader();

const objPath = 'assets/sponza/sponza.obj';
const mtlPath = 'assets/sponza/sponza.mtl';

const canvas = document.body.querySelector('canvas');
const gl = canvas.getContext('webgl2');
if(!gl){
    alert("Trouble loading WebGL 2.0. Try using a better browser.")
}

objMtlLoader.load(objPath, mtlPath, function(error, result){
    if(error) {
        console.log(error);
        return;
    }

    //create render targets
    var gBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(1, gBuffer);

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


    console.log(result);
})