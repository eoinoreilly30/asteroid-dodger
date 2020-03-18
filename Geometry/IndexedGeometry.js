
function init() {
    disableDefaultLight();
}

function createScene() {

    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(
        [  -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
         0.0, 0.0, 1.0]));

    var indices = new osg.BufferArray(osg.BufferArray.ELEMENT_ARRAY_BUFFER, null, 1 );
    indices.setElements(new Uint16Array(
        [ 0, 2, 1,
          0, 3, 2,
          0, 1, 4,
          1, 2, 4,
          4, 2, 3,
          3, 0, 4 ]));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.getPrimitives().push(new osg.DrawElements(osg.PrimitiveSet.TRIANGLES, indices));

    var root = new osg.Node();
    root.addChild(geometry);
    return root;
}