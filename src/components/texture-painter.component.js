import io from 'socket.io-client';
 
const socket = io();

AFRAME.registerComponent('texture-painter', {
    schema: {},
    init: function () {

        this.id = Math.floor(Math.random() * 100000000);

        this.el.sceneEl.addEventListener('camera-set-active', this.cameraSetActive.bind(this));
        this.el.sceneEl.addEventListener( 'mousemove', this.onMouseMove.bind(this), false );
        this.el.sceneEl.addEventListener( 'touchmove', this.onMouseMove.bind(this), false );
        this.el.sceneEl.addEventListener( 'mouseup', this.onMouseUp.bind(this), false );
        this.el.sceneEl.addEventListener( 'touchend', this.onMouseUp.bind(this), false );
        this.el.sceneEl.addEventListener( 'mousedown', this.onMouseDown.bind(this), false );
        this.el.sceneEl.addEventListener( 'touchstart', this.onMouseDown.bind(this), false );

        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycasterObj = evt.detail.el;
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            this.lastX = null;
            this.lastY = null;
            this.raycasterObj = null;
        });

        var controllers = document.querySelectorAll(".controller");
        controllers.forEach((controller) => {
            controller.addEventListener('triggerdown', evt => {
                this.triggerdown = true;
            });
            controller.addEventListener('triggerup', evt => {
                this.triggerdown = false;
            });
        })
        

        var planeTexture = new THREE.Texture( undefined, THREE.UVMapping, THREE.MirroredRepeatWrapping, THREE.MirroredRepeatWrapping );
        var planeMaterial = new THREE.MeshPhongMaterial( { map: planeTexture, shininess: 50 } );
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
    
            this._canvas.width = 1000 * 1.5;
            this._canvas.height = 1000;
    
            if ( ! this._context2D ) return;
        
            this._context2D.clearRect( 0, 0, this._canvas.width, this._canvas.height );

            // Background.
            var ptrn = this._context2D.createPattern(this._background, 'repeat'); // Create a pattern with this image, and set it to "repeat".
            this._context2D.fillStyle = ptrn;
            this._context2D.fillRect(0, 0, this._canvas.width, this._canvas.height); 
            this.parentTexture.needsUpdate = true;
    
        }.bind(this), false );
        this._background.crossOrigin = '';
        this._background.src = require("./whiteboard_pattern.jpg").default;
    
        socket.on('remoteDraw', (remoteDrawObject) => {
            if (remoteDrawObject.id != this.id) {
                this.drawRemote(remoteDrawObject);
            }
        });

    },
    drawRemote: function(remoteDrawObject) {
        if (remoteDrawObject.lastX != null && remoteDrawObject.lastY != null) {

            this._context2D.beginPath();
            this._context2D.strokeStyle = "rgba(0,0,0,0.9)";
            this._context2D.lineJoin = 'round';
            this._context2D.lineWidth = 10;
            this._context2D.moveTo(remoteDrawObject.lastX, remoteDrawObject.lastY);
            this._context2D.lineTo(remoteDrawObject.x, remoteDrawObject.y);
            this._context2D.closePath();
            this._context2D.stroke();
            
            this.parentTexture.needsUpdate = true;
        }
    },
    tick: function () {
        if (!this.raycasterObj) { return; }  // Not intersecting.
    
        let intersection = this.raycasterObj.components.raycaster.getIntersection(this.el);
        if (!intersection) { return; }
        if (this.triggerdown) {
            var uv = intersection.uv;
            var x = uv.x;
            var y = 1 - uv.y;
            this._draw( x * this._canvas.width, y * this._canvas.height);
            this.lastX = x * this._canvas.width;
            this.lastY = y * this._canvas.height;
        } else {
            this.lastX = null;
            this.lastY = null;
        }
    },
    cameraSetActive: function() {
        this.camera = this.el.sceneEl.camera;
    },
    _draw: function (x, y) {
        if (this.lastX != null && this.lastY != null) {
            var drawObject= {};
            drawObject.id = this.id;
            drawObject.lastX = this.lastX;
            drawObject.lastY = this.lastY;
            drawObject.x = x;
            drawObject.y = y;
            socket.emit('draw', drawObject);
            this.drawRemote(drawObject);
            this.lastX = x;
            this.lastY = y;
        }
    },

    onMouseMove: function ( evt ) {

        evt.preventDefault();

        var array = this.getMousePosition( this.renderer.domElement, evt.clientX || evt.touches[0].clientX, evt.clientY || evt.touches[0].clientY );
        this.onClickPosition.fromArray( array );

        var intersects = this.getIntersects( this.onClickPosition, [this.el.getObject3D('mesh')] );

        if ( intersects.length > 0 && intersects[ 0 ].uv ) {

            var uv = intersects[ 0 ].uv;
            intersects[ 0 ].object.material.map.transformUv( uv );
            this._draw( uv.x * this._canvas.width, uv.y * this._canvas.height);
        }

    },
    onMouseDown: function(evt) {
        //evt.preventDefault();

        var array = this.getMousePosition( this.renderer.domElement, evt.clientX || evt.touches[0].clientX, evt.clientY || evt.touches[0].clientY );
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
        //evt.preventDefault();
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