AFRAME.registerComponent('intersection-visual', {
    schema: {
        size: {
            type: "number",
            default: 10
        },
        color: {
            type: "color",
            default: "black"
        }
    },
    init: function () {

        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycasterObj = evt.detail.el;
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            this.raycasterObj = null;
            this.mesh.position.set(0, -1, 0);
        });

        this.geometry = new THREE.SphereBufferGeometry(0.0005 * this.data.size);
        this.material = new THREE.MeshBasicMaterial({color: this.data.color, opacity: 0.5, transparent: true});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.el.sceneEl.object3D.add(this.mesh);

    },
    update: function() {
        this.el.sceneEl.object3D.remove(this.mesh);
        this.geometry = new THREE.SphereBufferGeometry(0.0005 * this.data.size);
        this.material = new THREE.MeshBasicMaterial({color: this.data.color, opacity: 0.5, transparent: true});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.el.sceneEl.object3D.add(this.mesh);
    },
    tick: function () {
        if (!this.raycasterObj) { return; }  // Not intersecting.
    
        let intersection = this.raycasterObj.components.raycaster.getIntersection(this.el);
        if (!intersection) { return; }
        this.mesh.position.set(intersection.point.x, intersection.point.y, intersection.point.z);        
    },

  });