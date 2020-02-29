const OBJMTLLoader = require('obj-mtl-loader');
const objMtlLoader = new OBJMTLLoader();

const objPath = 'assets/sponza/sponza.obj';
const mtlPath = 'assets/sponza/sponza.mtl';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

objMtlLoader.load(objPath, mtlPath, function(error, result){
    if(error) {
        console.log(error);
        return;
    }

    console.log(result);
})