
function createScene() {

    var root = new osg.Node();

    var boxSize = 5;
    var cube = osg.createTexturedBox(0, 0, 0, boxSize, boxSize, boxSize);
    var material = new osg.Material();
    material.setDiffuse([1.0, 1.0, 0.2, 1.0]);
    cube.getOrCreateStateSet().setAttributeAndMode(material);

    var leftMatrix = new osg.Matrix.create();
    leftMatrix = osg.Matrix.makeTranslate(-10, 0, 0, leftMatrix);
    var leftMatrixTransform = new osg.MatrixTransform();
    leftMatrixTransform.setMatrix(leftMatrix);
    root.addChild(leftMatrixTransform);
    leftMatrixTransform.addChild(cube);

    var centreMatrix = new osg.Matrix.create();
    centreMatrix = osg.Matrix.makeTranslate(0, 0, 0, centreMatrix);

    var centreMatrixTransform = new osg.MatrixTransform();
    centreMatrixTransform.setMatrix(centreMatrix);
    root.addChild(centreMatrixTransform);
    centreMatrixTransform.addChild(cube);

    var rightMatrix = new osg.Matrix.create();
    rightMatrix = osg.Matrix.makeTranslate(10, 0, 0, rightMatrix);
    var rightMatrixTransform = new osg.MatrixTransform();
    rightMatrixTransform.setMatrix(rightMatrix);
    root.addChild(rightMatrixTransform);
    rightMatrixTransform.addChild(cube);

    return root;
}
