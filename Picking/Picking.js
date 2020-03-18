function init() {
    enablePicking();
}

function createScene() {

    var root = new osg.Node();

    var boxSize = 5;

    var cube1 = osg.createTexturedBox(0, 0, 0, boxSize, boxSize, boxSize);
    var material1 = new osg.Material();
    material1.setDiffuse([1.0, 1.0, 0.2, 1.0]);
    cube1.getOrCreateStateSet().setAttributeAndMode(material1);
    cube1.onpick = function() {
        alert("cube 1 picked");
    }

    var leftMatrix = new osg.Matrix.create();
    leftMatrix = osg.Matrix.makeTranslate(-10, 0, 0, leftMatrix);
    var leftMatrixTransform = new osg.MatrixTransform();
    leftMatrixTransform.setMatrix(leftMatrix);
    root.addChild(leftMatrixTransform);
    leftMatrixTransform.addChild(cube1);

    var cube2 = osg.createTexturedBox(0, 0, 0, boxSize, boxSize, boxSize);
    var material2 = new osg.Material();
    material2.setDiffuse([1.0, 1.0, 0.2, 1.0]);
    cube2.getOrCreateStateSet().setAttributeAndMode(material2);
    cube2.onpick = function() {
        alert("cube 2 picked");
    }

    var centreMatrix = new osg.Matrix.create();
    centreMatrix = osg.Matrix.makeTranslate(0, 0, 0, centreMatrix);
    var centreMatrixTransform = new osg.MatrixTransform();
    centreMatrixTransform.setMatrix(centreMatrix);
    root.addChild(centreMatrixTransform);
    centreMatrixTransform.addChild(cube2);

    var cube3 = osg.createTexturedBox(0, 0, 0, boxSize, boxSize, boxSize);
    var material3 = new osg.Material();
    material3.setDiffuse([1.0, 1.0, 0.2, 1.0]);
    cube3.getOrCreateStateSet().setAttributeAndMode(material3);
    cube3.onpick = function() {
        alert("cube 3 picked");
    }

    var rightMatrix = new osg.Matrix.create();
    rightMatrix = osg.Matrix.makeTranslate(10, 0, 0, rightMatrix);
    var rightMatrixTransform = new osg.MatrixTransform();
    rightMatrixTransform.setMatrix(rightMatrix);
    root.addChild(rightMatrixTransform);
    rightMatrixTransform.addChild(cube3);

    return root;
}
