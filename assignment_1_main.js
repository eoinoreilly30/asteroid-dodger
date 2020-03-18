const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const UP_ARROW = 38;
const DOWN_ARROW = 40;
const H_KEY = 72;

const ROCK_Z_START_POS = 50;
const ROCK_SPEED = 10;
const ROCK_RADIUS = 0.2;

let root;

let shipXPos = 0;
let shipYPos = -2;
let shipZPos = -4;

let shipTransform;
let shipMatrix;

let mainHeadLight;
let mainLightSource;
let mainLightSourceEnabled = true;

let nextLightNumber = 0;
function getNextLightNumber() {
    return nextLightNumber++;
}

function init() {
    let canvas = document.getElementById('canvas');
    canvas.addEventListener('keydown', keyPressed);
    canvas.focus();
    disableDefaultManipulator();
    disableDefaultLight()
}

function createScene() {
    root = new osg.Node();

    mainLightSource = createDirectionalLightSource(0, 0.5, -1, 1.0, 1.0, 1.0); //off set ot show shadows
    root.addChild(mainLightSource);

    let ship = createShip(shipXPos, shipYPos, shipZPos, 1);
    shipTransform = ship[0];
    shipMatrix = ship[1];
    root.addChild(shipTransform);

    root.addChild(createBackground());

    setInterval(createRock, 200);

    return root;
}

function createBackground() {
    let sizeX = 150;
    let sizeY = sizeX*1.777; // 1980x1080 ratio

    let background = osg.createTexturedBoxGeometry(0, 0, 50, sizeY, sizeX, 0.001);

    let texture = new osg.Texture();
    osgDB.readImageURL('background_texture.jpg').then(function (image) {
        texture.setImage(image);
        background.getOrCreateStateSet().setTextureAttributeAndModes(0, texture);
    });
    return background;
}

function swapLights() {
    if(mainLightSourceEnabled) {
        mainLightSource.getLight().setEnabled(false);
        mainHeadLight.getLight().setEnabled(true);
        mainLightSourceEnabled = false;
    } else {
        mainLightSource.getLight().setEnabled(true);
        mainHeadLight.getLight().setEnabled(false);
        mainLightSourceEnabled = true;
    }
}

function keyPressed(event) {
    let keyCode = event.keyCode;

    switch(keyCode) {
        case UP_ARROW:
            shipYPos++;
            break;
        case DOWN_ARROW:
            shipYPos--;
            break;
        case LEFT_ARROW:
            shipXPos++;
            break;
        case RIGHT_ARROW:
            shipXPos--;
            break;
        case H_KEY:
            swapLights();
            break;
    }

    let matrix = new osg.Matrix.create();
    matrix = osg.Matrix.makeTranslate(shipXPos, shipYPos+2, shipZPos+3, matrix);
    shipTransform.setMatrix(matrix);
}

function createRock() {
    let max_x = 3;
    let min_x = -3;
    let max_y = 3;
    let min_y = -3;

    let x = Math.floor(Math.random() * (max_x - min_x + 1) + min_x);
    let y = Math.floor(Math.random() * (max_y - min_y + 1) + min_y);

    let rock = osg.createTexturedSphere(ROCK_RADIUS);

    let material = new osg.Material();
    material.setDiffuse([0.035, 0.945, 0.815, 1.0]); // cyan
    material.setAmbient([0.031, 0.666, 0.576, 1.0]); // slightly darker cyan
    material.setSpecular([1.0, 1.0, 1.0, 1.0]); // white
    material.setShininess(100); // demonstrates specular
    rock.getOrCreateStateSet().setAttributeAndModes(material);

    let rockDistanceMatrix = new osg.Matrix.create();
    osg.Matrix.makeTranslate(x, y, ROCK_Z_START_POS, rockDistanceMatrix);
    let rockDistanceTransform = new osg.MatrixTransform();
    rockDistanceTransform.setMatrix(rockDistanceMatrix);
    rockDistanceTransform.addChild(rock);

    rockDistanceTransform.addUpdateCallback(new animateRockMotion());

    root.addChild(rockDistanceTransform);
}

