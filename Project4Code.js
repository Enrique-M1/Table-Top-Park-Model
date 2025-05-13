/* Programmer/Modified by: Shang Chen 
    Date: 11/14/24
    Original file: 31-jack.js
    Description: Project 4, part 2 and 3. 

    PART 1: Modified version of 31-jack scene to display personal built composite object and mesh object.
    MESH OBJECT: race car, see racecar.js and .html for face fragment/face components defined in color
    COMPOSITE OBJECT: person figurine, simple one that is properly scaled next to the race car, defined in cube, sphere, and cylinders
    
    PART 2: Complete first version of the scene, with proper lighting and materials given, while adding:
            - One Extruded Shape Object (or a composite object made of extruded objects)
            - One Surface Revolution Object
            - Any additional Objects of any type: 
            - Animation using keypress 'a' (race car driving a set race track)
*/
//global vars to control the scene
var program;
var canvas;
var gl;

var numTimesToSubdivide = 3;

var pointsArray = [];
var normalsArray = [];

var left = -1;
var right = 1;
var ytop = 1;
var bottom = -1;
var near = -30;
var far = 30;
var eye=[];
var at=[.1, .1, 0];
var up=[0, 2, 0];

//additional global variables to enable, disable, and settings for the race car driving animation
var doAnimation = false;
var beginningSet = false;

//animation step 0 to 1, (beginning) (-1.25, 0.05, -1) to (-1.25, 0.05, 1), rotation 90
//animation step 1 to 2, (-1.25, 0.05, 1) to vec3(-1.5, 0.05, 1.75), rotation 75
//animation step 2 to 3, (-1.5, 0.05, 1.75) to (-2, 0.05, 1.75), rotation 0
//step 3 to 4, (-2, 0.05, 1.75) to (-2.25, 0.05, 1) rotate -75/285
//step 4 to 5, (-2.25, 0.05, 1) to (-2.25, 0.05, -1) rotate -90/270
//step 5 to 6, (-2.25, 0.05, -1) to (-2, 0.05, -1.75) rotate -105/255
//step 6 to 7, (-2, 0.05, -1.75) to (-1.5, 0.05, -1.75) rotate 180
//step 7 to 0 (back to start), (-1.5, 0.05, -1.75) to (-1.25, 0.05, -1), rotate 105
var carCoords0 = vec3(-1.25, 0.05, -1);
var carCoords1 = vec3(-1.25, 0.05, 1);
var carCoords2 = vec3(-1.5, 0.05, 1.75);
var carCoords3 = vec3(-2, 0.05, 1.75);
var carCoords4 = vec3(-2.25, 0.05, 1);
var carCoords5 = vec3(-2.25, 0.05, -1);
var carCoords6 = vec3(-2, 0.05, -1.75);
var carCoords7 = vec3(-1.5, 0.05, -1.75);

var currentCarX = carCoords0[0];
var currentCarZ = carCoords0[2];
var currentRotate = 90;

var animationStep = 0;
var totalStepCount = 0;
var startX,
    startZ,
    deltaX,
    deltaZ,
    targetX,
    targetZ;

//total vertices in pointsArray should be at 1020
//cube count at 36
//cylinder count at 216
//sphere count at 768
//1020+ vertices can be additional primitive 3d shape or mesh objects

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

//vertices generation go here, separate files provided for meshes.
var squareVertices = [
        vec4( -0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5,  0.5,  0.5, 1.0 ),
        vec4( 0.5, -0.5,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 )
];

var cylinderVertices = generateCylinderPt();
var roadVertices = [];

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(0, 2, 0, 0 );

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4(.8, 0.8, 0.8, 1.0 );
var lightSpecular = vec4( .8, .8, .8, 1.0 );

var materialAmbient = vec4( .2, .2, .2, 1.0 );
var materialDiffuse = vec4( 0.0, 0.5, 1, 1.0);
var materialSpecular = vec4( 1, 1, 1, 1.0 );

var materialShininess = 50.0;

