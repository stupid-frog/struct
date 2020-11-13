// import当前文件后 具有全局属性  layerScene（场景管理类）   loadUtils(加载工具类)    eventUtils(事件工具类)

import config from "./Config";
import version from "./Version";

export default window.frameCore = (function(exports) {
    //输出函数
    window.log = function() {
        try {
            console.log.apply(null, arguments)
        } catch (e) {
            console.log.apply(null, arguments)
        }
    }


    exports.init = function(callBack) {
        try {
            config.log && (new VConsole())
        } catch (e) {

        }

        log("初始化游戏引擎")

        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        // alert(isAndroid+" "+isIOS)
        exports.phoneModel = (isIOS) ? "ios" : "android"

        var client = navigator.userAgent.toLowerCase(); //获取判断用的对象
        //运行环境
        // exports.runScene=(client.match(/MicroMessenger/i)=="micromessenger")?'wx':(typeof MostOneJSApis=='object'||typeof MostOneJSApis=='function')?'mw':'wx';

        // Laya.Config.useRetinalCanvas = true;
        //初始化微信小游戏
        //初始化百度小游戏
        // if(config.gameType == 'bd')Laya.BMiniAdapter.init()
        // else if(config.gameType == 'tt')Laya.MiniAdpter.init();
        // else Laya.MiniAdpter.init();
        //激活资源版本控制
        // Laya.ResourceVersion.enable("version.json", Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);

        Laya.init(config.gameW, config.gameH, Laya["WebGL"]);

        // if(isIOS){Laya.init(config.gameW, config.gameH, Laya.WebGL);config.cacheAsBitmap=true}//WebGL
        // else if(isAndroid)Laya.init(config.gameW, config.gameH, Laya.WebGL);//WebGL
        // else {Laya.init(config.gameW, config.gameH, Laya.WebGL);config.cacheAsBitmap=true}
        // Laya.init(config.gameW, config.gameH, Laya.WebGL)
        // if(config.gameType == 'wx' || config.gameType == 'web'){
        //设置Laya提供的worker.js的路径
        // Laya.WorkerLoader.workerPath = "libs/workerloader.js";
        //开启worker线程
        // Laya.WorkerLoader.enable = true;

        //     	var a = new Laya.Image('bigImage/2_1.png')
        // 	Laya.stage.addChild(a)
        // return
        // }
        // new Main();
        // return;
        Laya.stage.bgColor = "#fff";
        // Laya.stage.frameRate = "slow";
        // Laya.stage.frameRate = "sleep";

        // Laya.Log.enable()
        config.showStat && Laya.Stat.show(0, 0)
        log("设置游戏适配")
        exports.stage = Laya.stage;
        exports.browserW = config.screenMode == "horizontal" ? Laya.Browser.clientHeight : Laya.Browser.clientWidth;
        exports.browserH = config.screenMode == "horizontal" ? Laya.Browser.clientWidth : Laya.Browser.clientHeight;
        exports.ratio_w = exports.browserW / Laya.stage.designWidth;
        exports.ratio_h = exports.browserH / Laya.stage.designHeight;
        exports.ratio_max = Math.max(exports.ratio_w, exports.ratio_h);
        exports.ratio_min = Math.min(exports.ratio_w, exports.ratio_h);
        exports.designWidth = Laya.stage.designWidth
        exports.designHeight = Laya.stage.designHeight
            // log('Laya.Browser.onAndriod', Laya.Browser.onAndriod)
            // log('Laya.Browser.onAndroid', Laya.Browser.onAndroid)
            // log('Laya.Browser.onIOS', Laya.Browser.onIOS)
        if (Laya.Browser.onAndriod || Laya.Browser.onAndroid || Laya.Browser.onIOS) {
            exports.width = exports.canvasWidth = exports.browserW / exports.ratio_max;
            exports.height = exports.canvasHeight = exports.browserH / exports.ratio_max;
            var bili = exports.height / exports.width
                // log(exports.height/exports.width, 960/1680)
                // if(bili < 0.46 || bili > 0.68){
                // 	Laya.stage.scaleMode = "showall";//fixedwidth
                // 	Laya.stage.alignH = "center";
                // 	Laya.stage.alignV = "middle";
                // 	exports.width = exports.canvasWidth = Laya.stage.designWidth;
                // 	exports.height = exports.canvasHeight = Laya.stage.designHeight;
                // }else{
            var ratio = 0
            var scaleMode = ''
            if (exports.ratio_w > exports.ratio_h) {
                ratio = exports.ratio_w
                scaleMode = 'fixedwidth'
            } else {
                ratio = exports.ratio_h
                scaleMode = 'fixedheight'
            }

            exports.width = exports.canvasWidth = exports.browserW / ratio;
            exports.height = exports.canvasHeight = exports.browserH / ratio;
            Laya.stage.scaleMode = scaleMode;
            // }
            Laya.stage.screenMode = config.screenMode
        } else {
            // console.log('非 onAndriod onIOS')
            Laya.stage.scaleMode = "showall"; //fixedwidth
            Laya.stage.alignH = "center";
            Laya.stage.alignV = "middle";
            exports.width = exports.canvasWidth = Laya.stage.designWidth;
            exports.height = exports.canvasHeight = Laya.stage.designHeight;
        }
        exports.width = Math.ceil(exports.width);
        exports.height = Math.ceil(exports.height);
        exports.scaleW = exports.width / Laya.stage.width
        exports.scaleH = exports.height / Laya.stage.height
        exports.scale = Math.min(exports.scaleW, exports.scaleH)



        //初始化显示层
        exports.scene.init(exports.stage);

        Laya.ResourceVersion.addVersionPrefix = function(url) {
            if (url.indexOf(version.res) > -1) return url;
            return url + version.res;
        };

        //兼容微信不支持加载scene后缀场景
        Laya.URL.exportSceneToJson = config.exportSceneToJson;
        Laya.URL.customFormat = Laya.ResourceVersion.addVersionPrefix;
        //激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
        // Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, function(){
        //激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
        Laya.AtlasInfoManager.enable("fileconfig.json" + '?v=1', Laya.Handler.create(this, function() {
            //加载初始化
            exports.load.init(function() {
                if (!callBack) console.error('初始化引擎后没有回调函数！！！');
                else callBack();
            });
        }));
        // }), Laya.ResourceVersion.FILENAME_VERSION);
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //加载工具
    exports.load = (function() {
        function LoadUtils() {};

        LoadUtils.onloaded = 'loadUtils_loadComplete';
        LoadUtils.onProgress = 'loadUtils_loadProgress';

        LoadUtils.init = function(callBack) {
            Laya.loader.load([
                { "url": config.headUrl + "ui.json" + version.src, "type": Laya.Loader.JSON }
            ], Laya.Handler.create(this, function() {
                exports.uiMap = Laya.loader.getRes(config.headUrl + "ui.json" + version.src);
                callBack();
            }))
        };
        /**
         * 加载工具类加载方法
         * @param {*} array__   需要加载的UI数组
         * @param {*} callBack  完成回调函数
         * @param {*} loadStyle 加载类
         */
        LoadUtils.load = function(array__, callBack, loadStyle) {
            if (loadStyle) { layerScene.add(loadStyle) }
            Laya.loader.load(array__, Laya.Handler.create(null, function() {
                layerScene.remove(loadStyle);
                eventUtils.dispatchEvent(LoadUtils.onloaded);
                callBack && callBack();
            }), Laya.Handler.create(null, function(v) {
                try {
                    layerScene.get(loadStyle).progress(v);
                } catch (e) { eventUtils.dispatchEvent(LoadUtils.onProgress); }

            }, null, false))
        };

        return LoadUtils;
    })({})

    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------------------------------
    //场景工具
    exports.scene = (function() {
        function Scene() {}
        Scene.elements = [];
        Scene.container = null;
        Scene.layer = [
            { c: null, name: 'bottom', isMask: false },
            { c: null, name: 'middle', isMask: false },
            { c: null, name: 'icon', isMask: false },
            { c: null, name: 'panel', isMask: true, mask: null, maskAlpha: 0.5 },
            { c: null, name: 'tips', isMask: false }
        ];
        Scene.init = function(container_) {
            //层级在这里new因为掉用这个方法之前才laya才刚刚init
            Scene.container = new Laya.Sprite();
            Scene.container.width = exports.width
            Scene.container.height = exports.height
            container_.addChild(Scene.container);

            for (var i = 0; i < Scene.layer.length; i++) {
                Scene.layer[Scene.layer[i].name] = Scene.layer[i]
                Scene.layer[i].c = Scene.container.addChild(new Laya.Sprite())
                if (Scene.layer[i].isMask) {
                    var _mask = new Laya.Sprite()
                    _mask.graphics.drawRect(0, 0, exports.width, exports.height, "#000000");
                    _mask.size(exports.width, exports.height)
                    _mask.alpha = Scene.layer[i].maskAlpha;
                    _mask.on("click", this, function(e) {})
                    _mask.on("mousedown", this, function(e) {})
                    _mask.on("mouseup", this, function(e) {})
                    Scene.layer[i].mask = _mask
                }
            }
            // if( Laya.Browser.onMobile ){
            // 	Scene.container.rotation = 180;
            // 	Scene.container.x = game.width;
            // 	Scene.container.y = game.height;
            // }
            Laya.stage.on(Laya.Event.RESIZE, this, Scene.resize)
        }

        Scene.resize = function(params) {
            // if(Laya.Browser.onMobile && Laya.Browser.clientWidth < Laya.Browser.clientHeight){
            // 	Scene.c.rotation = 180;
            // 	Scene.c.x = game.width;
            // 	Scene.c.y = game.height;
            // 	layer.closeAll('dialog');
            // }else if(Laya.Browser.onMobile && Laya.Browser.clientWidth >= Laya.Browser.clientHeight){
            // 	Scene.c.rotation = 360;
            // 	Scene.c.x = 0;
            // 	Scene.c.y = 0;
            // 	layer.msg('<span style="font-size:24px">锁定屏幕旋转，获得最佳游戏体验！</span>', {area: ['100%'], time: 0, shade: 1});
            // }
            exports.cb.dispatchEvent("resize")
        }

        Scene.remove = function(Class_) {
            if (!Class_) return;
            var module = Scene.elements[exports.utils.getClassName(Class_)]
            if (!module) return null
            exports.utils.remove(module)

            var layer = Scene.layer[module.params.layer]
            if (layer.isMask) {
                layer.c.numChildren >= 2 && (layer.c.addChildAt(layer.mask, layer.c.numChildren - 2))
                layer.c.numChildren == 1 && layer.c.removeChildAt(0)
            }

            return module;
        }

        Scene.removeAll = function() {
            for (var i = 0; i < Scene.layer.length; i++) {
                while (Scene.layer[i].c.numChildren) Scene.layer[i].c.removeChildAt(0)
            }
        }

        Scene.get = function(Class_) {
            var module = Scene.elements[exports.utils.getClassName(Class_)]
            if (!module) return null
            return module
        }

        Scene.registe = function(Class_) {
            var module = Scene.elements[exports.utils.getClassName(Class_)]
            if (module) return module;
            module = new Class_();
            Scene.elements[exports.utils.getClassName(Class_)] = module
            return module
        }

        Scene.add = function(Class_, args_) {
            var module = null
            var className = exports.utils.getClassName(Class_)
            if (!className) throw new Error(Class_ + " 不能获取className")
            if (Scene.elements[className]) {
                module = Scene.elements[className];
            } else {
                module = new Class_()
                Scene.elements[className] = module
            }
            module.addedParams = args_
            if (!module.params) throw new Error("模块 " + className + " 不存在属性 params")

            var layer = Scene.layer[module.params.layer]
            if (layer.isMask) {
                layer.c.addChild(layer.mask)
            }
            layer.c.addChild(module);
            return module
        }

        return Scene
    })();






    // utils模块
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------------------------------
    exports.utils = (function() {
        function Utils() {}
        /**
         * 创建一个实例 DATA {}类型的信息 复制给new CLASS
         */
        Utils.newA = function(_class_, _data_) {
            if (!_class_) throw new Error("Error " + _class_ + " 不存在")
            var a = new _class_()
            Utils.injectProp(a, _data_)
            return a
        }
        Utils.injectProp = function(_instance_, _data_) {
            for (var name in _data_) {
                if (_instance_.hasOwnProperty(name)) {
                    var value = _data_[name]
                    _instance_[name] = (value == "true" ? true : (value == "false" ? false : value))
                }
            }
            return _instance_
        }
        Utils.scale = function(target, scaleX, scaleY) {
            if (scaleY == null || scaleY == undefined) scaleY = scaleX
            target.scaleX = scaleX
            target.scaleY = scaleY
            target.__w = target.width * scaleX
            target.__h = target.height * scaleY
        }
        Utils.cacheAtlasAndImage = function(arr, u1Arr, u2Arr, isReplace) {
            for (var i = 0; i < arr.length; i++) {
                var o = arr[i]
                var url = o.url
                if (isReplace && u1Arr && u2Arr) {
                    for (var u_index = 0; u_index < u1Arr.length; u_index++) {
                        url = url.replace(u1Arr[u_index], u2Arr[u_index])
                    }
                }
                var all_url = o.url
                var json = url.indexOf("json")
                    // 只按照图片解析 json music不解析
                if (json != -1) continue
                var mp3 = url.indexOf(".mp3")
                var wav = url.indexOf(".wav")
                if (mp3 >= 0 || wav >= 0) continue;

                url = url.replace(config.urlHead, "")

                var atlas = url.indexOf("atlas")
                url = url.replace("res/", "")
                url = url.replace("atlas/", "")
                if (atlas == -1) {
                    url = url.replace(config.verson_res, "")
                    game.utils.cacheImage(url, all_url)
                } else {
                    url = url.replace(".png" + config.verson_res, "")
                        // url = url.replace(".json"+config.verson_res, "")
                    game.utils.cacheAtlas(url, all_url, o.jsonUrl)
                }
            }
        }
        Utils.cacheImage = function(url, all_url) {
            laya.net.Loader.cacheRes(url, laya.net.Loader.getRes(all_url))
                // laya.net.Loader.cacheRes(url, laya.net.Loader.getRes(config.urlHead+"res/" + url + config.verson_res))
        }
        var __cache_urls = [];
        Utils.cacheAtlas = function(JSONNAME, all_url, jsonUrl) {
            var url_p = all_url
            var url_j = jsonUrl || url_p.replace(".png", ".json")
                // var url_j = config.urlHead+"res/atlas/"+JSONNAME+".json"+config.verson_res
                // var url_p = config.urlHead+"res/atlas/"+JSONNAME+".png"+config.verson_res
                //如果已经解析 那么返回 如果图集太多 解析消耗也大
            var index = __cache_urls.indexOf(url_j)
            if (index != -1) {
                log("已经解析过该资源", url_j)
                log("已经解析过该资源", url_p)
                return
            }

            var json = Laya.loader.getRes(url_j)
            if (!json) {
                miniApi.alert(null, '网络错误，请重启游戏', miniApi.exit, miniApi.exit)
                throw new Error("资源不存在 " + url_j);
            }

            __cache_urls.push(url_j)

            var t = Laya.loader.getRes(url_p)
            if (!t) {
                miniApi.alert(null, '网络错误，请重启游戏', miniApi.exit, miniApi.exit)
                throw new Error("资源不存在 " + url_p);
            }

            var prefix = json.meta.prefix
            for (var key in json.frames) {
                if (json.frames.hasOwnProperty(key)) {
                    var element = json.frames[key];
                    var nt = laya.resource.Texture.createFromTexture(t, element.frame.x, element.frame.y, element.frame.w, element.frame.h)
                    laya.net.Loader.cacheRes(prefix + key, nt)
                }
            }
        }
        Utils.timeToString = function(time, sign) {
            var d = new Date(time)
            var year = d.getFullYear()
            var month = (d.getMonth() + 1)
            month = month < 10 ? '0' + month : month
            var date = d.getDate()
            date = date < 10 ? '0' + date : date
            var hour = d.getHours()
            hour = hour < 10 ? '0' + hour : hour
            var minute = d.getMinutes()
            minute = minute < 10 ? '0' + minute : minute
            var second = d.getSeconds()
            second = second < 10 ? '0' + second : second
            return year + '-' + month + '-' + date + sign + hour + ':' + minute + ':' + second
        }
        Utils.RoundRect = function(___width, ___height, ___ror) {
                var __imgWidth = ___width
                var __imgHeight = ___height
                var __imgRor = (___ror) ? ___ror : ((___width + ___height) / 2) / 15
                var _rect = new Laya.Sprite();
                _rect.graphics.drawPath(0, 0, [
                    ["moveTo", __imgRor, 0],
                    ["lineTo", __imgWidth - __imgRor, 0],
                    ["arcTo", __imgWidth, 0, __imgWidth, __imgRor, __imgRor],
                    ["lineTo", __imgWidth, __imgHeight - __imgRor],
                    ["arcTo", __imgWidth, __imgHeight, __imgWidth - __imgRor, __imgHeight, __imgRor],
                    ["lineTo", __imgRor, __imgHeight],
                    ["arcTo", 0, __imgHeight, 0, __imgHeight - __imgRor, __imgRor],
                    ["lineTo", 0, __imgRor],
                    ["arcTo", 0, 0, __imgRor, 0, __imgRor],
                    ["closePath"]
                ], {
                    fillStyle: "#00ffff"
                })
                return _rect
            }
            //删除arr中 和deleteArr所有相同的元素
        Utils.deleteArrayFromArray = function(deleteArr, arr) {
            var deleteArr = deleteArr.slice()
            var arr = arr.slice()
            var m = 0
            while (deleteArr.length && m < 10000) {
                for (var i = arr.length - 1; i >= 0; i--) {
                    if (deleteArr[0] == arr[i]) {
                        deleteArr.shift()
                        arr.splice(i, 1)
                        break;
                    }
                }
                m++
            }
            if (m >= 10000) {
                alert('deletexx while 循环次数超出范围')
            }
            return arr
        }
        Utils.getURL = function(url_) {
            return url_ + "?v=" + config.verson_res
        }
        Utils.removeAll = function(a) {
            while (a.numChildren) a.removeChildAt(0)
        }
        Utils.remove = function() {
            if (arguments.length <= 0) throw new Error('remove can not nothing！')
            let returnArr = []
            let args = Array.prototype.slice.call(arguments);
            while (args.length) {
                if (args[0] && args[0].parent) { args[0].parent.removeChild(args[0]) }
                returnArr.push(args.shift())
            }
            return returnArr.length > 1 ? returnArr : returnArr[0]
                // if(a&&a.parent)a.parent.removeChild(a)
                // return a
        }
        Utils.getSprite = function(sp, textureURL) {
            sp = sp || new Laya.Sprite()
            var t = Laya.loader.getRes(textureURL)
            if (!t) throw new Error("资源不存在 " + textureURL)

            sp.graphics.clear();
            sp.graphics.drawTexture(t, 0, 0);
            sp.size(t.width, t.height)
            return sp
        }
        Utils.setget = function(target, property, setfunction, getfunction) {
            Object.defineProperty(target, property, { set: setfunction, get: getfunction })
        }
        Utils.deletePX = function(value) {
            if (!value) return 0
            var str_ = ""
            var str = value.toString()
            var i = str.indexOf("px")
            if (i != -1) str_ = parseInt(str.slice(0, i))
            else str_ = str
            return str_
        }
        Utils.stage = function(value) {
                var a = null
                if (value) {
                    if (value.parent) {
                        if (value.parent == ___frame.stage) a = true
                        else { a = Utils.stage(value.parent) }
                    } else {
                        a = false
                    }
                } else {
                    a = false
                }
                return a
            }
            //function a(){} return a
            //exports.a = function(){} 解析不能
        Utils.getClassName = function(value) {
                if (typeof value === 'object') return value.constructor.name
                else if (typeof value === 'function') return value.name
            }
            /*
            *在抽奖的活动中经常会用到这个算法，不同奖项的获取概率不同，要按概率去随机生成对应的奖品
            *
            * // test
            var a = ['mac', 'iphone', 'vivo', 'OPPO'];
            var b = [0.1, 0.2, 0.3, 0.4];
            console.log(random(a, b));
            随机取样
            */
        Utils.randomSample = function(arr1, arr2) {
            var sum = 0,
                factor = 0,
                random = Math.random();

            for (var i = arr2.length - 1; i >= 0; i--) {
                sum += arr2[i]; // 统计概率总和
            };
            random *= sum; // 生成概率随机数
            for (var i = arr2.length - 1; i >= 0; i--) {
                factor += arr2[i];
                if (random <= factor)
                    return arr1[i];
            };
            return null;
        };

        Utils.randomArr = function(oArr) {
                var temp_x; //临时交换数
                var random_x;
                for (var i = oArr.length; i > 0; i--) {
                    random_x = Math.floor(Math.random() * i); //   取得一个随机数
                    temp_x = oArr[random_x];
                    oArr[random_x] = oArr[i - 1];
                    oArr[i - 1] = temp_x;
                }
                return oArr
            }
            // Utils.polygon_g;
            // Utils.polygon_g1;
            /**
             * [hitTestPolygon 多边形碰撞]
             * @param  {[type]} polygon1_ [多边形1 数组 [0,0,100,100,100,200] 0 x坐标 1 y坐标 以此类推]
             * @param  {[type]} polygon2_ [多边形2 数组 [0,0,100,100,100,200] 0 x坐标 1 y坐标 以此类推]
             * @param  {[type]} offx1     [多边形1 x偏移坐标 全部x坐标 + 这个偏移值]
             * @param  {[type]} offy1     [多边形1 y偏移坐标 全部x坐标 + 这个偏移值]
             * @param  {[type]} offx2     [多边形2 x偏移坐标 全部x坐标 + 这个偏移值]
             * @param  {[type]} offy2     [多边形2 y偏移坐标 全部x坐标 + 这个偏移值]
             * @return {[type]}           [description]
             */
        Utils.hitTestPolygon = function(polygon1_, polygon2_, offx1, offy1, offx2, offy2) {
            var polygon1 = polygon1_.slice()
            var polygon2 = polygon2_.slice()
            offx1 = offx1 ? offx1 : 0
            offy1 = offy1 ? offy1 : 0
            offx2 = offx2 ? offx2 : 0
            offy2 = offy2 ? offy2 : 0
            if (polygon1.length < 4 || polygon2.length < 4) {
                //___frame.error("___frameUtils.hitTestPolygon 数组长度必须大于等于4")
                return false
            }
            polygon1[polygon1.length] = polygon1[0];
            polygon1[polygon1.length] = polygon1[1];
            polygon2[polygon2.length] = polygon2[0];
            polygon2[polygon2.length] = polygon2[1];
            var isHit = false
            for (var i = 0; i <= polygon1.length - 4; i += 2) {
                for (var j = 0; j <= polygon2.length - 4; j += 2) {
                    isHit = Utils.hitTestLine(polygon1[i] + offx1, polygon1[i + 1] + offy1, polygon1[i + 2] + offx1, polygon1[i + 3] + offy1, polygon2[j] + offx2, polygon2[j + 1] + offy2, polygon2[j + 2] + offx2, polygon2[j + 3] + offy2)
                        // if(isHit){
                        //     polygon_g = polygon_g || new PIXI.Graphics()
                        //     ___frame.stage.addChild(polygon_g)

                    //     polygon_g1 = polygon_g1 || new PIXI.Graphics()
                    //     ___frame.stage.addChild(polygon_g1)
                    //     polygon_g.clear()
                    //     polygon_g.lineStyle(2, 0xff0000)
                    //     polygon_g.moveTo(polygon1[i]+offx1, polygon1[i+1]+offy1)
                    //     polygon_g.lineTo(polygon1[i+2]+offx1, polygon1[i+3]+offy1)
                    //     polygon_g.endFill()

                    //     polygon_g1.clear()
                    //     polygon_g1.lineStyle(2, 0xff00ff)
                    //     polygon_g.moveTo(polygon2[j]+offx2, polygon2[j+1]+offy2)
                    //     polygon_g.lineTo(polygon2[j+2]+offx2, polygon2[j+3]+offy2)
                    //     polygon_g1.endFill()
                    // }
                    if (isHit) break
                }
                if (isHit) break
            }
            return isHit
        }
        Utils.hitTestLine = function(x1, y1, x2, y2, x3, y3, x4, y4) {
            if (x1 == x2 && x2 == x3 && x3 == x4) {
                if (Math.abs((y1 + (y2 - y1) / 2) - (y3 + (y4 - y3) / 2)) <= Math.abs((y2 - y1) / 2 + (y4 - y3) / 2)) return true
                else return false
            } else if (y1 == y2 && y2 == y3 && y3 == y4) {
                if (Math.abs((x1 + (x2 - x1) / 2) - (x3 + (x4 - x3) / 2)) <= Math.abs((x2 - x1) / 2 + (x4 - x3) / 2)) return true
                else return false
            }

            var line1p1 = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1); //第一条线段的向量和（第一条线段的开始点与第二条线段的开始点组成的向量）的向量积
            var line1p2 = (x2 - x1) * (y4 - y1) - (x4 - x1) * (y2 - y1); //第一条线段的向量和（第一条线段的开始点与第二条线段的结束点组成的向量）的向量积
            var line2p1 = (x4 - x3) * (y1 - y3) - (x1 - x3) * (y4 - y3); //第二条线段的向量和（第二条线段的开始点与第一条线段的开始点组成的向量）的向量积
            var line2p2 = (x4 - x3) * (y2 - y3) - (x2 - x3) * (y4 - y3); //第二条线段的向量和（第二条线段的开始点与第一条线段的结束点组成的向量）的向量积
            if ((line1p1 * line1p2 <= 0) && (line2p1 * line2p2 <= 0)) { //判断方法在先前讲过
                return true; //相交
            } else {
                return false; //否则不相交
            }
        }
        Utils.numberToTime = function(time, maxTime, insertHout, insertMinute) {
            maxTime = arguments[1] != null ? arguments[1] : 3;
            insertHout = arguments[2] != null ? arguments[2] : "：";
            insertMinute = arguments[3] != null ? arguments[3] : "：";

            var hour = Math.floor(time / 60 / 60) >> 0;
            var minute = Math.floor(time / 60) % 60;
            var second = time % 60;
            var timeTxt = "";
            if (maxTime == 3) {
                timeTxt += ((hour >= 100) ? hour.toString() : (100 + hour).toString().substr(1)) + insertHout;
                timeTxt += ((minute < 10) ? ("0" + minute.toString()) : minute.toString()) + insertMinute;
                timeTxt += (second < 10) ? ("0" + second.toString()) : second.toString();
            } else if (maxTime == 2) {
                timeTxt += ((minute < 10) ? ("0" + minute.toString()) : minute.toString()) + insertMinute;
                timeTxt += (second < 10) ? ("0" + second.toString()) : second.toString();
            } else if (maxTime == 1) {
                timeTxt += (second < 10) ? ("0" + second.toString()) : second.toString();
            }
            return timeTxt;
        }
        Utils.deletePX = function(value) {
                if (!value) return 0
                var str_ = ""
                var str = value.toString()
                var i = str.indexOf("px")
                if (i != -1) str_ = parseInt(str.slice(0, i))
                else str_ = str
                return str_
            }
            // son在容器1里面的坐标 变成容易2是什么坐标
            // son 可以取到 x y
            // parent1 可以取到 x y scaleX scaleY
            // parent2 可以取到 x y scaleX scaleY
            // 改变精灵坐标 是显示对象
        Utils.changeSpriteXY = function(son, parent1, parent2) {
                if (son.parent == parent2) return { x: son.x, y: son.y }
                return Utils.changeDataXY(son, parent1, parent2)
            }
            // 改变左边 改变的是数据
        Utils.changeDataXY = function(son, parent1, parent2) {
                var a = son.x * parent1.scaleX + parent1.x
                var b = a - parent2.x
                var x = b / parent2.scaleX

                var a = son.y * parent1.scaleY + parent1.y
                var b = a - parent2.y
                var y = b / parent2.scaleY

                return { x: x, y: y }
            }
            // son在容器1里面的坐标 变成容易2是什么坐标
            // son 可以取到 x y
            // parent1 可以取到 x y scaleX scaleY
            // parent2 可以取到 x y scaleX scaleY
        Utils.getXY = function(son, parent1, parent2) {
            var a = son.x * parent1.scaleX + parent1.x
            var b = a - parent2.x
            var x = b / parent2.scaleX

            var a = son.y * parent1.scaleY + parent1.y
            var b = a - parent2.y
            var y = b / parent2.scaleY

            return { x: x, y: y }
        }
        Utils.loadImage = function(image, loadUrl, defaultUrl) {
            var texture = Laya.loader.getRes(loadUrl);
            if (texture) {
                Utils.updateImage(image, loadUrl)
            } else {
                Utils.updateImage(image, defaultUrl)
                    // var aa = loadUrl//[{"url":loadUrl, "type":Laya.Loader.IMAGE}]
                Laya.loader.load(loadUrl, Laya.Handler.create(null, Utils.updateImage, [image, loadUrl]))
            }
        }
        Utils.updateImage = function(image, loadUrl) {
            // if(resArray)game.utils.cacheAtlasAndImage(resArray)
            image.skin = loadUrl
        }

        /**
         * [Clip description]
         * @param {[type]} img             [description]
         * @param {[type]} url             [description]
         * @param {[type]} delay           [description]
         * @param {[type]} repeat          [description]
         * @param {[type]} completeHandler [description]
         */
        Utils.Clip = function LClip(img, url, delay, repeat, completeHandler) {
            img = img ? img : new Laya.Image(url[0])
            img.__index = 0
            img.__url = url
            img.__playing = false;
            img.__repeat = repeat;
            img.index = function(value) {
                img.__index = value
                img.skin = img.__url[value];
            }
            img.play = function(value) {
                parseInt(value) >= 0 && img.index(value)
                img.stop()
                img.__playing = true
                Laya.timer.loop(delay, img, img.clip_update);
            }
            img.clip_update = function() {
                img.__index++
                    if (img.__index < img.__url.length) {
                        img.skin = img.__url[img.__index];
                    } else
                if (img.__repeat) {
                    img.__index = 0
                    img.skin = img.__url[img.__index];
                } else {
                    img.stop()
                    completeHandler && completeHandler(img)
                }
            }
            img.stop = function() {
                img.__playing = false
                Laya.timer.clear(img, img.clip_update);
            }
            return img;
        }

        return Utils
    })()







    /**
     * 派发回调处理
     */
    exports.cb = (function() {
        function CB() {}

        CB._cbmArr = [];
        CB._pool = [];
        /**
         * 添加事件
         * @param   eventType 事件类型
         * @param   callBack  事件回调
         * @param   depth     事件深度 0<1 0先执行 1后执行
         */
        CB.addEvent = function(eventType, caller, callBack, depth) {
            if (!callBack) throw new Error("事件回调callback null")
            if (!eventType) throw new Error("给我把事件type天上")
            depth = parseInt(depth) >= 0 ? depth : 100;

            if (!CB._cbmArr[eventType]) CB._cbmArr[eventType] = [];

            var index = CB.getIndex(eventType, caller, callBack)
            if (index != -1) CB._cbmArr[eventType][index].depth = depth ? depth : index
            else {
                var handler = CB._pool.length ? CB._pool.shift() : new CBHandler()
                handler.caller = caller
                handler.func = callBack
                handler.depth = depth
                CB._cbmArr[eventType].push(handler)
            }
            CB._cbmArr[eventType].sort(CB.paixu)
        }

        CB.on = CB.addEvent;

        CB.removeEvent = function(eventType, caller, callBack) {
            if (!CB._cbmArr[eventType] || !CB._cbmArr[eventType].length) return
            var index = CB.getIndex(eventType, caller, callBack)
            if (index != -1) CB._pool.push(CB._cbmArr[eventType].splice(index, 1))
        }

        CB.off = CB.removeEvent;

        /**
         * 派发事件
         * @param   eventType      事件类型
         * @param   callBackParams 回调参数
         */
        CB.dispatchEvent = function(eventType, callBackParams) {
            callBackParams = arguments[1] != null ? arguments[1] : null;
            if (CB._cbmArr[eventType]) {
                for (var i = CB._cbmArr[eventType].length - 1; i >= 0; i--) {
                    CB._cbmArr[eventType][i] && CB._cbmArr[eventType][i].func.apply(CB._cbmArr[eventType][i].caller, callBackParams)
                }
            } else {
                // log("[Warn] CBM没有对应的回调类型 - " + eventType) 
            }
        }
        CB.event = CB.dispatchEvent;

        CB.paixu = function(a, b) { return b.depth - a.depth }

        /**
         * 获取对应回调函数的下表
         * @param   eventType 类型
         * @param   func      回调函数
         * @return  没有返回 -1
         */
        CB.getIndex = function(eventType, caller, func) {
            for (var i = 0, length = CB._cbmArr[eventType].length; i < length; i++) {
                if (func == CB._cbmArr[eventType][i].func && caller == CB._cbmArr[eventType][i].caller) {
                    return i
                }
            }
            return -1
        }

        function CBHandler() {
            var that = this
                /**作用域*/
            this.caller;
            /**回调方法*/
            this.func;
            /**深度*/
            this.depth;
        }

        return CB
    })();

    window.layerScene = exports.scene;

    window.loadUtils = exports.load;

    window.eventUtils = exports.cb;

    window.coreUtils = exports.utils;

    return exports;
}({}))