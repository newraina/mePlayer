import {THEME_DEFAULT, THEME_MINI} from './constants';
import * as lyric from './lyric';
import * as utils from './utils';
import * as spectrum from './spectrum';

window.mePlayer = function (options) {
    // 检查必填选项
    if (!(options.music && options.music.src)) {
        console.error('必须指定音乐地址哦~');
        return;
    }

    var musicConf         = options.music,
        target            = getTarget(options.target),
        theme             = options.theme ? options.theme : THEME_DEFAULT,
        hasLrc            = musicConf.lrc ? true : false,
        coverSrc          = musicConf.cover ? musicConf.cover : 'https://unsplash.it/78/?random',

        currentThemeClass = theme === THEME_DEFAULT ? 'meplayer-container' : 'meplayer-container-mini',
        containerClass    = `${currentThemeClass} ${hasLrc ? 'meplayer-haslrc' : ''} meplayer-isloading`,

        playerHTMLContent = `<div class="${containerClass}">
                             <audio src=${musicConf.src}></audio>
                             <div class="meplayer-info">
                             <div class="meplayer-info-cover"><img src=${coverSrc} alt="cd-cover"></div>
                             <div class="meplayer-meta">
                             <div class="meplayer-meta-title">${musicConf.title}</div>
                             <div class="meplayer-meta-author">${musicConf.author}</div>
                             <div class="meplayer-meta-time-tick"><span class="meplayer-meta-time-tick-text"></span></div>
                             </div>
                             </div>
                             <canvas class="meplayer-spectrum"></canvas>
                             <div class="meplayer-lyric"><div class="meplayer-lyric-area"></div></div>
                             <div class="meplayer-control"><div class="meplayer-control-play"><i class="icon-play"></i><i class="icon-pause"></i></div></div>
                             <div class="meplayer-volume-bg"><div class="meplayer-volume"><i class="icon-volume"></i><div class="meplayer-volume-progress"></div></div></div>
                             <div class="meplayer-duration"><i class="icon-clock"></i><span class="meplayer-duration-text">loading</span></div>
                             <div class="meplayer-loadingsign"><i class="icon-spin animate-spin"></i>loading</div>
                             <div class="meplayer-timeline-bg"><div class="meplayer-timeline"><div class="meplayer-timeline-passed"></div></div></div>
                             </div>`;

    target.innerHTML = playerHTMLContent;

    var meplayerContainer = target.querySelector(`.${currentThemeClass}`),
        audio             = target.querySelector('audio'),
        playBtn           = target.querySelector('.meplayer-control-play'),
        timeTick          = target.querySelector('.meplayer-meta-time-tick-text'),
        timeCount         = target.querySelector('.meplayer-duration'),
        timeLine          = target.querySelector('.meplayer-timeline'),
        timePassed        = target.querySelector('.meplayer-timeline-passed'),
        volumeArea        = target.querySelector('.meplayer-volume'),
        volumeProgress    = target.querySelector('.meplayer-volume-progress'),
        lyricArea         = target.querySelector('.meplayer-lyric-area'),
        canvas            = target.querySelector('.meplayer-spectrum'),
        duration;

    // 设置在页面加载后立即加载音频
    audio.preload = 'auto';

    if (hasLrc) {
        lyric.parse(musicConf.lrc);
        lyric.render(lyricArea);
    } else {
        // 频谱动画初始化
        spectrum.init(canvas);
    }

    eventInit();

    // 重定义meplayer
    window.mePlayer = {
        play       : play,
        pause      : pause,
        toggleTheme: toggleTheme
    };


    /*
     * 工具函数
     * */

    // 给播放器绑定各种事件
    function eventInit() {
        audio.addEventListener('ended', function () {
            utils.removeClass(meplayerContainer, 'meplayer-isplaying');
        });

        audio.addEventListener('canplaythrough', function () {
            duration = this.duration;
            setTimeout(function () {
                utils.removeClass(meplayerContainer, 'meplayer-isloading');
                timeCount.querySelector('.meplayer-duration-text').innerText = utils.parseSec(duration.toFixed(0));
            }, 1000);
        });

        audio.addEventListener('durationchange', function () {
            duration = this.duration;
        });

        audio.addEventListener('timeupdate', function () {
            var curTime       = (audio.currentTime).toFixed(0);
            var curTimeForLrc = (audio.currentTime).toFixed(3);
            var playPercent   = 100 * (curTime / duration);

            timePassed.style.width = playPercent.toFixed(2) + '%';
            timeTick.innerText     = utils.parseSec(curTime);

            if (hasLrc && theme === THEME_DEFAULT) {
                var tempLrcIndex    = lyric.currentIndex(curTimeForLrc);
                var tempLrcLines    = lyricArea.querySelectorAll('p');
                var tempLrcLinePre  = tempLrcLines[tempLrcIndex - 1];
                var tempLrcLine     = tempLrcLines[tempLrcIndex];
                var tempLrcLineNext = tempLrcLines[tempLrcIndex + 1];

                if (!tempLrcLine.className.includes('meplayer-lyric-current')) {
                    utils.removeClass(lyricArea.querySelector('.meplayer-lyric-current'), 'meplayer-lyric-current');
                    if (lyricArea.querySelector('.meplayer-lyric-pre')) {
                        utils.removeClass(lyricArea.querySelector('.meplayer-lyric-pre'), 'meplayer-lyric-pre');
                    }
                    if (lyricArea.querySelector('.meplayer-lyric-next')) {
                        utils.removeClass(lyricArea.querySelector('.meplayer-lyric-next'), 'meplayer-lyric-next');
                    }
                    utils.addClass(tempLrcLine, 'meplayer-lyric-current');
                    if (tempLrcLinePre) {
                        utils.addClass(tempLrcLinePre, 'meplayer-lyric-pre');
                    }
                    if (tempLrcLineNext) {
                        utils.addClass(tempLrcLineNext, 'meplayer-lyric-next');
                    }

                    lyricArea.style.webkitTransform = 'translateY(-' + 20 * tempLrcIndex + 'px)';
                    lyricArea.style.transform       = 'translateY(-' + 20 * tempLrcIndex + 'px)';
                }
            }
        });

        var _handleMouseWheel;
        playBtn.addEventListener('click', function () {
            if (audio.paused) {
                audio.play();
                if (theme === THEME_DEFAULT && !hasLrc) {
                    spectrum.draw();
                }
                // 播放状态中可以用滑轮调节音量
                meplayerContainer.addEventListener('mousewheel', function handleMouseWheel() {
                    var timer         = null;
                    var step          = 0.05;
                    _handleMouseWheel = function (event) {
                        if (timer) {
                            clearTimeout(timer);
                        }
                        if (!meplayerContainer.className.includes('meplayer-adjusting-volume')) {
                            utils.addClass(meplayerContainer, 'meplayer-adjusting-volume');
                        }
                        if (event.wheelDeltaY < 0 && audio.volume > step) {
                            audio.volume -= step;
                        }
                        if (event.wheelDeltaY > 0 && audio.volume < 1 - step) {
                            audio.volume += step;
                        }
                        if (theme === THEME_DEFAULT) {
                            volumeProgress.style.width = audio.volume * 100 + '%';
                        } else {
                            volumeArea.querySelector('i').style.opacity = audio.volume;
                        }
                        event.preventDefault();

                        timer = setTimeout(function () {
                            utils.removeClass(meplayerContainer, 'meplayer-adjusting-volume');
                        }, 1000);
                    };
                    return _handleMouseWheel;
                }());
            } else {
                audio.pause();
                spectrum.stop();
                meplayerContainer.removeEventListener('mousewheel', _handleMouseWheel);
            }
            utils.toggleClass(meplayerContainer, 'meplayer-isplaying');
        });

        timeLine.addEventListener('click', function (event) {
            var clickPercent       = (event.pageX - utils.getAbsLeft(this)) / this.offsetWidth;
            timePassed.style.width = clickPercent * 100 + '%';
            audio.currentTime      = (clickPercent * duration).toFixed(0);
        });
    }

    function play() {
        if (audio.paused) {
            audio.play();
        }
    }

    function pause() {
        if (!audio.paused) {
            audio.pause();
        }
    }

    function toggleTheme() {
        var step     = 0.03;
        var count    = 0;
        var maxCount = 200;

        utils.addClass(meplayerContainer, 'meplayer-changing-theme');

        theme = theme === THEME_DEFAULT ? THEME_MINI : THEME_DEFAULT;

        loop();

        function loop() {
            count++;
            meplayerContainer.style.opacity -= step;
            if (meplayerContainer.style.opacity <= 0) {
                step *= -1;
                meplayerContainer.style.opacity = 0;
                utils.toggleClass(meplayerContainer, 'meplayer-container-mini');
                utils.toggleClass(meplayerContainer, 'meplayer-container');
            }
            if (meplayerContainer.style.opacity < 1 && count < maxCount) {
                requestAnimationFrame(loop);
            } else {
                setTimeout(function () {
                    utils.removeClass(meplayerContainer, 'meplayer-changing-theme');
                }, 500);
            }
        }
    }
};

function getTarget(option) {
    if (typeof option === 'string') {
        return document.querySelector(option);
    } else if (option.toString().includes('HTMLDivElement')) {
        return option;
    } else {
        return document.querySelector('.meplayer');
    }
}