var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var mvMatrixStack=[];

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

    // generate the points/normals
    colorCube();
    console.log(pointsArray.length);
    colorCylinder();
    console.log(pointsArray.length);
    tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
    console.log(pointsArray.length);
    SetRaceCar();
    console.log(pointsArray.length);
    roadVertices = generateTrackPt();
    SetRaceTrack();
    console.log(pointsArray.length);
    ExtrudedSteps();
    console.log(pointsArray.length);

    // pass data onto GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    //Function to call to set up lighting and material, can change material color through this (RGBA).
    SetupLightingMaterial();

    // support user interface
    document.getElementById("zoomIn").onclick=function(){AllInfo.zoomFactor *= 0.50;};
    document.getElementById("zoomOut").onclick=function(){AllInfo.zoomFactor *= 1.50;};
    document.getElementById("left").onclick=function(){AllInfo.translateX -= 0.25;};
    document.getElementById("right").onclick=function(){AllInfo.translateX += 0.25;};
    document.getElementById("up").onclick=function(){AllInfo.translateY += 0.25;};
    document.getElementById("down").onclick=function(){AllInfo.translateY -= 0.25;};

    // keyboard handle
    window.onkeydown = HandleKeyboard;

    // Set the scroll wheel to change the zoom factor.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
      if (e.wheelDelta > 0) {
          AllInfo.zoomFactor *= 0.9;
      } else {
          AllInfo.zoomFactor *= 1.1;
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

function HandleKeyboard(event)
{
    switch (event.keyCode)
    {
      //cases 37-40 enables semi-free camera movement (cursor keys, mouse to rotate)
      //case 65 (key a) enables/disables animation flag, calculations to move the race car are done within render function.
    case 37:  // left cursor key
              AllInfo.translateX -= 0.25;
              render();
              break;
    case 39:   // right cursor key
              AllInfo.translateX += 0.25;
              render();
              break;
    case 38:   // up cursor key
              AllInfo.translateY += 0.25;
              render();
              break;
    case 40:    // down cursor key
              AllInfo.translateY -= 0.25;
              render();
              break;
    case 65:
              if (!doAnimation){
                doAnimation = true;
                console.log("Animation enabled");
              }
              else{
                doAnimation = false;
                console.log("Animation disabled");
              }
              render();
              break;

    }
}

// ******************************************
// Draw simple and primitive objects
// ******************************************
function DrawSolidSphere(radius)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(radius, radius, radius);   // scale to the given radius
        modelViewMatrix = mult(modelViewMatrix, s);
        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

 	// draw unit radius sphere
        //for( var i=0; i<sphereCount; i+=3)
        gl.drawArrays( gl.TRIANGLES, 252, 768 );

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCylinder(width, height, depth) {
  mvMatrixStack.push(modelViewMatrix);
	s=scale4(width, height, depth );   // scale to the given width/height/depth

  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 36, 216);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawSolidCube(width, height, depth)
{
	mvMatrixStack.push(modelViewMatrix);
	s=scale4(width, height, depth );   // scale to the given width/height/depth

  modelViewMatrix = mult(modelViewMatrix, s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 0, 36);

	modelViewMatrix=mvMatrixStack.pop();
}


// start drawing the wall
function DrawWall(x, y, z, thickness, size)
{
	var s, t, r;

	// draw thin wall with top = xz-plane, corner at origin
	mvMatrixStack.push(modelViewMatrix);

	t=translate(x, y*thickness, z);
	s=scale4(size, thickness, size);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1, 1, 1);

	modelViewMatrix=mvMatrixStack.pop();
}

// ******************************************
// Draw composite objects and other meshes
// ******************************************
function DrawTableLeg(thick, len)
{
	var s, t;

	mvMatrixStack.push(modelViewMatrix);

	t=translate(0, len/2, 0);
	var s=scale4(thick, len, thick);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1, 1, 1);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawTable(topWid, topThick, legThick, legLen)
{
	var s, t;

	// draw the table top
	mvMatrixStack.push(modelViewMatrix);

  t=translate(0, legLen, 0);
	s=scale4(topWid, topThick, topWid);
  modelViewMatrix=mult(mult(modelViewMatrix, t), s);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
	DrawSolidCube(1, 1, 1);

  modelViewMatrix=mvMatrixStack.pop();

	// place the four table legs
	var dist = 0.95 * topWid / 2.0 - legThick / 2.0;
	mvMatrixStack.push(modelViewMatrix);

  t= translate(dist, 0, dist);
  modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

  // no push and pop between leg placements
	t=translate(0, 0, -2*dist);
  modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

	t=translate(-2*dist, 0, 2*dist);
  modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

	t=translate(0, 0, -2*dist);
  modelViewMatrix = mult(modelViewMatrix, t);
	DrawTableLeg(legThick, legLen);

	modelViewMatrix=mvMatrixStack.pop();
}

