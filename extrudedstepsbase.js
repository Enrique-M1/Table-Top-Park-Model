// variables to track the vertices and N count for extruded step object
var N;
var stepVertices;
var N_STEPS;

function ExtrudedSteps(){
    var height=12;
    stepVertices = 
    [ 
        vec4(0, 0, 3, 1),
        vec4(0, 0, 0, 1),
        vec4(9, 0, 0, 1),
        vec4(9, 0, 1, 1),
        vec4(6, 0, 1, 1),
        vec4(6, 0, 2, 1),
        vec4(3, 0, 2, 1),
        vec4(3, 0, 3, 1),
	];
    N=N_STEPS = stepVertices.length;
    // add the second set of points
    // extruded along the Y Axis
    for (var i=0; i<N; i++)
    {
        stepVertices.push(vec4(stepVertices[i][0], stepVertices[i][1]+height, stepVertices[i][2], 1));
    }

    ExtrudedShape();
}