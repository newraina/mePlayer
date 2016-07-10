function toggleClass(el, className) {
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes       = el.className.split(' ');
        var existingIndex = classes.indexOf(className);

        if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
        else
            classes.push(className);

        el.className = classes.join(' ');
    }
}

function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
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
    var tempMin = (sec / 60) | 0;
    var tempSec = (sec % 60) | 0;
    var curMin  = tempMin < 10 ? ('0' + tempMin) : tempMin;
    var curSec  = tempSec < 10 ? ('0' + tempSec) : tempSec;
    return curMin + ':' + curSec;
}

export {toggleClass, addClass, removeClass, getAbsLeft, parseSec};
