
function init() {
    disableDefaultLight();
}

function createScene() {

    var radius = 0.3;
    var faces = 12;
    var height = 1.0;

    var top = createCylinderTop(radius, height, faces);
    var body = createCylinderBody(radius, height, faces);
    var base = createCylinderBase(radius, height, faces);


    var root = new osg.Node();
    root.addChild(top);
    root.addChild(body);
    root.addChild(base);
    return root;
}

function createCylinderTop (radius, height, faces) {

    var angle = 0.0;
    var angleIncrement = (2*Math.PI)/faces;
    var coordinates = new Array(faces*3*3);


    for(var f=0; f<faces; f++) {
        // Generate the four coordinates required for each face
        var x1 = radius * Math.cos(angle);
        var y1 = radius * Math.sin(angle);
        angle += angleIncrement;
        var x2 = radius * Math.cos(angle);
        var y2 = radius * Math.sin(angle);

        coordinates[f*3*3] = 0;
        coordinates[f*3*3+1] = 0;
        coordinates[f*3*3+2] = height/2.0;

        coordinates[f*3*3+3] = x1;
        coordinates[f*3*3+4] = y1;
        coordinates[f*3*3+5] = height/2.0;

        coordinates[f*3*3+6] = x2;
        coordinates[f*3*3+7] = y2;
        coordinates[f*3*3+8] = height/2.0;
    }

    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(coordinates));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 3*faces));

    return geometry;
}

function createCylinderBase(radius, height, faces) {
    var angle = 0.0;
    var angleIncrement = (2*Math.PI)/faces;

    var coordinates = new Array(faces*3*3);

    for(var f=0; f<faces; f++) {
        // Generate the four coordinates required for each face
        var x1 = radius * Math.cos(angle);
        var y1 = radius * Math.sin(angle);
        angle += angleIncrement;
        var x2 = radius * Math.cos(angle);
        var y2 = radius * Math.sin(angle);

        coordinates[f*3*3] = 0;
        coordinates[f*3*3+1] = 0;
        coordinates[f*3*3+2] = -height/2.0;

        coordinates[f*3*3+3] = x2;
        coordinates[f*3*3+4] = y2;
        coordinates[f*3*3+5] = -height/2.0;

        coordinates[f*3*3+6] = x1;
        coordinates[f*3*3+7] = y1;
        coordinates[f*3*3+8] = -height/2.0;
    }

    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(coordinates));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 3*faces));

    return geometry;
}

function createCylinderBody(radius, height, faces) {

    var angle = 0;
    var angleIncrement = (2*Math.PI)/faces;
    var coordinates = new Array(faces*2*3*3);

    for(var f=0; f<faces; f++)
    {
        // Generate the four coordinates required for each face
        var x1 = radius*Math.cos(angle);
        var y1 = radius*Math.sin(angle);
        angle += angleIncrement;
        var x2 = radius*Math.cos(angle);
        var y2 = radius*Math.sin(angle);

        // Populate the coordinates array
        coordinates[f*2*3*3] = x1;
        coordinates[f*2*3*3+1] = y1;
        coordinates[f*2*3*3+2] = -height/2.0;

        coordinates[f*2*3*3+3] = x2;
        coordinates[f*2*3*3+4] = y2;
        coordinates[f*2*3*3+5] = height/2.0;

        coordinates[f*2*3*3+6] = x1;
        coordinates[f*2*3*3+7] = y1;
        coordinates[f*2*3*3+8] = height/2.0;

        coordinates[f*2*3*3+9] = x1;
        coordinates[f*2*3*3+10] = y1;
        coordinates[f*2*3*3+11] = -height/2.0;

        coordinates[f*2*3*3+12] = x2;
        coordinates[f*2*3*3+13] = y2;
        coordinates[f*2*3*3+14] = -height/2.0;

        coordinates[f*2*3*3+15] = x2;
        coordinates[f*2*3*3+16] = y2;
        coordinates[f*2*3*3+17] = height/2.0;
    }

    var vertexCoordAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexCoordAttribArray.setElements(new Float32Array(coordinates));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexCoordAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 6*faces));

    return geometry;
}

