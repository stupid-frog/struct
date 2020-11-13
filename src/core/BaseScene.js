//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
export default window.BaseClass = function(exports) {

    class BaseScene extends Laya.Scene {
        constructor(data) {
            super();
            //默认数据
            this.defaultData = { layer: 'bottom', ani: 2, centerx: true, centery: true, left: false, right: false, up: false, down: false, offx: 0, offy: 0, scaleX: frameCore.scale, scaleY: frameCore.scale };
            //设置场景
            this.createView(frameCore.uiMap[data.url]);
            //覆盖数据
            for (name in data) this.defaultData[name] = data[name];
            //面板数据参数
            this.params = this.defaultData;
            //面板缩放
            this.scale(this.defaultData.scaleX, this.defaultData.scaleY);
            //调整面板位置
            this.pos_script = this.addComponent(PositionBaseScript)
            this.ani_script = this.addComponent(AnimationBaseScript)
        }
    }

    class AnimationBaseScript extends Laya.Script {
        onEnable() {
            switch (this.owner.params.ani) {
                case 1: //直接显示  啥也没有
                    break;
                case 2:
                    this.scaleAni();
                    break;
                case 3:

                    break;
            }
        }

        scaleAni() {
            //缩放动画
            this.owner.pivot(this.owner.width / 2, this.owner.height / 2);
            this.owner.x += this.owner.width / 2;
            this.owner.y += this.owner.height / 2;
            this.owner.scale(0, 0);
            this.aniTween = Laya.Tween.to(this.owner, { scaleX: 1, scaleY: 1 }, 200, Laya.Ease.backOut);
        }

        onDisable() {
            //清理一下
            this.owner.pivot(0, 0);
            this.owner.x = this.owner.y = 0;
            this.owner.scale(1, 1);
            Laya.Tween.clear(this.aniTween);
        }
    }


    class PositionBaseScript extends Laya.Script {
        onEnable() {
            this.updatePosition();
            this.owner.addParam && this.owner.addParam.apply(this.owner, this.owner.addedParams);
        }
        onDisable() {
            // this.owner.removed && this.owner.removed();
        }
        updatePosition() {
            this.owner.x = 0;
            this.owner.y = 0;
            var w = this.owner.width * this.owner.scaleX;
            var h = this.owner.height * this.owner.scaleY;
            this.owner.params.centerx && (this.owner.x = (frameCore.width - w) / 2);
            this.owner.params.centery && (this.owner.y = (frameCore.height - h) / 2);
            this.owner.params.up && (this.owner.y = 0);
            this.owner.params.down && (this.owner.y = frameCore.height - h);
            this.owner.params.left && (this.owner.x = 0);
            this.owner.params.right && (this.owner.x = frameCore.width - w);
            this.owner.x += this.owner.params.offx;
            this.owner.y += this.owner.params.offy;
        }
    }

    window.BaseScene = BaseScene;

    return exports;
}({})