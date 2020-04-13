
AFRAME.registerComponent('size-smaller', {
    schema: {
        color: {
            type: 'color',
            default: 'white'
        }
    },
    init: function () {

        this.texturePainter = document.querySelector("[texture-painter]");
        this.intersectionVisual = document.querySelector("[intersection-visual]");
        this.decreasing = false;

        var controllers = document.querySelectorAll(".controller");
        controllers.forEach((controller) => {
            controller.addEventListener('triggerdown', evt => {
                if (!(this.decreasing) && (this.raycasterObj)) {
                    this.decreasing = true;
                    if (this.texturePainter) {
                        newSize = this.texturePainter.getAttribute('texture-painter').size - 10;
                        if (newSize < 5) {
                            newSize = 5;
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
                this.decreasing = false;
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