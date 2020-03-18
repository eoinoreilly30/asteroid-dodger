
function init() {
    disableDefaultLight();
}

function createScene() {

    var vertexAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexAttribArray.setElements(new Float32Array(
        [  -1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            0.0, 0.0, 1.0  ]));

    var colorAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 4);
    colorAttribArray.setElements(new Float32Array(
       [    1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1     ]));

    var geometry = new osg.Geometry();
    geometry.setVertexAttribArray('Vertex', vertexAttribArray);
    geometry.setVertexAttribArray('Color', colorAttribArray);
    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 3));

    var root = new osg.Node();
    root.addChild(geometry);
    return root;
}

