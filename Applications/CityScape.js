


function init() {

    setManipulator(new osgGA.FirstPersonManipulator());
}

function createScene() {

    root = new osg.Node();

    var height = 10;
    var width = 3;
    var depth = 3;
    for(var x=-60; x<60; x+=10)
        for(var y=-60; y<60; y+=10) {
            var box = osg.createTexturedBoxGeometry(x, y, 0, width, depth, height);
            box.getOrCreateStateSet().setTextureAttributeAndModes(0, osg.Texture.createFromURL("res/textures/building.jpg"));
            root.addChild(box);
        }


    return root;
}