function DrawPerson(torsoR, torsoG, torsoB)
{
  //Person skin color
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 224/255, 172/255, 105/255, 1.0);
  materialSpecular = vec4( 224/255, 172/255, 105/255, 1.0 );
  SetupLightingMaterial();

  //set head (sphere), arms (cylinder) with skin tone material
  mvMatrixStack.push(modelViewMatrix);
  t = translate(0, 2.25, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidSphere(0.75);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  r = rotate(30, 30, 0, 0); //rotate using xy plane, messes with the translation coordinates after
  modelViewMatrix = mult(modelViewMatrix, r);
  t = translate(0, 0, -1.0); //?, ?, ?
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidCylinder(0.25, 1, 0.25);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  r = rotate(150, 150, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);
  t = translate(0, -1, -1); //?, ?, ?
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidCylinder(0.25, 1, 0.25);
  modelViewMatrix=mvMatrixStack.pop();

  //Set torso (rectangular prism/cube) with a random shirt color, can be defined using parameters
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( torsoR/255, torsoG/255, torsoB/255, 1.0);
  materialSpecular = vec4( torsoR/255, torsoG/255, torsoB/255, 1.0 );
  SetupLightingMaterial();

  mvMatrixStack.push(modelViewMatrix);
  t = translate(0, 1, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidCube(0.8, 2, 0.8);
  modelViewMatrix=mvMatrixStack.pop();

}

function DrawTree(){
  //Wood colored cylinder, including green colored "leaf sections" (squashed spheres)
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 161/255, 102/255, 47/255, 1.0);
  materialSpecular = vec4( 161/255, 102/255, 47/255, 1.0 );
  SetupLightingMaterial();

  mvMatrixStack.push(modelViewMatrix);
  t = translate(0, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidCylinder(0.25, 3, 0.25);
  modelViewMatrix=mvMatrixStack.pop();

  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 109/255, 179/255, 63/255, 1.0);
  materialSpecular = vec4( 109/255, 179/255, 63/255, 1.0 );
  SetupLightingMaterial();

  mvMatrixStack.push(modelViewMatrix);
  t = translate(0, 3, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidSphere(0.35);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t = translate(0, 2.5, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidSphere(0.5);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  t = translate(0, 1.5, 0);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidSphere(0.75);
  modelViewMatrix=mvMatrixStack.pop();
}

function DrawCar()
{

  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 0, 0, 0, 1.0);
  materialSpecular = vec4( 0, 0, 0, 1.0 );
  SetupLightingMaterial();

  //car vertices count: 312 (1332 total)
  //set wheels using cylinders
  mvMatrixStack.push(modelViewMatrix);
  r=rotate(90, 90, 0, 0); //Rotate 90 degrees at xy-plane, this rotation type also alters the coordinate translation (x unchanged, y is z, z is -y)
  modelViewMatrix = mult(modelViewMatrix, r);
  t = translate(3.35, 0.85, -1.35); //x, z, -y
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidCylinder(0.5, 1, 0.5);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  r=rotate(90, 90, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);
  t = translate(-0.35, 0.85, -1.35);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidCylinder(0.5, 1, 0.5);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  r=rotate(90, 90, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);
  t = translate(3.35, -1.85, -1.35);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidCylinder(0.5, 1, 0.5);
  modelViewMatrix=mvMatrixStack.pop();

  mvMatrixStack.push(modelViewMatrix);
  r=rotate(90, 90, 0, 0);
  modelViewMatrix = mult(modelViewMatrix, r);
  t = translate(-0.35, -1.85, -1.35);
  modelViewMatrix = mult(modelViewMatrix, t);
  DrawSolidCylinder(0.5, 1, 0.5);
  modelViewMatrix=mvMatrixStack.pop();

  //Car base, side of the driver seat included
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 1, 0, 0, 1.0);
  materialSpecular = vec4( 1, 0, 0, 1.0 );
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 1020, 210);
  gl.drawArrays( gl.TRIANGLES, 1278, 12);

	modelViewMatrix=mvMatrixStack.pop();

  //Back trunk fin, top (orange)
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 1, 165/255, 0, 1.0);
  materialSpecular = vec4( 1, 165/255, 0, 1.0 );
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 1230, 6);
	modelViewMatrix=mvMatrixStack.pop();

  //Driver seat, fin sides, headlight alcoves (Red Orange)
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 1, 83/255, 73/255, 1.0);
  materialSpecular = vec4( 1, 83/255, 73/255, 1.0 );
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 1236, 12);
  gl.drawArrays( gl.TRIANGLES, 1248, 30);
  gl.drawArrays( gl.TRIANGLES, 1308, 24);

	modelViewMatrix=mvMatrixStack.pop();


  //Driver seat windows, nearly black
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 0.3, 0.3, 0.3, 0.7);
  materialSpecular = vec4( 0.3, 0.3, 0.3, 0.7);
  SetupLightingMaterial();
  mvMatrixStack.push(modelViewMatrix);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 1290, 18);

	modelViewMatrix=mvMatrixStack.pop();

}

