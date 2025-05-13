function DrawPeople(){
    // draw people figurines, will be properly scaled next to the race car (COMPOSITE OBJECT 1)
    // Need to pass in parameters for RGB torso color (0-255)
    // left speedway set figurines
    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.87, 0.2, -0.8);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(255, 0, 0);
    modelViewMatrix=mvMatrixStack.pop();
    
    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.87, 0.2, -1.25);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(0, 0, 255);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.87, 0.2, -2);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(255, 0, 255);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.94, 0.15, -1.45);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(255, 255, 0);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.94, 0.15, -1.15);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(255, 127, 128);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.94, 0.15, -1.85);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(127, 127, 255);
    modelViewMatrix=mvMatrixStack.pop();

    //right speedway seats
    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.87, 0.2, 0.65);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(110, 200, 250);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.87, 0.2, 1.25);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(157, 200, 100);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.87, 0.2, 1.7);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(112, 200, 55);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.87, 0.2, 2.15);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(51, 24, 201);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.94, 0.15, 0.6);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(192, 127, 64);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.94, 0.15, 0.9);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(41, 230, 170);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.94, 0.15, 1);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(10, 152, 92);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.94, 0.15, 1.45);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(31, 56, 231);
    modelViewMatrix=mvMatrixStack.pop();

    mvMatrixStack.push(modelViewMatrix);
    t=translate(-0.94, 0.15, 2);
    modelViewMatrix=mult(modelViewMatrix, t);
    s=scale4(0.045, 0.045, 0.045);
    modelViewMatrix=mult(modelViewMatrix, s);
    DrawPerson(111, 222, 255);
    modelViewMatrix=mvMatrixStack.pop();



}