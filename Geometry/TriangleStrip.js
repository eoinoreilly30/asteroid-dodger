function init() {
    disableDefaultLight();
}

function createScene() {

    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(
        [  -1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 0.0, 1.0,
            2.0, 0.0, 1.0,
            1.0, 0.0, 2.0,
            3.0, 0.0, 2.0]));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLE_STRIP, 0, 6));

    var root = new osg.Node();
    root.addChild(geometry);
    return root;
}