function DrawRaceTrack(){
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 96/255, 111/255, 114/255, 1.0);
  materialSpecular = vec4( 96/255, 111/255, 114/255, 1.0 );
  SetupLightingMaterial();

  mvMatrixStack.push(modelViewMatrix);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 1332, 456);

	modelViewMatrix=mvMatrixStack.pop();

}

function DrawExtrudedSteps(){
  //reduce z scale mainly for house steps, reduce uniformly for speedway area seats, increase scaling for z axis if necessary

  //center steps, backwall
  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 155/255, 150/255, 150/255, 1.0);
  materialSpecular = vec4( 155/255, 150/255, 150/255, 1.0 );
  SetupLightingMaterial();

  mvMatrixStack.push(modelViewMatrix);

  r=rotate(270, 1, 0, 0); //Rotate 270 degrees at x axis
  modelViewMatrix = mult(modelViewMatrix, r);
  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 1788, 48);

  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4(  85/255, 85/255, 82/255, 1.0);
  materialSpecular = vec4( 85/255, 85/255, 82/255, 1.0 );
  SetupLightingMaterial();

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.drawArrays( gl.TRIANGLES, 1836, 36);

	modelViewMatrix=mvMatrixStack.pop();
}

function drawSurfaceOfRev() {
  
}

function render()
{
	var s, t, r;

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set up view and projection
  eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
                AllInfo.radius*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi));
  
  projectionMatrix = ortho(left*AllInfo.zoomFactor-AllInfo.translateX, 
                          right*AllInfo.zoomFactor-AllInfo.translateX, 
                         bottom*AllInfo.zoomFactor-AllInfo.translateY, 
                           ytop*AllInfo.zoomFactor-AllInfo.translateY, near, far);
  modelViewMatrix=lookAt(eye, at, up);
 	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

  if (doAnimation) {
    animateCar();
  }

  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 0, 1, 0, 1.0);
  materialSpecular = vec4( 0, 1, 0, 1.0 );
  SetupLightingMaterial();
  // wall #1, xz-plane baseplate, on top of the table
	DrawWall(0, 0, 0, 0.2, 5);

  materialAmbient = vec4( .2, .2, .2, 1.0 );
  materialDiffuse = vec4( 161/255, 102/255, 47/255, 1.0);
  materialSpecular = vec4( 161/255, 102/255, 47/255, 1.0 );
  SetupLightingMaterial();
  // wall #2, xz-plane floor
	DrawWall(0, -2, 0, 1, 10);
  
	// draw the table
	mvMatrixStack.push(modelViewMatrix);
	t=translate(0, -1.65, 0);
  modelViewMatrix=mult(modelViewMatrix, t);
	DrawTable(7, 0.2, 0.5, 1.5);
	modelViewMatrix=mvMatrixStack.pop();

  // draw the car (MESH OBJECT 1)
	mvMatrixStack.push(modelViewMatrix);

  //range of car translations within track: 
  //x: -1.25 (outer left), -2.25 (outer right)
  //z: 2 (very borrom/nearest), -2 (very top/farthest)
  //starting translate: (-1.25, 0.05, -1)
	t=translate(currentCarX, 0.05, currentCarZ);
  modelViewMatrix=mult(modelViewMatrix, t);
  s=scale4(0.050, 0.05, 0.05);
  modelViewMatrix=mult(modelViewMatrix, s);
  r = rotate(currentRotate, 0, 1, 0); //Horizontally flip the figure 90 degrees (z axis enabled, 90 degrees x axis rotate)
  modelViewMatrix=mult(modelViewMatrix, r);
	DrawCar();
	modelViewMatrix=mvMatrixStack.pop();

  //Draw multiple people translated to different parts of the scene, see peopledraw.js for the coordinates
  DrawPeople();


  // draw the race track, the race car will be animated within the track
	mvMatrixStack.push(modelViewMatrix);
	t=translate(-1.75, 0.05, 0);
  modelViewMatrix=mult(modelViewMatrix, t);
  s=scale4(0.05, 0.25, 0.075);
  modelViewMatrix=mult(modelViewMatrix, s);
	DrawRaceTrack();
	modelViewMatrix=mvMatrixStack.pop();

  //Draw a composite model of a tree (permitted scale: 15%, 20%, 25%)
  mvMatrixStack.push(modelViewMatrix);
	t=translate(0, 0.1, 0);
  modelViewMatrix=mult(modelViewMatrix, t);
  s=scale4(0.15, 0.15, 0.15);
  modelViewMatrix=mult(modelViewMatrix, s);
	DrawTree();
	modelViewMatrix=mvMatrixStack.pop();


  //Draw a bigger scaled tree
  mvMatrixStack.push(modelViewMatrix);
	t=translate(0.5, 0.1, 0);
  modelViewMatrix=mult(modelViewMatrix, t);
  s=scale4(0.2, 0.2, 0.2);
  modelViewMatrix=mult(modelViewMatrix, s);
	DrawTree();
	modelViewMatrix=mvMatrixStack.pop();

  //Ditto.
  mvMatrixStack.push(modelViewMatrix);
	t=translate(1, 0.1, 0);
  modelViewMatrix=mult(modelViewMatrix, t);
  s=scale4(0.25, 0.25, 0.25);
  modelViewMatrix=mult(modelViewMatrix, s);
	DrawTree();
	modelViewMatrix=mvMatrixStack.pop();

  // draw race track "seats", first part closer to z axis
  mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.75, 0.1, 0.25);
  modelViewMatrix=mult(modelViewMatrix, t);
  r = rotate(180, 0, 1, 0); //invert position of the extruded seats
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(0.025, 0.05, 0.175);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawExtrudedSteps();
  modelViewMatrix=mvMatrixStack.pop();

  // ditto, second part farther from z axis
  mvMatrixStack.push(modelViewMatrix);
	t=translate(-0.75, 0.1, -2.4);
  modelViewMatrix=mult(modelViewMatrix, t);
  r = rotate(180, 0, 1, 0); //invert position of the extruded seats
  modelViewMatrix=mult(modelViewMatrix, r);
  s=scale4(0.025, 0.05, 0.175);
  modelViewMatrix=mult(modelViewMatrix, s);
  DrawExtrudedSteps();
  modelViewMatrix=mvMatrixStack.pop();

	/*// wall #2: in yz-plane
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(90.0, 0.0, 0.0, 1.0);
  modelViewMatrix=mult(modelViewMatrix, r);
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop();


	// wall #3: in xy-plane
	mvMatrixStack.push(modelViewMatrix);
	r=rotate(-90, 1.0, 0.0, 0.0);
	//r=rotate(90, 1.0, 0.0, 0.0);  // ??
  modelViewMatrix=mult(modelViewMatrix, r);
	DrawWall(0.02);
	modelViewMatrix=mvMatrixStack.pop(); */

  if (doAnimation){
    setTimeout(function (){requestAnimFrame(render);}, 50);
  }
}

