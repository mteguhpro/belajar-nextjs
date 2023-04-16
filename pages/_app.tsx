import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import useSidebarStore from "../zustand/sidebar"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  const setActive = useSidebarStore((state) => state.setActive)

    useEffect(() => {
      setActive(window.innerWidth >= 768)
    }, [])

  return (<>
    <Component {...pageProps} />
    <ToastContainer />
  </>)
}
