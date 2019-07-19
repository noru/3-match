import { Int } from './types'
import { Piece } from './piece'
import { Board, Layout, Status } from './board'

import './styles.scss'
import { randomInt } from 'noru-utils'

const PlaygroundSelector = '#playground'
const BoardSize = 750 // px
const PieceTemplate = document.createElement('div')
PieceTemplate

export class Renderer {
  constructor(board: Board) {
    this.board = board
  }
  board: Board
  score: HTMLDivElement | null = null
  container: HTMLDivElement | null = null
  pieceTemplate: HTMLDivElement | null = null
  pieceSize: Int = 0
  pieces = new WeakMap<Piece>()

  init() {
    let { row, col } = this.board.status
    this.container = document.querySelector(PlaygroundSelector)
    if (!this.score) {
      let div = document.createElement('div')
      div.id = 'score'
      div.className = 'score-board'
      document.body.appendChild(div)
      div.innerHTML = '<span>Score</span>'
      let h1 = document.createElement('h1')
      div.appendChild(h1)
      this.score = h1
    }
    if (!this.container) {
      let div = document.createElement('div')
      div.id = PlaygroundSelector.substring(1)
      div.className = 'playground'
      document.body.appendChild(div)
      this.container = div
    }

    this.container.style.width = `${BoardSize}px`
    this.container.style.height = `${(BoardSize * row) / col}px`
    this.pieceSize = BoardSize / col

    this.pieceTemplate = document.createElement('div')
    this.pieceTemplate.className = 'piece'
    this.pieceTemplate.style.width = this.pieceSize + 'px'
    this.pieceTemplate.style.height = this.pieceSize + 'px'
    this.pieceTemplate.style.fontSize = this.pieceSize - 4 + 'px'

    this.board.subscribe(this.onBoardChange)
  }

  onBoardChange = (layout: Layout, status: Status) => {
    layout.forEach(p => {
      this.put(p)
    })
    this.score!.innerText = status.score + ''
  }

  put(piece: Piece | null) {
    if (!piece) return
    if (!this.pieces.has(piece)) {
      let domNode = this.pieceTemplate!.cloneNode() as HTMLDivElement
      domNode.classList.add('piece-' + piece.shape)
      this.container!.appendChild(domNode)
      domNode.style.left = `${randomInt(0, 1000)}px`
      domNode.style.top = `-200px`
      let clickLisener = evt => {
        evt.target.classList.add('beat')
        this.board.onPieceClick(piece)
        setTimeout(() => {
          evt.target.classList.remove('beat')
        }, 800)
      }
      domNode.addEventListener('click', clickLisener)
      let subscribePosChange = (x: Int, y: Int) => {
        setTimeout(() => {
          domNode.style.left = x * this.pieceSize + 'px'
          domNode.style.top = y * this.pieceSize + 'px'
        })
      }
      let onDestroy = () => {
        domNode.style.opacity = '0'
        setTimeout(() => {
          this.container!.removeChild(domNode)
        }, 500)
        this.pieces.delete(piece)
        piece.unsubscribe(subscribePosChange)
        domNode.removeEventListener('click', clickLisener)
      }
      piece.onDestroy = onDestroy
      piece.subscribe(subscribePosChange)
    }
  }

  clear() {
    let container = this.container!
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
  }
}
