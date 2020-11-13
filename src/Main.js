import frameCore from "./core/Core";
import config from "./core/Config";
import version from "./core/Version";
import sound from "./core/Sound";
import BaseClass from "./core/BaseScene";

class Main {
    constructor() {
        //引擎初始化等;
        frameCore.init(this.inited);
    }

    //初始化完成
    inited() {
        log('complete！');
    }
}


//激活启动类
new Main();