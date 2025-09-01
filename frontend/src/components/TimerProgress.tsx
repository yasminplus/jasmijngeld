import { useEffect, useState } from "react"

interface Props {
  duration: number
  callback: () => void
}
export default function TimerProgress({ duration, callback } : Props) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    const intv = setInterval(() => {
      if (timeLeft > 1) {
        setTimeLeft(prev => prev - 1)
      } else {
        clearInterval(intv)
        callback()
      }
    }, 1000)

    return () => {
      clearInterval(intv)
    }
  }, [callback, timeLeft])

  return (
    <>
      { timeLeft }
    </>
  )
}