import { Manager } from './manager'

let manager = new Manager()

manager.init(15, 15)

declare global {
  interface Window {
    $m: any
  }
}

window.$m = manager
