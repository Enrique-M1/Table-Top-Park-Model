/* Programmer/Modified by: Shang Chen 
    Date: 11/14/24
    
    Description: Project 4, part 1. 
    3D Race Car Mesh example*/

var canvas;
var gl;
var image;
var program;

var eye ;
var near = -30;
var far = 30;
//var dr = 5.0 * Math.PI/180.0;

var left = -2.0;
var right = 2.0;
var ytop = 2.0;
var bottom = -2.0;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var modelView, projection;
var viewerPos;
var flag = true;

var pointsArray = [];
var colorsArray = [];

// define the vertices of the mesh
var vertices = [
    //0-15 defines the race car's right side face
    //2, 3, 0, 1 = right side trunk face
    //5, 6, 4, 2 = side face, top of rear wheel space
    //9, 8, 7, 5 = side face, main car chassis
    //11, 12, 10, 9 = side face, top of front wheel space
    //14, 15, 13, 11 = right side front face 
    vec4(4, 1.1, 2, 1), //0, very left/trunk edge of the race car
    vec4(4, 2, 2, 1), //1
    vec4(3.75, 2, 2, 1), //2
    vec4(3.75, 1.1, 2, 1), //3
    vec4(3.75, 1.85, 2, 1), //4
    vec4(3, 2, 2, 1), //5
    vec4(3, 1.85, 2, 1), //6
    vec4(3, 1.1, 2, 1), //7
    vec4(0, 1.1, 2, 1), //8
    vec4(0, 2, 2, 1), //9
    vec4(0, 1.85, 2, 1), //10
    vec4(-0.75, 2, 2, 1), //11
    vec4(-0.75, 1.85, 2, 1), //12
    vec4(-0.75, 1.1, 2, 1), //13
    vec4(-1.5, 2, 2, 1), //14
    vec4(-2.5, 1.1, 2, 1), //15

    //16-23 defines the right side alcove where the wheels are inserted
    //side wheel outer alcove points (4, 3, 7, 6)
    //front wheel alcove outside points (12, 13, 10, 8)

    //18, 19, 17, 16 = side wheel inner alcove
    //20, 21, 23, 22 = front wheel inner alcove
    //16, 17, 3, 4 / 6, 7, 19, 18 = side wheel inner side wall
    //20, 21, 13, 12 / 10, 8, 23, 22  = front wheel inner side wall
    vec4(3.75, 1.85, 1.25, 1), //16
    vec4(3.75, 1.1, 1.25, 1), //17
    vec4(3, 1.85, 1.25, 1), //18
    vec4(3, 1.1, 1.25, 1), //19
    vec4(-0.75, 1.85, 1.25, 1), //20
    vec4(-0.75, 1.1, 1.25, 1), //21
    vec4(0, 1.85, 1.25, 1), //22
    vec4(0, 1.1, 1.25, 1), //23

    //24-39 defines the race car's left side face, z-axis flip, same order of vertices to be passed in + 24, but set clockwise (like stack)
    //25, 24, 27, 26 = left side trunk face
    //26, 28, 30, 29 = side face, top of rear wheel space
    //29, 31, 32, 33 = side face, main car chassis
    //35, 36, 34, 33 = side face, top of front wheel space
    //38, 39, 37, 35 = left side front face 
    vec4(4, 1.1, -2, 1), //24, very left/trunk edge of the race car
    vec4(4, 2, -2, 1), //25
    vec4(3.75, 2, -2, 1), //26
    vec4(3.75, 1.1, -2, 1), //27
    vec4(3.75, 1.85, -2, 1), //28
    vec4(3, 2, -2, 1), //29
    vec4(3, 1.85, -2, 1), //30
    vec4(3, 1.1, -2, 1), //31
    vec4(0, 1.1, -2, 1), //32
    vec4(0, 2, -2, 1), //33
    vec4(0, 1.85, -2, 1), //34
    vec4(-0.75, 2, -2, 1), //35
    vec4(-0.75, 1.85, -2, 1), //36
    vec4(-0.75, 1.1, -2, 1), //37
    vec4(-1.5, 2, -2, 1), //38
    vec4(-2.5, 1.1, -2, 1), //39

    //40-47 defines the left side alcove where the wheels are inserted, z axis flip also
    //side wheel outer alcove points (28, 27, 31, 30)
    //front wheel alcove outside points (36, 37, 34, 32)

    //40, 41, 43, 42 = side wheel inner alcove
    //46, 47, 45, 44 = front wheel inner alcove
    //28, 27, 41, 40 / 42, 43, 31, 30 = side wheel inner side wall
    //36, 37, 45, 44/ 46, 47, 32, 34 = front wheel inner side wall
    vec4(3.75, 1.85, -1.25, 1), //40
    vec4(3.75, 1.1, -1.25, 1), //41
    vec4(3, 1.85, -1.25, 1), //42
    vec4(3, 1.1, -1.25, 1), //43
    vec4(-0.75, 1.85, -1.25, 1), //44
    vec4(-0.75, 1.1, -1.25, 1), //45
    vec4(0, 1.85, -1.25, 1), //46
    vec4(0, 1.1, -1.25, 1), //47

    
  
];

