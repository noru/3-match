import { Action } from "./action";

const Fail = new Audio('./assets/fail.mp3')
const Succ = new Audio('./assets/succ.mp3')
const Select = new Audio('./assets/select.wav')
const Fill = new Audio('./assets/fill.mp3')


export class AudioManager {

  on(action: Action) {
    switch (action.type) {
      case 'select':
        Select.play()
        break
      case 'reverse':
        Fail.play()
        break;
      case 'fillNew':
        Fill.play()
        break
      case 'clearMatched':
        Succ.play()
        break
    }
  }
}