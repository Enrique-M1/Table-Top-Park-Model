/* Programmer/Modified by: Enrique Martinez
    Date: 11/18/24
    
    Description: Project 4, part 1. 
    Bench with cushions
*/

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
    // Draw Legs
    // Front right leg
    // 0 - 3 = Base of leg
    vec4(5, 0, 2, 1), // 0
    vec4(4, 0, 2, 1), // 1
    vec4(4, 0, 1, 1), // 2
    vec4(5, 0, 1, 1), // 3
    // 4 - 7 = back of leg
    vec4(5, 0, 2, 1), // 4
    vec4(5, 3, 2, 1), // 5
    vec4(4, 3, 2, 1), // 6
    vec4(4, 0, 2, 1), // 7
    // 8 - 11 = left side of leg
    vec4(4, 0, 2, 1), // 8
    vec4(4, 3, 2, 1), // 9
    vec4(4, 3, 1, 1), // 10
    vec4(4, 0, 1, 1), // 11
    // 12 - 15 = front of leg
    vec4(4, 0, 1, 1), // 12
    vec4(4, 3, 1, 1), // 13
    vec4(5, 3, 1, 1), // 14
    vec4(5, 0, 1, 1), // 15
    // 16 - 19 = right side of leg
    vec4(5, 0, 2, 1), // 16
    vec4(5, 3, 2, 1), // 17
    vec4(5, 3, 1, 1), // 18
    vec4(5, 0, 1, 1), // 19

    // Back Right Leg
    // 20 - 23 =  bottom of leg
    vec4(5, 0, -2, 1), // 20
    vec4(4, 0, -2, 1), // 21
    vec4(4, 0, -1, 1), // 22
    vec4(5, 0, -1, 1), // 23
    // 24 - 27 = back of leg
    vec4(5, 0, -2, 1), // 24
    vec4(5, 3, -2, 1), // 25
    vec4(4, 3, -2, 1), // 26
    vec4(4, 0, -2, 1), // 27
    // 28 - 31 = left side of leg
    vec4(4, 0, -2, 1), // 28
    vec4(4, 3, -2, 1), // 29
    vec4(4, 3, -1, 1), // 30
    vec4(4, 0, -1, 1), // 31
    // 32 - 35 = front of leg
    vec4(4, 0, -1, 1), // 32
    vec4(4, 3, -1, 1), // 33
    vec4(5, 3, -1, 1), // 34
    vec4(5, 0, -1, 1), // 35
    // 36 - 39 = right side of leg
    vec4(5, 0, -2, 1), // 36
    vec4(5, 3, -2, 1), // 37
    vec4(5, 3, -1, 1), // 38
    vec4(5, 0, -1, 1), // 39

    // Back Left Leg
    // 40 - 43 =  bottom of leg
    vec4(-5, 0, -2, 1), // 40
    vec4(-4, 0, -2, 1), // 41
    vec4(-4, 0, -1, 1), // 42
    vec4(-5, 0, -1, 1), // 43
    // 44 - 47 = back of leg
    vec4(-5, 0, -2, 1), // 44
    vec4(-5, 3, -2, 1), // 45
    vec4(-4, 3, -2, 1), // 46
    vec4(-4, 0, -2, 1), // 47
    // 48 - 51 = left side of leg
    vec4(-4, 0, -2, 1), // 48
    vec4(-4, 3, -2, 1), // 49
    vec4(-4, 3, -1, 1), // 50
    vec4(-4, 0, -1, 1), // 51
    // 52 - 55 = front of leg
    vec4(-4, 0, -1, 1), // 52
    vec4(-4, 3, -1, 1), // 53
    vec4(-5, 3, -1, 1), // 54
    vec4(-5, 0, -1, 1), // 55
    // 56 - 59 = right side of leg
    vec4(-5, 0, -2, 1), // 56
    vec4(-5, 3, -2, 1), // 57
    vec4(-5, 3, -1, 1), // 58
    vec4(-5, 0, -1, 1), // 59

    // Back Left Leg
    // 60 - 63 =  bottom of leg
    vec4(-5, 0, 2, 1), // 60
    vec4(-4, 0, 2, 1), // 61
    vec4(-4, 0, 1, 1), // 62
    vec4(-5, 0, 1, 1), // 63
    // 64 - 67 = back of leg
    vec4(-5, 0, 2, 1), // 64
    vec4(-5, 3, 2, 1), // 65
    vec4(-4, 3, 2, 1), // 66
    vec4(-4, 0, 2, 1), // 67
    // 68 - 71 = left side of leg
    vec4(-4, 0, 2, 1), // 68
    vec4(-4, 3, 2, 1), // 69
    vec4(-4, 3, 1, 1), // 70
    vec4(-4, 0, 1, 1), // 71
    // 72 - 75 = front of leg
    vec4(-4, 0, 1, 1), // 72
    vec4(-4, 3, 1, 1), // 73
    vec4(-5, 3, 1, 1), // 74
    vec4(-5, 0, 1, 1), // 75
    // 76 - 79 = right side of leg
    vec4(-5, 0, 2, 1), // 76
    vec4(-5, 3, 2, 1), // 77
    vec4(-5, 3, 1, 1), // 78
    vec4(-5, 0, 1, 1), // 79

    // Seat
    // 80 - 83 = Bottom of Seat
    vec4(5, 2, 2, 1), // 80
    vec4(5, 2, -2, 1), // 81
    vec4(-5, 2, -2, 1), // 82
    vec4(-5, 2, 2, 1), // 83
    // 84 - 87 = back of the seat
    vec4(5, 2, 2, 1), // 84
    vec4(5, 3, 2, 1), // 85
    vec4(-5, 3, 2, 1), // 86
    vec4(-5, 2, 2, 1), // 87
    // 88 - 91 = left side of the seat
    vec4(-5, 2, 2, 1), // 88
    vec4(-5, 3, 2, 1), // 89
    vec4(-5, 3, -2, 1), // 90
    vec4(-5, 2, -2, 1), // 91
    // 92 - 95 = front side of the seat
    vec4(-5, 2, -2, 1), // 92
    vec4(-5, 3, -2, 1), // 93
    vec4(5, 3, -2, 1), // 94
    vec4(5, 2, -2, 1), // 95
    // 96 - 99 = right side of the seat
    vec4(5, 2, 2, 1), // 96
    vec4(5, 3, 2, 1), // 97
    vec4(5, 3, -2, 1), // 98
    vec4(5, 2, -2, 1), // 99
    // 100 - 103 = top of seat
    vec4(5, 3, 2, 1), // 100
    vec4(-5, 3, 2, 1), // 101
    vec4(-5, 3, -2, 1), // 102
    vec4(5, 3, -2, 1), // 103

    // Cushions of the Seat
    // 104 - 107 = Bottom of Right Cushion
    vec4(4, 3, 1.75, 1), // 104
    vec4(4, 3, -1.75, 1), // 105
    vec4(1, 3, -1.75, 1), // 106
    vec4(1, 3, 1.75, 1), // 107
    // 108 - 111 = Front of Right Cushion
    vec4(4, 3, 1.75, 1), // 108
    vec4(4, 3.2, 1.75, 1), // 109
    vec4(1, 3.2, 1.75, 1), // 110
    vec4(1, 3, 1.75, 1), // 111
    // 112 - 115 = Right of Right Cushion
    vec4(4, 3, 1.75, 1), // 112
    vec4(4, 3, -1.75, 1), //113
    vec4(4, 3.2, -1.75, 1), // 114
    vec4(4, 3.2, 1.75, 1), // 115
    // 116 - 119 = Back of Right Cushion
    vec4(4, 3, -1.75, 1), // 116
    vec4(1, 3, -1.75, 1), // 117
    vec4(1, 3.2, -1.75, 1), // 118
    vec4(4, 3.2, -1.75, 1), // 119
    // 120 - 123 = Left of Right Cushion
    vec4(1, 3, -1.75, 1), // 120
    vec4(1, 3, 1.75, 1), // 121
    vec4(1, 3.2, 1.75, 1), // 122
    vec4(1, 3.2, -1.75, 1), // 123
    // 124 - 127 = Top of Right Cushion
    vec4(4, 3.2, 1.75, 1), // 124
    vec4(4, 3.2, -1.75, 1), // 125
    vec4(1, 3.2, -1.75, 1), // 126
    vec4(1, 3.2, 1.75, 1), // 127
    // 108 - 111 = Bottom of Left Cushion
    vec4(-4, 3, 1.75, 1), // 128
    vec4(-4, 3, -1.75, 1), // 129
    vec4(-1, 3, -1.75, 1), // 130
    vec4(-1, 3, 1.75, 1), // 131
    // 132 - 135 = Front of Left Cushion
    vec4(-4, 3, 1.75, 1), // 132
    vec4(-4, 3.2, 1.75, 1), // 133
    vec4(-1, 3.2, 1.75, 1), // 134
    vec4(-1, 3, 1.75, 1), // 135
    // 136 - 139 = Right of Left Cushion
    vec4(-1, 3, 1.75, 1), // 136
    vec4(-1, 3, -1.75, 1), //137
    vec4(-1, 3.2, -1.75, 1), // 138
    vec4(-1, 3.2, 1.75, 1), // 139
    // 140 - 143 = Back of Left Cushion
    vec4(-4, 3, -1.75, 1), // 140
    vec4(-1, 3, -1.75, 1), // 141
    vec4(-1, 3.2, -1.75, 1), // 142
    vec4(-4, 3.2, -1.75, 1), // 143
    // 144 - 147 = Left of Left Cushion
    vec4(-4, 3, -1.75, 1), // 144
    vec4(-4, 3, 1.75, 1), // 145
    vec4(-4, 3.2, 1.75, 1), // 146
    vec4(-4, 3.2, -1.75, 1), // 147
    // 148 - 151 = Top of Left Cushion
    vec4(-4, 3.2, 1.75, 1), // 148
    vec4(-4, 3.2, -1.75, 1), // 149
    vec4(-1, 3.2, -1.75, 1), // 150
    vec4(-1, 3.2, 1.75, 1), // 151    

];

