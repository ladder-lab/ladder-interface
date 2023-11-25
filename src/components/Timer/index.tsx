import { useEffect, useState } from 'react'

const formatTime = (d: number, h: number, m: number, s: number, getNumber?: boolean) => {
  if (getNumber) {
    return [d, h, m, s]
  }
  if (d) {
    return `${d}d ${h}h ${m}m ${s}s`
  } else {
    return `${h}h ${m}m ${s}s`
  }
}

export const getDeltaTime = (time: number, to = Date.now()) => {
  const correctedTime = time
  const delta = /*14*24*60*60*1000 -*/ (correctedTime - to) / 1000

  return delta > 0 ? delta : 0
}

export const toDeltaTimer = (delta: number, getNumber?: boolean) => {
  const d = Math.floor(delta / (60 * 60 * 24))
  const h = Math.floor((delta / (60 * 60)) % 24)
  const m = Math.floor((delta / 60) % 60)
  const s = Math.floor(delta % 60)
  return formatTime(d, h, m, s, getNumber)
}

export const Timer = ({ timer, onZero, getNumber }: { timer: number; onZero?: () => void; getNumber?: boolean }) => {
  const [time, setTime] = useState(getDeltaTime(timer))

  useEffect(() => {
    const tm = setInterval(() => setTime(getDeltaTime(timer)), 1000)
    return () => clearInterval(tm)
  }, [timer])

  useEffect(() => {
    if (!time) {
      onZero && onZero()
    }
  }, [time, onZero])

  if (getNumber) {
    const days = toDeltaTimer(time, getNumber)
    return (
      <>
        <span>{pad0(days[0])}</span>
        <span>{pad0(days[1])}</span>
        <span>{pad0(days[2])}</span>
      </>
    )
  }
  return <>{toDeltaTimer(time)}</>
}

function pad0(num: number | string) {
  if (+num < 10) {
    return '0' + num
  }
  return num
}

export function getTimeDifference(endTime: number) {
  const currentTime = Date.now()

  const timeDiff = endTime - currentTime

  const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000))
  const hours = Math.floor((timeDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000))
  const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000)

  return {
    days,
    hours,
    minutes,
    seconds
  }
}
