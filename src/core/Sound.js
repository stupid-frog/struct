import config from './Config';
export default window.Sound = (function(exports) {
    //是否处于播放状态
    exports.isPlaying = false;
    //正在播放的背景音乐名称
    exports.playingName = '';
    //音乐音量
    exports.musicVolume = 1;
    //音频一辆
    exports.soundVolume = 1;

    exports.musicChannel = null;
    //回复音量
    exports.unmute = function() {
        //设置音效音量
        Laya.SoundManager.setSoundVolume(exports.musicVolume);
        //设置背景音乐音量
        Laya.SoundManager.setMusicVolume(exports.soundVolume);
    }

    exports.play = function(name) {
        //如果音乐正在播放   且和正在播放的是同一条音频
        if (exports.isPlaying && name === exports.playingName) { return }
        //重置
        exports.musicChannel = null;
        //确定当前播放的音乐名称
        exports.playingName = name ? name : exports.playingName;
        //获取播放位置
        let lastPosition = exports.musicChannel ? exports.musicChannel.position : 0.1
        exports.musicChannel = Laya.SoundManager.playMusic(config.soundUrl + exports.playingName + ".mp3", 0, null, lastPosition);
        exports.isPlaying = true;
    }

    //静音
    exports.mute = function() {
        Laya.SoundManager.setSoundVolume(0);
        Laya.SoundManager.setMusicVolume(0);
    }

    exports.button = function() {
        Laya.SoundManager.playSound(config.soundUrl + "button.mp3", 1);
    }

    //更改为全局变量
    window.sound = exports;

    return exports;
})({})