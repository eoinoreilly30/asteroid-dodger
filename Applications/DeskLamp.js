


function init() {
    //disableDefaultLight();
    enablePicking();
}

var ON = true;
var OFF = false;

function createScene() {
    var root = new osg.Node();

    var floor = osg.createTexturedBoxGeometry(0, 0, 0, 10, 10, 0.001);
    root.addChild(floor);

    var lamp1 = createLamp(2, 2, 1.0, 1.0, 0.0);
    root.addChild(lamp1);

    var lamp2 = createLamp(0, 0, 1.0, 0.0, 0.0);
    root.addChild(lamp2);

    var lamp3 = createLamp(0, -1, 0.0, 0.0, 1.0);
    root.addChild(lamp3);

    return root;
}

function createLamp(x, y, r, g, b) {

    var localRoot = new osg.Node();

    var defaultMaterial = new osg.Material();
    defaultMaterial.setDiffuse([0.5, 0.5, 0.5, 1.0]);

    var emissiveMaterial = new osg.Material();
    emissiveMaterial.setEmission([r, g, b, 1.0]);

    var baseRadiusMeters = 0.3;
    var base = createSolidCylinderWithNormalsAndTextureCoordinates(baseRadiusMeters, 0.1, 20);
    base.getOrCreateStateSet().setAttributeAndModes(defaultMaterial);
    var baseMatrix = new osg.Matrix.create();
    baseMatrix = osg.Matrix.makeTranslate(x, y, 0.0, baseMatrix);
    var baseMatrixTransform = new osg.MatrixTransform();
    baseMatrixTransform.setMatrix(baseMatrix);
    baseMatrixTransform.addChild(base);
    localRoot.addChild(baseMatrixTransform);

    var column = createSolidCylinderWithNormalsAndTextureCoordinates(0.05, 1, 20);
    var columnMatrix = new osg.Matrix.create();
    columnMatrix = osg.Matrix.makeTranslate(x, y, 0.5, columnMatrix);
    var columnMatrixTransform = new osg.MatrixTransform();
    columnMatrixTransform.setMatrix(columnMatrix);
    columnMatrixTransform.addChild(column);
    localRoot.addChild(columnMatrixTransform);

    var light = createPointLight(r, g, b, 0.0, 0.0, 1.0);
    light.getLight().setEnabled(false);

    var bulb = osg.createTexturedSphere(0.2, 20, 20);
    bulb.bulbState = OFF;
    bulb.getOrCreateStateSet().setAttributeAndModes(defaultMaterial);
    bulb.onpick = function() {
        bulb.bulbState = !bulb.bulbState;
        if(bulb.bulbState == true) {
            light.getLight().setEnabled(true);
            bulb.getOrCreateStateSet().setAttributeAndModes(emissiveMaterial);
        }
        else {
            light.getLight().setEnabled(false);
            bulb.getOrCreateStateSet().setAttributeAndModes(defaultMaterial);
        }
    }
    var bulbMatrix = new osg.Matrix.create();
    bulbMatrix = osg.Matrix.makeTranslate(x, y, 1.0, bulbMatrix);
    var bulbMatrixTransform = new osg.MatrixTransform();

    bulbMatrixTransform.setMatrix(bulbMatrix);
    bulbMatrixTransform.addChild(light);
    bulbMatrixTransform.addChild(bulb);



    localRoot.addChild(bulbMatrixTransform);
    return localRoot;
}

var nextLightNumber = 1;
function getNextLightNumber() {
    return nextLightNumber++;
}

function createPointLight(r, g, b, c, l, q) {

    var lightNumber = getNextLightNumber();
    var pointLight = new osg.Light(lightNumber);
    pointLight.setPosition([0, 0, 0, 1]);

    if(typeof r === 'undefined') r = 0.8;
    if(typeof g === 'undefined') g = 0.8;
    if(typeof b === 'undefined') b = 0.8;
    pointLight.setDiffuse([r, g, b, 1.0]);
    pointLight.setSpecular([r, g, b, 1.0]);
    pointLight.setAmbient([0.0, 0.0, 0.0, 1.0]);

    if(typeof c === 'undefined') c = 1.0;
    if(typeof l === 'undefined') l = 0.0;
    if(typeof q === 'undefined') q = 0.0;
    pointLight.setConstantAttenuation(c);
    pointLight.setLinearAttenuation(l);
    pointLight.setQuadraticAttenuation(q);

    var lightSource = new osg.LightSource();
    lightSource.setLight(pointLight);

    return lightSource;
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