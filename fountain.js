// Enrique Martinez
// Original File: marbledChess.js

var canvas;
var gl;

var eye= [2, 2, 2];
var at = [0, 0, 0];
var up = [0, 1, 0];

var pointsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var N;
var vertices=[];

var lightPosition = vec4(2, 3, 2, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0.0, 0.0, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 50.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelView, projection;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 1;
var theta =[0, 0, 0];

var flag = true;

// texture coordinates
var texCoord = [
    vec2(0, .75),
    vec2(0, 0),
    vec2(.75, .75),
    vec2(.75, 0),
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // generate the points
    SurfaceRevPoints();

    // set up normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // set up point buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    // create the texture object
    texture = gl.createTexture();

    // create the image object
    texture.image = new Image();

    // register the event handler to be called on loading an image
    texture.image.onload = function() {  loadTexture(texture);}

    // Tell the broswer to load an image
    texture.image.src='marble.jpg';   // test with different marble textures images
    //texture.image.src='marble.jpg';

    //thetaLoc = gl.getUniformLocation(program, "theta");

    projection = ortho(-3, 3, -3, 3, -20, 20);

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};


    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),
       false, flatten(projection));

    render();
}

function loadTexture(texture)
{
     // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture );

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // set the texture unit 0 the sampler
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

//Pawn initial 2d line points for surface of revolution  (25 points)
var pawnPoints = [

   [0.41308594, 0.38769531, 0],   
   [0.32617188, 0.38769531, 0],
   [0.32617188, 0.35742188, 0],
   [0.34570312, 0.35742188, 0],
   [0.34570312, 0.2578125, 0],
   [0.34375, 0.26953125, 0],
   [0.34375, 0.27832031, 0],
   [0.34179688, 0.28320312, 0],
   [0.33984375, 0.28710938, 0],
   [0.3359375, 0.28808594, 0],
   [0.33300781, 0.28710938, 0],
   [0.33105469, 0.28417969, 0],
   [0.32910156, 0.28027344, 0],
   [0.32714844, 0.27636719, 0],
   [0.32617188, 0.26855469, 0],
   [0.32617188, 0.25976562, 0],
   [0.32226562, 0.26855469, 0],
   [0.31640625, 0.27148438, 0],
   [0.31445312, 0.27148438, 0],
   [0.30957031, 0.26855469, 0],
   [0.30664062, 0.26464844, 0],
   [0.30566406, 0.25976562, 0],
   [0.30175781, 0.25976562, 0],
   [0.29882812, 0.27636719, 0],
   [0.29492188, 0.28417969, 0],
   [0.29199219, 0.29101562, 0],
   [0.28710938, 0.29589844, 0],
   [0.28320312, 0.29882812, 0],
   [0.27636719, 0.29980469, 0],
   [0.27636719, 0.26367188, 0],
   [0.27050781, 0.27050781, 0],
   [0.26269531, 0.27050781, 0],
   [0.25683594, 0.26757812, 0],
   [0.25292969, 0.26464844, 0],
   [0.25097656, 0.2578125, 0],
   [0.41308594, 0.2578125, 0],
   /*
    [397/512, 423/512, 0.0],
    [397/512, 334/512, 0.0],
    [366/512, 334/512, 0.0],
    [366/512, 354/512, 0.0],
    [264/512, 354/512, 0.0],
    [276/512, 352/512, 0.0],
    [285/512, 352/512, 0.0],
    [290/512, 350/512, 0.0],
    [294/512, 348/512, 0.0],
    [295/512, 344/512, 0.0],
    [294/512, 341/512, 0.0],
    [291/512, 339/512, 0.0],
    [287/512, 337/512, 0.0],
    [283/512, 335/512, 0.0],
    [275/512, 334/512, 0.0],
    [266/512, 334/512, 0.0],
    [275/512, 330/512, 0.0],
    [278/512, 324/512, 0.0],
    [278/512, 322/512, 0.0],
    [275/512, 317/512, 0.0],
    [271/512, 314/512, 0.0],
    [266/512, 313/512, 0.0],
    [266/512, 309/512, 0.0],
    [283/512, 306/512, 0.0],
    [291/512, 302/512, 0.0],
    [298/512, 299/512, 0.0],
    [303/512, 294/512, 0.0],
    [306/512, 290/512, 0.0],
    [307/512, 283/512, 0.0],
    [270/512, 283/512, 0.0],
    [277/512, 277/512, 0.0],
    [277/512, 269/512, 0.0],
    [274/512, 263/512, 0.0],
    [271/512, 259/512, 0.0],
    [264/512, 257/512, 0.0],
    */
   
];


//Sets up the vertices array so the pawn can be drawn
function SurfaceRevPoints()
{
	//Setup initial points matrix
	for (var i = 0; i<36; i++)
	{
		vertices.push(vec4(pawnPoints[i][0], pawnPoints[i][1],
                                   pawnPoints[i][2], 1));
	}

	var r;
   var t=Math.PI/12;

   // sweep the original curve another "angle" degree
	for (var j = 0; j < 36; j++) {
   var angle = (j+1)*t;

   // for each sweeping step, generate 25 new points corresponding to the original points
	for(var i = 0; i < 36 ; i++ ) {
	   r = vertices[i][0];
      vertices.push(vec4(r*Math.cos(angle), vertices[i][1], -r*Math.sin(angle), 1));
		}
	}

   var N=36;
   // quad strips are formed slice by slice (not layer by layer)
   for (var i=0; i<24; i++) { // slices
      for (var j=0; j<24; j++) { // layers
		      quad(i*N+j, (i+1)*N+j, (i+1)*N+(j+1), i*N+(j+1));
      }
   }
}

function quad(a, b, c, d) {

     var indices=[a, b, c, d];
     var normal = Newell(indices);

     // triangle a-b-c
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     // triangle a-c-d
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);
}


function Newell(indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=i;
       nextIndex = (i+1)%L;

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}

function render()
{
   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

   if(flag) theta[axis] += 2.0;

   modelView = lookAt(eye, at, up);
   modelView = mult(modelView, rotate(theta[xAxis], [1, 0, 0] ));
   modelView = mult(modelView, rotate(theta[yAxis], [0, 1, 0] ));
   modelView = mult(modelView, rotate(theta[zAxis], [0, 0, 1] ));

   modelView = mult(modelView, translate(0, 2, 0));
   modelView = mult(modelView, scale4(8, -8, 8));
   gl.uniformMatrix4fv( gl.getUniformLocation(program,
         "modelViewMatrix"), false, flatten(modelView) );

   gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length);

   requestAnimFrame(render);
}

function scale4(a, b, c) {
        var result = mat4();
        result[0][0] = a;
        result[1][1] = b;
        result[2][2] = c;
        return result;
}
