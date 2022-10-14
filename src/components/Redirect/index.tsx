import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Redirect() {
  const navigate = useNavigate()
  useEffect(() => {
    const path = localStorage.getItem('PATH')
    localStorage.removeItem('path')
    if (path) {
      return navigate('/' + path)
    }
  }, [navigate])
  return <></>
}
