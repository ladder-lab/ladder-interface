import { useEffect, useRef } from 'react'
import Lottie from 'lottie-web'
import { Box } from '@mui/material'
import { SxProps } from '@mui/system'

export default function AnimatedSvg({
  fileName,
  sx,
  className,
  onClick
}: {
  fileName: string
  sx?: SxProps
  className?: string
  onClick?: () => void
}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref || !ref.current) return

    Lottie.loadAnimation({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      container: ref.current!, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `/animations/${fileName}.json`
    })
    return () => {
      Lottie.destroy()
    }
  }, [fileName, ref])

  return (
    <Box
      ref={ref}
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start'
      }}
      sx={sx}
      onClick={onClick}
    ></Box>
  )
}