let animateRockMotion = function() {};
animateRockMotion.prototype = {
    startTimeSeconds: -1,

    update: function(rockTransform, updateVisitor) {
        let simulationTimeSeconds = updateVisitor.getFrameStamp().getSimulationTime();

        if(this.startTimeSeconds === -1) {
            this.startTimeSeconds = simulationTimeSeconds;
        }

        let rockTravelTimeSeconds = simulationTimeSeconds - this.startTimeSeconds;
        let distanceTravelledMeters = ROCK_SPEED * rockTravelTimeSeconds;

        let matrix = rockTransform.getMatrix();
        let x = matrix[12];
        let y = matrix[13];
        let z = ROCK_Z_START_POS - distanceTravelledMeters;

        checkForCollision(osg.Matrix.makeTranslate(x, y, z, matrix));

        if(z < -10) {
            rockTransform.removeUpdateCallback(this);
            rockTransform.getParents()[0].removeChild(rockTransform);
        }
        return true;
    }
};

function checkForCollision(rockMatrix) {
    let shipBoundingSphere = shipTransform.getBoundingSphere();

    let rockX = rockMatrix[12];
    let rockY = rockMatrix[13];
    let rockZ = rockMatrix[14];

    let shipX = shipBoundingSphere['_center'][0];
    let shipY = shipBoundingSphere['_center'][1];
    let shipZ = shipBoundingSphere['_center'][2];
    let shipRadius = shipBoundingSphere['_radius'];

    let distanceBetweenShipAndRock = Math.sqrt(Math.pow(rockX-shipX, 2)
                                                + Math.pow(rockY-shipY, 2)
                                                + Math.pow(rockZ-shipZ, 2));

    if(distanceBetweenShipAndRock < shipRadius + ROCK_RADIUS) {
        alert('You crashed!');
    }
}

