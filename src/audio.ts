import { Action } from './action'

HTMLAudioElement.prototype.stop = function() {
  this.pause()
  this.currentTime = 0
}

HTMLAudioElement.prototype.replay = function() {
  this.stop()
  this.play()
}

// special thanks to http://www.aigei.com
const BGM = new Audio(require('./assets/bgm.mp3'))
BGM.loop = true
const Fail = new Audio(require('./assets/fail.mp3'))
const Succ = new Audio(require('./assets/succ.mp3'))
const Select = new Audio(require('./assets/select.wav'))
const Fill = new Audio(require('./assets/fill.mp3'))

export class AudioManager {
  bgmOn = false

  on(action: Action) {
    // audio must be triggered by user interaction, nice to know...
    if (!this.bgmOn) {
      BGM.play()
      this.bgmOn = true
    }

    switch (action.type) {
      case 'select':
        Select.replay()
        break
      case 'reverse':
        Fail.replay()
        break
      case 'fillNew':
        Fill.replay()
        break
      case 'clearMatched':
        Succ.replay()
        break
    }
  }
}
