

var SimpleUpdateCallback = function() {};
SimpleUpdateCallback.prototype = {
    // rotation angle
    angle: 0,

    update: function(node, nodeVisitor) {
        var t = nodeVisitor.getFrameStamp().getSimulationTime();
        var dt = t - node._lastUpdate;
        if (dt < 0) {
            return true;
        }
        node._lastUpdate = t;

        // rotation
        var matrix = node.getMatrix();
        osg.Matrix.makeRotate(this.angle, 0.0, 0.0, 1.0, matrix);
        osg.Matrix.setTrans(matrix, 0, 0, 0);
        this.angle += 0.01;
        return true;
    }
};

Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

function createScene() {

    var root = new osg.Node();

    var boxSize = 5;

    var redBox = osg.createTexturedBox(0, 0, 0, boxSize, boxSize, boxSize);
    var redMaterial = new osg.Material();
    redMaterial.setDiffuse([1.0, 0.2, 0.2, 1.0]);
    redBox.getOrCreateStateSet().setAttributeAndMode(redMaterial);

    var greenBox = osg.createTexturedBox(0, 0, 0, boxSize, boxSize, boxSize);
    var greenMaterial = new osg.Material();
    greenMaterial.setDiffuse([0.2, 1.0, 0.2, 1.0]);
    greenBox.getOrCreateStateSet().setAttributeAndMode(greenMaterial);

    var blueBox = osg.createTexturedBox(0, 0, 0, boxSize, boxSize, boxSize);
    var blueMaterial = new osg.Material();
    blueMaterial.setDiffuse([0.2, 0.2, 1.0, 1.0]);
    blueBox.getOrCreateStateSet().setAttributeAndMode(blueMaterial);

    var lod = new osg.Lod();
    lod.addChild(redBox, 0, 25);
    lod.addChild(greenBox, 25, 50);
    lod.addChild(blueBox, 50, 1000);

    root.addChild(lod);

    return root;
}

function createColoredBox() {

}
