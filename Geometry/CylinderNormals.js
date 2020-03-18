
var radius = 0.3;
var height = 1.0;
var faces = 600;

function init() {
    //disableDefaultLight();
}

function createScene() {

    var material = new osg.Material();
    material.setDiffuse([0.6, 0.8, 1.0, 1.0]);


    var top = createCylinderTop();
    top.getOrCreateStateSet().setAttributeAndMode(material);
    var body = createCylinderBody();
    body.getOrCreateStateSet().setAttributeAndMode(material);
    var base = createCylinderBase();


    var root = new osg.Node();
    root.addChild(top);
    root.addChild(body);
    //root.addChild(base);
    return root;
}

function createCylinderTop () {
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

    var normals = new Array(faces*3*3);

    for(var f=0; f<faces; f++) {
        // Generate the four coordinates required for each face
        var x1 = Math.cos(angle);
        var y1 =  Math.sin(angle);
        angle += angleIncrement;
        var x2 =  Math.cos(angle);
        var y2 = Math.sin(angle);

        normals[f*3*3] = 0;
        normals[f*3*3+1] = 0;
        normals[f*3*3+2] = 1;

        normals[f*3*3+3] = 0;
        normals[f*3*3+4] = 0;
        normals[f*3*3+5] = 1;

        normals[f*3*3+6] = 0;
        normals[f*3*3+7] = 0;
        normals[f*3*3+8] = 1;
    }

    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(coordinates));

    var normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals ));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.setVertexAttribArray('Normal', normalAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 3*faces));

    return geometry;
}

function createCylinderBase() {
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

function createCylinderBody() {

    // Define the attributes for the cylinder


    var angle = 0.0;
    var angleIncrement = (2*Math.PI)/faces;

    // create an empty array of floats to hold the coordinates
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

    var normals = new Array(faces*2*3*3);

    for(var f=0; f<faces; f++)
    {
        // Generate the four coordinates required for each face
        var n1x = Math.cos(angle);
        var n1y = Math.sin(angle);
        angle += angleIncrement;
        var n2x = Math.cos(angle);
        var n2y = Math.sin(angle);

        // Populate the coordinates array
        normals[f*2*3*3] = n1x;
        normals[f*2*3*3+1] = n1y;
        normals[f*2*3*3+2] = 0;

        normals[f*2*3*3+3] = n2x;
        normals[f*2*3*3+4] = n2y;
        normals[f*2*3*3+5] = 0;

        normals[f*2*3*3+6] = n1x;
        normals[f*2*3*3+7] = n1y;
        normals[f*2*3*3+8] = 0;

        normals[f*2*3*3+9] = n1x;
        normals[f*2*3*3+10] = n1y;
        normals[f*2*3*3+11] = 0;

        normals[f*2*3*3+12] = n2x;
        normals[f*2*3*3+13] = n2y;
        normals[f*2*3*3+14] = 0;

        normals[f*2*3*3+15] = n2x;
        normals[f*2*3*3+16] = n2y;
        normals[f*2*3*3+17] = 0;
    }


    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(coordinates));

    var normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals ));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.setVertexAttribArray('Normal', normalAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 6*faces));

    return geometry;

}