// ******************************************
// supporting functions below this:
// ******************************************
function triangle(a, b, c)
{
     var points = [a, b, c];
     var normal = Newell(points);
    
     pointsArray.push(a);
     normalsArray.push(normal);
     pointsArray.push(b);
     normalsArray.push(normal);
     pointsArray.push(c);
     normalsArray.push(normal);

}

function divideTriangleSphere(a, b, c, count)
{
    if ( count > 0 )
    {
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);

        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);

        divideTriangleSphere( a, ab, ac, count - 1 );
        divideTriangleSphere( ab, b, bc, count - 1 );
        divideTriangleSphere( bc, c, ac, count - 1 );
        divideTriangleSphere( ab, bc, ac, count - 1 );
    }
    else {
      triangle( a, b, c );
    }
}

function tetrahedron(a, b, c, d, n)
{
  divideTriangleSphere(a, b, c, n);
  divideTriangleSphere(d, c, b, n);
  divideTriangleSphere(a, d, b, n);
  divideTriangleSphere(a, c, d, n);
}

function quad(vertices, a, b, c, d)
{

      var points=[vertices[a], vertices[b], vertices[c], vertices[d]];
      var normal = Newell(points);

     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[b]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);

     	pointsArray.push(vertices[a]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[c]);
     	normalsArray.push(normal);
     	pointsArray.push(vertices[d]);
     	normalsArray.push(normal);
}