function createShip(x, y, z, length) {
    let engineBodyLength = length*0.5;
    let engineRadius = ROCK_RADIUS*0.5;
    let faces = 10;

    // create shapes
    let mainBody = createCylinderWithCone(ROCK_RADIUS, length, faces);
    let mainBodyEngine = createCone(ROCK_RADIUS*0.85, length*0.33, faces)
    let leftEngine = createCylinderWithCone(engineRadius, engineBodyLength, faces);
    let rightEngine = createCylinderWithCone(engineRadius, engineBodyLength, faces);

    // create headlight
    mainHeadLight = createSpotLight(0, 0, 1, 1, 1, 1, 1, 0, 0, 40, 1.0);
    mainHeadLight.getLight().setEnabled(false);

    // position the main body
    let mainBodyMatrix = new osg.Matrix.create();
    mainBodyMatrix = osg.Matrix.makeTranslate(x, y, z, mainBodyMatrix);
    let mainBodyTransform = new osg.MatrixTransform();
    mainBodyTransform.setMatrix(mainBodyMatrix);
    mainBodyTransform.addChild(mainBody);

    // rotate the cone and attach to back of main body
    let mainEngineRotateMatrix = new osg.Matrix.create();
    mainEngineRotateMatrix = osg.Matrix.makeRotate(Math.PI, 1, 0, 0, mainEngineRotateMatrix);
    let mainEngineRotateTransform = new osg.MatrixTransform();
    mainEngineRotateTransform.setMatrix(mainEngineRotateMatrix);
    mainEngineRotateTransform.addChild(mainBodyEngine);

    let mainEngineTranslateMatrix = new osg.Matrix.create();
    mainEngineTranslateMatrix = osg.Matrix.makeTranslate(x, y, z, mainEngineTranslateMatrix);
    let mainEngineTranslateTransform = new osg.MatrixTransform();
    mainEngineTranslateTransform.setMatrix(mainEngineTranslateMatrix);
    mainEngineTranslateTransform.addChild(mainEngineRotateTransform);

    // attach the side engines
    let leftEngineTranslateMatrix = new osg.Matrix.create();
    leftEngineTranslateMatrix = osg.Matrix.makeTranslate(x-ROCK_RADIUS, y, z, leftEngineTranslateMatrix);
    let leftEngineTranslateTransform = new osg.MatrixTransform();
    leftEngineTranslateTransform.setMatrix(leftEngineTranslateMatrix);
    leftEngineTranslateTransform.addChild(leftEngine);

    let rightEngineTranslateMatrix = new osg.Matrix.create();
    rightEngineTranslateMatrix = osg.Matrix.makeTranslate(x+ROCK_RADIUS, y, z, rightEngineTranslateMatrix);
    let rightEngineTranslateTransform = new osg.MatrixTransform();
    rightEngineTranslateTransform.setMatrix(rightEngineTranslateMatrix);
    rightEngineTranslateTransform.addChild(rightEngine);

    // attach the headlight
    let mainHeadLightTranslateMatrix = new osg.Matrix.create();
    mainHeadLightTranslateMatrix = osg.Matrix.makeTranslate(x, y, z+length, mainHeadLightTranslateMatrix);
    let mainHeadLightTranslateTransform = new osg.MatrixTransform();
    mainHeadLightTranslateTransform.setMatrix(mainHeadLightTranslateMatrix);
    mainHeadLightTranslateTransform.addChild(mainHeadLight);

    let transformArray = [mainBodyTransform,
        mainEngineTranslateTransform,
        leftEngineTranslateTransform,
        rightEngineTranslateTransform,
        mainHeadLightTranslateTransform];
    let mainTransform = new osg.MatrixTransform();
    transformArray.map(tf => mainTransform.addChild(tf));

    return [mainTransform, mainBodyMatrix];
}

function createCylinderWithCone(radius, length, faces) {
    let engineLength = 0.66*length;
    let noseLength = length - engineLength;

    let angle = 0;
    let angleIncrement = (2*Math.PI)/faces;
    let coordinates = [];
    let normals = [];
    let texCoords = [];

    let x0 = radius*Math.cos(angle);
    let y0 = radius*Math.sin(angle);
    let nx0 = Math.cos(angle);
    let ny0 = Math.sin(angle);
    let s0 = 0;

    for(let i=0; i<faces; i++) {
        angle += angleIncrement;

        // coordinates
        let x1 = radius*Math.cos(angle);
        let y1 = radius*Math.sin(angle);

        coordinates.push(0, 0, engineLength+noseLength);
        coordinates.push(x0, y0, engineLength);
        coordinates.push(x1, y1, engineLength);

        coordinates.push(x0, y0, 0);
        coordinates.push(x1, y1, 0);
        coordinates.push(0, 0, 0);

        x0 = x1;
        y0 = y1;

        // normals
        let nx1 = Math.cos(angle);
        let ny1 = Math.sin(angle);

        normals.push(0, 0, 1);
        normals.push(nx0, ny0, 0);
        normals.push(nx1, ny1, 0);

        normals.push(nx0, ny0, -1);
        normals.push(nx1, ny1, -1);
        normals.push(0, 0, -1);

        // textures
        let s1 = angle / (2*Math.PI);

        texCoords.push(0.5, 0.5);
        texCoords.push(0.5 + 0.5*nx0, 0.5 + 0.5*ny0);
        texCoords.push(0.5 + 0.5*nx1, 0.5 + 0.5*ny1);

        texCoords.push(s0, 0.0);
        texCoords.push(s1, 0.0);
        texCoords.push(0.5, 0.5);

        s0 = s1;

        nx0 = nx1;
        ny0 = ny1;
    }

    let geometry = new osg.Geometry();

    let vertexCoordAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexCoordAttribArray.setElements(new Float32Array(coordinates));
    geometry.setVertexAttribArray('Vertex', vertexCoordAttribArray);

    let textureAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 2);
    textureAttribArray.setElements(new Float32Array(texCoords));
    geometry.setVertexAttribArray('TexCoord0', textureAttribArray);

    let normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals));
    geometry.setVertexAttribArray('Normal', normalAttribArray);

    let texture = new osg.Texture();
    osgDB.readImageURL('ship_texture.jpg').then(function (image) {
        texture.setImage(image);
        geometry.getOrCreateStateSet().setTextureAttributeAndModes(0, texture);
    });

    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLE_STRIP, 0, coordinates.length/3));

    return geometry;
}

