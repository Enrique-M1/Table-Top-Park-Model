var carVertices = [
    //0-15 defines the race car's right side face
    //2, 3, 0, 1 = right side trunk face
    //5, 6, 4, 2 = side face, top of rear wheel space
    //9, 8, 7, 5 = side face, main car chassis
    //11, 12, 10, 9 = side face, top of front wheel space
    //14, 15, 13, 11 = right side front face 
    vec4(4, 1.1, 1.5, 1), //0, very left/trunk edge of the race car
    vec4(4, 2, 1.5, 1), //1
    vec4(3.75, 2, 1.5, 1), //2
    vec4(3.75, 1.1, 1.5, 1), //3
    vec4(3.75, 1.85, 1.5, 1), //4
    vec4(3, 2, 1.5, 1), //5
    vec4(3, 1.85, 1.5, 1), //6
    vec4(3, 1.1, 1.5, 1), //7
    vec4(0, 1.1, 1.5, 1), //8
    vec4(0, 2, 1.5, 1), //9
    vec4(0, 1.85, 1.5, 1), //10
    vec4(-0.75, 2, 1.5, 1), //11
    vec4(-0.75, 1.85, 1.5, 1), //12
    vec4(-0.75, 1.1, 1.5, 1), //13
    vec4(-1.5, 2, 1.5, 1), //14
    vec4(-2.5, 1.1, 1.5, 1), //15
  
    //16-23 defines the right side alcove where the wheels are inserted
    //side wheel outer alcove points (4, 3, 7, 6)
    //front wheel alcove outside points (12, 13, 10, 8)
  
    //18, 19, 17, 16 = side wheel inner alcove
    //16, 18, 6, 4 = side wheel inner alcove top
    //20, 21, 23, 22 = front wheel inner alcove
    //22, 20, 12, 10 = side wheel inner alcove top
    //16, 17, 3, 4 / 6, 7, 19, 18 = side wheel inner side wall
    //20, 21, 13, 12 / 10, 8, 23, 22  = front wheel inner side wall
    vec4(3.75, 1.85, 0.75, 1), //16
    vec4(3.75, 1.1, 0.75, 1), //17
    vec4(3, 1.85, 0.75, 1), //18
    vec4(3, 1.1, 0.75, 1), //19
    vec4(-0.75, 1.85, 0.75, 1), //20
    vec4(-0.75, 1.1, 0.75, 1), //21
    vec4(0, 1.85, 0.75, 1), //22
    vec4(0, 1.1, 0.75, 1), //23
  
    //24-39 defines the race car's left side face, z-axis flip, same order of vertices to be passed in + 24, but set clockwise (like stack)
    //25, 24, 27, 26 = left side trunk face
    //26, 28, 30, 29 = side face, top of rear wheel space
    //29, 31, 32, 33 = side face, main car chassis
    //35, 36, 34, 33 = side face, top of front wheel space
    //38, 39, 37, 35 = left side front face 
    vec4(4, 1.1, -1.5, 1), //24, very left/trunk edge of the race car
    vec4(4, 2, -1.5, 1), //25
    vec4(3.75, 2, -1.5, 1), //26
    vec4(3.75, 1.1, -1.5, 1), //27
    vec4(3.75, 1.85, -1.5, 1), //28
    vec4(3, 2, -1.5, 1), //29
    vec4(3, 1.85, -1.5, 1), //30
    vec4(3, 1.1, -1.5, 1), //31
    vec4(0, 1.1, -1.5, 1), //32
    vec4(0, 2, -1.5, 1), //33
    vec4(0, 1.85, -1.5, 1), //34
    vec4(-0.75, 2, -1.5, 1), //35
    vec4(-0.75, 1.85, -1.5, 1), //36
    vec4(-0.75, 1.1, -1.5, 1), //37
    vec4(-1.5, 2, -1.5, 1), //38
    vec4(-2.5, 1.1, -1.5, 1), //39
  
    //40-47 defines the left side alcove where the wheels are inserted, z axis flip also
    //side wheel outer alcove points (28, 27, 31, 30)
    //front wheel alcove outside points (36, 37, 34, 32)
  
    //40, 41, 43, 42 = side wheel inner alcove
    //28, 30, 42, 40 = side wheel inner alcove top
    //46, 47, 45, 44 = front wheel inner alcove
    //34, 36, 44, 46 = side wheel inner alcove top
    //28, 27, 41, 40 / 42, 43, 31, 30 = side wheel inner side wall
    //36, 37, 45, 44/ 46, 47, 32, 34 = front wheel inner side wall
    vec4(3.75, 1.85, -0.75, 1), //40
    vec4(3.75, 1.1, -0.75, 1), //41
    vec4(3, 1.85, -0.75, 1), //42
    vec4(3, 1.1, -0.75, 1), //43
    vec4(-0.75, 1.85, -0.75, 1), //44
    vec4(-0.75, 1.1, -0.75, 1), //45
    vec4(0, 1.85, -0.75, 1), //46
    vec4(0, 1.1, -0.75, 1), //47
  
    //48-55 defines the tail fin, small connectors at the center, larger connectors at the side
    //48, 49, 51, 50 = fin main piece, slight extension outside
    //48, 5, 53, 52 = side connector, left
    //54, 55, 29, 50 = side connector, right
    vec4(3.25, 2.25, 1.5, 1), //48
    vec4(4.25, 2.5, 1.5, 1), //49
    vec4(3.25, 2.25, -1.5, 1), //50
    vec4(4.25, 2.5, -1.5, 1), //51
    vec4(4.5, 2.6, 1.5, 1), //52
    vec4(4.5, 2.0, 1.5, 1), //53
    vec4(4.5, 2.6, -1.5, 1), //54
    vec4(4.5, 2.0, -1.5, 1), //55
  
    //56-75 defines the driver cockpit, exactly centered, slick angle polygon, with additional windows vertices
    //57, 56, 59, 58 = left side 
    //62, 63, 60, 61 = right side 
    //61, 60, 56, 57 / 62, 61, 57, 58 / 63, 62, 58, 59 = front sides 
    //Close off edges with 56, 59, 60, 63
    //all window vertices will have at minimum 0.1 gap between main cockpit frame 
    //67, 66, 64, 65 = front window
    //69, 68, 71, 70 / 73, 74, 75, 72 = side window
    vec4(0, 2, 1.15, 1), //56
    vec4(1, 2.75, 0.9, 1), // 57
    vec4(2, 2.75, 0.9, 1), // 58
    vec4(3, 2, 1.15, 1), // 59
    vec4(0, 2, -1.15, 1), // 60
    vec4(1, 2.75, -0.9, 1), // 61
    vec4(2, 2.75, -0.9, 1), // 62
    vec4(3, 2, -1.15, 1), // 63
    vec4(-0.05, 2, 0.95, 1), // 64
    vec4(0.95, 2.75, 0.7, 1), // 65
    vec4(-0.05, 2, -0.95, 1), // 66
    vec4(0.95, 2.75, -0.7, 1), // 67
    vec4(0.5, 2, 1.2, 1), //68
    vec4(1.3, 2.6, 0.95, 1), // 69
    vec4(1.95, 2.6, 0.95, 1), // 70
    vec4(1.95, 2, 1.2, 1), // 71
    vec4(0.5, 2, -1.2, 1), //72
    vec4(1.3, 2.6, -0.95, 1), // 73
    vec4(1.95, 2.6, -0.95, 1), // 74
    vec4(1.95, 2, -1.2, 1), // 75
  
    //76- defines misc decors (headlight, etc.)
    vec4(-1.5, 2.25, 1.5, 1), //76
    vec4(-1, 2, 1.5, 1), //77
    vec4(-1.5, 2, 1, 1), //78
    vec4(-1.5, 2.25, 1, 1), //79
    vec4(-1, 2, 1, 1), //80
  
    vec4(-1.5, 2.25, -1.5, 1), //81
    vec4(-1, 2, -1.5, 1), //82
    vec4(-1.5, 2, -1, 1), //83
    vec4(-1.5, 2.25, -1, 1), //84
    vec4(-1, 2, -1, 1), //85
  
    
  
];

  // define quad and tri vertices for the race car