function colorCube()
{
    	quad(squareVertices, 1, 0, 3, 2 );
    	quad(squareVertices, 2, 3, 7, 6 );
    	quad(squareVertices, 3, 0, 4, 7 );
    	quad(squareVertices, 6, 5, 1, 2 );
    	quad(squareVertices, 4, 5, 6, 7 );
    	quad(squareVertices, 5, 4, 0, 1 );
}

function colorCylinder() {
  //18 slices, points, vertex 0 is top center point, vertex 19 is bottom center point,
  //assuming i = 0, i + 1 = 1, numslice + i + 2 = 20, etc. 
  for (let i = 0; i < 18; i++){
    if (i != 17){
      quad(cylinderVertices, (i + 1), (18 + i + 2), (18 + i + 3), (i + 2));
      triangle(cylinderVertices[0], cylinderVertices[(i + 1)], cylinderVertices[(i + 2)]);
      triangle(cylinderVertices[19], cylinderVertices[(18 + i + 2)], cylinderVertices[(18 + i + 3)]);
    }
    else {
      quad(cylinderVertices, (i + 1), (18 + i + 2), 20, 1);
      triangle(cylinderVertices[0], cylinderVertices[(i + 1)], cylinderVertices[1]);
      triangle(cylinderVertices[19], cylinderVertices[(18 + i + 2)], cylinderVertices[20]);
    }
  }
}

function generateCylinderPt()
{
    var radius = 1;
    var points = [];
    var numSlices = 18;
    var angleSlices = 2*Math.PI/numSlices;

    var x = 0;
    var z = 0;

    //center point, top
    points.push(vec4(0, 1, 0, 1));
    //points, top
    for (let i = 0; i < numSlices; i++){
      x = radius * Math.cos(i*angleSlices);
      z = radius * Math.sin(i*angleSlices);
      points.push(vec4(x, 1, z, 1));
    }
    console.log(points.length);
    //center point, bottom
    points.push(vec4(0, 0, 0, 1));
    //points, bottom
    for (let i = 0; i < numSlices; i++){
      x = radius * Math.cos(i*angleSlices);
      z = radius * Math.sin(i*angleSlices);
      points.push(vec4(x, 0, z, 1));
    }
    console.log(points.length);
    return points;

}

