export default class Btn_Scale extends Laya.Script {

    constructor() {
        super();
        /** @prop {name:scale_coe, tips:"按钮按下缩放程度", type:Number, default:0.92}*/
        let scale_coe = null;
    }

    onAwake() {
        this.scaleX_origin = this.owner.scaleX
        this.scaleY_origin = this.owner.scaleY

        if (coreUtils.getClassName(this.owner) == 'Image') {
            if (this.owner.anchorX != 0.5 && this.owner.anchorY != 0.5) {
                this.owner.anchorX = 0;
                this.owner.anchorY = 0;
                this.owner.anchorX = 0.5;
                this.owner.anchorY = 0.5;
                this.owner.x += this.owner.width * this.scaleX_origin / 2;
                this.owner.y += this.owner.height * this.scaleY_origin / 2;
            }
        } else if (this.owner.pivotX != this.owner.width / 2 && this.owner.pivotY != this.owner.height / 2) {
            this.owner.pivotX = 0;
            this.owner.pivotY = 0;
            this.owner.pivotX = this.owner.width / 2
            this.owner.pivotY = this.owner.height / 2
            this.owner.x += this.owner.width * this.scaleX_origin / 2
            this.owner.y += this.owner.height * this.scaleY_origin / 2
        }
    }

    onEnable() {
        this.scale_coe = this.scale_coe ? this.scale_coe : 0.92
    }

    onMouseDown(e) {
        this.owner.scaleX = this.scale_coe * this.scaleX_origin
        this.owner.scaleY = this.scale_coe * this.scaleY_origin
    }
    onMouseOut(e) {
        this.owner.scaleX = 1 * this.scaleX_origin
        this.owner.scaleY = 1 * this.scaleY_origin
    }
    onMouseUp(e) {
        this.owner.scaleX = 1 * this.scaleX_origin
        this.owner.scaleY = 1 * this.scaleY_origin
    }
    onClick(e) {
        e && sound.button();
    }
}