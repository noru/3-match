import { Ms } from './types'

export type ActionType = 'match' | 'select' | 'move' | 'replace' | 'clearMatched' | 'fillNew' | 'reverse'
export type Data = any

export class Action {
  type: ActionType
  data?: Data | Action[]
  delay?: Ms

  constructor(type: ActionType, data?: Data | Action[], delay?: Ms) {
    this.type = type
    this.data = data
    this.delay = delay
  }
}