//Repeat:
//animation step 0 to 1, (beginning) (-1.25, 0.05, -1) to (-1.25, 0.05, 1), rotation 90
//animation step 1 to 2, (-1.25, 0.05, 1) to vec3(-1.5, 0.05, 1.75), rotation 75
//animation step 2 to 3, (-1.5, 0.05, 1.75) to (-2, 0.05, 1.75), rotation 0
//step 3 to 4, (-2, 0.05, 1.75) to (-2.25, 0.05, 1) rotate -75/285
//step 4 to 5, (-2.25, 0.05, 1) to (-2.25, 0.05, -1) rotate -90/270
//step 5 to 6, (-2.25, 0.05, -1) to (-2, 0.05, -1.75) rotate -105/255
//step 6 to 7, (-2, 0.05, -1.75) to (-1.5, 0.05, -1.75) rotate 180
//step 7 to 0 (back to start), (-1.5, 0.05, -1.75) to (-1.25, 0.05, -1), rotate 105
function animateCar(){
  if (!beginningSet){
    switch (animationStep) {
      case 0:
        startX = carCoords0[0];
        startZ = carCoords0[2];

        targetX = carCoords1[0];
        targetZ = carCoords1[2];

        currentRotate = 90;
        totalStepCount = 20;
        break;
      case 1:
        startX = carCoords1[0];
        startZ = carCoords1[2];

        targetX = carCoords2[0];
        targetZ = carCoords2[2];

        currentRotate = 75;
        totalStepCount = 10;
        break;
      case 2:
        startX = carCoords2[0];
        startZ = carCoords2[2];

        targetX = carCoords3[0];
        targetZ = carCoords3[2];

        currentRotate = 0;
        totalStepCount = 10;
        break;
      case 3:
        startX = carCoords3[0];
        startZ = carCoords3[2];

        targetX = carCoords4[0];
        targetZ = carCoords4[2];

        currentRotate = 285;
        totalStepCount = 10;
        break;
      case 4:
        startX = carCoords4[0];
        startZ = carCoords4[2];

        targetX = carCoords5[0];
        targetZ = carCoords5[2];

        currentRotate = 270;
        totalStepCount = 20;
        break;
      case 5:
        startX = carCoords5[0];
        startZ = carCoords5[2];

        targetX = carCoords6[0];
        targetZ = carCoords6[2];

        currentRotate = 255;
        totalStepCount = 10;
        break;
      case 6:
        startX = carCoords6[0];
        startZ = carCoords6[2];

        targetX = carCoords7[0];
        targetZ = carCoords7[2];

        currentRotate = 180;
        totalStepCount = 10;
        break;
      case 7:
        startX = carCoords7[0];
        startZ = carCoords7[2];

        targetX = carCoords0[0];
        targetZ = carCoords0[2];

        currentRotate = 105;
        totalStepCount = 10;
        break;
    }
    //perform deltaX and deltaY calculation after switch statement
    deltaX = (targetX-startX)/totalStepCount;
    deltaZ = (targetZ-startZ)/totalStepCount;


    beginningSet = true;
  }

  //after initial condition (will not be called until next animation step), calculate change in current X and Z translation of the race car
  currentCarX = currentCarX + deltaX;
  currentCarZ = currentCarZ + deltaZ;
  
  //set of case checks if the car has moved at (or beyond) the target coordinates of the current animation step
  //if the car does move at (or beyond) target coordinates, snap back the car back to the target coordinate, iterate step count and
  //set beginningSet flag as false for new set of start, target coordinates and rotation.
  //steps 0, 1, 2, 7 z increment (>=), steps 3, 4, 5, 6 z decrement (<=) 
  //steps 0 to 4 x decrement (<=), 5 to 7 x increment (>=)
  if ((animationStep == 0) || (animationStep == 1) || (animationStep == 2)){
    if ((currentCarX <= targetX) && (currentCarZ >= targetZ)){
      currentCarX = targetX;
      currentCarZ = targetZ;

      animationStep++;
      beginningSet = false;
    }
  }
  else if ((animationStep == 3) || (animationStep == 4)){
    if ((currentCarX <= targetX) && (currentCarZ <= targetZ)){
      currentCarX = targetX;
      currentCarZ = targetZ;

      animationStep++;
      beginningSet = false;
    }
  }
  else if ((animationStep == 5) || (animationStep == 6)){
    if ((currentCarX >= targetX) && (currentCarZ <= targetZ)){
      currentCarX = targetX;
      currentCarZ = targetZ;

      animationStep++;
      beginningSet = false;
    }
  }
  else if (animationStep == 7){
    if ((currentCarX >= targetX) && (currentCarZ >= targetZ)){
      currentCarX = targetX;
      currentCarZ = targetZ;

      animationStep = 0;
      beginningSet = false;
    }
  }

}