// define the colors (Only 2 needed for the bench and cushions)
var colors = [
    vec4(0, .2, .13, 1), // Dark Green
    vec4(1, .917, 0, 1) // Bright Yellow
];

// define the faces
function DrawBench()
{   
    // Legs
    // Draw front right leg of bench
    quad(0, 1, 2, 3, 0);
    quad(4, 5, 6, 7, 0);
    quad(8, 9, 10, 11, 0);
    quad(12, 13, 14, 15, 0);
    quad(16, 17, 18, 19, 0);

    // Draw back right leg
    quad(20, 21, 22, 23, 0);
    quad(24, 25, 26, 27, 0);
    quad(28, 29, 30, 31, 0);
    quad(32, 33, 34, 35, 0);
    quad(36, 37, 38, 39, 0);

    // Draw back left leg
    quad(40, 41, 42, 43, 0);
    quad(44, 45, 46, 47, 0);
    quad(48, 49, 50, 51, 0);
    quad(52, 53, 54, 55, 0);
    quad(56, 57, 58, 59, 0);

    // Draw front left leg
    quad(60, 61, 62, 63, 0);
    quad(64, 65, 66, 67, 0);
    quad(68, 69, 70, 71, 0);
    quad(72, 73, 74, 75, 0);
    quad(76, 77, 78, 79, 0);

    // Draw Seat
    quad(80, 81, 82, 83, 0);
    quad(84, 85, 86, 87, 0);
    quad(88, 89, 90, 91, 0);
    quad(92, 93, 94, 95, 0);
    quad(96, 97, 98, 99, 0);
    quad(100, 101, 102, 103, 0);

    // Cushions
    // Right
    quad(104, 105, 106, 107, 1);
    quad(108, 109, 110, 111, 1);
    quad(112, 113, 114, 115, 1);
    quad(116, 117, 118, 119, 1);
    quad(120, 121, 122, 123, 1);
    quad(124, 125, 126, 127, 1);
    
    // Left
    quad(128, 129, 130, 131, 1);
    quad(132, 133, 134, 135, 1);
    quad(136, 137, 138, 139, 1);
    quad(140, 141, 142, 143, 1);
    quad(144, 145, 146, 147, 1);
    quad(148, 149, 150, 151, 1);

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
    
    DrawBench();
    
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