function SetRaceCar()
{

    //right side
    quad(carVertices, 2, 3, 0, 1);
    quad(carVertices, 5, 6, 4, 2);
    quad(carVertices, 9, 8, 7, 5);
    quad(carVertices, 11, 12, 10, 9);
    quad(carVertices, 14, 15, 13, 11);
    quad(carVertices, 18, 19, 17, 16);
    quad(carVertices, 16, 18, 6, 4);
    quad(carVertices, 16, 17, 3, 4);
    quad(carVertices, 6, 7, 19, 18);
    quad(carVertices, 20, 21, 23, 22);
    quad(carVertices, 22, 20, 12, 10);
    quad(carVertices, 20, 21, 13, 12);
    quad(carVertices, 10, 8, 23, 22);

    //left side
    quad(carVertices, 25, 24, 27, 26);
    quad(carVertices, 26, 28, 30, 29);
    quad(carVertices, 29, 31, 32, 33);
    quad(carVertices, 35, 36, 34, 33);
    quad(carVertices, 38, 39, 37, 35);
    quad(carVertices, 40, 41, 43, 42);
    quad(carVertices, 28, 30, 42, 40);
    quad(carVertices, 46, 47, 45, 44);
    quad(carVertices, 34, 36, 44, 46);
    quad(carVertices, 28, 27, 41, 40);
    quad(carVertices, 42, 43, 31, 30);
    quad(carVertices, 36, 37, 45, 44);
    quad(carVertices, 46, 47, 32, 34);
    console.log(pointsArray.length);

    //bottom part of the race car (back face, counter-clockwise as if front, beginning with left side vertices)
    quad(carVertices, 24, 27, 3, 0);
    quad(carVertices, 41, 43, 19, 17);
    quad(carVertices, 31, 32, 8, 7);
    quad(carVertices, 45, 47, 23, 21);
    quad(carVertices, 37, 39, 15, 13);
    console.log(pointsArray.length);

    //Bumper and trunk
    quad(carVertices, 25, 24, 0, 1);
    quad(carVertices, 5, 1, 25, 29);
    quad(carVertices, 38, 39, 15, 14);
    quad(carVertices, 9, 14, 38, 33);
    console.log(pointsArray.length);

    //Fin piece
    quad(carVertices, 48, 49, 51, 50);
    quad(carVertices, 48, 5, 53, 52);
    quad(carVertices, 54, 55, 29, 50);
    console.log(pointsArray.length);

    //Driver seat
    quad(carVertices, 57, 56, 59, 58);
    quad(carVertices, 62, 63, 60, 61);
    quad(carVertices, 61, 60, 56, 57);
    quad(carVertices, 62, 61, 57, 58);
    quad(carVertices, 63, 62, 58, 59);
    console.log(pointsArray.length);
    quad(carVertices, 59, 56, 9, 5);
    quad(carVertices, 63, 60, 33, 29);
    console.log(pointsArray.length);

    //side windows
    quad(carVertices, 67, 66, 64, 65);
    quad(carVertices, 69, 68, 71, 70);
    quad(carVertices, 73, 74, 75, 72);
    console.log(pointsArray.length);

    //headlight
    triangle(carVertices[76], carVertices[14], carVertices[77]);
    triangle(carVertices[79], carVertices[80], carVertices[78]);
    quad(carVertices, 77, 76, 79, 80);

    triangle(carVertices[81], carVertices[38], carVertices[82]);
    triangle(carVertices[84], carVertices[83], carVertices[85]);
    quad(carVertices, 82, 81, 84, 85);
    console.log(pointsArray.length);


}