function scale4(a, b, c) {
   	var result = mat4();
   	result[0][0] = a;
   	result[1][1] = b;
   	result[2][2] = c;
   	return result;
}


/*
  Function that sets up lighting and material of specific objects (coloring them in) if provided: 
  materialAmbient = (RGBA);
  materialDiffuse = (RGBA);
  materialSpecular = (RGBA);
  Then function call before drawing in object or components from a composite object

  issue: only mono-color that will affect extruded/rotation-swept/mesh objects if drawing in the whole model
  without separating sections by their own colors
  workaround: find a way to generate individual parts by vertices count 
  (gl.drawArrays( gl.TRIANGLES, x, y) drawing a part has this diffuse/specular material)
*/
function SetupLightingMaterial()
{
    // set up lighting and material
    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

	// send lighting and material coefficient products to GPU
    gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );
}

// a 4x4 matrix multiple by a vec4, usage will be in surface revolution
function multiply(m, v)
{
    var vv=vec4(
     m[0][0]*v[0] + m[0][1]*v[1] + m[0][2]*v[2]+ m[0][3]*v[3],
     m[1][0]*v[0] + m[1][1]*v[1] + m[1][2]*v[2]+ m[1][3]*v[3],
     m[2][0]*v[0] + m[2][1]*v[1] + m[2][2]*v[2]+ m[2][3]*v[3],
     m[3][0]*v[0] + m[3][1]*v[1] + m[3][2]*v[2]+ m[3][3]*v[3]);
    return vv;
}
//Newell's method for normals, used in quad and triangle
function Newell(vertices)
{
   var L=vertices.length;
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

//Alternative Newell's method for normals, primarily used for extruded shapes (top and bottom points passed in as index)
function NewellAlt(vertices, indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       if (i == L-1){
         nextIndex = indices[0];
       }
       else {
        nextIndex = indices[i+1];
       }

       x += (vertices[index][1] - vertices[nextIndex][1])*
            (vertices[index][2] + vertices[nextIndex][2]);
       y += (vertices[index][2] - vertices[nextIndex][2])*
            (vertices[index][0] + vertices[nextIndex][0]);
       z += (vertices[index][0] - vertices[nextIndex][0])*
            (vertices[index][1] + vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}
//Taken from 35-extruded.js
function ExtrudedShape()
{
    var basePoints=[];
    var topPoints=[];

    // create the face list
    // add the side faces first --> N quads
    for (var j=0; j<N; j++)
    {
        quad(stepVertices, j, j+N, (j+1)%N+N, (j+1)%N); // CCW rotation
    }
    console.log(pointsArray.length)

    // the first N vertices come from the base
    basePoints.push(0);
    for (var i=N-1; i>0; i--)
    {
        basePoints.push(i);  // index only
    }
    // add the base face as the Nth face, base face will have offset of 0
    polygon(stepVertices, basePoints);
    console.log(pointsArray.length)

    // the next N vertices come from the top
    for (var i=0; i<N; i++)
    {
        topPoints.push(i+N); // index only
    }
    // add the top face, set indices offset by length of basePoints
    polygon(stepVertices, topPoints);
    console.log(pointsArray.length)
}

function polygon(vertices, indices)
{
    
    // for indices=[a, b, c, d, e, f, ...]
    var M=indices.length;
    var normal=NewellAlt(vertices, indices);

    var prev=1;
    var next=2;
    // triangles:
    // a-b-c
    // a-c-d
    // a-d-e
    // ...
    for (var i=0; i<M-2; i++)
    {
        pointsArray.push(vertices[indices[0]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[prev]]);
        normalsArray.push(normal);

        pointsArray.push(vertices[indices[next]]);
        normalsArray.push(normal);

        prev=next;
        next=next+1;
    }
}
