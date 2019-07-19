export type Int = number
export type Ms = number //millisecond
export type Timestamp = number //millisecond

declare global {
  interface Window {
    $m: any
  }
}
