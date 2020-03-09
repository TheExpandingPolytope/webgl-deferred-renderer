Math.clamp=function(min,val,max){ return Math.min(Math.max(min, val), max)};

class perspective_camera {
    constructor(fovy, aspect, near, far){
        //set perspective parameters
        this.fovy = fovy;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        //set perspective matrix
        this.perspective_matrix = mat4.create();
        mat4.perspective(this.perspective_matrix, this.fovy, this.aspect, this.near, this.far);

        //set eye
        this.eye =vec3.fromValues(0, 0, 1);
        //set target
        this.target =vec3.fromValues(0, 0, 0);
        //set up vector
        this.up =vec3.fromValues(0, 1, 0);
        //set view matrix
        this.view_matrix = mat4.create();
        mat4.lookAt(this.view_matrix, this.eye, this.target, this.up );
    }
    set_perspective_uniform(gl, location){
        gl.uniformMatrix4fv(location, false, this.perspective_matrix);
    }
    set_view_uniform(gl, location){
        gl.uniformMatrix4fv(location, false, this.view_matrix);
    }
    set_orbit_controls(gl, max, min){
        //initialize control variables
        this.mousedown = false;
        this.temp_mouse_x = 0;
        this.temp_mouse_y = 0;
        this.distance = 7*Math.sqrt((max[0]*max[0])+(max[1]*max[1])+(max[2]*max[2]));
        console.log(this.distance);

        //set camera far to twice the distance
        mat4.perspective(this.perspective_matrix, this.fovy, this.aspect, this.near, this.distance*10);
        this.angle1 = 0;
        this.angle2 = 0;
        this.gain = 10;
        this.eye =vec3.fromValues(this.distance, 0, 0);
        this.target = vec3.fromValues((max[0]+min[0])/2,(max[1]+min[1])/2,(max[2]+min[2])/2);
        //this.eye = vec3.fromValues(1, 0, 0);
        //this.target = vec3.fromValues(0, 0, 0);

        //compute view matrix
        mat4.lookAt(this.view_matrix, this.eye, this.target, this.up );
        

        //set listeners
        gl.canvas.addEventListener('mousedown', (event)=>{
            //set mouse down to true
            this.mousedown = true;
            //record position of mouse
            this.temp_mouse_x = event.clientX;
            this.temp_mouse_y = event.clientY;
            this.temp_angle_1 = this.angle1;
            this.temp_angle_2 = this.angle2;
        });

        gl.canvas.addEventListener('mouseup',(event)=>{
            this.mousedown = false;
        });

        gl.canvas.addEventListener('mousemove', (event)=>{
            if(this.mousedown){
                //set mouse coordinates
                var mouse_x = event.clientX,
                mouse_y = event.clientY;
                //set angles
                var dx = this.gain * (mouse_x - this.temp_mouse_x)/window.innerWidth,
                dy = this.gain * (mouse_y - this.temp_mouse_y)/window.innerHeight;
                this.angle1 = this.temp_angle_1 + dx;
                this.angle2 = Math.clamp( -Math.PI/2,this.temp_angle_2 + dy, Math.PI/2);
                //compute eye
                var t = this.distance * Math.cos(this.angle2),
                y = this.distance * Math.sin(this.angle2) + this.target[1],
                x = t * Math.cos(this.angle1) + this.target[0],
                z = t * Math.sin(this.angle1) + this.target[2];
                this.eye =vec3.fromValues(x, y, z);
                //compute view matrix
                mat4.lookAt(this.view_matrix, this.eye, this.target, this.up );
            }
        });
        gl.canvas.addEventListener('wheel', (event) =>{
            event.preventDefault();
            //caltulate mouse scroll
            var delta = vec3.dist(this.eye, this.target)*.1;
            if (event.deltaY < 0) {
                this.distance -= delta;
              }
              if (event.deltaY > 0) {
                this.distance += delta;
              }
              //compute eye
              var t = this.distance * Math.cos(this.angle2),
              y = this.distance * Math.sin(this.angle2) + this.target[1],
              x = t * Math.cos(this.angle1) + this.target[0],
              z = t * Math.sin(this.angle1) + this.target[2];
              this.eye =vec3.fromValues(x, y, z);
              //compute view matrix
              mat4.lookAt(this.view_matrix, this.eye, this.target, this.up );
        });

        gl.canvas.addEventListener('contextmenu', (event)=>{
            event.preventDefault();
        });
    }
}

export { perspective_camera };