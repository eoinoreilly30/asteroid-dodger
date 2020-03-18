
var SimpleUpdateCallback = function() {};

SimpleUpdateCallback.prototype = {

    rateOfRotationRadsPerSecond: 2 * Math.PI,

    update: function(node, nodeVisitor) {
        
        var currentTimeSeconds = nodeVisitor.getFrameStamp().getSimulationTime();
        
        var matrix = node.getMatrix();
        var angle = currentTimeSeconds * this.rateOfRotationRadsPerSecond;
        osg.Matrix.makeRotate(angle, 0.0, 0.0, 1.0, matrix);

        return true;
    }
};

function createScene() {
    var root = new osg.Node();

    var matrixTransform = new osg.MatrixTransform();

    var size = 7;
    var cube = osg.createTexturedBoxGeometry(0,0,0, size,size,size);
    matrixTransform.addChild(cube);

    var material = new osg.Material();
    material.setDiffuse([1.0, 1.0, 0.2, 1.0]);
    cube.getOrCreateStateSet().setAttributeAndModes(material);

    var updateCallback = new SimpleUpdateCallback();
    updateCallback.rateOfRotationRadsPerSecond = 2 * Math.PI;
    matrixTransform.addUpdateCallback(updateCallback);

    root.addChild(matrixTransform);

    return root;
}
