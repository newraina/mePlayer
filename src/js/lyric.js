import { LYRIC_CURRENT_CLASS, LYRIC_NEXT_CLASS } from './constants'

var lyrics

// 歌词解析脚本
// 修改自：https://github.com/DIYgod/APlayer
function parse(text) {
  var lyric = text.split('\n')
  var lrc = []
  var len = lyric.length
  var reg1 = /\[(\d{2}):(\d{2})\.(\d{2,3})]/g
  var reg2 = /\[(\d{2}):(\d{2})\.(\d{2,3})]/
  for (var i = 0; i < len; i++) {
    var time = lyric[i].match(reg1)
    var lrcText = lyric[i].replace(reg1, '').replace(/^\s+|\s+$/g, '')
    // 排除空行
    if (!lrcText) {
      continue
    }
    if (time != null) {
      var timeLen = time.length
      for (var j = 0; j < timeLen; j++) {
        var oneTime = reg2.exec(time[j])
        var lrcTime =
          oneTime[1] * 60 +
          parseInt(oneTime[2]) +
          parseInt(oneTime[3]) / ((oneTime[3] + '').length === 2 ? 100 : 1000)
        lrc.push({
          time: lrcTime,
          text: lrcText
        })
      }
    }
  }
  lrc.sort(function(a, b) {
    return a.time - b.time
  })

  lyrics = lrc
  return this
}

// 歌词文本解析成DOM结构
function renderTo(target) {
  if (!lyrics) {
    console.error('未指定歌词文本！')
    return
  }
  var lyricHTML = ''
  for (let i = 0; i < lyrics.length; i++) {
    lyricHTML += `<p>${lyrics[i].text}</p>`
  }
  target.innerHTML = lyricHTML
  target.querySelector('p').className = LYRIC_CURRENT_CLASS
  target.querySelector('p + p').className = LYRIC_NEXT_CLASS
  return this
}

function currentIndex(time) {
  if (time < lyrics[0].time) return 0
  for (var i = 0, l = lyrics.length; i < l; i++) {
    if (
      time >= lyrics[i].time &&
      (!lyrics[i + 1] || time <= lyrics[i + 1].time)
    ) {
      break
    }
  }
  return i
}

export { parse, renderTo, currentIndex }
