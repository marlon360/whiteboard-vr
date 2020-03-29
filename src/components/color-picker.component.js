
AFRAME.registerComponent('color-picker', {
    schema: {
        color: {
            type: 'color',
            default: 'black'
        }
    },
    init: function () {

        this.intersectionVisual = document.querySelector("[intersection-visual]");
        this.texturePainter = document.querySelector("[texture-painter]");

        this.el.setAttribute('material', {
            color: this.data.color
        })
        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycasterObj = evt.detail.el;   
            this.raycasterObj.setAttribute('line', {
                color: this.data.color
            });
            if (this.intersectionVisual) {
                this.intersectionVisual.setAttribute('intersection-visual', {
                    color: this.data.color
                });
            }
            if (this.texturePainter) {
                this.texturePainter.setAttribute('texture-painter', {
                    color: this.data.color
                });
            }
            
        });
    }

  });