//var KEY_CODE_SPACE = 32;
var KEY_CODE_LEFT_ARROW = 37;
var KEY_CODE_UP_ARROW = 38;
var KEY_CODE_RIGHT_ARROW = 39;
var KEY_CODE_DOWN_ARROW = 40;

var heading = Math.PI / 2; // Heading with respect to +ve x axis
var headingDelta = Math.PI/72; // 2.5 degrees
var eyeHeight = 1;

function init() {
    var canvas = document.getElementById("canvas");
     canvas.addEventListener("keydown", keyPressed);
     canvas.focus();
}

function keyPressed(event) {

    var keyCode = event.keyCode;

    var transX = 0;
    var transY = 0;

    if(keyCode == KEY_CODE_UP_ARROW) {
        transX = Math.cos(heading);
        transY = Math.sin(heading);
    }
    else if(keyCode == KEY_CODE_DOWN_ARROW) {
        transX = -Math.cos(heading);
        transY = -Math.sin(heading);
    }
    else if(keyCode == KEY_CODE_LEFT_ARROW) {
        heading += headingDelta;
    }
    else if(keyCode == KEY_CODE_RIGHT_ARROW) {
        heading -= headingDelta;
    }

    updateManipulator(transX, transY, heading);
 }

 function updateManipulator(targetTransX, targetTransY, viewDirection) {
     var manipulator = viewer.getManipulator();
     var currentTarget = osg.Vec3.create();
     manipulator.getTarget(currentTarget);

     var targetTranslation = osg.Vec3.createAndSet(targetTransX, targetTransY, 0.0);

     var newTarget = osg.Vec3.create();
     osg.Vec3.add(currentTarget, targetTranslation, newTarget);
     newTarget[2] = eyeHeight;
     manipulator.setTarget(newTarget);

     manipulator.setEyePosition([newTarget[0]-Math.cos(viewDirection),newTarget[1]-Math.sin(viewDirection),eyeHeight]);
 }


function createScene() {

    root = new osg.Node();

    var height = 10;
    var width = 3;
    var depth = 3;
    for(var x=-60; x<60; x+=10)
        for(var y=-60; y<60; y+=10) {

            var translateMatrix = new osg.Matrix.create();
            translateMatrix = osg.Matrix.makeTranslate(0, 0, 5, translateMatrix);
            var translateMatrixTransform = new osg.MatrixTransform();
            translateMatrixTransform.setMatrix(translateMatrix);
            root.addChild(translateMatrixTransform);

            var building = osg.createTexturedBoxGeometry(x, y, 0, width, depth, height);
            building.getOrCreateStateSet().setTextureAttributeAndModes(0, osg.Texture.createFromURL("res/textures/building.jpg"));
            translateMatrixTransform.addChild(building);
        }

    return root;
}