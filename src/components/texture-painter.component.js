AFRAME.registerComponent('texture-painter', {
    schema: {},
    init: function () {

        this.el.sceneEl.addEventListener('camera-set-active', this.cameraSetActive.bind(this));
        this.el.sceneEl.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        this.el.sceneEl.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );
        this.el.sceneEl.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );

        planeTexture = new THREE.Texture( undefined, THREE.UVMapping, THREE.MirroredRepeatWrapping, THREE.MirroredRepeatWrapping );
        var planeMaterial = new THREE.MeshBasicMaterial( { map: planeTexture } );
        this.mesh = this.el.getObject3D('mesh');
        this.mesh.material = planeMaterial;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.onClickPosition = new THREE.Vector2();

        this.renderer = this.el.sceneEl.renderer;

        this.parentTexture = planeTexture;
        this._parentTexture = [];

        this._canvas = document.createElement( "canvas" );
        this._canvas.width = this._canvas.height = 1024;
        this._context2D = this._canvas.getContext( "2d" );
    
        this.parentTexture.image = this._canvas;
        
        this._background = document.createElement( "img" );
        this._background.addEventListener( "load", function () {
    
            this._canvas.width = this._background.naturalWidth;
            this._canvas.height = this._background.naturalHeight;
    
            if ( ! this._context2D ) return;
        
            this._context2D.clearRect( 0, 0, this._canvas.width, this._canvas.height );

            // Background.
            this._context2D.drawImage( this._background, 0, 0 );
            this.parentTexture.needsUpdate = true;
    
        }.bind(this), false );
        this._background.crossOrigin = '';
        this._background.src = require("./UV_Grid_Sm.jpg").default;
    
        
    },
    cameraSetActive: function() {
        this.camera = this.el.sceneEl.camera;
    },
    _draw: function (x, y) {
        
        if (this.lastX != null && this.lastY != null) {

            this._context2D.beginPath();
            this._context2D.strokeStyle = "rgba(255,255,255,0.9)";
            this._context2D.lineJoin = 'round';
            this._context2D.lineWidth = 10;
            this._context2D.moveTo(this.lastX, this.lastY);
            this._context2D.lineTo(x, y);
            this._context2D.closePath();
            this._context2D.stroke();
            
            this.parentTexture.needsUpdate = true;
            this.lastX = x;
            this.lastY = y;
        }
            
    },


    onMouseMove: function ( evt ) {

        evt.preventDefault();

        var array = this.getMousePosition( this.renderer.domElement, evt.clientX, evt.clientY );
        this.onClickPosition.fromArray( array );

        var intersects = this.getIntersects( this.onClickPosition, [this.el.getObject3D('mesh')] );

        if ( intersects.length > 0 && intersects[ 0 ].uv ) {

            var uv = intersects[ 0 ].uv;
            intersects[ 0 ].object.material.map.transformUv( uv );
            this._draw( uv.x * this._canvas.width, uv.y * this._canvas.height);
        }

    },
    onMouseDown: function(evt) {
        evt.preventDefault();

        var array = this.getMousePosition( this.renderer.domElement, evt.clientX, evt.clientY );
        this.onClickPosition.fromArray( array );

        var intersects = this.getIntersects( this.onClickPosition, [this.el.getObject3D('mesh')] );

        if ( intersects.length > 0 && intersects[ 0 ].uv ) {

            var uv = intersects[ 0 ].uv;
            intersects[ 0 ].object.material.map.transformUv( uv );

            this.lastX = uv.x * this._canvas.width;
            this.lastY = uv.y * this._canvas.height;

        }
    },
    onMouseUp: function (evt) {
        evt.preventDefault();
        this.lastX = null;
        this.lastY = null;
    },

    getMousePosition: function ( dom, x, y ) {

        var rect = this.renderer.domElement.getBoundingClientRect();
        return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

    },

    getIntersects: function ( point, objects ) {

        this.mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

        this.raycaster.setFromCamera( this.mouse, this.camera );

        return this.raycaster.intersectObjects( objects );

    }

  });