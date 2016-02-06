/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _constants = __webpack_require__(1);

	var _lyric = __webpack_require__(2);

	var lyric = _interopRequireWildcard(_lyric);

	var _utils = __webpack_require__(3);

	var utils = _interopRequireWildcard(_utils);

	var _spectrum = __webpack_require__(4);

	var spectrum = _interopRequireWildcard(_spectrum);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	window.mePlayer = function (options) {
	    // 检查必填选项
	    if (!(options.music && options.music.src)) {
	        console.error('必须指定音乐地址哦~');
	        return;
	    }

	    var musicConf = options.music,
	        target = getTarget(options.target),
	        theme = options.theme ? options.theme : _constants.THEME_DEFAULT,
	        hasLrc = musicConf.lrc ? true : false,
	        coverSrc = musicConf.cover ? musicConf.cover : 'https://unsplash.it/78/?random',
	        currentThemeClass = theme === _constants.THEME_DEFAULT ? 'meplayer-container' : 'meplayer-container-mini',
	        containerClass = currentThemeClass + ' ' + (hasLrc ? 'meplayer-haslrc' : '') + ' meplayer-isloading',
	        playerHTMLContent = '<div class="' + containerClass + '">\n                             <audio src=' + musicConf.src + '></audio>\n                             <div class="meplayer-info">\n                             <div class="meplayer-info-cover"><img src=' + coverSrc + ' alt="cd-cover"></div>\n                             <div class="meplayer-meta">\n                             <div class="meplayer-meta-title">' + musicConf.title + '</div>\n                             <div class="meplayer-meta-author">' + musicConf.author + '</div>\n                             <div class="meplayer-meta-time-tick"><span class="meplayer-meta-time-tick-text"></span></div>\n                             </div>\n                             </div>\n                             <canvas class="meplayer-spectrum"></canvas>\n                             <div class="meplayer-lyric"><div class="meplayer-lyric-area"></div></div>\n                             <div class="meplayer-control"><div class="meplayer-control-play"><i class="icon-play"></i><i class="icon-pause"></i></div></div>\n                             <div class="meplayer-volume-bg"><div class="meplayer-volume"><i class="icon-volume"></i><div class="meplayer-volume-progress"></div></div></div>\n                             <div class="meplayer-duration"><i class="icon-clock"></i><span class="meplayer-duration-text">loading</span></div>\n                             <div class="meplayer-loadingsign"><i class="icon-spin animate-spin"></i>loading</div>\n                             <div class="meplayer-timeline-bg"><div class="meplayer-timeline"><div class="meplayer-timeline-passed"></div></div></div>\n                             </div>';

	    target.innerHTML = playerHTMLContent;

	    var meplayerContainer = target.querySelector('.' + currentThemeClass),
	        audio = target.querySelector('audio'),
	        playBtn = target.querySelector('.meplayer-control-play'),
	        timeTick = target.querySelector('.meplayer-meta-time-tick-text'),
	        timeCount = target.querySelector('.meplayer-duration'),
	        timeLine = target.querySelector('.meplayer-timeline'),
	        timePassed = target.querySelector('.meplayer-timeline-passed'),
	        volumeArea = target.querySelector('.meplayer-volume'),
	        volumeProgress = target.querySelector('.meplayer-volume-progress'),
	        lyricArea = target.querySelector('.meplayer-lyric-area'),
	        canvas = target.querySelector('.meplayer-spectrum'),
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
	        play: play,
	        pause: pause,
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
	            var curTime = audio.currentTime.toFixed(0);
	            var curTimeForLrc = audio.currentTime.toFixed(3);
	            var playPercent = 100 * (curTime / duration);

	            timePassed.style.width = playPercent.toFixed(2) + '%';
	            timeTick.innerText = utils.parseSec(curTime);

	            if (hasLrc && theme === _constants.THEME_DEFAULT) {
	                var tempLrcIndex = lyric.currentIndex(curTimeForLrc);
	                var tempLrcLines = lyricArea.querySelectorAll('p');
	                var tempLrcLinePre = tempLrcLines[tempLrcIndex - 1];
	                var tempLrcLine = tempLrcLines[tempLrcIndex];
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
	                    lyricArea.style.transform = 'translateY(-' + 20 * tempLrcIndex + 'px)';
	                }
	            }
	        });

	        var _handleMouseWheel;
	        playBtn.addEventListener('click', function () {
	            if (audio.paused) {
	                audio.play();
	                if (theme === _constants.THEME_DEFAULT && !hasLrc) {
	                    spectrum.draw();
	                }
	                // 播放状态中可以用滑轮调节音量
	                meplayerContainer.addEventListener('mousewheel', function handleMouseWheel() {
	                    var timer = null;
	                    var step = 0.05;
	                    _handleMouseWheel = function _handleMouseWheel(event) {
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
	                        if (theme === _constants.THEME_DEFAULT) {
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
	            var clickPercent = (event.pageX - utils.getAbsLeft(this)) / this.offsetWidth;
	            timePassed.style.width = clickPercent * 100 + '%';
	            audio.currentTime = (clickPercent * duration).toFixed(0);
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
	        var step = 0.03;
	        var count = 0;
	        var maxCount = 200;

	        utils.addClass(meplayerContainer, 'meplayer-changing-theme');

	        theme = theme === _constants.THEME_DEFAULT ? _constants.THEME_MINI : _constants.THEME_DEFAULT;

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/*
	 * 全局常量声明
	 */

	var THEME_DEFAULT = 'default';
	var THEME_MINI = 'mini';
	var LYRIC_CURRENT_CLASS = 'meplayer-lyric-current';
	var LYRIC_NEXT_CLASS = 'meplayer-lyric-next';

	exports.THEME_DEFAULT = THEME_DEFAULT;
	exports.THEME_MINI = THEME_MINI;
	exports.LYRIC_CURRENT_CLASS = LYRIC_CURRENT_CLASS;
	exports.LYRIC_NEXT_CLASS = LYRIC_NEXT_CLASS;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.currentIndex = exports.render = exports.parse = undefined;

	var _constants = __webpack_require__(1);

	var lyrics;

	// 歌词解析脚本
	// 修改自：https://github.com/DIYgod/APlayer
	function parse(text) {
	    var lyric = text.split('\n');
	    var lrc = [];
	    var len = lyric.length;
	    var reg1 = /\[(\d{2}):(\d{2})\.(\d{2,3})]/g;
	    var reg2 = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
	    for (var i = 0; i < len; i++) {
	        var time = lyric[i].match(reg1);
	        var lrcText = lyric[i].replace(reg1, '').replace(/^\s+|\s+$/g, '');
	        // 排除空行
	        if (!lrcText) {
	            continue;
	        }
	        if (time != null) {
	            var timeLen = time.length;
	            for (var j = 0; j < timeLen; j++) {
	                var oneTime = reg2.exec(time[j]);
	                var lrcTime = oneTime[1] * 60 + parseInt(oneTime[2]) + parseInt(oneTime[3]) / ((oneTime[3] + '').length === 2 ? 100 : 1000);
	                lrc.push({
	                    time: lrcTime,
	                    text: lrcText
	                });
	            }
	        }
	    }
	    lrc.sort(function (a, b) {
	        return a.time - b.time;
	    });

	    lyrics = lrc;
	    return lrc;
	}

	// 歌词文本解析成DOM结构
	function render(target) {
	    if (!lyrics) {
	        console.error('未指定歌词文本！');
	        return;
	    }
	    var lyricHTML = '';
	    for (var i = 0; i < lyrics.length; i++) {
	        lyricHTML += '<p>' + lyrics[i].text + '</p>';
	    }
	    target.innerHTML = lyricHTML;
	    target.querySelector('p').className = _constants.LYRIC_CURRENT_CLASS;
	    target.querySelector('p + p').className = _constants.LYRIC_NEXT_CLASS;
	}

	function currentIndex(time) {
	    if (time < lyrics[0].time) return 0;
	    for (var i = 0, l = lyrics.length; i < l; i++) {
	        if (time >= lyrics[i].time && (!lyrics[i + 1] || time <= lyrics[i + 1].time)) {
	            break;
	        }
	    }
	    return i;
	}

	exports.parse = parse;
	exports.render = render;
	exports.currentIndex = currentIndex;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	function toggleClass(el, className) {
	    if (el.classList) {
	        el.classList.toggle(className);
	    } else {
	        var classes = el.className.split(' ');
	        var existingIndex = classes.indexOf(className);

	        if (existingIndex >= 0) classes.splice(existingIndex, 1);else classes.push(className);

	        el.className = classes.join(' ');
	    }
	}

	function addClass(el, className) {
	    if (el.classList) el.classList.add(className);else el.className += ' ' + className;
	}

	function removeClass(el, className) {
	    if (el.classList) el.classList.remove(className);else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}

	function getAbsLeft(el) {
	    var left = el.offsetLeft;
	    while (el.offsetParent) {
	        el = el.offsetParent;
	        left += el.offsetLeft;
	    }
	    return left;
	}

	function parseSec(sec) {
	    var tempMin = (sec / 60).toFixed(0);
	    var tempSec = (sec % 60).toFixed(0);
	    var curMin = tempMin < 10 ? '0' + tempMin : tempMin;
	    var curSec = tempSec < 10 ? '0' + tempSec : tempSec;
	    return curMin + ':' + curSec;
	}

	exports.toggleClass = toggleClass;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.getAbsLeft = getAbsLeft;
	exports.parseSec = parseSec;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/*
	 * 频谱动画模拟
	 * */
	var canvas,
	    ctx,
	    specItems = [],
	    needStop = false,
	    timer = null,
	    random = Math.random;

	function randHeight() {
	    if (random() > 0.8) {
	        return random() * 8 + 11;
	    } else {
	        return random() * 6 + 2;
	    }
	}

	var randHeightGenerator = function randHeightGenerator(base) {
	    var max = base * 1.5 > 28 ? 28 : base * 1.5,
	        min = 1,
	        direction = random() > 0.5 ? 1 : -1,
	        tempHeight = base,
	        curStep;
	    return function () {
	        curStep = direction;
	        tempHeight += curStep;
	        if (tempHeight >= max) {
	            direction *= -1;
	            tempHeight = max;
	        } else if (tempHeight <= min) {
	            direction *= -1;
	            tempHeight = min;
	        }
	        if (random() > 0.9) {
	            direction *= -1;
	        }
	        return tempHeight;
	    };
	};

	function loop() {
	    ctx.clearRect(0, -canvas.height / 2, canvas.width, canvas.height);
	    for (var i = 0; i < specItems.length; i++) {
	        var item = specItems[i];
	        var height = item.getHeight();
	        ctx.fillRect(i + specItems[i].xSpace, -height / 2, specItems[i].width, height);
	    }

	    if (!needStop) {
	        timer = requestAnimationFrame(loop);
	    }
	}

	function init(canvasElem) {
	    var width = arguments.length <= 1 || arguments[1] === undefined ? 220 : arguments[1];
	    var height = arguments.length <= 2 || arguments[2] === undefined ? 30 : arguments[2];
	    var color = arguments.length <= 3 || arguments[3] === undefined ? '#D94240' : arguments[3];

	    canvas = canvasElem;
	    canvas.width = width;
	    canvas.height = height;
	    ctx = canvas.getContext('2d');
	    ctx.fillStyle = color;
	    ctx.translate(0, height / 2);

	    for (var i = 0; i < 64; i++) {
	        var xSpace = i == 0 ? 0 : 5 * i;
	        var tempItem = {
	            xSpace: xSpace,
	            width: 1,
	            getHeight: randHeightGenerator(randHeight())
	        };
	        specItems.push(tempItem);
	    }
	}

	function draw() {
	    needStop = false;
	    loop();
	}

	function stop() {
	    needStop = true;
	}

	exports.init = init;
	exports.draw = draw;
	exports.stop = stop;

/***/ }
/******/ ]);