
AFRAME.registerComponent('size-bigger', {
    schema: {
        color: {
            type: 'color',
            default: 'white'
        }
    },
    init: function () {

        this.texturePainter = document.querySelector("[texture-painter]");
        this.intersectionVisual = document.querySelector("[intersection-visual]");
        this.increasing = false;

        var controllers = document.querySelectorAll(".controller");
        controllers.forEach((controller) => {
            controller.addEventListener('triggerdown', evt => {
                if (!(this.increasing) && (this.raycasterObj)) {
                    this.increasing = true;
                    if (this.texturePainter) {
                        newSize = this.texturePainter.getAttribute('texture-painter').size + 10;
                        if (newSize > 50) {
                            newSize = 50;
                        }
                        this.texturePainter.setAttribute('texture-painter', {
                            size: newSize
                        });
                        if (this.intersectionVisual) {
                            this.intersectionVisual.setAttribute('intersection-visual', {
                                size: newSize
                            });
                            this.el.setAttribute('material', {
                                color: 'red'
                            })
                        }
                    }
                }
            });
            controller.addEventListener('triggerup', evt => {
                this.increasing = false;
                this.el.setAttribute('material', {
                    color: this.data.color
                })
            });
        })
        
        this.el.setAttribute('material', {
            color: this.data.color
        })
        
        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycasterObj = evt.detail.el;   
        });

        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            this.raycasterObj = null;   
        });
    }

  });