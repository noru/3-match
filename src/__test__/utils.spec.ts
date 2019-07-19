import { indexToPos, posToIndex } from '../utils'

describe('utils', () => {
  test('indexToPos ', () => {
    // 012
    // 345  <- find 4
    // 678
    expect(indexToPos(4, 3)).toEqual([1, 1])
    // 01
    // 23
    // 45  <-
    // 67
    expect(indexToPos(5, 2)).toEqual([1, 2])
  })

  test('posToIndex', () => {
    // 012
    // 345  <- 4
    // 678
    expect(posToIndex(1, 1, 3)).toEqual(4)
    // 01
    // 23
    // 45  <-
    // 67
    expect(posToIndex(1, 2, 2)).toEqual(5)
  })
})