// define the colors
var colors = [
    vec4(1, 0, 0, 1),
    vec4(0, 1, 0, 1),
    vec4(0, 0, 1, 1),
    vec4(1, 0, 1, 1),
    vec4(0, 1, 1, 1),
    vec4(1, 1, 0, 1),
    vec4(1, 0.5, 0.5, 1),
    vec4(0.5, 1, 0.5, 1),
    vec4(0.5, 0.5, 1, 1),

];

// define the faces
function DrawMesh()
{
    //right side
    quad(2, 3, 0, 1, 0);
    quad(5, 6, 4, 2, 0);
    quad(9, 8, 7, 5, 0);
    quad(11, 12, 10, 9, 0);
    quad(14, 15, 13, 11, 0);
    quad(18, 19, 17, 16, 1);
    quad(16, 17, 3, 4, 1);
    quad(6, 7, 19, 18, 1);
    quad(20, 21, 23, 22, 1);
    quad(20, 21, 13, 12, 1);
    quad(10, 8, 23, 22, 1);

    //left side
    quad(25, 24, 27, 26, 0);
    quad(26, 28, 30, 29, 0);
    quad(29, 31, 32, 33, 0);
    quad(35, 36, 34, 33, 0);
    quad(38, 39, 37, 35, 0);
    quad(40, 41, 43, 42, 1);
    quad(46, 47, 45, 44, 1);
    quad(28, 27, 41, 40, 1);
    quad(42, 43, 31, 30, 1);
    quad(36, 37, 45, 44, 1);
    quad(46, 47, 32, 34, 1);

    //bottom part of the race car (back face, counter-clockwise as if front, beginning with left side vertices)
    quad(24, 27, 3, 0, 2);
    quad(41, 43, 19, 17, 2);
    quad(31, 32, 8, 7, 2);
    quad(45, 47, 23, 21, 2);
    quad(37, 39, 15, 13, 2);

    //Bumper and trunk
    quad(25, 24, 0, 1, 3);
    quad(38, 39, 15, 14, 3);
}

// define the quad function and other needed function, such as triangle
function quad(a, b, c, d, colorIndex) {
    pointsArray.push(vertices[a]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[b]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[c]);
    colorsArray.push(colors[colorIndex]);

    pointsArray.push(vertices[a]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[c]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[d]);
    colorsArray.push(colors[colorIndex]);

}

function triangle(a, b, c, colorIndex) {
    pointsArray.push(vertices[a]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[b]);
    colorsArray.push(colors[colorIndex]);
    pointsArray.push(vertices[c]);
    colorsArray.push(colors[colorIndex]);
}


// no need to change after this point
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 4,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.5, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    // !!
    // program needs to be global
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    DrawMesh();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);

	// color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );


    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
        render();
    });

    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });
    render();
}

function render() {

    // Specify the color for clearing <canvas>
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    //eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
    //    radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

	eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
                AllInfo.radius*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi));

    modelViewMatrix = lookAt(eye, at , up);
    //projectionMatrix = ortho(left, right, bottom, ytop, near, far);
	projectionMatrix = ortho(left*AllInfo.zoomFactor - AllInfo.translateX,
                              right*AllInfo.zoomFactor - AllInfo.translateX,
                              bottom*AllInfo.zoomFactor - AllInfo.translateY,
                              ytop*AllInfo.zoomFactor - AllInfo.translateY,
                              near, far);

    let s = scale4(.3, .3, .3);
    modelViewMatrix = mult(s, modelViewMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

	gl.drawArrays( gl.TRIANGLES, 0, colorsArray.length);

}

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
