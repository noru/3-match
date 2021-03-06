import { Action } from './action'
import { Timestamp, Ms } from './types'
import { Renderer } from './renderer'
import { Board } from './board'
import { Piece } from './piece'
import { debug, generateInitPieces } from './utils'
import { AudioManager } from './audio';

export type Dispatch = (act: Action) => void
const Now = Date.now
export const Tick: Ms = 200

export class Looper {
  private busyUntil: Timestamp = Now()
  private actionQueue: Action[] = new Array()
  private animationFrameId: number = 0
  private renderer?: Renderer
  private board?: Board
  private audioManager: AudioManager = new AudioManager()

  get isBusy() {
    return this.busyUntil > Now()
  }

  init(col = 10, row = 10, width = 750) {
    let initPieces = generateInitPieces(col, row)
    let board = new Board(col, row, this.dispatch)
    board.fill(initPieces)
    while (board.match() > 0) {
      board.clearMathced()
      board.fillNew()
    }
    board.clearScore()
    this.renderer = new Renderer(board, width)
    this.renderer.init()
    this.board = board

    this.loop()
  }

  loop = () => {
    this.animationFrameId = requestAnimationFrame(this.loop)
    if (this.isBusy || this.actionQueue.length === 0) {
      return
    }
    let action = this.actionQueue.shift()!
    this.busyUntil = Now() + (action.delay || Tick)
    this.handleAction(action)
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId)
  }

  dispatch: Dispatch = (action: Action) => {
    debug('dispatch', action)
    if (this.isBusy && action.type === 'move') {
      debug('discard action', action)
      return
    }
    this.actionQueue.push(action)
  }

  handleAction(action: Action) {
    let board = this.board!
    debug('handle action', action)
    this.audioManager.on(action)
    switch (action.type) {
      case 'move':
        board.swap(...(action.data as [Piece, Piece]))
        this.dispatch(new Action('match', action.data, 1))
        break
      case 'match':
        board.match() > 0 ? this.dispatch(new Action('replace')) : this.dispatch(new Action('reverse'))
        break
      case 'reverse':
        board.reverse()
        break
      case 'replace':
        board.replace()
        break
      case 'clearMatched':
        board.clearMathced()
        break
      case 'fillNew':
        board.fillNew()
        board.match() > 0 && this.dispatch(new Action('replace'))
        break
    }
  }
}
