
function createScene() {

    var root = new osg.Node();

    var boxSize = 5;
    var box = osg.createTexturedBox(0, 0, 0, boxSize, boxSize, boxSize);
    var material = new osg.Material();
    material.setDiffuse([1.0, 1.0, 0.2, 1.0]);
    box.getOrCreateStateSet().setAttributeAndMode(material);

    var switchNode = new ee497.Switch();
    root.addChild(switchNode);

    var leftMatrix = new osg.Matrix.create();
    leftMatrix = osg.Matrix.makeTranslate(-10, 0, 0, leftMatrix);
    var leftMatrixTransform = new osg.MatrixTransform();
    leftMatrixTransform.setMatrix(leftMatrix);
    switchNode.addChild(leftMatrixTransform, false);
    leftMatrixTransform.addChild(box);

    var centreMatrix = new osg.Matrix.create();
    centreMatrix = osg.Matrix.makeTranslate(0, 0, 0, centreMatrix);
    var centreMatrixTransform = new osg.MatrixTransform();
    centreMatrixTransform.setMatrix(centreMatrix);
    switchNode.addChild(centreMatrixTransform, false);
    centreMatrixTransform.addChild(box);

    var rightMatrix = new osg.Matrix.create();
    rightMatrix = osg.Matrix.makeTranslate(10, 0, 0, rightMatrix);
    var rightMatrixTransform = new osg.MatrixTransform();
    rightMatrixTransform.setMatrix(rightMatrix);
    switchNode.addChild(rightMatrixTransform, false);
    rightMatrixTransform.addChild(box);

    switchNode.setChildValue(leftMatrixTransform, true);
    switchNode.setChildValue(centreMatrixTransform, false);
    switchNode.setChildValue(rightMatrixTransform, true);

    return root;
}