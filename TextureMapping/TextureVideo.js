
function createScene() {

        var root = new osg.Node();

        var videoElement = document.createElement("video");
        videoElement.preload = 'auto';
        videoElement.loop = true;
        videoElement.crossOrigin = 'anonymous';
        videoElement.src = 'http://d8d913s460fub.cloudfront.net/videoserver/cat-test-video-320x240.mp4';

        var image = new osg.ImageStream( videoElement );
        image.whenReady().then( function ( imageStream ) {

            var w, h;
            w = imageStream.getWidth();
            h = imageStream.getHeight();

            var model = this.getOrCreateModel( w, h );

            root.addChild( model );
            var texture = new osg.Texture();
            texture.setImage( image );

            var stateSet = model.getOrCreateStateSet();
            stateSet.setTextureAttributeAndModes( 0, texture );

            //this._viewer.getManipulator().computeHomePosition();

            imageStream.play();

        });

        return root;
}

function  getOrCreateModel( width, height ) {

    var model = osg.createTexturedQuadGeometry( -width / 2, 0, -height / 2, width, 0, 0,  0, 0, height );
    return model;
}
