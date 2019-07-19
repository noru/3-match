import { Looper } from './looper'

const MaxWidth = 800
const MaxSize = 100
const MinSize = 50
const OptimalDemension = 10

function determineLayout() {
  let totalHeight = Math.min(window.innerHeight, MaxWidth) - 80 - window.innerHeight * 0.05 // score height + padding
  let totalWidth = Math.min(window.innerWidth, MaxWidth) - window.innerWidth * 0.05
  console.log(totalWidth)
  let colOption = [Math.floor(totalWidth / MaxSize), Math.floor(totalWidth / MinSize)]
  let rowOption = [Math.floor(totalHeight / MaxSize), Math.floor(totalHeight / MinSize)]

  let colResult = Number.MAX_VALUE
  for (let col = colOption[0]; col < colOption[1]; col++) {
    if (Math.abs(col - OptimalDemension) < Math.abs(colResult - OptimalDemension)) {
      colResult = col
    }
  }

  let rowResult = Number.MAX_VALUE
  for (let row = rowOption[0]; row < rowOption[1]; row++) {
    if (Math.abs(row - OptimalDemension) < Math.abs(rowResult - OptimalDemension)) {
      rowResult = row
    }
  }

  return [colResult, rowResult, totalWidth - 60]
}

let looper = new Looper()
looper.init(...determineLayout())
