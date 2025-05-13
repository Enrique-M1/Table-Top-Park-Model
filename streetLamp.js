/* Programmer/Modified by: Enrique Martinez
    Date: 11/18/24
    
    Description: Project 4, part 1. 
    3D Street Lamp
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
        // Base of the street lamp (COMPLETE)
        // 0 - 3 = back of base
        vec4(2, 0, 2, 1), // 0
        vec4(-2, 0, 2, 1), // 1
        vec4(-2, 1, 2, 1), // 2
        vec4(2, 1, 2, 1), // 3
        // 4 - 7 = left side of base
        vec4(-2, 0, 2, 1), // 4
        vec4(-2, 1, 2, 1), // 5
        vec4(-2, 1, -2, 1), // 6
        vec4(-2, 0, -2, 1), // 7
        // 8 - 11 = front of base
        vec4(-2, 0, -2, 1), // 8
        vec4(-2, 1, -2, 1), // 9
        vec4(2, 1, -2, 1), // 10
        vec4(2, 0, -2, 1), // 11
        // 12 - 15 = right side of base
        vec4(2, 0, -2, 1), // 12
        vec4(2, 1, -2, 1), // 13
        vec4(2, 1, 2, 1), // 14
        vec4(2, 0, 2, 1), // 15
        // 16 - 19 = top of base (the stand wont sit perfecly on the base so we need to fill in the gaps)
        vec4(2, 1, 2, 1), // 16
        vec4(-2, 1, 2, 1), // 17
        vec4(-2, 1, -2, 1), // 18
        vec4(2, 1, -2, 1), // 19

        // Stand of the lamp (Long cube for now. May change to a cylinder closer to the due date)
        // 20 - 23 =  bottom of the middle portion
        vec4(1.15, 1, 1.15, 1), // 20
        vec4(-1.15, 1, 1.15, 1), // 21
        vec4(-1.15, 1, -1.15, 1), // 22
        vec4(1.15, 1, -1.15, 1), // 23
        // 24 - 27 = back of the middle portion
        vec4(1.15, 1, 1.15, 1), // 24
        vec4(1.15, 20, 1.15, 1), // 25
        vec4(-1.15, 20, 1.15, 1), // 26
        vec4(-1.15, 1, 1.15, 1), //27
        // 28 - 31 = left side of the middle portion
        vec4(-1.15, 1, 1.15, 1), // 28
        vec4(-1.15, 20, 1.15, 1), // 29
        vec4(-1.15, 20, -1.15, 1), // 30
        vec4(-1.15, 1, -1.15, 1), // 31
        // 32 - 35 = front of the middle portion
        vec4(-1.15, 1, -1.15, 1), // 32
        vec4(-1.15, 20, -1.15, 1), // 33
        vec4(1.15, 20, -1.15, 1), // 34
        vec4(1.15, 1, -1.15, 1), //35
        // 36 - 39 = right side of the middle portion
        vec4(1.15, 1, -1.15, 1), // 36
        vec4(1.15, 20, -1.15, 1), // 37
        vec4(1.15, 20, 1.15, 1), // 38
        vec4(1.15, 1, 1.15, 1), // 39

        // Draw the Light Portion
        // 40 - 43 = Back light on the top of the middle portion
        vec4(1.15, 20, 1.15, 1), // 40
        vec4(1.15, 24, 1.15, 1), // 41
        vec4(-1.15, 24, 1.15, 1), // 42
        vec4(-1.15, 20, 1.15, 1), // 43
        // 44 - 47 = Left Light
        vec4(-1.15, 20, 1.15, 1), // 44
        vec4(-1.15, 24, 1.15, 1), // 45
        vec4(-1.15, 24, -1.15, 1), // 46
        vec4(-1.15, 20, -1.15, 1), // 47
        // 48 - 51 = Front Light
        vec4(-1.15, 20, -1.15, 1), // 48
        vec4(-1.15, 24, -1.15, 1), // 49
        vec4(1.15, 24, -1.15, 1), // 50
        vec4(1.15, 20, -1.15, 1), // 51
        // 52 - 55 = Right Light
        vec4(1.15, 20, -1.15, 1), // 52
        vec4(1.15, 24, -1.15, 1), // 53
        vec4(1.15, 24, 1.15, 1), // 54
        vec4(1.15, 20, 1.15, 1), // 55

        // Draw the top of the Lamp
        // 56 - 59 = bottom of the top (dont want gaps underneath the topper)
        vec4(2, 24, 2, 1), // 56
        vec4(-2, 24, 2, 1), // 57
        vec4(-2, 24, -2, 1), // 58
        vec4(2, 24, -2, 1), // 59
        // 60 - 62 = back of the topper (triangles for these)
        vec4(0, 26, 0, 1), // 60
        vec4(2, 24, 2, 1), // 61
        vec4(-2, 24, 2, 1), // 62
        // 63 - 65 = left side of topper
        vec4(0, 26, 0, 1), // 63
        vec4(-2, 24, 2, 1), // 64
        vec4(-2, 24, -2, 1), // 65
        // 66 - 68 = front of topper
        vec4(0, 26, 0, 1), // 66
        vec4(-2, 24, -2, 1), // 67
        vec4(2, 24, -2, 1), // 68
        // 69 - 71 = right side of topper
        vec4(0, 26, 0, 1), // 69
        vec4(2, 24, 2, 1), // 70
        vec4(2, 24, -2, 1), // 71

      
    ];
    
    // define the colors (Only 2 needed for the street lamp)
    var colors = [
        vec4(.2314, .2314, .2196, 1), // Lamp (Dark Grey)
        vec4(1, .749, 0, 1) // Light Glass. (Amber)
    ];
    
    // define the faces
    function DrawMesh()
    {
        // Draw the base of the lamp (use the index of the vertices to do this)
        quad(0, 1, 2, 3, 0);
        quad(4, 5, 6, 7, 0);
        quad(8, 9, 10, 11, 0);
        quad(12, 13, 14, 15, 0);
        quad(16, 17, 18, 19, 0);

        // Draw the middle portion
        quad(20, 21, 22, 23, 0);
        quad(24, 25, 26, 27, 0);
        quad(28, 29, 30, 31, 0);
        quad(32, 33, 34, 35, 0);
        quad(36, 37, 38, 39, 0);

        // Draw the light part
        quad(40, 41, 42, 43, 1);
        quad(44, 45, 46, 47, 1);
        quad(48, 49, 50, 51, 1);
        quad(52, 53, 54, 55, 1);

        // Draw Topper
        quad(56, 57, 58, 59, 0);
        triangle(60, 61, 62, 0);
        triangle(63, 64, 65, 0);
        triangle(66, 67, 68, 0);
        triangle(69, 70, 71, 0);

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
    