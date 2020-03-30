
import { MeshText2D, textAlign } from 'three-text2d'

AFRAME.registerComponent('room-number', {
    schema: {
        color: { type: 'color', default: "#000" },
      },
    init: function() {        
        let room = this.getParameterByName('room');
        const group = new THREE.Group();
        this.titleText = new MeshText2D("Room: " + room, { align: textAlign.left,  font: '64px Arial', fillStyle: this.data.color , antialias: true });
        this.titleText.scale.set(0.001,0.001,0.001);
        group.add(this.titleText);
        this.el.setObject3D('mesh',group);
    },
    getParameterByName: function(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
});