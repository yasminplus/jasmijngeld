export function groupDigit(value: number) {
  return Number(value).toLocaleString()
}
export function groupDigitS(value: string) {
  return groupDigit(Number(value))
}

