export function useCheckTwitter() {
  const interval = 5000
  let count = 0
  const intervalFun = setInterval(() => {
    count++
    if (count >= 5) {
      clearInterval(intervalFun)
    }
  }, interval)
}
