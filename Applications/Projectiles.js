var KEY_CODE_SPACE = 32;
var KEY_CODE_LEFT_ARROW = 37;
var KEY_CODE_UP_ARROW = 38;
var KEY_CODE_RIGHT_ARROW = 39;
var KEY_CODE_DOWN_ARROW = 40;

var root;

var upDownAngle = 0;//Math.PI/2;
var upDownMatrix;
var upDownTransform;

var leftRightAngle = 0;
var leftRightMatrix;
var leftRightTransform;



function init() {
    var canvas = document.getElementById("canvas");
    //canvas.setAttribute("tabindex", "1");
    canvas.addEventListener("keydown", keyPressed);
    canvas.focus();

    disableDefaultManipulator();
}

function createScene() {

    var cylinder = createSolidCylinderWithNormalsAndTextureCoordinates(0.4, 4.0, 20);

    upDownMatrix = new osg.Matrix.create();
    osg.Matrix.makeRotate(upDownAngle, -1.0, 0.0, 0.0, upDownMatrix);
    upDownTransform = new osg.MatrixTransform(upDownMatrix);
    upDownTransform.setMatrix(upDownMatrix);
    upDownTransform.addChild(cylinder);

    leftRightMatrix = new osg.Matrix.create();
    osg.Matrix.makeRotate(leftRightAngle, 0.0, 0.0, 1.0, leftRightMatrix);
    leftRightTransform = new osg.MatrixTransform();
    leftRightTransform.setMatrix(leftRightMatrix);
    leftRightTransform.addChild(upDownTransform);

    root = new osg.Node();
    root.addChild(leftRightTransform);
    return root;
}

function keyPressed(event) {
    var keyCode = event.keyCode;

    var angleIncrement = 0.05;
    if(keyCode == KEY_CODE_DOWN_ARROW)
        upDownAngle -= angleIncrement;
    else if(keyCode == KEY_CODE_UP_ARROW)
        upDownAngle += angleIncrement;
    else if(keyCode == KEY_CODE_LEFT_ARROW)
        leftRightAngle += angleIncrement;
    else if(keyCode == KEY_CODE_RIGHT_ARROW)
        leftRightAngle -= angleIncrement;
    else if(keyCode == KEY_CODE_SPACE)
        createProjectile();

    osg.Matrix.makeRotate(upDownAngle, -1.0, 0.0, 0.0, upDownMatrix);
    upDownTransform.setMatrix(upDownMatrix);

    osg.Matrix.makeRotate(leftRightAngle, 0.0, 0.0, 1.0, leftRightMatrix);
    leftRightTransform.setMatrix(leftRightMatrix);
}


var SimpleUpdateCallback = function() {};

SimpleUpdateCallback.prototype = {

    distance: 0,
    startTimeSeconds: -1,
    velocityMetersPerSecond: 50,

    update: function(node, nodeVisitor) {

        var simulationTimeSeconds = nodeVisitor.getFrameStamp().getSimulationTime();
        if(this.startTimeSeconds == -1)
            this.startTimeSeconds = simulationTimeSeconds;

        var projectileTravelTimeSeconds = simulationTimeSeconds - this.startTimeSeconds;

        var distanceTravelledMeters = this.velocityMetersPerSecond * projectileTravelTimeSeconds;

        var matrix = node.getMatrix();
        osg.Matrix.makeTranslate( 0.0, 0.0, distanceTravelledMeters, matrix);

        if(distanceTravelledMeters > 100) {
            node.removeUpdateCallback(this);
            node.getParents()[0].removeChild(node);
        }

        return true;
    }
};

