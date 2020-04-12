
AFRAME.registerComponent('eraser-picker', {
    schema: {
        color: {
            type: 'color',
            default: 'pink'
        },
        clearing: {
            type: 'boolean',
            default: 'true'
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
            this.data.clearing = 'true';
            if (this.intersectionVisual) {
                this.intersectionVisual.setAttribute('intersection-visual', {
                    color: this.data.color
                });
            }
            if (this.texturePainter) {
                this.texturePainter.setAttribute('texture-painter', {
                    clearing: this.data.clearing
                });
            }
            
        });
    }

  });