function createCone(radius, height, faces) {
    let coordinates = [];
    let colors = [];
    let normals = [];
    let texCoords = [];

    let angle = 0;
    let angleIncrement = (2*Math.PI)/faces;

    let x0 = radius*Math.cos(angle);
    let y0 = radius*Math.sin(angle);
    let nx0 = Math.cos(angle);
    let ny0 = Math.sin(angle);
    let s0 = 0;

    for(let i=0; i<faces; i++) {
        angle += angleIncrement;

        // vertices
        let x1 = radius*Math.cos(angle);
        let y1 = radius*Math.sin(angle);

        coordinates.push(0, 0, 0);
        coordinates.push(x1, y1, 0);
        coordinates.push(x0, y0, 0);

        coordinates.push(0, 0, height);

        x0 = x1;
        y0 = y1;

        // normals
        let nx1 = Math.cos(angle);
        let ny1 = Math.sin(angle);

        normals.push(0, 0, -1);
        normals.push(nx1, ny1, 1);
        normals.push(nx0, ny0, 1);

        normals.push(0, 0, 1);

        nx0 = nx1;
        ny0 = ny1;

        // colors
        for(let j=0; j<4; j++) {
            colors.push(0.529, 0.070, 0.070, 1);
        }
    }

    let geometry = new osg.Geometry();

    let vertexCoordAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexCoordAttribArray.setElements(new Float32Array(coordinates));
    geometry.setVertexAttribArray('Vertex', vertexCoordAttribArray);

    let colorAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 4);
    colorAttribArray.setElements(new Float32Array(colors));
    geometry.setVertexAttribArray('Color', colorAttribArray);

    let normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals));
    geometry.setVertexAttribArray('Normal', normalAttribArray);

    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLE_STRIP, 0, coordinates.length/3));

    return geometry;
}

function createDirectionalLightSource(x, y, z, r, g, b) {
    let directionalLight = new osg.Light(getNextLightNumber());
    directionalLight.setPosition([x, y, z, 0.0]);

    directionalLight.setDiffuse([r, g, b, 1.0]);
    directionalLight.setSpecular([r, g, b, 1.0]);
    directionalLight.setAmbient([0.0, 0.0, 0.0, 1.0]); // no need i.e. light source doesn't generate

    let lightSource = new osg.LightSource();
    lightSource.setLight(directionalLight);

    return lightSource;
}

function createSpotLight(x, y, z, r, g, b, c, l, q, cutoff, blend) {
    let spotLight = new osg.Light(getNextLightNumber());

    spotLight.setPosition([0, 0, 0, 1]);
    spotLight.setDirection([x, y, z]);

    spotLight.setDiffuse([r, g, b, 1.0]);
    spotLight.setSpecular([r, g, b, 1.0]);
    spotLight.setAmbient([0.0, 0.0, 0.0, 1.0]); // no need i.e. light source doesn't generate

    spotLight.setConstantAttenuation(c);
    spotLight.setLinearAttenuation(l);
    spotLight.setQuadraticAttenuation(q);

    spotLight.setSpotCutoff(cutoff);
    spotLight.setSpotBlend(blend);

    let lightSource = new osg.LightSource();
    lightSource.setLight(spotLight);
    return lightSource;
}