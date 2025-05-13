function generateTrackPt(){
    var vertices = [];
    var x, z;

    //readjust if necessary
    var innerRadius = 4;
    var outerRadius = 12;
    var numSlices = 16;
    var angleSlices =  2 * Math.PI/numSlices;

    vertices.push(vec4(4, 0.25, -15, 1)); //0
    vertices.push(vec4(4, 0, -15, 1)); //1
    vertices.push(vec4(12, 0.25, -15, 1)); //2
    vertices.push(vec4(12, 0, -15, 1)); //3

    vertices.push(vec4(4, 0.25, 15, 1)); //4
    vertices.push(vec4(4, 0, 15, 1)); //5
    vertices.push(vec4(12, 0.25, 15, 1)); //6
    vertices.push(vec4(12, 0, 15, 1)); //7

    vertices.push(vec4(-4, 0.25, -15, 1)); //8
    vertices.push(vec4(-4, 0, -15, 1)); //9
    vertices.push(vec4(-12, 0.25, -15, 1)); //10
    vertices.push(vec4(-12, 0, -15, 1)); //11

    vertices.push(vec4(-4, 0.25, 15, 1)); //12
    vertices.push(vec4(-4, 0, 15, 1)); //13
    vertices.push(vec4(-12, 0.25, 15, 1)); //14
    vertices.push(vec4(-12, 0, 15, 1)); //15

    //mini cylinder sides for both inner curve and outer curve
    for (let i = 0; i < numSlices; i++){
        x = innerRadius * Math.cos(i*angleSlices);
        z = innerRadius * Math.sin(i*angleSlices);
        vertices.push(vec4(x, 0.25, z + 15, 1));
        vertices.push(vec4(x, 0, z + 15, 1));
    }

    for (let i = 0; i < numSlices; i++){
        x = outerRadius * Math.cos(i*angleSlices);
        z = outerRadius * Math.sin(i*angleSlices);
        vertices.push(vec4(x, 0.25, z + 15, 1));
        vertices.push(vec4(x, 0, z + 15, 1));
    }

    //ditto, but bottom curve
    for (let i = 0; i < numSlices; i++){
        x = -innerRadius * Math.cos(i*angleSlices);
        z = -innerRadius * Math.sin(i*angleSlices);
        vertices.push(vec4(x, 0.25, z - 15, 1));
        vertices.push(vec4(x, 0, z - 15, 1));
    }
    
    for (let i = 0; i < numSlices; i++){
        x = -outerRadius * Math.cos(i*angleSlices);
        z = -outerRadius * Math.sin(i*angleSlices);
        vertices.push(vec4(x, 0.25, z - 15, 1));
        vertices.push(vec4(x, 0, z - 15, 1));
    }


    return vertices;
}

function SetRaceTrack()
{
    //front
    quad(roadVertices, 0, 1, 3, 2);
    //top
    quad(roadVertices, 4, 0, 2, 6);
    //sides
    quad(roadVertices, 4, 5, 1, 0);
    quad(roadVertices, 6, 7, 5, 4);
    quad(roadVertices, 6, 7, 3, 2);
    //bottom
    quad(roadVertices, 5, 1, 3, 7);
    
    //front
    quad(roadVertices, 8, 9, 11, 10);
    //top
    quad(roadVertices, 12, 8, 10, 14);
    //sides
    quad(roadVertices, 12, 13, 9, 8);
    quad(roadVertices, 14, 15, 13, 12);
    quad(roadVertices, 14, 15, 11, 10);
    //bottom
    quad(roadVertices, 13, 9, 11, 15);

    //starting vertices 16-79, top half-circle curve, even vertices top, odd vertices bottom (inner curve 16-47, outer curve 48-79)

    //16 slices, with each current and next iteration producing full defined rectangles curving slightly to the next straight lane
    for (let i = 0; i < 16; i+=2){
        //top (even vertices, (iCurr + 2, iCurr, oCurr, oCurr + 2))
        quad(roadVertices, i + 16 + 2, i + 16, i + 48, i + 48 + 2); 

        //bottom (odd vertices, (iCurr + 2 + 1, iCurr + 1, oCurr + 1, oCurr + 2 + 1))
        quad(roadVertices, i + 16 + 2 + 1, i + 16 + 1, i + 48 + 1, i + 48 + 2 + 1);
        
        //side inner
        quad(roadVertices, i + 16, i + 16 + 1, i + 16 + 3, i + 16 + 2);

        //side outer
        quad(roadVertices, i + 48, i + 48 + 1, i + 48 + 3, i + 48 + 2)

    }

    // starting vertices 80-143, bottom half-circle curve (inner curve 80-111, outer curve 112-143)
    for (let i = 0; i < 16; i+=2){
        //top (even vertices, (iCurr + 2, iCurr, oCurr, oCurr + 2))
        quad(roadVertices, i + 80 + 2, i + 80, i + 112, i + 112 + 2); 

        //bottom (odd vertices, (iCurr + 2 + 1, iCurr + 1, oCurr + 1, oCurr + 2 + 1))
        quad(roadVertices, i + 80 + 2 + 1, i + 80 + 1, i + 112 + 1, i + 112 + 2 + 1);
        
        //side inner
        quad(roadVertices, i + 80, i + 80 + 1, i + 80 + 3, i + 80 + 2);

        //side outer
        quad(roadVertices, i + 112, i + 112 + 1, i + 112 + 3, i + 112 + 2);

    }
    


}