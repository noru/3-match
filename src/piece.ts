import { Int } from './types'

export type PieceShape = Int
export type PieceStatus = 'matched' | undefined

type Subscriber = (x: Int, y: Int) => void

export class Piece {
  private _x: Int
  private _y: Int
  private _shape: PieceShape
  private subscribers = new Array<Subscriber>()
  status: PieceStatus
  onDestroy?: () => void

  static isMatch(p1: Piece | null, p2: Piece | null) {
    if (!p1 || !p2) {
      return false
    }
    return p1.isMatch(p2)
  }

  constructor(shape: PieceShape, x: Int = -1, y: Int = -1) {
    this._x = x
    this._y = y
    this._shape = shape
  }

  get shape() {
    return this._shape
  }

  get pos(): [Int, Int] {
    return [this._x, this._y]
  }

  moveTo(x: Int, y: Int) {
    this._x = x
    this._y = y
    this.subscribers.forEach(sub => sub(x, y))
  }

  swap(piece: Piece) {
    let pos = piece.pos
    piece.moveTo(...this.pos)
    this.moveTo(...pos)
  }

  isAdjasent(piece: Piece) {
    let [x, y] = piece.pos
    return Math.abs(x - this._x) + Math.abs(y - this._y) === 1
  }

  subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber)
    subscriber(this._x, this._y)
  }

  unsubscribe(subscriber: Subscriber) {
    this.subscribers = this.subscribers.filter(s => s !== subscriber)
  }

  isMatch(p: Piece): boolean {
    return p.shape === this._shape
  }

  destroy() {
    this.onDestroy && this.onDestroy()
  }
}
