
function createScene() {

    var root = new osg.Node();

    osgDB.readNodeURL('res/models/falcon/Millennium_Falcon.osgjs').then(function(model){
        root.addChild( model );
    });

    return root;
}
