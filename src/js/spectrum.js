/*
 * 频谱动画模拟
 * */
var canvas, ctx,
    specItems = [],
    needStop  = false,
    timer     = null,

    random    = Math.random;

function randHeight() {
    if (random() > 0.8) {
        return random() * 8 + 11;
    } else {
        return random() * 6 + 2;
    }
}

var randHeightGenerator = function (base) {
    var max        = base * 1.5 > 28 ? 28 : base * 1.5,
        min        = 1,
        direction  = random() > 0.5 ? 1 : -1,
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
    }
};

function loop() {
    ctx.clearRect(0, -canvas.height / 2, canvas.width, canvas.height);
    for (var i = 0; i < specItems.length; i++) {
        var item   = specItems[i];
        var height = item.getHeight();
        ctx.fillRect(i + specItems[i].xSpace, -height / 2, specItems[i].width, height);
    }

    if (!needStop) {
        timer = requestAnimationFrame(loop);
    }
}

function init(canvasElem, width = 220, height = 30, color = '#D94240') {
    canvas        = canvasElem;
    canvas.width  = width;
    canvas.height = height;
    ctx           = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.translate(0, height / 2);

    for (let i = 0; i < 64; i++) {
        var xSpace   = i == 0 ? 0 : 5 * i;
        var tempItem = {
            xSpace   : xSpace,
            width    : 1,
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

export {init, draw, stop};
