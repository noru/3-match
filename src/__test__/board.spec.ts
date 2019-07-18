import { Board } from '../board'
import { Piece } from '../piece'

const mockDispatch = jest.fn()

function b(str: string | TemplateStringsArray = '') {
  let newline = '\n'
  let withoutSpaces = str.toString().replace(/[ ]/g, '')

  if (withoutSpaces.startsWith(newline)) {
    withoutSpaces = withoutSpaces.replace(newline, '')
  }
  let rows = withoutSpaces.split(newline)
  let result = new Array<Piece>()
  rows.forEach((row, i) => {
    row.split('').forEach((val, j) => result.push(new Piece(+val, j, i)))
  })

  console.log(result)

  return result
}

describe('board', () => {
  test('status ', () => {
    let board = new Board(4, 5, mockDispatch)
    expect(board.status).toEqual({
      row: 5,
      col: 4,
      matchSize: 3,
      pieces: new Array(20),
      score: 0,
    })
  })

  test('fill', () => {
    let board = new Board(3, 3, mockDispatch)
    let toFill = Array.from({ length: 10 }, (_, i) => new Piece(i))
    board.fill(toFill)
    expect(board.status.layout).toEqual(toFill.slice(0, 9))
  })

  test('match: no match', () => {
    let board = new Board(5, 5, mockDispatch)

    let noMatch = b`
      12121
      21212
      12121
      21212
      12121
    `

    board.fill(noMatch)
    board.match()
    board.debug_printMatched()
    expect(board.status.layout.filter(p => p!.status === 'matched').length).toBe(0)
  })

  test('match: row match', () => {
    let board = new Board(5, 5, mockDispatch)
    let someMatch = b`
      11122
      33222
      12453
      34342
      34333
    `
    board.fill(someMatch)
    board.match()
    board.debug_printMatched()
    expect(board.status.layout.filter(p => p!.status === 'matched').length).toBe(9)
  })

  test('match: col match', () => {
    let board = new Board(5, 5, mockDispatch)
    let someMatch = b`
      12122
      33112
      13152
      33242
      34233
    `
    board.fill(someMatch)
    board.match()
    board.debug_printMatched()
    expect(board.status.layout.filter(p => p!.status === 'matched').length).toBe(10)
  })

  test('match: mix match', () => {
    let board = new Board(5, 5, mockDispatch)
    let someMatch = b`
      11122
      11222
      12223
      34343
      34343
    `
    board.fill(someMatch)
    board.match()
    board.debug_printMatched()
    expect(board.status.layout.filter(p => p!.status === 'matched').length).toBe(15)
  })

  test('match: all match', () => {
    let board = new Board(5, 5, mockDispatch)
    let someMatch = b`
      11122
      13222
      13222
      33333
      44444
    `
    board.fill(someMatch)
    board.match()
    board.debug_printMatched()
    expect(board.status.layout.filter(p => p!.status === 'matched').length).toBe(25)
  })

  test('swap', () => {
    let board = new Board(3, 3, mockDispatch)

    let layout = b`
      123
      456
      789
    `
    board.fill(layout)
    let [p1, p2] = board.status.layout
    board.swap(p1!, p2!)
    expect(board.status.layout).toEqual(b`
      213
      456
      789
    `)
    let p5 = board.status.layout[4]
    let p9 = board.status.layout[8]
    board.swap(p5!, p9!)
    expect(board.status.layout).toEqual(b`
      213
      496
      785
    `)
  })
})
