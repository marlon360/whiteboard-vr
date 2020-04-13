
AFRAME.registerComponent('erase-all', {
    schema: {
        color: {
            type: 'color',
            default: 'red'
        }
    },
    init: function () {

        this.texturePainter = document.querySelector("[texture-painter]");

        this.el.setAttribute('material', {
            color: this.data.color
        })
        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycasterObj = evt.detail.el;   
            if (this.texturePainter) {
                this.texturePainter.setAttribute('texture-painter', {
                    clearAll: true
                });
                this.el.setAttribute('material', {
                    color: 'pink'
                })
            }
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            this.raycasterObj = null;
            if (this.texturePainter) {
                this.texturePainter.setAttribute('texture-painter', {
                        clearAll: false
                });
            }
            this.el.setAttribute('material', {
                color: this.data.color
            })
        });
    }

  });