function createProjectile(){

    var sphere = osg.createTexturedSphere(0.4);

    var projectileDistanceMatrix = new osg.Matrix.create();
    osg.Matrix.makeTranslate(0, 0, 0, projectileDistanceMatrix);
    var projectileDistanceTransform = new osg.MatrixTransform();
    projectileDistanceTransform.setMatrix(projectileDistanceMatrix);
    projectileDistanceTransform.addChild(sphere);

    var updateCallback = new SimpleUpdateCallback();
    projectileDistanceTransform.addUpdateCallback(updateCallback);

    var projectileUpDownMatrix = new osg.Matrix.create();
    osg.Matrix.makeRotate(upDownAngle, -1.0, 0.0, 0.0, projectileUpDownMatrix);
    var projectileUpDownTransform = new osg.MatrixTransform();
    projectileUpDownTransform.setMatrix(projectileUpDownMatrix);
    projectileUpDownTransform.addChild(projectileDistanceTransform);

    var projectileLeftRightMatrix = new osg.Matrix.create();
    osg.Matrix.makeRotate(leftRightAngle, 0.0, 0.0, 1.0, projectileLeftRightMatrix);
    var projectileLeftRightTransform = new osg.MatrixTransform();
    projectileLeftRightTransform.setMatrix(projectileLeftRightMatrix);
    projectileLeftRightTransform.addChild(projectileUpDownTransform);

    root.addChild(projectileLeftRightTransform);
}





function createSolidCylinderWithNormalsAndTextureCoordinates(radius, height, faces) {

    var angle = 0;
    var angleIncrement = (2*Math.PI)/faces;
    var coordinates = new Array();
    var normals = new Array();
    var texCoords = new Array();

    var x0 = radius*Math.cos(angle);
    var y0 = radius*Math.sin(angle);
    var nx0 = Math.cos(angle);
    var ny0 = Math.sin(angle);
    var cosAngle0 = Math.cos(angle);
    var sineAngle0 = Math.sin(angle);
    var s0 = 0;
    var z = height/2;

    for(var f=0; f<faces; f++) {

        angle += angleIncrement;
        var cosAngle1 = Math.cos(angle);
        var sinAngle1 = Math.sin(angle);

        /* Coordinates */ {

            var x1 = radius*Math.cos(angle);
            var y1 = radius*Math.sin(angle);

            coordinates.push(0, 0, z);
            coordinates.push(x0, y0, z);
            coordinates.push(x1, y1, z);

            coordinates.push(x0, y0, -z);
            coordinates.push(x1, y1, z);
            coordinates.push(x0, y0, z);

            coordinates.push(x0, y0, -z);
            coordinates.push(x1, y1, -z);
            coordinates.push(x1, y1, z);

            coordinates.push(x1, y1, -z);
            coordinates.push(x0, y0, -z);
            coordinates.push(0, 0, -z);

            x0 = x1;
            y0 = y1;
        }
        var nx1 = Math.cos(angle);
        var ny1 = Math.sin(angle);

        /* Normals */ {
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);
            normals.push(0, 0, 1);

            normals.push(nx0, ny0, 0);
            normals.push(nx1, ny1, 0);
            normals.push(nx0, ny0, 0);

            normals.push(nx0, ny0, 0);
            normals.push(nx1, ny1, 0);
            normals.push(nx1, ny1, 0);

            normals.push(0, 0, -1);
            normals.push(0, 0, -1);
            normals.push(0, 0, -1);
        }

        /* Texture coordinates */ {

            var s1 = angle / (2*Math.PI);

            texCoords.push(0.5, 0.5);
            texCoords.push(0.5 + 0.5*nx0, 0.5 + 0.5*ny0);
            texCoords.push(0.5 + 0.5*nx1, 0.5 + 0.5*ny1);

            texCoords.push(s0, 0.0);
            texCoords.push(s1, 1.0);
            texCoords.push(s0, 1.0);

            texCoords.push(s0, 0.0);
            texCoords.push(s1, 0.0);
            texCoords.push(s1, 1.0);

            texCoords.push(0.5 + 0.5*nx1, 0.5 - 0.5*ny1);
            texCoords.push(0.5 + 0.5*nx0, 0.5 - 0.5*ny0);
            texCoords.push(0.5, 0.5);

            s0 = s1;
        }

        nx0 = nx1;
        ny0 = ny1;
    }

    var geometry = new osg.Geometry();

    var vertexCoordAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexCoordAttribArray.setElements(new Float32Array(coordinates));
    geometry.setVertexAttribArray('Vertex', vertexCoordAttribArray);

    var textureAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 2);
    textureAttribArray.setElements(new Float32Array(texCoords));
    geometry.setVertexAttribArray('TexCoord0', textureAttribArray);

    var normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals ));
    geometry.setVertexAttribArray('Normal', normalAttribArray);

    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, 6*faces+3*faces+3*faces));

    return geometry;
}