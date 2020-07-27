export function range (length: number): Array<number> {
  const ret: number[] = []

  for (let i = 0; i < length; i++) {
    ret.push(i)
  }

  return ret
}