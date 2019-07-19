import { Int } from './types'
import { Piece } from './piece'
import { swap } from 'noru-utils'
import { Dispatch } from './looper'
import { Action } from './action'
import { debug, getRandomPiece, indexToPos, posToIndex } from './utils'
import { Tick } from './looper'

export interface Status {
  score: number
  row: number
  col: number
  matchSize: number
  layout: Layout
}
export type Layout = (Piece | null)[]
export type Subscriber = (changed: Layout, status: Status) => void

export class Board {
  private layout: Layout = new Array()
  private rowSize: Int = 0
  private colSize: Int = 0
  private matchSize: Int = 3
  private selected: Piece | null = null
  private dispatch: Dispatch
  private lastSwapped?: [Piece, Piece]
  private subscribers: Subscriber[] = new Array()
  private score: number = 0

  constructor(colSize: Int, rowSize: Int, dispatch: Dispatch) {
    this.colSize = colSize
    this.rowSize = rowSize
    this.layout = new Array(colSize * rowSize)
    this.dispatch = dispatch
  }

  get status(): Status {
    return {
      row: this.rowSize,
      col: this.colSize,
      matchSize: this.matchSize,
      layout: [...this.layout],
      score: this.score,
    }
  }

  private markMatched(streaks: Layout) {
    if (streaks.length >= this.matchSize) {
      streaks.forEach(p => p && (p.status = 'matched'))
    }
  }

  clearScore() {
    this.score = 0
  }

  subscribe(sub: Subscriber) {
    this.subscribers.push(sub)
    sub(this.layout, this.status)
  }

  fill(pieces: Layout) {
    for (let i = 0; i < this.layout.length; i++) {
      let piece = pieces[i]
      if (!piece) continue
      piece.moveTo(...this.indexToPos(i))
      this.layout[i] = piece
    }
    this.subscribers.forEach(sub => sub(pieces, this.status))
  }

  match(layout: Layout = this.layout) {
    for (let rowStart = 0; rowStart < this.layout.length; rowStart += this.colSize) {
      this.matchingRow(rowStart)
    }
    for (let colIndex = 0; colIndex < this.colSize; colIndex++) {
      this.matchingCol(colIndex)
    }
    return layout.filter(p => p && p.status === 'matched').length
  }

  matchingRow(rowIndex: Int) {
    let streaks: Layout = new Array()

    for (let i = 0; i < this.colSize; i++) {
      let current = this.layout[rowIndex + i]
      let matchTarget = streaks[0]

      if (!matchTarget) {
        streaks.push(current)
        continue
      }
      if (Piece.isMatch(matchTarget, current)) {
        streaks.push(current)
      } else {
        this.markMatched(streaks)
        streaks.length = 1
        streaks[0] = current
      }
    }
    this.markMatched(streaks)
  }

  matchingCol(colIndex: Int) {
    let streaks: Layout = new Array()
    for (let row = 0; row < this.rowSize; row++) {
      let current = this.layout[colIndex + row * this.colSize]
      let matchTarget = streaks[0]
      if (!matchTarget) {
        streaks.push(current)
        continue
      }
      if (Piece.isMatch(matchTarget, current)) {
        streaks.push(current)
      } else {
        this.markMatched(streaks)
        streaks.length = 1
        streaks[0] = current
      }
    }
    this.markMatched(streaks)
  }

  swap(p1: Piece, p2: Piece) {
    debug('swap', p1, p2)
    this.lastSwapped = [p1, p2]
    swap(this.layout, this.getPieceIndex(p1), this.getPieceIndex(p2))
    p1.swap(p2)
  }

  reverse() {
    if (this.lastSwapped) {
      this.swap(...this.lastSwapped)
    }
  }

  fillNew() {
    let newPieces = this.layout.map(p => (!p ? getRandomPiece() : null))
    debug('fillnew', newPieces)
    this.fill(newPieces)
  }

  clearMathced() {
    let count = 0
    for (let i = 0; i < this.layout.length; i++) {
      const p = this.layout[i]
      if (p && p.status === 'matched') {
        p.destroy()
        this.layout[i] = null
        count += 1
      }
    }
    this.score += 100 + (count - 3) * 50
    debug('score', this.score)
  }

  onPieceClick(piece: Piece) {
    debug('click', piece)
    if (this.selected) {
      if (this.selected.isAdjasent(piece)) {
        this.dispatch(new Action('move', [piece, this.selected], Tick))
        this.selected = null
      } else {
        this.selected = piece
      }
    } else {
      this.selected = piece
    }
  }

  replace() {
    this.dispatch(new Action('clearMatched', undefined, Tick))
    this.dispatch(new Action('fillNew', undefined, 500))
  }

  getPieceIndex(p: Piece): Int {
    let [x, y] = p.pos
    return posToIndex(x, y, this.colSize)
  }

  indexToPos(idx: Int): [number, number] {
    return indexToPos(idx, this.colSize)
  }

  debug_print() {
    let lines = new Array()
    for (let row = 0; row < this.rowSize; row++) {
      lines.push(
        this.layout
          .slice(row * this.colSize, row * this.colSize + this.colSize)
          .map(p => (p ? p.shape : '*'))
          .join(' ')
      )
    }
    console.info(lines.join('\n'))
  }

  debug_printMatched() {
    let lines = new Array()
    for (let row = 0; row < this.rowSize; row++) {
      lines.push(
        this.layout
          .slice(row * this.colSize, row * this.colSize + this.colSize)
          .map(p => (p ? (p.status === 'matched' ? `(${p.shape})` : ` ${p.shape} `) : ' * '))
          .join(' ')
      )
    }
    console.info(lines.join('\n'))
  }
}
