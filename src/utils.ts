import { Piece } from './piece'
import { randomInt } from 'noru-utils'
import { Int } from './types'

const isDev = process.env.NODE_ENV !== 'production'

export function debug(msg: string, ...rest: any) {
  isDev && console.log(msg, ...rest)
}

export function generateInitPieces(x: Int, y: Int, _matchSize: Int = 3) {
  let result = new Array<Piece>()
  for (let i = 0; i < x * y; i++) {
    result.push(getRandomPiece(i % x, Math.floor(i / y)))
  }
  return result
}

export function getRandomPiece(x: Int = -1, y: Int = -1): Piece {
  return new Piece(randomInt(1, 5), x, y)
}

export function indexToPos(index: Int, col: Int): [Int, Int] {
  return [index % col, Math.floor(index / col)]
}

export function posToIndex(x: Int, y: Int, col: Int): Int {
  return x + y * col
}
